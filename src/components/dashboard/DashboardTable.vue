<template>
    <div>
        <DataTable
            ref="dt"
            :value="stockPerformances"
            class="p-datatable-striped"
            :scrollable="true"
            scroll-height="500px"
            :paginator="true"
            :rows="15"
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rows-per-page-options="[15, 30, 45]"
            current-page-report-template="Showing {first} to {last} of {totalRecords} products"
            selectionMode="single"
        >
            <Column field="symbol" header="Stock Code" :sortable="true" />

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

            <Column field="transaction_info.avg_net_price" header="Average Price">
                <template #body="slotProps">
                    {{ slotProps.data.transaction_info.avg_net_price | currency }}
                </template>
            </Column>

            <Column field="transaction_info.total_net_amount" header="Average Net Amount">
                <template #body="slotProps">
                    {{ slotProps.data.transaction_info.total_net_amount | currency }}
                </template>
            </Column>

            <Column field="transaction_info.current_value" header="Current Amount" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.transaction_info.current_value | currency }}
                </template>
            </Column>

            <Column field="stock_weight.market" header="Market Value Weight %" :sortable="true">
                <template #body="slotProps">
                    <ProgressBar :value="slotProps.data.stock_weight.market" :show-value="true" />
                </template>
            </Column>

            <Column field="stock_weight.owned" header="Units owned Weight %" :sortable="true">
                <template #body="slotProps">
                    <ProgressBar :value="slotProps.data.stock_weight.owned" :show-value="true" />
                </template>
            </Column>

            <Column field="performance.profit_loss_value" header="Profit/Loss" :sortable="true">
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
                    <Column footer="Totals:" :colspan="1" />
                    <Column :colspan="1" footer-style="background-color:#e0e0e0" />
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
                    <b-button @click="onShowTransTableModal(slotProps.data.symbol)">
                        <i class="fa fa-university" aria-hidden="true" />
                    </b-button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
import Stockwatch from '../../services/stockwatchService';
import JamStockExService from '../../services/jamStockExService';

export default {
    name: 'DashboardTable',
    stockwatchService: null,
    jamStockExService: null,
    props: {
        stockPerformances: Array,
    },
    data() {
        return {
            transaction: {},
            modalShow: false,
            showStockModal: false,
        };
    },
    computed: {
        currentValueTotal() {
            let total = 0;
            for (let stockPerformance of this.stockPerformances) {
                total += stockPerformance.transaction_info.current_value;
            }

            return total;
        },
        marketPriceTotal() {
            let total = 0;
            for (let stockPerformance of this.stockPerformances) {
                total += stockPerformance.market_position.market_value;
            }

            return total;
        },
        sharesOwnTotal() {
            let total = 0;
            for (let stockPerformance of this.stockPerformances) {
                total += stockPerformance.transaction_info.total_shares;
            }

            return total;
        },
        totalNetAmount() {
            let total = 0;
            for (let stockPerformance of this.stockPerformances) {
                total += stockPerformance.transaction_info.total_net_amount;
            }

            return total;
        },
    },
    created() {
        this.stockwatchService = new Stockwatch();
        this.jamStockExService = new JamStockExService();
    },
    mounted() {},
    methods: {
        onShowTransTableModal(symbol) {
            this.$emit('onShowTransTableModal', symbol);
        },
        adjustColor(value) {
            return value < 0 ? 'font-weight: bold;color:red' : 'font-weight: bold;color:green';
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
            total = (this.currentValueTotal - this.marketPriceTotal) / this.currentValueTotal;
            return total;
        },
    },
};
</script>
<style scoped>
.yellow-row {
    background-color: #ffff99;
}
</style>
