<script>

import {Stores_Posts} from "@/stores/posts/posts.js";
import Posts_Create from "@/views/posts/Posts_Create.vue";
import Posts_Edit from "@/views/posts/Posts_Edit.vue";

export default {
  name: "Posts",
  components: {
    'posts_create' : Posts_Create,
    'posts_edit' : Posts_Edit
  },
  mounted() {
    this.Items_Get();
  },
  data(){
    return {
      items:[],
      query_params:{
        sort_by : 'id',
        sort_type : 'desc',
        per_page : 15,
        page : 1,
        search :{}
      },
      items_loading:true,
      delete_loading:false,
      activation_loading:false,
      dialog_create:false,
      dialog_edit:[],
      dialog_image:[],
      dialog_files:[],
      items_selected:[],
      selected: [],
      pagination: {
        sortBy : 'id',
        descending:true,
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 15
      },
      columns : [
        {
          name: 'id',
          required: true,
          label: 'ID',
          align: 'left',
          sortable: true,
          field: row => '# ' + row.id,
        },
        {
          name: 'title',
          value: 'title',
          label: 'عنوان',
          align: 'left',
          sortable: true,
          field: row => row.title,
        },
        {
          name: 'category',
          value: 'category',
          label: 'دسته بندی',
          align: 'left',
          sortable: true,
          field: row => row.category,
        },
        {
          name: 'slug',
          value: 'slug',
          label: 'پیوند یکتا',
          align: 'left',
          sortable: false,
          field: row => row.slug,
        },
        {
          name: 'views',
          value: 'views',
          label: 'تعداد بازدید',
          align: 'left',
          sortable: false,
          field: row => row.views,
        },
        {
          name: 'files',
          value: 'files',
          label: 'تعداد فایل',
          align: 'left',
          sortable: false,
          field: row => row,
        },
        {
          name: 'is_active',
          value: 'is_active',
          label: 'وضعیت',
          align: 'left',
          sortable: true,
          field: row => row.is_active,
        },
        {
          name: 'tools',
          value: 'tools',
          label: 'عملیات',
          align: 'left',
        }
      ],
      visible_columns:[],
      edit_image:null,
      edit_image_loading:null,
      add_file:{
        file:null,
        title:null,
      },
      add_file_loading : false,
      search_title:null
    }
  },
  methods :{
    Items_Get(per_page,page){
      if (per_page){
        this.query_params.per_page = per_page;
      }
      if (page){
        this.query_params.page = page;
      }

      Stores_Posts().Index(this.query_params).then(res=>{
        this.items = res.data.result.data;
        this.pagination.page = res.data.result.current_page;
        this.pagination.rowsPerPage = res.data.result.per_page;
        this.pagination.rowsNumber = res.data.result.total;
        this.items_loading=false;
      }).catch(error => {
        this.Methods_Notify_Error_Server();
        this.items_loading=false;
      })
    },
    Item_Create(item){
      this.items.unshift(item);
      this.dialog_create = false;
      this.Methods_Notify_Create()
    },
    Item_Edit(item){
      this.items = this.items.map(get_item => {
        if (get_item.id === item.id) {
          return item;
        }
        return get_item;
      });
      this.dialog_edit[item.id] = false;
      this.Methods_Notify_Update()
    },
    Item_Edit_Image(item){
      if (!this.edit_image){
        return this.Methods_Notify_Message_Error("برای ویرایش فایل تصویر را انتخاب کنید")
      }
      this.edit_image_loading=true;
      let data = {
        id: item.id,
        image : this.edit_image
      }
      Stores_Posts().Edit_image(data).then(res=>{
        this.items = this.items.map(get_item => {
          if (get_item.id === item.id) {
            return res.data.result;
          }
          return get_item;
        });
        this.dialog_image[item.id] = false;
        this.Methods_Notify_Update()
        this.edit_image_loading=false;
      }).catch(error => {
        this.Methods_Notify_Error_Server();
        this.edit_image_loading=false;
      })

    },
    Item_Delete_Image(item){
      let data = {
        id: item.id,
      }
      Stores_Posts().Edit_image(data).then(res=>{
        this.items = this.items.map(get_item => {
          if (get_item.id === item.id) {
            return res.data.result;
          }
          return get_item;
        });
        this.dialog_image[item.id] = false;
        this.Methods_Notify_Update()
      }).catch(error => {
        this.Methods_Notify_Error_Server();
      })

    },

    Item_Delete(id){
      this.delete_loading=true;
      Stores_Posts().Delete(id).then(res => {
        this.items = this.items.filter(item => {
          return item.id !== id;
        })
        this.Methods_Notify_Delete();
        this.delete_loading=false;
      }).catch(error => {
        if (error.response.status === 409) {
          this.Methods_Notify_Generator( error.response.data.error,'red-8','fa-duotone fa-light fa-times')
        }else {
          this.Methods_Notify_Error_Server();
        }
        this.delete_loading=false;
      })

    },
    Item_Activation(id){
      this.activation_loading=true;
      Stores_Posts().Activation(id).then(res => {
        this.items = this.items.filter(item => {
          if (item.id === id){
            item.is_active = !item.is_active;
          }
          return item;
        })
        this.activation_loading=false;
      }).catch(error =>{
        if (error.response.status === 409) {
          this.Methods_Notify_Generator( error.response.data.error,'red-8','fa-duotone fa-light fa-times')
        }
        this.activation_loading=false;
      })

    },
    updateSelected(newSelection) {
      this.selected = newSelection;
      this.items_selected = newSelection.map(item => item.id);
    },
    Items_OnRequest(props){
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      let sort_type;
      this.pagination.sortBy = sortBy
      if (page === this.pagination.page && rowsPerPage === this.pagination.rowsPerPage){
        this.pagination.descending = !this.pagination.descending
      }
      if (this.pagination.descending){
        sort_type = "desc"
      }else {
        sort_type = "asc"
      }
      this.query_params.sort_by = sortBy;
      this.query_params.sort_type = sort_type;
      this.Items_Get(rowsPerPage,page);
    },
    Remove_File(post_id,id){
      Stores_Posts().Remove_File({id : id}).then(res => {
        this.items.map(item => {
          if (item.id === post_id){
            if (item.files.length){
              item.files = item.files.filter(file => { return file.id !== id });
            }
          }
          return item;
        })
        this.Methods_Notify_Delete();
      }).catch( error => {
        this.Methods_Notify_Error_Server();

      });
    },
    Add_File(id){
      this.add_file_loading = true;
      let parms = {
        id:id,
        file : this.add_file.file,
        title : this.add_file.title
      }
      Stores_Posts().Add_File(parms).then(res => {
        this.items.map(item => {
          if (item.id === id){
           return res.data.result;
          }
          return item;
        })
        this.add_file_loading=false
        this.Methods_Notify_Create();

      }).catch(error => {
        this.Methods_Notify_Error_Server();
        this.add_file_loading=false
      })
    },
    Search(){
      if (this.search_title){
        this.query_params.search.title = this.search_title

        this.Items_Get()
      }
    }

  }


}
</script>

