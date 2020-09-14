<template>
  <div>
    <Toolbar class="p-mb-4">
      <template slot="left">
        <Button
          label="New"
          icon="pi pi-plus"
          class="p-button-success p-mr-2"
          @click="addStock"
        />
      </template>
    </Toolbar>

    <b-modal
      v-model="modalShow"
      size="xl"
      :title="modalTitle"
    >
      <transactions-table
        :symbol-transactions="transactions" 
        :transaction-loading="transactionLoading" 
        @onSaveTransaction="onSaveTransaction" 
        @onDeleteTransaction="onDeleteTransaction"
      />
    </b-modal>

    <Dialog
      :visible.sync="showAddTransactionDialog"
      header="Transaction Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-formgrid p-grid">
        <div class="p-field p-col">
          <label for="price">Stocks</label>
          <b-form-select
            v-model="selectedStock"
            :options="stockOptions"
            text-field="instrument_name"
            value-field="symbol"
          />
        </div>
        <div class="p-field p-col">
          <label for="price">Action</label>
          <b-form-select
            v-model="transaction.action"
            :options="actionOptions"
          />
        </div>
        <div class="p-field p-col">
          <label for="price">Price</label>
          <InputNumber
            id="price"
            v-model="transaction.price"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>
        <div class="p-field p-col">
          <label for="shares">Shares</label>
          <InputNumber
            id="shares"
            v-model="transaction.shares"
          />
        </div>
        <div class="p-field p-col">
          <label for="fees">Fees</label>
          <InputNumber
            id="fees"
            v-model="transaction.fees"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          class="p-button-text"
          @click="saveStock"
        />
      </template>
    </Dialog>

    <DataTable
      ref="dt"
      :value="stockPerformances"
      class="p-datatable-striped" 
      :loading="loading"
      :scrollable="true"
      scroll-height="500px"
      :paginator="true"
      :rows="15"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rows-per-page-options="[15,30,45]"
      current-page-report-template="Showing {first} to {last} of {totalRecords} products"
    >
      <Column
        field="symbol"
        header="Stock Code"
        :sortable="true"
      />

      <Column
        field="market_position.market_price"
        header="Market Price"
        body-style="background-color:#e0e0e0"
      >
        <template #body="slotProps">
          {{ slotProps.data.market_position.market_price | currency }}
        </template>       
      </Column>

      <Column
        field="market_position.market_value"
        header="Market Value"
        body-style="background-color:#e0e0e0"
      >
        <template #body="slotProps">
          {{ slotProps.data.market_position.market_value | currency }}
        </template>       
      </Column>

      <Column
        field="transaction_info.avg_net_price"
        header="Average Price"
      >
        <template #body="slotProps">
          {{ slotProps.data.transaction_info.avg_net_price | currency }}
        </template>
      </Column>

      <Column
        field="transaction_info.total_net_amount"
        header="Average Net Amount"
      >
        <template #body="slotProps">
          {{ slotProps.data.transaction_info.total_net_amount | currency }}
        </template>
      </Column>

      <Column
        field="transaction_info.current_value"
        header="Current Amount"
        :sortable="true"
      >
        <template #body="slotProps">
          {{ slotProps.data.transaction_info.current_value | currency }}
        </template>           
      </Column>

      <Column
        field="stock_weight.market"
        header="Market Value Weight %"
        :sortable="true"
      >
        <template #body="slotProps">
          <ProgressBar
            :value="slotProps.data.stock_weight.market"
            :show-value="true"
          />
        </template>
      </Column>

      <Column
        field="stock_weight.owned"
        header="Units owned Weight %"
        :sortable="true"
      >
        <template #body="slotProps">
          <ProgressBar
            :value="slotProps.data.stock_weight.owned"
            :show-value="true"
          />
        </template>
      </Column>

      <Column
        field="performance.profit_loss_value"
        header="Profit/Loss"
        :sortable="true"
      >
        <template #body="slotProps">
          <p :style="adjustColor(slotProps.data.performance.profit_loss_value)">
            {{ slotProps.data.performance.profit_loss_value }}
          </p>
        </template>
      </Column>

      <Column
        field="performance.profit_loss_percentage"
        header="Profit/Loss %"
        :sortable="true"
      >
        <template #body="slotProps">
          <p :style="adjustColor(slotProps.data.performance.profit_loss_percentage)">
            {{ slotProps.data.performance.profit_loss_percentage | percent }}
          </p>
        </template>
      </Column>
      <!-- <Column field="totalShares" header="Target Price"></Column>
            <Column field="totalShares" header="Action"></Column> --> 

      <ColumnGroup type="footer">
        <Row>
          <Column
            footer="Totals:"
            :colspan="1"
          />
          <Column
            :colspan="1"
            footer-style="background-color:#e0e0e0"
          />
          <Column
            :footer="marketPriceTotal | currency"
            footer-style="background-color:#e0e0e0"
          />
          <Column :colspan="1" />
          <Column :footer="totalNetAmount | currency" />
          <Column :footer="currentValueTotal | currency" />
          <Column :colspan="2" />
          <Column
            :footer="profitTotal() | currency"
            :footer-style="adjustColor(profitTotal())"
          />
          <Column
            :footer="profitPercentage() | percent"
            :footer-style="adjustColor(profitPercentage())"
          />
        </Row>
      </ColumnGroup>
      <Column>
        <template #body="slotProps">
          <!-- <Button icon="pi pi-dollar" class="p-button-rounded p-button-success p-mr-2" @click="onViewTransaction(slotProps.data.symbol)" /> -->
          <!-- <Button icon="pi pi-dollar" class="p-button-rounded p-button-success p-mr-2" @click="modalShow = !modalShow" /> -->
          <b-button @click="onShowModal(slotProps.data.symbol)">
            <i
              class="fa fa-university"
              aria-hidden="true"
            />
          </b-button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import Stockwatch from "../services/stockwatchService";
