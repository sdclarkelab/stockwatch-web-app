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

            <Column field="transaction_info.total_shares" header="Shares" />

            <Column field="transaction_info.avg_net_price" header="Average Price">
                <template #body="slotProps">
                    {{ slotProps.data.transaction_info.avg_net_price | currency }}
                </template>
            </Column>

            <Column field="plan.target_sell_price" header="Target Sell Price">
                <template #body="slotProps">
                    {{ slotProps.data.plan.target_sell_price | currency }}
                </template>
            </Column>

            <Column field="transaction_info.current_value" header="Current Amount" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.transaction_info.current_value | currency }}
                </template>
            </Column>

            <Column field="performance.profit_loss_value" header="Profit/Loss" :sortable="true">
                <template #body="slotProps">
                    <p :style="adjustColor(slotProps.data.performance.profit_loss_value)">
                        {{ slotProps.data.performance.profit_loss_value | currency }}
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

            <Column field="plan.status" header="Status">
                <template #body="slotProps">
                    <span
                        v-if="slotProps.data.plan.status == 1"
                        :class="'status-badge status-' + slotProps.data.plan.status"
                        >SELL</span
                    >
                    <span
                        v-if="slotProps.data.plan.status == 3"
                        :class="'status-badge status-' + slotProps.data.plan.status"
                        >HOLD</span
                    >
                </template>
            </Column>

            <Column field="transaction_info.total_net_amount" header="Average Net Amount">
                <template #body="slotProps">
                    {{ slotProps.data.transaction_info.total_net_amount | currency }}
                </template>
            </Column>

            <Column field="stock_weight.owned" header="Units owned Weight %" :sortable="true">
                <template #body="slotProps">
                    <ProgressBar :value="slotProps.data.stock_weight.owned">
                        {{ slotProps.data.stock_weight.owned | percent }}
                    </ProgressBar>
                </template>
            </Column>

            <Column
                field="stock_weight.market"
                header="Market Value Weight %"
                headerStyle="background-color:#FEFFB1"
                bodyStyle="background-color:#FEFFB1"
                :sortable="true"
            >
                <template #body="slotProps">
                    <ProgressBar :value="slotProps.data.stock_weight.market">
                        {{ slotProps.data.stock_weight.market | percent }}
                    </ProgressBar>
                </template>
            </Column>

            <Column
                field="market_position.market_price"
                header="Market Price"
                headerStyle="background-color:#FEFFB1"
                bodyStyle="background-color:#FEFFB1"
            >
                <template #body="slotProps">
                    {{ slotProps.data.market_position.market_price | currency }}
                </template>
            </Column>

            <Column
                field="market_position.market_value"
                header="Market Value"
                headerStyle="background-color:#FEFFB1"
                bodyStyle="background-color:#FEFFB1"
            >
                <template #body="slotProps">
                    {{ slotProps.data.market_position.market_value | currency }}
                </template>
            </Column>

            <ColumnGroup type="footer">
                <Row>
                    <Column footer="Totals:" :colspan="4" />
                    <Column :footer="currentValueTotal | currency" />
                    <Column
                        :footer="profitTotal() | currency"
                        :footer-style="adjustColor(profitTotal())"
                    />
                    <Column
                        :footer="avgProfitLostPercentage | percent"
                        :footer-style="adjustColor(avgProfitLostPercentage)"
                        :colspan="2"
                    />
                    <Column :footer="totalNetAmount | currency" />
                </Row>
            </ColumnGroup>
            <Column>
                <template #body="slotProps">
                    <b-button @click="onShowTransTableModal(slotProps.data)">
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
        avgProfitLostPercentage() {
            var total = 0;

            for (let stockPerformance of this.stockPerformances) {
                total += stockPerformance.performance.profit_loss_percentage;
            }

            return total / this.stockPerformances.length;
        },
    },
    created() {
        this.stockwatchService = new Stockwatch();
        this.jamStockExService = new JamStockExService();
    },
    mounted() {},
    methods: {
        onShowTransTableModal(stock) {
            this.$emit('onShowTransTableModal', stock);
        },
        adjustColor(value) {
            return value < 0 ? 'font-weight: bold;color:red' : 'font-weight: bold;color:green';
        },
        exportCSV() {
            this.$refs.dt.exportCSV();
        },
        profitTotal() {
            var total = 0;
            total = this.marketPriceTotal - this.currentValueTotal;
            return total;
        },
        profitPercentage() {
            var total = 0;
            total = (this.marketPriceTotal - this.currentValueTotal) / this.currentValueTotal;
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
