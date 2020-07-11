const axios = require('axios');


export default class JamStockExService {

  getStocks(symbols = '', fields = '', limit, pageNumber) {

    if (symbols) {
      return axios.get(`https://jamstockex-api.herokuapp.com/stocks?symbols=${symbols}&projection=${fields}`)  
    }
     
    return axios.get(`https://jamstockex-api.herokuapp.com/stocks?symbols=${symbols}&projection=${fields}&limit=${limit}&page=${pageNumber}`)  
  }
}