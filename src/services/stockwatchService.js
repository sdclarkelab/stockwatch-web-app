const qs = require('querystring');

const axios = require('axios');
const stockWatchJaAxios = axios.create({
    baseURL: process.env.VUE_APP_STOCK_WATCH_URL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});

stockWatchJaAxios.interceptors.request.use((config) => {
    if (!config.url.includes('token')) {
        config.headers.Authorization = `${sessionStorage.getItem('token')}`;
    }
    return config;
});

let investorId = sessionStorage.getItem('investorId') || null;
let portfolioId = sessionStorage.getItem('portfolioId') || null;

export default class Stockwatch {
    async login(formData) {
        formData['grant_type'] = 'password';

        return new Promise((resolve, reject) => {
            stockWatchJaAxios
                .post(`/stockwatch_admin/o/token/`, qs.stringify(formData), {
                    auth: {
                        username: process.env.VUE_APP_STOCKWATCH_CLIENT,
                        password: process.env.VUE_APP_STOCKWATCH_SECRET,
                    },
                })
                .then((response) => {
                    sessionStorage.setItem('token', `Bearer ${response.data.access_token}`);
                    sessionStorage.setItem('investorId', response.data.investor.id);
                    stockWatchJaAxios.defaults.headers.common[
                        'Authorization'
                    ] = `Bearer ${response.data.access_token}`;
                    resolve(response);
                })
                .catch((error) => {
                    sessionStorage.removeItem('token');
                    reject(error);
                });
        });
    }

    logout() {
        const formData = {
            token: sessionStorage.getItem('token'),
        };

        return stockWatchJaAxios
            .post(`/stockwatch_admin/o/revoke_token/`, qs.stringify(formData), {
                auth: {
                    username: process.env.VUE_APP_STOCKWATCH_CLIENT,
                    password: process.env.VUE_APP_STOCKWATCH_SECRET,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('investorId');
                    sessionStorage.removeItem('portfolioId');
                    console.log('Successfully Logged Out');
                    return response;
                }
            })
            .catch((error) => {
                console.log(error);
                return error;
            });
    }

    async getStockPerformance() {
        portfolioId = sessionStorage.getItem('portfolioId') || null;
        return stockWatchJaAxios.get(
            `/investor/${investorId}/portfolio/${portfolioId}/performance/`
        );
    }

    /**
     * Gets default portfolio Id
     */
    async getDefaultPortfolioId() {
        investorId = sessionStorage.getItem('investorId') || null;
        return stockWatchJaAxios
            .get(`/investor/${investorId}/portfolio/default/`)
            .then((response) => {
                sessionStorage.setItem('portfolioId', response.data.portfolio_id);
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getInvestorId() {
        return stockWatchJaAxios
            .get(`${process.env.VUE_APP_STOCK_WATCH_URL}/investor/get_id/`, {
                headers: { Authorization: sessionStorage.getItem('token') },
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Return Investor's Id");
                    return response.data;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    createStock(symbol) {
        return stockWatchJaAxios
            .post(
                `/investor/${investorId}/portfolio/${portfolioId}/stock/`,
                {
                    headers: { Authorization: sessionStorage.getItem('token') },
                },
                {
                    symbol: symbol,
                    status: 1,
                }
            )
            .then((response) => {
                console.log('Added stock to portfolio.');
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getStocks() {
        return stockWatchJaAxios
            .get(`/investor/${investorId}/portfolio/${portfolioId}/stock/`, {
                headers: { Authorization: sessionStorage.getItem('token') },
            })
            .then((response) => {
                console.log('Get stocks.');
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    deleteStockBySymbol(symbol) {
        return stockWatchJaAxios
            .delete(`/investor/${investorId}/portfolio/${portfolioId}/stock/${symbol}`, {
                headers: { Authorization: sessionStorage.getItem('token') },
            })
            .then((response) => {
                console.log('Deleted Stock.');
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // createStockBySymbol(symbol) {
    //     return stockWatchJaAxios
    //         .post(
    //             `/investor/${investorId}/portfolio/${portfolioId}/stock/`,
    //             {
    //                 symbol: symbol,
    //             },
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: sessionStorage.getItem('token'),
    //                 },
    //             }
    //         )
    //         .then((response) => {
    //             return response;
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    createStockBySymbol(transaction) {
        return stockWatchJaAxios
            .post(
                `/investor/${investorId}/portfolio/${portfolioId}/stock_transaction`,
                {
                    stock: {
                        portfolio: 1,
                        symbol: transaction.symbolName,
                    },
                    transaction: transaction,
                    plan: {
                        target_percentage: transaction.target_percentage,
                    },
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: sessionStorage.getItem('token'),
                    },
                }
            )
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getSymbolTransactions(symbolId) {
        return stockWatchJaAxios
            .get(
                `/investor/${investorId}/portfolio/${portfolioId}/stock/${symbolId}/transaction/`,
                {
                    headers: { Authorization: sessionStorage.getItem('token') },
                }
            )
            .then((response) => {
                console.log('Got Transactions.');
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    createSymbolTransaction(payload) {
        return stockWatchJaAxios
            .post(
                `/investor/${investorId}/portfolio/${portfolioId}/stock/${payload.stock}/transaction/`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: sessionStorage.getItem('token'),
                    },
                }
            )
            .then((response) => {
                console.log('Added stock to transaction.');
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    updateTransaction(payload) {
        return stockWatchJaAxios
            .put(
                `/investor/${investorId}/portfolio/${portfolioId}/stock/${payload.stock}/transaction/${payload.id}/`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: sessionStorage.getItem('token'),
                    },
                }
            )
            .then((response) => {
                console.log('Updated transaction.');
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    updateSymbolTransaction(symbol, payload) {
        return stockWatchJaAxios
            .put(
                `/investor/${investorId}/portfolio/${portfolioId}/stock/${symbol}/transaction/`,
                {
                    headers: { Authorization: sessionStorage.getItem('token') },
                },
                payload
            )
            .then((response) => {
                console.log('Updated stock to transaction.');
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    deleteSymbolTransaction(symbolId, transactionId) {
        return stockWatchJaAxios
            .delete(
                `/investor/${investorId}/portfolio/${portfolioId}/stock/${symbolId}/transaction/${transactionId}/`,
                {
                    headers: { Authorization: sessionStorage.getItem('token') },
                }
            )
            .then((response) => {
                console.log('Deleted Transactions.');
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getStockNames() {
        return stockWatchJaAxios
            .get('/stockNames/', {
                headers: { Authorization: sessionStorage.getItem('token') },
            })
            .then((res) => {
                console.log('Got stock names.');
                return res;
            });
    }
}
