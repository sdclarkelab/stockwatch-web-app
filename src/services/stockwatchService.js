const axios = require('axios');


const headers = {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
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

    postStocks(investorId, portfolioId, symbol) {
        return axios.post(`${process.env.VUE_APP_STOCK_WATCH_URL}/investor/${investorId}/portfolio/${portfolioId}/stock/`, 
            {
                "symbol": symbol
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

    createTransaction(investorId, portfolioId, symbol, payload) {
        return axios.post(`${process.env.VUE_APP_STOCK_WATCH_URL}/investor/${investorId}/portfolio/${portfolioId}/stock/${symbol}/transaction/`, 
            payload,
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
} 