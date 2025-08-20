<script>
import {Stores_Posts} from "@/stores/posts/posts.js";
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "Posts_Create",
  mounted() {
    this.Get_Category();
  },
  components: {Editor},
  data() {
    return {
      items : {
        title : null,
        post_category_id : null,
        slug : null,
        description : null,
        image : null,
        files:[
          {
            id:1,
            title:null,
            file:null,
          }
        ],
      },
      add_files : 1,
      loading: false,
      categories:[],
      errors: [],
    }
  },
  methods: {
    Create_Item() {
      this.loading = true;
      Stores_Posts().Create(this.items).then(response => {
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
          this.categories.push({label: item.name, value: item.id,parent : item.parent});
        })
      })
    },
    More_Files(){
      this.add_files++;
      this.items.files.push({id:this.add_files,title: null,file: null});
    },
    Remove_Files(id){
      this.items.files = this.items.files.filter(item => {
        return item.id !== id;
      })
    }

  }
}
</script>

<template>
  <div class="row">
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
                <strong v-if="scope.opt.parent" class="text-red-8 q-mr-sm">
                  ( {{scope.opt.parent.name}} )
                </strong>
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
    <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'slug')" outlined v-model="items.slug"  type="text" label="پیوند یکتا ( به صورت انگلیسی )">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'slug')" />
        </template>
      </q-input>

    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
      <q-file outlined bottom-slots v-model="items.image" label="انتخاب تصویر " counter>
        <template v-slot:prepend>
          <q-icon name="fa-duotone fa-light fa-upload" @click.stop.prevent />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click.stop.prevent="items.image = null" class="cursor-pointer" />
        </template>
      </q-file>
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
    <div class="col-12 q-mt-md q-mb-md">
      <strong class="text-primary font-15">افزودن فایل / ویدئو</strong>
    </div>
    <template v-for="file in items.files">
        <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
          <q-input outlined type="text" label="عنوان فایل/ویدئو " v-model="file.title">
            <template v-slot:prepend>
              <q-btn  @click="Remove_Files(file.id)" color="red-6" icon="fa-duotone fa-trash" flat round size="sm"></q-btn>
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
          <q-file outlined bottom-slots v-model="file.file" label="انتخاب فایل / ویدئو " counter>
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-light fa-upload" @click.stop.prevent />
            </template>
            <template v-slot:append>
              <q-icon name="close" @click.stop.prevent="file.file = null" class="cursor-pointer" />
            </template>
          </q-file>
        </div>
    </template>
    <div class="col-12">
      <q-btn @click="More_Files" glossy color="primary" icon="fa-duotone fa-plus-circle" rounded label="فایل بیشتر"></q-btn>
    </div>
    <div class="col-12 q-mt-sm q-pa-xs text-right">
      <q-btn color="grey-8" glossy icon="fa-duotone fa-light fa-times" label="بستن" class="q-mr-sm" v-close-popup></q-btn>
      <q-btn @click="Create_Item" :loading="loading" color="indigo-7" glossy icon="fa-duotone fa-light fa-plus-circle" label="افزودن آیتم جدید"></q-btn>

    </div>
  </div>

</template>

<style scoped>

</style>