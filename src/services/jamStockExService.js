const axios = require('axios');


export default class JamStockExService {

  getStocks(symbols = '', fields = '') {

    if (symbols) {
      return axios.get(`https://jamstockex-api.herokuapp.com/stocks?symbols=${symbols}&projection=${fields}`)  
    }
    return axios.get(`https://jamstockex-api.herokuapp.com/stocks?projection=${fields}`)  
    // return axios.get(`https://jamstockex-api.herokuapp.com/stocks?symbols=${symbols}&projection=${fields}&limit=${limit}&page=${pageNumber}`)  
  }
}