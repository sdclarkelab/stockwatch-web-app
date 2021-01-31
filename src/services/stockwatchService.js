const qs = require('querystring');

const axios = require('axios');
const stockWatchJaAxios = axios.create({
    baseURL: process.env.VUE_APP_STOCK_WATCH_URL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});

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
                    localStorage.setItem('token', `Bearer ${response.data.access_token}`);
                    localStorage.setItem('investorId', response.data.investor.id);
                    stockWatchJaAxios.defaults.headers.common[
                        'Authorization'
                    ] = `Bearer ${response.data.access_token}`;
                    resolve(response);
                })
                .catch((error) => {
                    localStorage.removeItem('token');
                    reject(error);
                });
        });
    }

    logout() {
        const formData = {
            token: localStorage.getItem('token'),
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
                    localStorage.removeItem('token');
                    console.log('Successfully Logged Out');
                    return response;
                }
            })
            .catch((error) => {
                console.log(error);
                return error;
            });
    }

    async getStockPerformance(portfolioId) {
        return stockWatchJaAxios.get(`/investor/2/portfolio/${portfolioId}/performance/`, {
            headers: { Authorization: localStorage.getItem('token') },
        });
    }

    /**
     * Gets default portfolio Id
     */
    async getDefaultPortfolioId() {
        return stockWatchJaAxios
            .get(`/investor/2/portfolio/default/`, {
                headers: { Authorization: localStorage.getItem('token') },
            })
            .then((response) => {
                localStorage.setItem('portfolioId', response.data.portfolioId);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getInvestorId() {
        return stockWatchJaAxios
            .get(`${process.env.VUE_APP_STOCK_WATCH_URL}/investor/get_id/`, {
                headers: { Authorization: localStorage.getItem('token') },
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
                `/investor/2/portfolio/1/stock/`,
                {
                    headers: { Authorization: localStorage.getItem('token') },
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
            .get(`/investor/2/portfolio/1/stock/`, {
                headers: { Authorization: localStorage.getItem('token') },
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
            .delete(`/investor/2/portfolio/1/stock/${symbol}`, {
                headers: { Authorization: localStorage.getItem('token') },
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
    //             `/investor/2/portfolio/1/stock/`,
    //             {
    //                 symbol: symbol,
    //             },
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: localStorage.getItem('token'),
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
                `/investor/2/portfolio/1/stock_transaction`,
                {
                    stock: {
                        portfolio: 1,
                        symbol: transaction.symbolName,
                    },
                    transaction: transaction,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token'),
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
            .get(`/investor/2/portfolio/1/stock/${symbolId}/transaction/`, {
                headers: { Authorization: localStorage.getItem('token') },
            })
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
            .post(`/investor/2/portfolio/1/stock/${payload.stock}/transaction/`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token'),
                },
            })
            .then((response) => {
                console.log('Added stock to transaction.');
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    updateSymbolTransaction(symbol, payload) {
        return stockWatchJaAxios
            .put(
                `/investor/2/portfolio/1/stock/${symbol}/transaction/`,
                {
                    headers: { Authorization: localStorage.getItem('token') },
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
            .delete(`/investor/2/portfolio/1/stock/${symbolId}/transaction/${transactionId}/`, {
                headers: { Authorization: localStorage.getItem('token') },
            })
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
                headers: { Authorization: localStorage.getItem('token') },
            })
            .then((res) => {
                console.log('Got stock names.');
                return res;
            });
    }
}
