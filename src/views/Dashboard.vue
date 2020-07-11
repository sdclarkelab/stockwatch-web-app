<template>
    <div>
        <Toolbar class="p-mb-4">
            <template slot="left">
                <Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" />
                <Button label="Delete" icon="pi pi-trash" class="p-button-danger" />
            </template>

            <template slot="right">
                <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2" />
                <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
            </template>
        </Toolbar>

        <DataTable ref="dt" :value="stockPerformances" class="p-datatable-striped" 
        :loading="loading" :scrollable="true" scrollHeight="500px" :paginator="true" :rows="10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        >
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

            <Column field="symbol" header="Stock Code" :sortable="true"></Column>

            <Column field="market_position.dollar_change" header="Price Change" bodyStyle="background-color:#e0e0e0">
                 <template #body="slotProps">
                    {{ slotProps.data.market_position.dollar_change | currency }}
                </template>       
            </Column>

            <Column field="market_position.market_price" header="Market Price" bodyStyle="background-color:#e0e0e0">
                 <template #body="slotProps">
                    {{ slotProps.data.market_position.market_price | currency }}
                </template>       
            </Column>

            <Column field="market_position.market_value" header="Market Value" bodyStyle="background-color:#e0e0e0">
                 <template #body="slotProps">
                    {{ slotProps.data.market_position.market_value | currency }}
                </template>       
            </Column>

            <Column field="transaction_info.average_price" header="Average Price">
                <template #body="slotProps">
                    {{ slotProps.data.transaction_info.average_price | currency }}
                </template>
            </Column>

            <Column field="transaction_info.total_value" header="Current Amount" :sortable="true">
                 <template #body="slotProps">
                    {{ slotProps.data.transaction_info.total_value | currency }}
                </template>           
            </Column>

            <Column field="transaction_info.total_shares" header="Total Shares"></Column>

            <Column field="stock_weight" header="Weight %" :sortable="true">
                <template #body="slotProps">
                    <ProgressBar :value="slotProps.data.stock_weight" :showValue="true"></ProgressBar>
                </template>
            </Column>

            <Column field="performance.profit_loss_value" header="Profit/Loss" :sortable="true">
                <template #body="slotProps">
                    <p :style="adjustColor(slotProps.data.performance.profit_loss_value)">{{slotProps.data.performance.profit_loss_value}}</p>
                </template>
            </Column>

            <Column field="performance.profit_loss_percentage" header="Profit/Loss %" :sortable="true">
                <template #body="slotProps">
                    <p :style="adjustColor(slotProps.data.performance.profit_loss_percentage)">{{slotProps.data.performance.profit_loss_percentage | percent }}</p>
                </template>
            </Column>
            <!-- <Column field="totalShares" header="Target Price"></Column>
            <Column field="totalShares" header="Action"></Column> --> 

            <ColumnGroup type="footer">
                <Row>
                    <Column footer="Totals:" :colspan="2" />
                    <Column :colspan="2" footerStyle="background-color:#e0e0e0" />
                    <Column :footer="marketPriceTotal | currency" footerStyle="background-color:#e0e0e0" />
                    <Column :colspan="1" />
                    <Column :footer="currentValueTotal | currency" />
                    <Column :footer="sharesOwnTotal" />
                    <Column :colspan="1" />
                    <Column :footer="profitTotal() | currency" :footerStyle="adjustColor(profitTotal())" />
                    <Column :footer="profitPercentage() | percent" :footerStyle="adjustColor(profitPercentage())" />
                </Row>
            </ColumnGroup>
        </DataTable>
    </div>
</template>

<script>
import Stockwatch from "../services/stockwatchService";

export default {
    name: 'Dashboard',
    stockwatchService: null,
    data() {
        return {
            stockPerformances: [],
            loading: false
        };
    },
    created() {
        this.stockwatchService = new Stockwatch();
    },
    mounted() {
        this.loading = true;
        this.stockwatchService.getStockPerformance().then(response => {
            this.stockPerformances = response.data;
            this.loading = false;
        })
    },
    methods: {
        adjustColor(value) {
            return value < 0 ? 'font-weight: bold;color:red' : 'font-weight: bold;color:green'
        },
        openNew() {},
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
        }
    },
    computed: {
        currentValueTotal() {
            let total = 0;
            for(let stockPerformance of this.stockPerformances) {
                total += stockPerformance.transaction_info.total_value;
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
        }
    }
}
</script>
<style scoped>
.yellow-row {
    background-color:#FFFF99
}
</style>