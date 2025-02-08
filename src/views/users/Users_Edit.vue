<script>
import {Stores_Users} from "@/stores/users/users.js";

export default {
  name: "Users_Edit",
  props:['item'],
  mounted() {
    if (this.item) {
      this.items.id = this.item.id;
      this.Get_Item();
    }
  },
  data() {
    return {
      items : {
        id:null,
        name : null,
        phone : null,
        age : 18,
      },
      loading: true,
      edit_loading: false,
      errors: [],
    }
  },
  methods: {
    Get_Item(){
      Stores_Users().Show(this.items.id).then(res=>{
        this.items = res.data.result;
        this.loading = false;
      }).catch(error=>{
        this.Methods_Notify_Error_Server();
      })
    },
    Edit_Item() {
      this.edit_loading = true;
      Stores_Users().Edit(this.items).then(response => {
        this.$emit('Done', response.data.result);
        this.edit_loading = false;
      }).catch(error => {
        if (error.response.status === 422) {
          this.Methods_Validation_Notify();
          this.errors = error.response.data;
        }
        this.edit_loading=false;
      });

    }
  }
}
</script>

<template>
  <global_loading_shape v-if="loading"></global_loading_shape>
  <div v-else class="row">

    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'name')" outlined v-model="items.name"  type="text" label="نام کابر">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'name')" />
        </template>
      </q-input>

    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'phone')" outlined v-model="items.phone"  type="number" label="شماره موبایل">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'phone')" />
        </template>
      </q-input>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'age')" outlined v-model="items.age"  type="number" label="سن">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'age')" />
        </template>
      </q-input>
    </div>
    <div class="col-12 q-mt-sm q-pa-xs text-right">
      <q-btn color="grey-8" glossy icon="fas fa-times" label="بستن" class="q-mr-sm" v-close-popup></q-btn>
      <q-btn @click="Edit_Item" :loading="edit_loading" color="indigo-7" glossy icon="fas fa-plus-circle" label="ویرایش آیتم"></q-btn>

    </div>
  </div>

</template>

<style scoped>

</style>