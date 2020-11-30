<template>
    <div>
        <Dialog
            :visible.sync="showCreateStockTransactionModal"
            :header="modalName"
            :modal="true"
            class="p-fluid"
        >
            <div class="p-formgrid p-grid">
                <div class="p-field p-col" v-if="!isCreateTransactionOnly">
                    <label for="stocks">Stocks</label>
                    <b-form-select
                        v-model="transaction.symbolName"
                        :options="symbolNameOptions"
                        text-field="instrument_name"
                        value-field="symbol"
                    />
                </div>
                <div class="p-field p-col" v-if="isCreateTransactionOnly">
                    <label for="action">Action</label>
                    <b-form-radio-group
                        id="stock-action-radio-group"
                        v-model="transaction.action"
                        :options="actionOptions"
                        name="stock-action-radio-group options"
                    ></b-form-radio-group>
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
                    @click="hideCreateStockTransactionModal"
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
import _ from 'lodash';

export default {
    name: 'CreateStockTransactionModal',
    props: {
        modalName: String,
        stockOptions: Array,
        showModal: Boolean,
        isCreateTransactionOnly: Boolean,
        actionOptions: Array,
        selectedTransStock: Object,
    },
    data() {
        return {
            selectedStock: '',
            symbolNameOptions: [],
            transaction: this.getDefaultTransaction(),
            showCreateStockTransactionModal: this.showModal,
            transStock: this.selectedTransStock,
        };
    },
    methods: {
        getDefaultTransaction() {
            return {
                stock: _.get(this.selectedTransStock, 'id') || '',
                action: 'buy',
                price: 0,
                shares: 0,
                fees: 0,
            };
        },
        onSaveStockAndTransaction() {
            this.$emit('onSaveStockAndTransaction', this.transaction);
        },
        hideCreateStockTransactionModal() {
            this.$emit('onHideAddTransactionDialog');
        },
    },
    watch: {
        showModal() {
            this.showCreateStockTransactionModal = this.showModal;
        },
        stockOptions() {
            this.symbolNameOptions = this.stockOptions;
        },
        selectedTransStock(stock) {
            this.transStock = stock;
            this.transaction.stock = _.get(this.transStock, 'id');
        },
    },
};
</script>
