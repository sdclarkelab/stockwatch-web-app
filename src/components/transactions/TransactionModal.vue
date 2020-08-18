<template>
    <div>
        <Dialog :visible.sync="showAddTransactionDialog"  header="Transaction Details" :modal="true" class="p-fluid">
            <div class="p-formgrid p-grid">
                <div class="p-field p-col">
                    <b-form-select v-model="transaction.action" :options="actionOptions"></b-form-select>
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
        </Dialog>
    </div>
</template>

<script>
export default {
   name: 'TransactionsModal',
   props: {
       showModal: Boolean
   },
   data() {
       return {
           transaction: {},
           actionOptions: ['buy', 'sell'],
       }
   }
}
</script>
