<script>

import {Stores_Colors} from "@/stores/colors/colors.js";
import Colors_Create from "@/views/colors/Colors_Create.vue";
import Colors_Edit from "@/views/colors/Colors_Edit.vue";
import {Stores_Users} from "@/stores/users/users.js";

export default {
  name: "Colors",
  components: {
    'colors_create' : Colors_Create,
    'colors_edit' : Colors_Edit
  },
  mounted() {
    this.Items_Get();
    this.Searchable_Get();

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
          name: 'name',
          value: 'name',
          label: 'عنوان رنگ',
          align: 'left',
          sortable: true,
          field: row => row.name,
        },
        {
          name: 'group',
          value: 'group',
          label: 'گروه',
          align: 'left',
          sortable: false,
          field: row => row.group,
        },
        {
          name: 'color',
          value: 'color',
          label: 'کد',
          align: 'left',
          sortable: false,
          field: row => row.color,
        },
        {
          name: 'current_choices',
          value: 'current_choices',
          label: 'انتخاب های فعلی',
          align: 'left',
          sortable: false,
          field: row => row.current_choices,
        },
        {
          name: 'convert_choices',
          value: 'convert_choices',
          label: 'انتخاب های تبدیل',
          align: 'left',
          sortable: false,
          field: row => row.convert_choices,
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
      searchable:[],

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

      Stores_Colors().Index(this.query_params).then(res=>{
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
    Searchable_Get(){
      Stores_Colors().Searchable().then(res=>{
        this.searchable = res.data.result;
      }).catch(error => {
        this.Methods_Notify_Error_Server();
      })
    },
    Items_Search(data){
      this.query_params.search = data;
      this.Items_Get()
    },
    Cancel_Search(){
      this.query_params.search = {};
      this.Items_Get();
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
      Stores_Colors().Edit_image(data).then(res=>{
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
      Stores_Colors().Edit_image(data).then(res=>{
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
      Stores_Colors().Delete(id).then(res => {
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
      Stores_Colors().Activation(id).then(res => {
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
      >
        <q-card style="width: 1024px; max-width: 85vw;">

          <q-card-section>
            <strong class="text-indigo-8 font-15">افزودن آیتم جدید</strong>
            <q-btn size="sm" icon="fa-duotone fa-light fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
          </q-card-section>
          <q-card-section>
            <colors_create @Done="(item => { Item_Create(item) })"></colors_create>
          </q-card-section>
        </q-card>
      </q-dialog>

      <div class="q-mt-md">
        <strong class="text-blue-8">جستجو و فیلتر پیشترفته</strong>
        <div class="q-mt-md">
          <global_searching_full_search @Cancel_Search="Cancel_Search" @Search="(data) => Items_Search(data)" v-if="searchable.length" :items="searchable" ></global_searching_full_search>
        </div>
      </div>
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
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="row">
              <q-img v-if="props.row.image" :src="props.row.image" width="60px" class="rounded-borders" />
              <div class="q-ml-sm q-mt-sm"><strong>{{ props.row.name }}</strong></div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-group="props">
          <q-td :props="props">
            <template v-if="props.row.group">
              <strong class="text-indigo-8 font-14">{{props.row.group.name}}</strong>
            </template>
          </q-td>
        </template>
        <template v-slot:body-cell-color="props">
          <q-td :props="props">
            <div :style="'background-color:'+props.row.color+ ';margin: 0 auto'" class="tear"></div>
          </q-td>
        </template>
        <template v-slot:body-cell-is_active="props">
          <q-td :props="props">
            <global_actions_activation_item @Set_Ok="Item_Activation(props.row.id)" :status="props.row.is_active"></global_actions_activation_item>
          </q-td>
        </template>
        <template v-slot:body-cell-current_choices="props">
          <q-td :props="props">
            <q-chip color="blue-grey-8" text-color="white" size="sm" :label="props.row.current_choices" class="font-12"></q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-convert_choices="props">
          <q-td :props="props">
            <q-chip color="deep-orange-8" text-color="white" size="sm" :label="props.row.convert_choices" class="font-12"></q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-tools="props">
          <q-td :props="props">
            <div class="text-center">
              <q-btn @click="dialog_edit[props.row.id] = true" glossy title="ویرایش آیتم" class="q-ma-xs" color="blue-8" icon="fa-duotone fa-light fa-edit" size="9px" round  />
              <q-btn @click="dialog_image[props.row.id] = true" glossy title="ویرایش تصویر" class="q-ma-xs" color="purple-6" icon="fa-duotone fa-light fa-image" size="9px" round  />
              <global_actions_delete_item @Set_Ok="Item_Delete(props.row.id)" :loading="delete_loading"></global_actions_delete_item>
            </div>

            <q-dialog
                v-model="dialog_edit[props.row.id]"
                position="top"
            >
              <q-card style="width: 1024px; max-width: 85vw;">

                <q-card-section>
                  <strong class="text-blue-8 font-15">ویرایش اطلاعات : <strong class="text-red-8">{{props.row.name}}</strong></strong>
                  <q-btn size="sm" icon="fa-duotone fa-light fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
                </q-card-section>
                <q-card-section>
                  <colors_edit :item="props.row" @Done="(item => { Item_Edit(item) })"></colors_edit>
                </q-card-section>
              </q-card>
            </q-dialog>
            <q-dialog
                v-model="dialog_image[props.row.id]"
                position="top"
            >
              <q-card style="width: 860px; max-width: 85vw;">
                <q-card-section>
                  <strong class="text-purple-8 font-15">ویرایش تصویر : <strong class="text-red-8">{{props.row.name}}</strong></strong>
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


          </q-td>
        </template>

      </q-table>
    </q-card-section>
  </q-card>

</template>

<style scoped>

</style>