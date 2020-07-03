<template>
    <div>
        <DataTable :value="stockPerformances" class="p-datatable-striped" :loading="loading" :lazy="true" :scrollable="true" scrollHeight="500px">
            <Column field="symbol" header="Stock Code"></Column>
            <Column field="transaction_info.total_shares" header="Totoal Shares"></Column>
            <Column field="transaction_info.average_price" header="Average Price"></Column>
            <Column field="transaction_info.total_value" header="Current Amount"></Column>
            <Column field="market_position.market_price" header="Market Price"></Column>
            <Column field="market_position.dollar_change" header="Price Change"></Column>
            <Column field="market_position.market_value" header="Market Value"></Column>
            <!-- <Column field="symbol" header="Weight %"></Column> -->
            <Column field="performance.profit_loss_value" header="Profit/Loss">
                <template #body="slotProps">
                    <p :style="adjustColor(slotProps.data.performance.profit_loss_value)">{{slotProps.data.performance.profit_loss_value}}</p>
                </template>
            </Column>
            <Column field="performance.profit_loss_percentage" header="%Profit/Losss">
                <template #body="slotProps">
                    <p :style="adjustColor(slotProps.data.performance.profit_loss_percentage)">{{slotProps.data.performance.profit_loss_percentage}}</p>
                </template>
            </Column>
            <!-- <Column field="totalShares" header="Target Price"></Column>
            <Column field="totalShares" header="Action"></Column> -->
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
        }
    }
}
</script>