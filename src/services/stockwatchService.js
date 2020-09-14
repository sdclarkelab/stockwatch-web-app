const qs = require('querystring')

const axios = require('axios');
const stockWatchJaAxios = axios.create({
    baseURL: process.env.VUE_APP_STOCK_WATCH_URL,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    // baseUrl: 'http://localhost:5555/api/v1'
});


const headers = {
    headers: {
        'Authorization': `Bearer ${process.env.VUE_APP_STOCKWATCH_TOKEN}`
    }
};

export default class Stockwatch {

    login(formData) {
        return stockWatchJaAxios.post(
            `${process.env.VUE_APP_STOCK_WATCH_URL}/stockwatch_admin/o/token/`,
            formData,
            {
                auth: {
                  username: process.env.VUE_APP_STOCK_WATCH_USERNAME,
                  password: process.env.VUE_APP_STOCK_WATCH_PASSWORD
                }
            }
        ).then(response => {
            if(response.status === 200) {
                console.log("Successful Login!");
                return response.data;
            }
         })
         .catch(error => {
            console.log(error);
            return error;
        });
    }

    logout(formData) {
        return stockWatchJaAxios.post(
            `${process.env.VUE_APP_STOCK_WATCH_URL}/stockwatch_admin/o/revoke_token/`,
            formData,
            {
                auth: {
                    username: process.env.VUE_APP_STOCK_WATCH_USERNAME,
                    password: process.env.VUE_APP_STOCK_WATCH_PASSWORD
                  }               
            }
        ).then(response => {
            if(response.status === 200) {
                console.log("Successfully Logged Out");
                return response;
            }
        })
        .catch(error => {
            console.log(error);
            return error;
        });
    }

    async getStockPerformance() {
        var token = JSON.parse(localStorage.getItem('user-token'))

        const requestBody = {
            'username': 'test',
            'password': 'test',
            'grant_type': 'password'
        };
 
        if (!token) {
            token = await stockWatchJaAxios.post(`/stockwatch_admin/o/token/`, qs.stringify(requestBody), {
                auth: {
                  username: process.env.VUE_APP_STOCKWATCH_CLIENT,
                  password: process.env.VUE_APP_STOCKWATCH_SECRET
                }
              }).data
              localStorage.setItem('user-token', JSON.stringify(token.data))
        }
 
        stockWatchJaAxios.defaults.headers.common['Authorization'] = `Bearer ${token.access_token}`;

        return stockWatchJaAxios.get(`/investor/2/portfolio/1/performance/`)
    }

    getInvestorId() {
        return stockWatchJaAxios.get(
            `${process.env.VUE_APP_STOCK_WATCH_URL}/investor/get_id/`,
            headers
        )
        .then(response => {
            if(response.status === 200) {
                console.log("Return Investor's Id");
                return response.data;
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    postStocks(symbol) {
        return stockWatchJaAxios.post(`/investor/2/portfolio/1/stock/`, 
            {
                "symbol": symbol,
                "status": 1
            },
            headers
        )
        .then(response => {
            console.log('Added stock to portfolio.');
            return response;
        })
        .catch(error => {
            console.log(error);
        });
    }

    getStocks() {
        return stockWatchJaAxios.get(`/investor/2/portfolio/1/stock/`, 
            headers
        )
        .then(response => {
            console.log('Get stocks.');
            return response;
        })
        .catch(error => {
            console.log(error);
        });
    }

    deleteStockBySymbol(symbol) {
        return stockWatchJaAxios.delete(`/investor/2/portfolio/1/stock/${symbol}`,
            headers
        )
        .then(response => {
            console.log('Deleted Stock.');
            return response;
        })
        .catch(error => {
            console.log(error);
        });  
    }

    createStockBySymbol(symbol) {
        return stockWatchJaAxios.post(`/investor/2/portfolio/1/stock/`, 
            {
                "symbol": symbol
            },
            headers
        )
        .then(response => {
            console.log('Added stock.');
            return response;
        })
        .catch(error => {
            console.log(error);
        });
    }

    getSymbolTransactions(symbol) {
        return stockWatchJaAxios.get(`/investor/2/portfolio/1/stock/${symbol}/transaction/`,
            headers
        )
        .then(response => {
            console.log('Got Transactions.');
            return response;
        })
        .catch(error => {
            console.log(error);
        });  
    }

    createSymbolTransaction(symbol, payload) {
        return stockWatchJaAxios.post(`/investor/2/portfolio/1/stock/${symbol}/transaction/`, 
            payload,
            headers
        )
        .then(response => {
            console.log('Added stock to transaction.');
            return response;
        })
        .catch(error => {
            console.log(error);
        });
    }
    

    updateSymbolTransaction(symbol, payload) {
        return stockWatchJaAxios.put(`/investor/2/portfolio/1/stock/${symbol}/transaction/`, 
            payload,
            headers
        )
        .then(response => {
            console.log('Updated stock to transaction.');
            return response;
        })
        .catch(error => {
            console.log(error);
        });
    }

    deleteSymbolTransaction(symbol, transactionId) {
        return stockWatchJaAxios.delete(`/investor/2/portfolio/1/stock/${symbol}/transaction/${transactionId}`,
            headers
        )
        .then(response => {
            console.log('Deleted Transactions.');
            return response;
        })
        .catch(error => {
            console.log(error);
        });  
    }
} 