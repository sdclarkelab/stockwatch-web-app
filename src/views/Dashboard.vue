<template>
    <div class="container-fluid">
        <Toolbar class="p-mb-4">
            <template #left>
                <Button
                    label="Add Stock"
                    icon="pi pi-plus"
                    class="p-mr-2"
                    @click="onAddStockAndTransaction"
                />

                <FileUpload
                    mode="basic"
                    name="demo[]"
                    chooseLabel="Upload JMMB CSV"
                    :customUpload="true"
                    @uploader="myUploader"
                    class="p-fileupload-success p-mr-2"
                    :auto="true"
                />
            </template>
        </Toolbar>

        <b-modal v-model="showTransTableModal" size="xl" :title="transTableModalTitle">
            <transactions-table
                :symbol-transactions="transactions"
                :transaction-loading="transactionLoading"
                :selected-stock="selectedStock"
                @onSaveTransaction="onSaveTransaction"
                @onEditTransaction="onEditTransaction"
                @onDeleteTransaction="onDeleteTransaction"
            />
        </b-modal>

        <stock-transaction-modal
            :modalType="modalTypeTxt"
            :showstockTransactionModal="showAddTransactionDialog"
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
import stockTransactionModal from '../components/common/modal/StockTransactionModal';

export default {
    name: 'Dashboard',
    stockwatchService: null,
    jamStockExService: null,
    components: {
        DashboardTable,
        TransactionsTable,
        stockTransactionModal,
    },
    data() {
        return {
            transTableModalTitle: '',
            stockPerformances: [],
            showTransTableModal: false,
            transactions: [],
            transaction: {},
            stockOptions: [],
            transactionLoading: false,
            showAddTransactionDialog: false,
            selectedStock: '',
            portfolioId: '',
            modalTypeTxt: 'createStock',
        };
    },
    created() {
        this.stockwatchService = new Stockwatch();
        this.jamStockExService = new JamStockExService();
    },
    async mounted() {
        console.log('in dashboard');
        this.portfolioId = await this.getDefaultPortfolioId();
        this.loadStockPerformance(this.portfolioId);
    },
    methods: {
        async myUploader(event) {
            //event.files == files to upload
            console.log(event.files[0]);
            await this.stockwatchService
                .uploadJmmbCsv(event.files[0])
                .then(() => {
                    this.$messageService.displayToast(
                        'Success',
                        'success',
                        'File Successfully Uploaded!'
                    );
                    this.loadStockPerformance();
                })
                .catch((error) => {
                    this.$messageService.displayToast('Error', 'danger', error);
                });
            event.files = [];
        },
        // ***************** Dashboard Stock *****************
        onAddStockAndTransaction() {
            this.showAddTransactionDialog = true;
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
        async getDefaultPortfolioId() {
            return await this.stockwatchService
                .getDefaultPortfolioId()
                .then((response) => {
                    return response.data.portfolio_id;
                })
                .catch((error) => {
                    this.$messageService.displayToast('Error', 'danger', error);
                });
        },
        loadStockPerformance(portfolioId) {
            this.stockwatchService
                .getStockPerformance(portfolioId)
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
                    this.loadStockPerformance();
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
        updateTransaction(transaction) {
            this.stockwatchService
                .updateTransaction(transaction)
                .then((response) => {
                    if (response.data) {
                        this.$bvToast.toast('Transaction Successfully Updated!', {
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
        deleteSymbolTransactions(transactionId, stockId) {
            this.stockwatchService
                .deleteSymbolTransaction(stockId, transactionId)
                .then((response) => {
                    if (response.data) {
                        this.$bvToast.toast('Transaction Successfully Deleted.', {
                            title: 'Successful',
                            variant: 'success',
                            solid: true,
                            autoHideDelay: 5000,
                        });

                        this.getSymbolTransactions(stockId);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        onSaveTransaction(transaction) {
            this.createSymbolTransaction(transaction);
        },
        onEditTransaction(transaction) {
            this.updateTransaction(transaction);
        },
        onDeleteTransaction(transactionId, stockId) {
            this.deleteSymbolTransactions(transactionId, stockId);
        },
        onViewTransaction(symbol) {
            this.$router.push({ path: `symbol/${symbol}/transaction` });
        },
    },
};
</script>