import JamStockExService from "../services/jamStockExService";

import TransactionsTable from "../components/transactions/TransactionsTable.vue";

export default {
    name: 'Dashboard',
    stockwatchService: null,
      jamStockExService: null,
    components: {
        TransactionsTable,
    },
    data() {
        return {
            modalTitle: '',
            actionOptions: ['buy', 'sell'],
            transaction: {},
            transactions: [],
            stockPerformances: [],
            modalShow: false,
            showStockModal: false,
            loading: false,
            transactionLoading: false,
            showAddTransactionDialog: false,
            stockOptions: [],
            selectedStock: ''
        };
    },
    computed: {
        currentValueTotal() {
            let total = 0;
            for(let stockPerformance of this.stockPerformances) {
                total += stockPerformance.transaction_info.current_value;
            }

            return total;
        },
        marketPriceTotal() {
            let total = 0;
            for(let stockPerformance of this.stockPerformances) {
                total += stockPerformance.market_position.market_value;
            }

            return total;
        },
        sharesOwnTotal() {
            let total = 0;
            for(let stockPerformance of this.stockPerformances) {
                total += stockPerformance.transaction_info.total_shares;
            }

            return total;
        },
        totalNetAmount() {
            let total = 0;
            for(let stockPerformance of this.stockPerformances) {
                total += stockPerformance.transaction_info.total_net_amount;
            }

            return total;
        }
    },
    created() {
        this.stockwatchService = new Stockwatch();
        this.jamStockExService = new JamStockExService();
    },
    mounted() {
        
        this.loadStockPerformance();
        this.getJSEStocks();
    },
    methods: {
        loadStockPerformance() {
            this.loading = true;
            this.stockwatchService.getStockPerformance().then(response => {
                this.stockPerformances = response.data;
                this.loading = false;
            });
        },
        getJSEStocks() {
            this.jamStockExService.getStocks('', 'symbol instrument_name').then(response => {
                this.stockOptions = response.data.result;
            });
        },
        // getStocks() {
        //     this.stockwatchService.getStocks().then(response => {
        //         this.stockOptions = response.data;
        //     });
        // },
        onShowModal(symbol) {
            this.getSymbolTransactions(symbol);
            this.modalShow = !this.modalShow;
            this.modalTitle = `${symbol} Transactions`;
            console.log(symbol);
        },
        getSymbolTransactions(symbol) {
            this.transactionLoading = true;
            this.stockwatchService.getSymbolTransactions(symbol).then(response => {
                this.transactions = response.data;
                this.transactionLoading = false;
            });
        },
        adjustColor(value) {
            return value < 0 ? 'font-weight: bold;color:red' : 'font-weight: bold;color:green'
        },
        addStock() {
            this.transaction = {};
            this.showAddTransactionDialog = true;
        },
        hideDialog() {
            this.showAddTransactionDialog = false;
        },
        saveStock() {
            this.showAddTransactionDialog = false;
            

            this.stockwatchService.postStocks(this.selectedStock).then(stock => {
                console.log(stock);

                this.stockwatchService.createSymbolTransaction(this.selectedStock, this.transaction).then(response => {
                    if (response.data) {
                        this.$bvToast.toast('Transaction Successfully Added!', {
                            title: "Successful",
                            variant: "success",
                            solid: true,
                            autoHideDelay: 5000,
                        });
                        this.transaction = {};
                        this.loadStockPerformance();
                    }
                });
            
            });


        },
        exportCSV() {
            this.$refs.dt.exportCSV();
        },
        profitTotal() {

            var total = 0;
            total = this.currentValueTotal - this.marketPriceTotal;
            return total;
        },
        profitPercentage() {
            var total = 0;
            total = (this.currentValueTotal - this.marketPriceTotal) / this.currentValueTotal ;
            return total;
        },
        onViewTransaction(symbol) {
            this.$router.push({ path: `symbol/${symbol}/transaction`});
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
<style scoped>
.yellow-row {
    background-color:#FFFF99
}
</style>