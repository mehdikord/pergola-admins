<script>
import {Stores_Posts} from "@/stores/posts/posts.js";
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "Posts_Category_Create",
  components: {Editor},
  data() {
    return {
      items : {
        name : null,
        color : null,
        description : null,
      },
      loading: false,
      groups:[],
      errors: [],
    }
  },
  methods: {
    Create_Item() {
      this.loading = true;
      Stores_Posts().Category_Create(this.items).then(response => {
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

  }
}
</script>

<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'name')" outlined v-model="items.name"  type="text" label="عنوان دسته بندی">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'name')" />
        </template>
      </q-input>

    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input
          :error="this.Methods_Validation_Check(errors,'color')" outlined v-model="items.color" label="انتخاب رنگ"
      >
        <template v-slot:append>
          <q-icon name="fa-duotone fa-light fa-eye-dropper" class="cursor-pointer" color="teal-8">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-color v-model="items.color" />
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'color')" />
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