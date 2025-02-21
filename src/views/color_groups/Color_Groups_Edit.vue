<script>
import {Stores_Color_Group} from "@/stores/colors/color_groups.js";

export default {
  name: "Colors_Edit",
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
        description : null,
      },
      loading: true,
      edit_loading: false,
      errors: [],
    }
  },
  methods: {
    Get_Item(){
      Stores_Color_Group().Show(this.items.id).then(res=>{
        this.items = res.data.result;
        this.loading = false;
      }).catch(error=>{
        this.Methods_Notify_Error_Server();
      })
    },
    Edit_Item() {
      this.edit_loading = true;
      Stores_Color_Group().Edit(this.items).then(response => {
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
      <q-input  :error="this.Methods_Validation_Check(errors,'name')" outlined v-model="items.name"  type="text" label="عنوان گروه">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'name')" />
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
      <q-btn @click="Edit_Item" :loading="edit_loading" color="indigo-7" glossy icon="fas fa-plus-circle" label="ویرایش آیتم"></q-btn>

    </div>
  </div>

</template>

<style scoped>

</style>