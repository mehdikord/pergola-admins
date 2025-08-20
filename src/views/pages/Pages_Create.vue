<script>
import {Stores_Pages} from "@/stores/pages/pages.js";
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "Pages_Create",
  components: {Editor},
  data() {
    return {
      items : {
        title : null,
        slug : null,
        content : null,
      },
      loading: false,
      groups:[],
      errors: [],
    }
  },
  methods: {
    Create_Item() {
      this.loading = true;
      Stores_Pages().Create(this.items).then(response => {
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
    <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'title')" outlined v-model="items.title"  type="text" label="عنوان صفحه">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'title')" />
        </template>
      </q-input>

    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'slug')" outlined v-model="items.slug"  type="text" label="پیوند یکتا ( به صورت انگلیسی )">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'slug')" />
        </template>
      </q-input>

    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <Editor
          v-model="items.content"
          api-key="2pilphf7q2r756w6jluid3y79bp8dbor5qib8cz35ghpndya"
          :init="{
                        language: 'fa',
                        directionality: 'rtl',
                        plugins: 'lists link image table code help wordcount',
                        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image ',
                        content_style: 'body { font-family: Vazirmatn, sans-serif; font-size: 14px; direction: rtl; text-align: right; }',
                        images_upload_url: 'https://core.pergola.ir/admins/questions/uploader',
                        automatic_uploads: true
                      }"
      />
    </div>
    <div class="col-12 q-mt-sm q-pa-xs text-right">
      <q-btn color="grey-8" glossy icon="fa-duotone fa-light fa-times" label="بستن" class="q-mr-sm" v-close-popup></q-btn>
      <q-btn @click="Create_Item" :loading="loading" color="indigo-7" glossy icon="fa-duotone fa-light fa-plus-circle" label="افزودن آیتم جدید"></q-btn>

    </div>
  </div>

</template>

<style scoped>

</style>