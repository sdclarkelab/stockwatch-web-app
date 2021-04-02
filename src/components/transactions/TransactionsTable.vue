<template>
    <div>
        <Toolbar class="p-mb-4">
            <template slot="left">
                <Button
                    label="New"
                    icon="pi pi-plus"
                    class="p-button-success p-mr-2"
                    @click="openTransactionModal('createTransaction')"
                />
            </template>
        </Toolbar>

        <DataTable
            :value="transactions"
            :selection.sync="selectedTransactions"
            :loading="transactionLoading"
        >
            <Column selection-mode="multiple" header-style="width: 3rem" />
            <Column field="last_updated_date" header="Date">
                <template #body="slotProps">
                    {{ slotProps.data.last_updated_date | date }}
                </template>
            </Column>
            <Column field="action" header="Action">
                <template #body="slotProps">
                    <p :style="adjustActionColor(mapAction(slotProps.data.action))">
                        {{ mapAction(slotProps.data.action) }}
                    </p>
                </template>
            </Column>
            <Column field="shares" header="Shares" />
            <Column field="price" header="Price">
                <template #body="slotProps">
                    {{ slotProps.data.price | currency }}
                </template>
            </Column>
            <Column field="fees" header="Fee">
                <template #body="slotProps">
                    {{ slotProps.data.fees | currency }}
                </template>
            </Column>
            <Column field="gross_amount" header="Gross Amount">
                <template #body="slotProps">
                    {{ slotProps.data.gross_amount | currency }}
                </template>
            </Column>
            <Column field="net_amount" header="Net Amount">
                <template #body="slotProps">
                    {{ slotProps.data.net_amount | currency }}
                </template>
            </Column>
            <Column field="net_price" header="Net Price">
                <template #body="slotProps">
                    {{ slotProps.data.net_price | currency }}
                </template>
            </Column>
            <Column>
                <template #body="slotProps">
                    <Button
                        icon="pi pi-pencil"
                        class="p-button-rounded p-button-success p-mr-2"
                        @click="openTransactionModal('editTransaction', slotProps.data)"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded p-button-warning"
                        @click="confirmDeleteTransaction(slotProps.data)"
                    />
                </template>
            </Column>
        </DataTable>

        <stock-transaction-modal
            :modalType="modalTypeTxt"
            :selectedTransStock="selectedStock"
            :showstockTransactionModal="showAddTransactionDialog"
            :editTransaction="editTransaction"
            @onHideAddTransactionDialog="onHideAddTransactionDialog"
            @onSaveStockAndTransaction="onSaveStockAndTransaction"
            @onEditStockAndTransaction="onEditStockAndTransaction"
        />

        <Dialog
            :visible.sync="showDeleteTransactionDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true"
        >
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
                <span v-if="transaction">Are you sure you want to delete?</span>
            </div>
            <template #footer>
                <Button
                    label="No"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="showDeleteTransactionDialog = false"
                />
                <Button
                    label="Yes"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteTransaction"
                />
            </template>
        </Dialog>
    </div>
</template>

<script>
import stockTransactionModal from '../common/modal/StockTransactionModal';

export default {
    name: 'TransactionsTable',
    components: {
        stockTransactionModal,
    },
    props: {
        symbolTransactions: Array,
        transactionLoading: Boolean,
        selectedStock: Object,
    },
    data() {
        return {
            isCreateTransactionOnly: true,
            modalName: 'Create Transaction',
            transactions: this.symbolTransactions,
            transaction: {},
            showAddTransactionDialog: false,
            showDeleteTransactionDialog: false,
            selectedTransactions: null,
            modalTypeTxt: '',
            editTransaction: {},
        };
    },
    watch: {
        symbolTransactions() {
            this.transactions = this.symbolTransactions;
        },
    },
    created() {},
    mounted() {},
    methods: {
        mapAction(value) {
            return value === 1 ? 'SELL' : 'BUY';
        },
        openTransactionModal(modalTxt, rowTransaction = {}) {
            this.editTransaction = rowTransaction;
            this.transaction = {};
            this.showAddTransactionDialog = true;
            this.modalTypeTxt = modalTxt;
        },
        onHideAddTransactionDialog() {
            this.showAddTransactionDialog = false;
        },
        confirmDeleteTransaction(transaction) {
            this.transaction = transaction;
            this.showDeleteTransactionDialog = true;
        },
        deleteTransaction() {
            this.showDeleteTransactionDialog = false;

            this.$emit('onDeleteTransaction', this.transaction.id, this.selectedStock.id);
            this.transaction = {};
        },
        onSaveStockAndTransaction(transaction) {
            this.showAddTransactionDialog = false;

            this.$emit('onSaveTransaction', transaction);
            this.transaction = {};
        },
        onEditStockAndTransaction(transaction) {
            this.showAddTransactionDialog = false;
            this.$emit('onEditTransaction', transaction);
            this.transaction = {};
        },
        adjustActionColor(value) {
            return value === 'BUY'
                ? 'font-weight: bold;color:blue'
                : 'font-weight: bold;color:green';
        },
    },
};
</script>
