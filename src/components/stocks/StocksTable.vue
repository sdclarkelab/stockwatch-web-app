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

        <DataTable :value="stocks" :selection.sync="selectedStocks">
            <Column selection-mode="multiple" header-style="width: 3rem" />
            <Column field="symbol" header="Symbol" />
            <Column field="status" header="status" />
            <Column>
                <template #body="slotProps">
                    <!-- <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editProduct(slotProps.data)" /> -->
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded p-button-warning"
                        @click="confirmDeleteStock(slotProps.data)"
                    />
                </template>
            </Column>
        </DataTable>

        <Dialog
            :visible.sync="showAddStockDialog"
            header="Stock Details"
            :modal="true"
            class="p-fluid"
        >
            <div class="p-formgrid p-grid">
                <div class="p-field p-col">
                    <b-form-select
                        v-model="stock.symbol"
                        :options="symbolOptions"
                        value-field="symbol"
                        text-field="instrument_name"
                    />
                </div>
                <!-- <div class="p-field p-col">
										<Dropdown v-model="stock.status" :options="statusOptions" placeholder="Select a Status" />
								</div> -->
            </div>
            <template #footer>
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="hideDialog"
                />
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveStock" />
            </template>
        </Dialog>

        <Dialog :visible.sync="showDeleteStockDialog" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
                <span v-if="stock">Are you sure you want to delete?</span>
            </div>
            <template #footer>
                <Button
                    label="No"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="showDeleteStockDialog = false"
                />
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteStock" />
            </template>
        </Dialog>
    </div>
</template>

<script>
export default {
    name: 'StocksTable',
    props: {
        stocks: Array,
        symbolOptions: Array,
    },
    data() {
        return {
            stock: {},
            showAddStockDialog: false,
            showDeleteStockDialog: false,
            selectedStocks: null,
            statusOptions: ['Active'],
            selected: '',
        };
    },
    methods: {
        openNew() {
            this.stock = {};
            this.showAddStockDialog = true;
        },
        hideDialog() {
            this.showAddStockDialog = false;
        },
        confirmDeleteStock(stock) {
            this.stock = stock;
            this.showDeleteStockDialog = true;
        },
        deleteStock() {
            this.showDeleteStockDialog = false;

            this.$emit('onDeleteStock', this.stock.symbol);
            this.stock = {};
        },
        saveStock() {
            this.showAddStockDialog = false;
            this.$emit('onSaveStock', this.stock);
            this.stock = {};
        },
    },
};
</script>
