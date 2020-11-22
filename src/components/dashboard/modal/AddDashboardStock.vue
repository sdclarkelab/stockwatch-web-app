<template>
    <div>
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
                        v-model="transaction.symbolName"
                        :options="symbolNameOptions"
                        text-field="instrument_name"
                        value-field="symbol"
                    />
                </div>
                <div class="p-field p-col">
                    <label for="price">Action</label>
                    <b-form-select v-model="transaction.action" :options="actionOptions" />
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
                    <InputNumber id="shares" v-model="transaction.shares" />
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
                    @click="onHideAddTransactionDialog"
                />
                <Button
                    label="Save"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="onSaveStockAndTransaction"
                />
            </template>
        </Dialog>
    </div>
</template>

<script>
export default {
    name: 'AddDashboardStock',
    props: {
        actionOptions: Array,
        stockOptions: Array,
        showAddTransactionDialog: Boolean,
    },
    data() {
        return {
            selectedStock: '',
            symbolNameOptions: [],
            transaction: this.getDefaultTransaction(),
        };
    },
    methods: {
        onSaveStockAndTransaction() {
            this.$emit('onSaveStockAndTransaction', this.transaction);
        },
        onHideAddTransactionDialog() {
            this.$emit('onHideAddTransactionDialog');
        },
        getDefaultTransaction() {
            return {
                symbolName: '',
                action: '',
                price: 0,
                shares: 0,
                fees: 0,
                portfolio: 1,
            };
        },
    },
    watch: {
        stockOptions() {
            this.symbolNameOptions = this.stockOptions;
        },
    },
};
</script>
