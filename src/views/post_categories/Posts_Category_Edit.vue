<script>
import {Stores_Posts} from "@/stores/posts/posts.js";
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "Posts_Category_Edit",
  components: {Editor},
  props:['item'],
  mounted() {
    if (this.item) {
      this.items.id = this.item.id;
      this.Get_Item();
    }
    this.Get_Categories();

  },
  data() {
    return {
      items : {
        parent_id:null,
        id:null,
        name : null,
        color : null,
        description : null,
      },
      loading: true,
      edit_loading: false,
      errors: [],
      groups:[],
      categories:[],


    }
  },
  methods: {
    Get_Item(){
      Stores_Posts().Category_Show(this.items.id).then(res=>{
        this.items = res.data.result;
        this.loading = false;
      }).catch(error=>{
        this.Methods_Notify_Error_Server();
      })
    },
    Get_Categories(){
      Stores_Posts().Category_All().then(res => {
        this.categories=[];
        res.data.result.forEach(item => {
          this.categories.push({label : item.name , value:item.id});
        })
      }).catch(error => {

      })
    },
    Edit_Item() {
      this.edit_loading = true;
      Stores_Posts().Category_Edit(this.items).then(response => {
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
  }
}
</script>

<template>
  <global_loading_shape v-if="loading"></global_loading_shape>
  <div v-else class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'name')" outlined v-model="items.name"  type="text" label="عنوان دسته بندی">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'name')" />
        </template>
      </q-input>

    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-select
          label="انتخاب سرگروه "
          outlined
          :options="categories"
          emit-value
          map-options
          use-input
          v-model="items.parent_id"
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
      <q-input :error="this.Methods_Validation_Check(errors,'color')" outlined v-model="items.color" label="انتخاب رنگ"
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
      <q-btn @click="Edit_Item" :loading="edit_loading" color="indigo-7" glossy icon="fa-duotone fa-light fa-plus-circle" label="ویرایش آیتم"></q-btn>

    </div>
  </div>

</template>

<style scoped>

</style>