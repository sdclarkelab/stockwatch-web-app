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
                    localStorage.setItem('user', `Bearer ${response.data.access_token}`);
                    stockWatchJaAxios.defaults.headers.common[
                        'Authorization'
                    ] = `Bearer ${response.data.access_token}`;
                    resolve(response);
                })
                .catch((error) => {
                    localStorage.removeItem('user');
                    reject(error);
                });
        });
    }

    logout() {
        const formData = {
            token: localStorage.getItem('user'),
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
                    localStorage.removeItem('user');
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
        return stockWatchJaAxios.get(`/investor/2/portfolio/1/performance/`, {
            headers: { Authorization: localStorage.getItem('user') },
        });
    }

    getInvestorId() {
        return stockWatchJaAxios
            .get(`${process.env.VUE_APP_STOCK_WATCH_URL}/investor/get_id/`, {
                headers: { Authorization: localStorage.getItem('user') },
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
                    headers: { Authorization: localStorage.getItem('user') },
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
                headers: { Authorization: localStorage.getItem('user') },
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
                headers: { Authorization: localStorage.getItem('user') },
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
    //                     Authorization: localStorage.getItem('user'),
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
                        symbol: transaction.symbolName,
                        status: 1,
                        portfolio: transaction.portfolio,
                        status: 3,
                    },
                    transaction: transaction,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('user'),
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

    getSymbolTransactions(symbol) {
        return stockWatchJaAxios
            .get(`/investor/2/portfolio/1/stock/${symbol}/transaction/`, {
                headers: { Authorization: localStorage.getItem('user') },
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
        console.log('Create Trans');
        return stockWatchJaAxios
            .post(
                `/investor/2/portfolio/1/stock/${payload.symbolName}/transaction/`,
                {
                    headers: { Authorization: localStorage.getItem('user') },
                },
                payload
            )
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
                    headers: { Authorization: localStorage.getItem('user') },
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

    deleteSymbolTransaction(symbol, transactionId) {
        return stockWatchJaAxios
            .delete(`/investor/2/portfolio/1/stock/${symbol}/transaction/${transactionId}`, {
                headers: { Authorization: localStorage.getItem('user') },
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
                headers: { Authorization: localStorage.getItem('user') },
            })
            .then((res) => {
                console.log('Got stock names.');
                return res;
            });
    }
}
