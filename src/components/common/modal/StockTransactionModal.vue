<template>
    <div>
        <Dialog :visible.sync="showModal" :header="modalName" :modal="true" class="p-fluid">
            <div class="p-formgrid p-grid">
                <div class="p-field p-col" v-if="showStockDDL">
                    <label for="stocks">Stocks</label>
                    <b-form-select
                        v-model="transaction.symbolName"
                        :options="symbolNameOptions"
                        text-field="instrument_name"
                        value-field="symbol"
                    />
                </div>
                <div class="p-field p-col" v-if="showActionRadioBtn">
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
                <div class="p-field p-col" v-if="showTargetPercentage">
                    <label for="target_percentage">Target Sell Percentage</label>
                    <InputNumber id="target_percentage" v-model="transaction.target_percentage" />
                </div>
            </div>
            <template #footer>
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="hidestockTransactionModal"
                />
                <Button
                    :label="saveBtnText"
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
import Stockwatch from '../../../services/stockwatchService';

export default {
    name: 'StockTransactionModal',
    stockwatchService: null,
    props: {
        modalType: String,
        showstockTransactionModal: Boolean,
        selectedTransStock: Object,
        editTransaction: Object,
    },
    created() {
        this.stockwatchService = new Stockwatch();
    },
    data() {
        return {
            actionOptions: [
                { text: 'buy', value: 2 },
                { text: 'sell', value: 1 },
            ],
            selectedStock: '',
            symbolNameOptions: [],
            transaction: this.getDefaultTransaction(),
            showModal: this.showstockTransactionModal,
            showStockDDL: false,
            showActionRadioBtn: false,
            showTargetPercentage: false,
            saveBtnText: '',
            modalName: '',
        };
    },
    methods: {
        getDefaultTransaction() {
            return {
                action: 2,
                price: 0,
                shares: 0,
                fees: 0,
                stock: _.get(this.selectedTransStock, 'id'),
                total_shares: _.get(this.selectedTransStock, 'transaction_info.total_shares', ''),
                ...(this.modalName != 'Create Transaction' && { target_percentage: 5 }),
                ...(this.modalName == 'Create Transaction' && {
                    plan_id: _.get(this.selectedTransStock, 'plan.id', ''),
                }),
            };
        },
        onSaveStockAndTransaction() {
            if (this.modalType === 'createStock' || this.modalType === 'createTransaction') {
                this.$emit('onSaveStockAndTransaction', this.transaction);
            } else {
                this.$emit('onEditStockAndTransaction', this.transaction);
            }
        },
        hidestockTransactionModal() {
            this.$emit('onHideAddTransactionDialog');
        },
        getJSEStocks() {
            this.stockwatchService
                .getStockNames()
                .then((res) => {
                    this.symbolNameOptions = res.data;
                })
                .catch((error) => {
                    this.$messageService.displayToast('Error', 'danger', error);
                });
        },
        configModal() {
            switch (this.modalType) {
                case 'createStock':
                    this.modalName = 'Create Stock and Transaction';
                    this.getJSEStocks();
                    this.showStockDDL = true;
                    this.saveBtnText = 'Save Stock';
                    this.showTargetPercentage = true;
                    break;
                case 'createTransaction':
                    this.modalName = 'Create Transcation';
                    this.showActionRadioBtn = true;
                    this.saveBtnText = 'Save Transaction';
                    break;
                case 'editTransaction':
                    this.modalName = 'Edit Transcation';
                    this.showActionRadioBtn = true;
                    this.saveBtnText = 'Update Transaction';
                    break;
            }
        },
        cleanTransaction(transaction) {
            transaction.price = parseFloat(transaction.price);
            transaction.fees = parseFloat(transaction.fees);
            transaction.share = parseFloat(transaction.share);
            return transaction;
        },
    },
    watch: {
        showstockTransactionModal() {
            this.showModal = this.showstockTransactionModal;
            if (this.showstockTransactionModal) {
                this.configModal();
            }
        },
        selectedTransStock(stock) {
            this.transaction.stock = _.get(stock, 'id');
            this.transaction.total_shares = _.get(stock, 'transaction_info.total_shares', '');
        },
        editTransaction() {
            let rawTransaction = this.editTransaction;
            this.transaction = this.cleanTransaction(rawTransaction);
        },
    },
};
</script>
