<template>
  <div>
    <transactions-table
      :transactions="transactions"
      @onSaveTransaction="onSaveTransaction"
      @onDeleteTransaction="onDeleteTransaction"
    />
    <b-button
      variant="info"
      to="/dashboard"
    >
      Back
    </b-button>
  </div>
</template>

<script>
import Stockwatch from "../services/stockwatchService";

import TransactionsTable from '../components/transactions/TransactionsTable.vue';


export default {
    name: 'Transactions',
    stockwatchService: null,
    components: {
        TransactionsTable
    },
    data() {
        return {
            transactions: [],
            actionOptions: ['buy', 'sell'],
            symbol: ''
        };
    },
    created() {
        this.stockwatchService = new Stockwatch();
    },
    mounted() {
        this.symbol = this.$route.params.symbol;
        this.getSymbolTransactions();
    },
    methods: {
        getSymbolTransactions() {
            this.stockwatchService.getSymbolTransactions(this.symbol).then(response => {
                this.transactions = response.data;
            });
        },
        createSymbolTransaction(transaction) {
            this.stockwatchService.createSymbolTransaction(this.symbol, transaction).then(response => {
                if (response.data) {
                    this.$bvToast.toast('Transaction Successfully Added!', {
                        title: "Successful",
                        variant: "success",
                        solid: true,
                        autoHideDelay: 5000,
                    });

                    this.getSymbolTransactions();
                }
            });
        },
        updateSymbolTransaction() {
            this.stockwatchService.updateSymbolTransaction(this.symbol).then(response => {
                this.transactions = response.data;
            });
        },
        deleteSymbolTransactions(transactionId) {
            this.stockwatchService.deleteSymbolTransaction(this.symbol, transactionId).then(response => {
                if (response.data) {
                    this.$bvToast.toast('Transaction Successfully Deleted.', {
                        title: "Successful",
                        variant: "success",
                        solid: true,
                        autoHideDelay: 5000,
                    });

                    this.getSymbolTransactions();
                }
            })
            .catch(error => {
                console.log(error)
            });            
        },
        onSaveTransaction(transaction) {
            this.createSymbolTransaction(transaction);
        },
        onDeleteTransaction(transactionId) {
            this.deleteSymbolTransactions(transactionId);
        }
    }
}
</script>