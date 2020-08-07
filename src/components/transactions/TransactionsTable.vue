<template>
    <div>
        <Toolbar class="p-mb-4">
            <template slot="left">
                <Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
            </template>
        </Toolbar>

        <DataTable :value="transactions" :selection.sync="selectedTransactions" :loading="transactionLoading">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column  field="last_updated_date" header="Date" />
            <Column  field="action" header="Action" />
            <Column  field="price" header="Price" />
            <Column  field="shares" header="Shares" />
            <Column  field="fees" header="Fee" />
            <Column  field="gross_amount" header="Gross Amount" />
            <Column  field="net_amount" header="Net Amount" />
            <Column  field="net_price" header="Price" />
            <Column>
                <template #body="slotProps">
                    <!-- <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editProduct(slotProps.data)" /> -->
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteTransaction(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog :visible.sync="showAddTransactionDialog"  header="Transaction Details" :modal="true" class="p-fluid">

            <div class="p-formgrid p-grid">
                <div class="p-field p-col">
                    <Dropdown v-model="transaction.action" :options="actionOptions" placeholder="Select an action" />
                </div>
                <div class="p-field p-col">
                    <label for="price">Price</label>
                    <InputNumber id="price" v-model="transaction.price" mode="currency" currency="USD" locale="en-US" />
                </div>
                <div class="p-field p-col">
                    <label for="shares">Shares</label>
                    <InputNumber id="shares" v-model="transaction.shares" mode="currency" currency="USD" locale="en-US" />
                </div>
                <div class="p-field p-col">
                    <label for="fees">Fees</label>
                    <InputNumber id="fees" v-model="transaction.fees" mode="currency" currency="USD" locale="en-US" />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveTransaction" />
            </template>
        </Dialog>

        <Dialog :visible.sync="showDeleteTransactionDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
                <span v-if="transaction">Are you sure you want to delete?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="showDeleteTransactionDialog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteTransaction" />
            </template>
        </Dialog>
    </div>
    
</template>

<script>

export default {
    name: 'TransactionsTable',
    props: {
        symbolTransactions: Array,
        transactionLoading: Boolean
    },
    data() {
        return {
            transactions: this.symbolTransactions,
            transaction: {},
            showAddTransactionDialog: false,
            showDeleteTransactionDialog: false,
            selectedTransactions: null,
            actionOptions: ['buy', 'sell']
        };
    },
    created() {},
    mounted() {},
    methods: {
        openNew() {
            this.transaction = {};
            this.showAddTransactionDialog = true;
        },
        hideDialog() {
            this.showAddTransactionDialog = false;
        },
        confirmDeleteTransaction(transaction) {
            this.transaction = transaction;
            this.showDeleteTransactionDialog = true;
        },
        deleteTransaction() {
            this.showDeleteTransactionDialog = false;

            this.$emit('onDeleteTransaction', this.transaction.id);
            this.transaction = {};
        },
        saveTransaction() {
            this.showAddTransactionDialog = false;
    
            this.$emit('onSaveTransaction', this.transaction);
            this.transaction = {};
        }
    },
    watch: {
        symbolTransactions() {
            this.transactions = this.symbolTransactions;
        }
    }
}
</script>