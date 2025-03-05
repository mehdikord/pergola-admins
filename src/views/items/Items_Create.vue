<script>
import {Stores_Items} from "@/stores/items/items.js";

export default {
  name: "Items_Create",
  mounted() {
    this.Add_Attributes();
  },
  data() {
    return {
      items : {
        name : null,
        unit : null,
        description : null,

      },
      item_counter:1,
      loading: false,
      errors: [],
    }
  },
  methods: {
    Create_Item() {

      this.loading = true;
      Stores_Items().Create(this.items).then(response => {
        this.$emit('Done', response.data.result);
        this.loading = false;
      }).catch(error => {
        if (error.response.status === 422) {
          this.Methods_Validation_Notify();
          this.errors = error.response.data;
        }
        this.loading=false;
      });




    },
    Add_Attributes() {
      this.items.items.push({id : this.item_counter,value:null})
      this.item_counter++;
    },
    Remove_Attributes(id){
      this.items.items = this.items.items.filter(item => item.id !== id)
    },
  }
}
</script>

<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'name')" outlined v-model="items.name"  type="text" label="عنوان آیتم">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'name')" />
        </template>
      </q-input>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'unit')" outlined v-model="items.unit"  type="text" label="یکا اندازه گیری" placeholder="مثال : درصد / تعداد / گرم">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'unit')" />
        </template>
      </q-input>
    </div>

    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'description')" outlined v-model="items.description"  type="textarea" rows="4" label="توضیحات">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'description')" />
        </template>
      </q-input>
    </div>

    <div class="col-12 q-mt-sm q-pa-xs text-right">
      <q-btn color="grey-8" glossy icon="fa-duotone fa-light fa-times" label="بستن" class="q-mr-sm" v-close-popup></q-btn>
      <q-btn @click="Create_Item" :loading="loading" color="indigo-7" glossy icon="fa-duotone fa-light fa-plus-circle" label="افزودن آیتم جدید"></q-btn>

    </div>
  </div>

</template>

<style scoped>

</style>