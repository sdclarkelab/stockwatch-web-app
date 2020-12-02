<template>
    <div class="container-fluid">
        <Toolbar class="p-mb-4">
            <template slot="left">
                <Button
                    label="Add Stock"
                    icon="pi pi-plus"
                    class="p-button-success p-mr-2"
                    @click="onAddStockAndTransaction"
                />
            </template>
        </Toolbar>

        <b-modal v-model="showTransTableModal" size="xl" :title="transTableModalTitle">
            <transactions-table
                :action-options="actionOptions"
                :symbol-transactions="transactions"
                :transaction-loading="transactionLoading"
                :selected-stock="selectedStock"
                @onSaveTransaction="onSaveTransaction"
                @onDeleteTransaction="onDeleteTransaction"
            />
        </b-modal>

        <create-stock-transaction-modal
            v-if="showAddTransactionDialog"
            :modal-name="modalName"
            :stock-options="stockOptions"
            :showModal="showAddTransactionDialog"
            :isCreateTransactionOnly="isCreateTransactionOnly"
            :action-options="actionOptions"
            @onHideAddTransactionDialog="onHideAddTransactionDialog"
            @onSaveStockAndTransaction="onSaveStockAndTransaction"
        />

        <dashboard-table
            :stock-performances="stockPerformances"
            @onShowTransTableModal="onShowTransTableModal"
        />
    </div>
</template>

<script>
import Stockwatch from '../services/stockwatchService';
import JamStockExService from '../services/jamStockExService';

import DashboardTable from '../components/dashboard/DashboardTable';
import TransactionsTable from '../components/transactions/TransactionsTable';
import CreateStockTransactionModal from '../components/common/modal/CreateStockTransactionModal';

export default {
    name: 'Dashboard',
    stockwatchService: null,
    jamStockExService: null,
    components: {
        DashboardTable,
        TransactionsTable,
        CreateStockTransactionModal,
    },
    data() {
        return {
            isCreateTransactionOnly: false,
            modalName: 'Create Stock and Transaction',
            actionOptions: ['buy', 'sell'],
            transTableModalTitle: '',
            stockPerformances: [],
            showTransTableModal: false,
            transactions: [],
            transaction: {},
            stockOptions: [],
            transactionLoading: false,
            showAddTransactionDialog: false,
            selectedStock: '',
        };
    },
    created() {
        this.stockwatchService = new Stockwatch();
        this.jamStockExService = new JamStockExService();
    },
    mounted() {
        this.loadStockPerformance();
    },
    methods: {
        // ***************** Dashboard Stock *****************
        onAddStockAndTransaction() {
            this.showAddTransactionDialog = true;
            this.getJSEStocks();
        },
        onHideAddTransactionDialog() {
            this.showAddTransactionDialog = false;
        },
        async onSaveStockAndTransaction(transaction) {
            this.showAddTransactionDialog = false;

            await this.stockwatchService
                .createStockBySymbol(transaction)
                .then(() => {
                    this.$messageService.displayToast(
                        'Success',
                        'success',
                        'Stock Successfully Created!'
                    );
                    this.loadStockPerformance();
                })
                .catch((error) => {
                    this.$messageService.displayToast('Error', 'danger', error);
                });
        },
        // ***************** Dashboard Table *****************
        getJSEStocks() {
            this.stockwatchService
                .getStockNames()
                .then((res) => {
                    this.stockOptions = res.data;
                })
                .catch((error) => {
                    this.$messageService.displayToast('Error', 'danger', error);
                });
        },
        loadStockPerformance() {
            this.stockwatchService
                .getStockPerformance()
                .then((response) => {
                    this.stockPerformances = response.data;
                })
                .catch((error) => {
                    this.$messageService.displayToast('Error', 'danger', error);
                });
        },
        onShowTransTableModal(stock) {
            this.selectedStock = stock;
            this.getSymbolTransactions(stock.id);
            this.showTransTableModal = !this.showTransTableModal;
            this.transTableModalTitle = `${stock.symbol} Transactions`;
        },
        // ***************** Transaction *****************
        getSymbolTransactions(symbolId) {
            this.transactionLoading = true;
            this.stockwatchService
                .getSymbolTransactions(symbolId)
                .then((response) => {
                    this.transactions = response.data;
                    this.transactionLoading = false;
                })
                .catch((error) => {
                    this.$messageService.displayToast('Error', 'danger', error);
                });
        },
        createSymbolTransaction(transaction) {
            this.stockwatchService
                .createSymbolTransaction(transaction)
                .then((response) => {
                    if (response.data) {
                        this.$bvToast.toast('Transaction Successfully Added!', {
                            title: 'Successful',
                            variant: 'success',
                            solid: true,
                            autoHideDelay: 5000,
                        });

                        this.getSymbolTransactions(transaction.stock);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.$bvToast.toast('Error!', {
                        title: 'Error',
                        variant: 'danger',
                        solid: true,
                        autoHideDelay: 5000,
                    });
                });
        },
        updateSymbolTransaction() {
            this.stockwatchService.updateSymbolTransaction(this.symbol).then((response) => {
                this.transactions = response.data;
            });
        },
        deleteSymbolTransactions(transactionId) {
            this.stockwatchService
                .deleteSymbolTransaction(this.symbol, transactionId)
                .then((response) => {
                    if (response.data) {
                        this.$bvToast.toast('Transaction Successfully Deleted.', {
                            title: 'Successful',
                            variant: 'success',
                            solid: true,
                            autoHideDelay: 5000,
                        });

                        this.getSymbolTransactions();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        onSaveTransaction(transaction) {
            this.createSymbolTransaction(transaction);
        },
        onDeleteTransaction(transactionId) {
            this.deleteSymbolTransactions(transactionId);
        },
        onViewTransaction(symbol) {
            this.$router.push({ path: `symbol/${symbol}/transaction` });
        },
    },
};
</script>
