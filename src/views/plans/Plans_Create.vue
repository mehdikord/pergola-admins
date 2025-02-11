<script>
import {Stores_Plans} from "@/stores/plans/plans.js";

export default {
  name: "Plans_Create",
  data() {
    return {
      items : {
        name : null,
        access : 1,
        price : null,
        sale : null,
        description : null,
      },
      loading: false,
      errors: [],
    }
  },
  methods: {
    Create_Item() {
      this.loading = true;
      Stores_Plans().Create(this.items).then(response => {
        this.$emit('Done', response.data.result);
        this.loading = false;
      }).catch(error => {
        if (error.response.status === 422) {
          this.Methods_Validation_Notify();
          this.errors = error.response.data;
        }
        this.loading=false;
      });




    }
  }
}
</script>

<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'name')" outlined v-model="items.name"  type="text" label="عنوان اشتراک">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'name')" />
        </template>
      </q-input>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'access')" outlined v-model="items.access"  type="number" label="مدت اشتراک (ماه)">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'access')" />
        </template>
      </q-input>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'price')" outlined v-model="items.price"  type="number" label="قیمت (تومان)">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'price')" />
        </template>
      </q-input>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'sale')" outlined v-model="items.sale"  type="number" label="قیمت با تخفیف">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'sale')" />
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
      <q-btn color="grey-8" glossy icon="fas fa-times" label="بستن" class="q-mr-sm" v-close-popup></q-btn>
      <q-btn @click="Create_Item" :loading="loading" color="indigo-7" glossy icon="fas fa-plus-circle" label="افزودن آیتم جدید"></q-btn>
    </div>
  </div>

</template>

<style scoped>

</style>