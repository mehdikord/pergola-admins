<script>
import {Stores_Options} from "@/stores/options/options.js";

export default {
  name: "Options_Create",
  mounted() {
    this.Add_Attributes();
  },
  data() {
    return {
      items : {
        name : null,
        unit : null,
        guid : null,
        description : null,
        items : [],

      },
      item_counter:1,
      loading: false,
      errors: [],
    }
  },
  methods: {
    Create_Item() {
      if (!this.items.items.length) {
        return this.Methods_Notify_Message_Error("هیچ گزینه ای برای این ویژگی ثبت نشده است")
      }
      this.loading = true;
      Stores_Options().Create(this.items).then(response => {
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
      <q-input  :error="this.Methods_Validation_Check(errors,'name')" outlined v-model="items.name"  type="text" label="عنوان ویژگی">
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
      <div>
        <strong class="text-red">افزودن گزینه های انتخابی</strong>
        <div class="q-mt-md">
          <q-btn rounded @click="Add_Attributes" glossy color="blue-8" icon="fa-duotone fa-light fa-plus" label="افزودن گزینه"></q-btn>
        </div>
      </div>
      <div class="q-mt-md q-mb-md row">
        <div v-for="(option,index) in items.items" class="col-md-3 q-px-sm q-mb-sm">
          <q-input outlined v-model="option.value"  type="text" :label="'گزینه ' + option.id">
            <template v-slot:append>
              <q-btn round dense glossy size="sm" color="red-6" icon="fa-duotone fa-light fa-times" @click="Remove_Attributes(option.id)"/>
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'guid')" outlined v-model="items.guid"  type="text" label="راهنما">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'guid')" />
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