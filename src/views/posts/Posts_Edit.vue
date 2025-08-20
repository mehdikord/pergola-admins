<script>
import {Stores_Posts} from "@/stores/posts/posts.js";
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "Posts_Edit",
  components: {Editor},
  props:['item'],
  mounted() {
    if (this.item) {
      this.items.id = this.item.id;
      this.Get_Category();
      this.Get_Item();
    }
  },
  data() {
    return {
      items : {
        id:null,
        title : null,
        post_category_id : null,
        slug : null,
        description : null,
      },
      loading: true,
      edit_loading: false,
      errors: [],
      categories:[],

    }
  },
  methods: {
    Get_Item(){
      Stores_Posts().Show(this.items.id).then(res=>{
        this.items = res.data.result;
        this.loading = false;
      }).catch(error=>{
        this.Methods_Notify_Error_Server();
      })
    },
    Edit_Item() {
      this.edit_loading = true;
      Stores_Posts().Edit(this.items).then(response => {
        this.$emit('Done', response.data.result);
        this.edit_loading = false;
      }).catch(error => {
        if (error.response.status === 422) {
          this.Methods_Validation_Notify();
          this.errors = error.response.data;
        }
        this.edit_loading=false;
      });

    },
    Filter_Category_Select (val, update, abort) {
      update(() => {
        if (val){
          this.categories =  this.categories.filter(item => {
            return item.label !== null && item.label.match(val)
          })
        }else {
          this.Get_Category();
        }
      })
    },
    Get_Category() {
      Stores_Posts().Category_All().then(res => {
        this.categories = [];
        res.data.result.forEach(item => {
          this.categories.push({label: item.name, value: item.id});
        })
      })

    }

  }
}
</script>

<template>
  <global_loading_shape v-if="loading"></global_loading_shape>
  <div v-else class="row">
    <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'title')" outlined v-model="items.title"  type="text" label="عنوان نوشته">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'title')" />
        </template>
      </q-input>

    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
      <q-select
          label="انتخاب دسته بندی "
          outlined
          :options="categories"
          emit-value
          map-options
          use-input
          @filter="Filter_Category_Select"
          v-model="items.post_category_id"
          position="top"
          clearable
          :error="this.Methods_Validation_Check(errors,'post_category_id')"
          clear-icon="fa-duotone fa-light fa-times-circle text-red-8 font-22"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>
                  <span>
                    {{ scope.opt.label }}
                  </span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'post_category_id')" />
        </template>
      </q-select>
    </div>

    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'slug')" outlined v-model="items.slug"  type="text" label="پیوند یکتا ( به صورت انگلیسی )">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'slug')" />
        </template>
      </q-input>

    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <Editor
          v-model="items.description"
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
      <q-btn @click="Edit_Item" :loading="edit_loading" color="indigo-7" glossy icon="fa-duotone fa-light fa-plus-circle" label="ویرایش آیتم"></q-btn>

    </div>
  </div>

</template>

<style scoped>

</style>