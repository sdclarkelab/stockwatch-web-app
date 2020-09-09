const axios = require('axios');


const headers = {
    headers: {
        // 'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        'Authorization': `Bearer ${process.env.VUE_APP_STOCKWATCH_TOKEN}`
    }
};

export default class Stockwatch {

    login(formData) {
        return axios.post(
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
        return axios.post(
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

    getStockPerformance() {
        return axios.get(
            `http://localhost:5555/api/v1/investor/2/portfolio/1/performance/`,
            headers
        )
    }

    getInvestorId() {
        return axios.get(
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
        return axios.post(`http://localhost:5555/api/v1/investor/2/portfolio/1/stock/`, 
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
        return axios.get(`http://localhost:5555/api/v1/investor/2/portfolio/1/stock/`, 
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
        return axios.delete(`http://localhost:5555/api/v1/investor/2/portfolio/1/stock/${symbol}`,
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
        return axios.post(`http://localhost:5555/api/v1/investor/2/portfolio/1/stock/`, 
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
        return axios.get(`http://localhost:5555/api/v1/investor/2/portfolio/1/stock/${symbol}/transaction/`,
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
        return axios.post(`http://localhost:5555/api/v1/investor/2/portfolio/1/stock/${symbol}/transaction/`, 
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
        return axios.put(`http://localhost:5555/api/v1/investor/2/portfolio/1/stock/${symbol}/transaction/`, 
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
        return axios.delete(`http://localhost:5555/api/v1/investor/2/portfolio/1/stock/${symbol}/transaction/${transactionId}`,
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