<template>
  <q-card flat>
    <q-card-section>
      <global_actions_header_buttons @Create="dialog_create=true" :create="true"></global_actions_header_buttons>

      <q-dialog
          v-model="dialog_create"
          position="top"
          full-width
      >
        <q-card >

          <q-card-section>
            <strong class="text-indigo-8 font-15">افزودن آیتم جدید</strong>
            <q-btn size="sm" icon="fa-duotone fa-light fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
          </q-card-section>
          <q-card-section>
            <posts_create @Done="(item => { Item_Create(item) })"></posts_create>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div class="row">
        <div class="col-md-4">
          <q-input outlined rounded v-model="search_title" label="جستجو با عنوان" dense @keyup.enter="Search" />
        </div>
      </div>
      <q-separator class="q-mt-xl"/>
    </q-card-section>
    <q-card-section>
      <q-table
          flat
          bordered
          :loading="items_loading"
          :rows="items"
          title="لیست آیتم ها"
          title-class="text-teal-8 font-18 font-weight-500"
          table-header-class="text-red-8"
          :columns="columns"
          separator="cell"
          selection="multiple"
          row-key="id"
          :selected="selected"
          @update:selected="updateSelected"
          v-model:pagination="pagination"
          @request="Items_OnRequest"
      >
        <template v-slot:body-cell-title="props">
          <q-td :props="props">
            <div class="row">
              <q-img v-if="props.row.image" :src="props.row.image" width="60px" class="rounded-borders" />
              <div class="q-ml-sm q-mt-sm"><strong>{{ props.row.title }}</strong></div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-category="props">
          <q-td :props="props">
            <strong v-if="props.row.category" class="text-teal-7">{{ props.row.category.name }}</strong>
          </q-td>
        </template>
        <template v-slot:body-cell-slug="props">
          <q-td :props="props">
            <template v-if="props.row.slug">
              <strong class="text-indigo-8 font-14">{{props.row.slug}}</strong>
            </template>
          </q-td>
        </template>

        <template v-slot:body-cell-views="props">
          <q-td :props="props">
            <q-chip color="dark" size="md" :label="props.row.views" text-color="white"></q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-files="props">
          <q-td :props="props">

            <q-chip color="deep-orange" size="md" :label="props.row.files.length" text-color="white"></q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-is_active="props">
          <q-td :props="props">
            <global_actions_activation_item @Set_Ok="Item_Activation(props.row.id)" :status="props.row.is_active"></global_actions_activation_item>
          </q-td>
        </template>
        <template v-slot:body-cell-tools="props">
          <q-td :props="props">
            <div class="text-center">
              <q-btn @click="dialog_edit[props.row.id] = true" glossy title="ویرایش آیتم" class="q-ma-xs" color="blue-8" icon="fa-duotone fa-regular fa-edit" size="9px" round  />
              <q-btn @click="dialog_image[props.row.id] = true" glossy title="ویرایش تصویر" class="q-ma-xs" color="purple-6" icon="fa-duotone fa-regular fa-image" size="9px" round  />
              <q-btn @click="dialog_files[props.row.id] = true" glossy title="مدیریت فایل ها" class="q-ma-xs" color="teal-8" icon="fa-duotone fa-regular fa-folder" size="9px" round  />
              <global_actions_delete_item @Set_Ok="Item_Delete(props.row.id)" :loading="delete_loading"></global_actions_delete_item>
            </div>

            <q-dialog
                v-model="dialog_edit[props.row.id]"
                position="top"
                full-width
            >
              <q-card >

                <q-card-section>
                  <strong class="text-blue-8 font-15">ویرایش اطلاعات : <strong class="text-red-8">{{props.row.title}}</strong></strong>
                  <q-btn size="sm" icon="fa-duotone fa-light fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
                </q-card-section>
                <q-card-section>
                  <posts_edit :item="props.row" @Done="(item => { Item_Edit(item) })"></posts_edit>
                </q-card-section>
              </q-card>
            </q-dialog>
            <q-dialog
                v-model="dialog_image[props.row.id]"
                position="top"
            >
              <q-card style="width: 860px; max-width: 85vw;">
                <q-card-section>
                  <strong class="text-purple-8 font-15">ویرایش تصویر : <strong class="text-red-8">{{props.row.title}}</strong></strong>
                  <q-btn size="sm" icon="fa-duotone fa-light fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
                </q-card-section>
                <q-card-section>

                  <q-file outlined bottom-slots v-model="edit_image" label="انتخاب تصویر رنگ" counter>
                    <template v-slot:prepend>
                      <q-icon name="fa-duotone fa-light fa-upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon name="close" @click.stop.prevent="edit_image = null" class="cursor-pointer" />
                    </template>
                  </q-file>
                  <div class="q-mt-lg text-right">
                    <q-btn @click="Item_Delete_Image(props.row)" color="red-6" glossy icon="fa-duotone fa-light fa-trash" label="حذف تصویر فعلی" class="q-mr-sm"></q-btn>
                    <q-btn @click="Item_Edit_Image(props.row)" :loading="edit_image_loading" color="indigo-6" glossy icon="fa-duotone fa-light fa-check" label="ویراش تصویر" class="q-mr-sm"></q-btn>
                    <q-btn color="grey-8" glossy icon="fa-duotone fa-light fa-times" label="بستن" class="q-mr-sm" v-close-popup></q-btn>
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
            <q-dialog
                v-model="dialog_files[props.row.id]"
                position="top"
            >
              <q-card style="width: 960px; max-width: 85vw;">
                <q-card-section>
                  <strong class="text-purple-8 font-15">مدیریت فایل های : <strong class="text-red-8">{{props.row.title}}</strong></strong>
                  <q-btn size="sm" icon="fa-duotone fa-light fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
                </q-card-section>
                <q-card-section>
                  <div class="q-mb-lg">
                    <div><strong class="text-primary">افزودن فایل جدید</strong></div>
                    <div class="q-mt-md q-mb-xl">
                      <div class="row">
                        <div class="col-md-5 q-px-xs">
                          <q-input dense rounded outlined label="عنوان فایل" v-model="add_file.title"/>
                        </div>
                        <div class="col-md-5 q-px-xs">
                          <q-file v-model="add_file.file" outlined dense rounded clearable @clear="add_file.file = null" label="انتخاب فایل"></q-file>
                        </div>
                        <div class="col-md-2 q-px-sm">
                          <q-btn :loading="add_file_loading" @click="Add_File(props.row.id)" color="teal-7" label="افزودن فایل" rounded glossy icon="fa-duotone fa-regular fa-plus" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <template v-if="props.row.files.length">
                    <template v-for="file in props.row.files">
                      <div>
                        <q-icon name="fa-duotone fa-file" size="20px" color="teal-8"/>
                        <strong class="q-ml-sm">{{ file.title }} <span class="font-weight-600 text-grey-8">( {{file.file_name}} )</span></strong>
                        <q-btn @click="Remove_File(props.row.id,file.id)" outline title="حذف فایل" class="float-right" color="red-6" icon="fa-duotone fa-regular fa-trash" size="10px" round  />
                      </div>
                      <q-separator class="q-mt-md q-mb-md "/>
                    </template>
                  </template>
                  <template v-else>
                    <global_images_animation_no_data></global_images_animation_no_data>
                  </template>
                  <div class="q-mt-lg text-right">
                    <q-btn color="grey-8" glossy icon="fa-duotone fa-light fa-times" label="بستن" class="q-mr-sm" v-close-popup></q-btn>
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>


          </q-td>
        </template>

      </q-table>
    </q-card-section>
  </q-card>

</template>

<style scoped>

</style>