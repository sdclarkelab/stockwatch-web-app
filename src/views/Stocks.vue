<template>
    <div>
        <div>Test</div>
        <stocks-table
            :stocks="stocks"
            :symbol-options="symbolOptions"
            @onSaveStock="onSaveStock"
            @onDeleteStock="onDeleteStock"
        />
    </div>
</template>

<script>
import Stockwatch from '../services/stockwatchService';
import JamStockExService from '../services/jamStockExService';

import StocksTable from '../components/stocks/StocksTable.vue';

export default {
    name: 'Stocks',
    stockwatchService: null,
    jamStockExService: null,
    components: {
        StocksTable,
    },
    data() {
        return {
            stocks: [],
            symbolOptions: [],
        };
    },
    created() {
        this.stockwatchService = new Stockwatch();
        this.jamStockExService = new JamStockExService();
    },
    mounted() {
        this.getStocks();
        this.getJSEStocks();
    },
    methods: {
        getJSEStocks() {
            this.jamStockExService.getStocks('', 'symbol instrument_name').then((response) => {
                this.symbolOptions = response.data;
            });
        },
        getStocks() {
            this.stockwatchService.getStocks().then((response) => {
                this.stocks = response.data;
            });
        },
        onSaveStock(stock) {
            this.createStockBySymbol(stock);
        },
        onDeleteStock(symbol) {
            this.deleteStockBySymbol(symbol);
        },
        createStockBySymbol(stockData) {
            console.log(stockData);
            this.stockwatchService.createStockBySymbol(stockData.symbol).then((response) => {
                if (response.data) {
                    this.$bvToast.toast('Stock Successfully Added!', {
                        title: 'Successful',
                        variant: 'success',
                        solid: true,
                        autoHideDelay: 5000,
                    });

                    this.getStocks();
                }
            });
        },
        deleteStockBySymbol(symbol) {
            this.stockwatchService
                .deleteStockBySymbol(symbol)
                .then((response) => {
                    if (response.data) {
                        this.$bvToast.toast('Stock Successfully Deleted.', {
                            title: 'Successful',
                            variant: 'success',
                            solid: true,
                            autoHideDelay: 5000,
                        });

                        this.getStocks();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
};
</script>
