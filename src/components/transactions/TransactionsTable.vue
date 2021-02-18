<template>
    <div>
        <Toolbar class="p-mb-4">
            <template slot="left">
                <Button
                    label="New"
                    icon="pi pi-plus"
                    class="p-button-success p-mr-2"
                    @click="openNew"
                />
            </template>
        </Toolbar>

        <DataTable
            :value="transactions"
            :selection.sync="selectedTransactions"
            :loading="transactionLoading"
        >
            <Column selection-mode="multiple" header-style="width: 3rem" />
            <Column field="last_updated_date" header="Date" />
            <Column field="action" header="Action" />
            <Column field="price" header="Price" />
            <Column field="shares" header="Shares" />
            <Column field="fees" header="Fee" />
            <Column field="gross_amount" header="Gross Amount" />
            <Column field="net_amount" header="Net Amount" />
            <Column field="net_price" header="Price" />
            <Column>
                <template #body="slotProps">
                    <Button
                        icon="pi pi-pencil"
                        class="p-button-rounded p-button-success p-mr-2"
                        @click="editProduct(slotProps.data)"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded p-button-warning"
                        @click="confirmDeleteTransaction(slotProps.data)"
                    />
                </template>
            </Column>
        </DataTable>

        <create-stock-transaction-modal
            v-if="showAddTransactionDialog"
            :modal-name="modalName"
            :showModal="showAddTransactionDialog"
            :isCreateTransactionOnly="isCreateTransactionOnly"
            :action-options="actionOptions"
            :selected-trans-stock="selectedStock"
            @onHideAddTransactionDialog="onHideAddTransactionDialog"
            @onSaveStockAndTransaction="onSaveStockAndTransaction"
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
import CreateStockTransactionModal from '../common/modal/CreateStockTransactionModal';

export default {
    name: 'TransactionsTable',
    components: {
        CreateStockTransactionModal,
    },
    props: {
        symbolTransactions: Array,
        transactionLoading: Boolean,
        actionOptions: Array,
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
            isEditTransaction: false,
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
        openNew() {
            this.transaction = {};
            this.showAddTransactionDialog = true;
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
    },
};
</script>
