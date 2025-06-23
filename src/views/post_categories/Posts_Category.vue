<script>

import {Stores_Posts} from "@/stores/posts/posts.js";
import Posts_Category_Edit from "@/views/post_categories/Posts_Category_Edit.vue";
import Posts_Category_Create from "@/views/post_categories/Posts_Category_Create.vue";


export default {
  name: "Posts_Category",
  components: {
    'posts_category_create' : Posts_Category_Create,
    'posts_category_edit' : Posts_Category_Edit
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
          label: 'عنوان دسته بندی',
          align: 'left',
          sortable: true,
          field: row => row.name,
        },
        {
          name: 'parent',
          value: 'parent',
          label: 'سرگروه',
          align: 'left',
          sortable: true,
          field: row => row.parent,
        },
        {
          name: 'color',
          value: 'color',
          label: 'رنگ',
          align: 'left',
          sortable: true,
          field: row => row.color,
        },
        {
          name: 'description',
          value: 'description',
          label: 'توضیحات',
          align: 'left',
          sortable: true,
          field: row => row.description,
        },

        {
          name: 'posts_count',
          value: 'posts_count',
          label: 'تعداد نوشته ها',
          align: 'left',
          sortable: false,
          field: row => row.posts_count,
        },

        {
          name: 'tools',
          value: 'tools',
          label: 'عملیات',
          align: 'left',
        }
      ],
      visible_columns:[],

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

      Stores_Posts().Category_Index(this.query_params).then(res=>{
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

    Item_Delete(id){
      this.delete_loading=true;
      Stores_Posts().Category_Delete(id).then(res => {
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
  <q-card>
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
            <posts_category_create @Done="(item => { Item_Create(item) })"></posts_category_create>
          </q-card-section>
        </q-card>
      </q-dialog>

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
        <template v-slot:body-cell-parent="props">
          <q-td :props="props">
            <strong v-if="props.row.parent">
              {{props.row.parent.name}}
            </strong>
          </q-td>
        </template>
        <template v-slot:body-cell-color="props">
          <q-td :props="props">
            <div :style="'background-color:'+props.row.color+ ';margin: 0 auto'" class="tear"></div>
          </q-td>
        </template>
        <template v-slot:body-cell-posts_count="props">
          <q-td :props="props">
            <q-chip color="dark" size="md" :label="props.row.posts_count" text-color="white"></q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-tools="props">
          <q-td :props="props">
            <div class="text-center">
              <q-btn @click="dialog_edit[props.row.id] = true" glossy title="ویرایش آیتم" class="q-ma-xs" color="blue-8" icon="fa-duotone fa-light fa-edit" size="9px" round  />
              <global_actions_delete_item @Set_Ok="Item_Delete(props.row.id)" :loading="delete_loading"></global_actions_delete_item>
            </div>

            <q-dialog
                v-model="dialog_edit[props.row.id]"
                position="top"
            >
              <q-card style="width: 1024px; max-width: 85vw;">

                <q-card-section>
                  <strong class="text-blue-8 font-15">ویرایش اطلاعات : <strong class="text-red-8">{{props.row.title}}</strong></strong>
                  <q-btn size="sm" icon="fa-duotone fa-light fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
                </q-card-section>
                <q-card-section>
                  <posts_category_edit :item="props.row" @Done="(item => { Item_Edit(item) })"></posts_category_edit>
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