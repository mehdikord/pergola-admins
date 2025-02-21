<script>

import {Stores_Questions} from "@/stores/questions/questions.js";
import colors_create from "@/views/colors/Colors_Create.vue";
import Editor from "@tinymce/tinymce-vue";


export default {
  name: "Questions",
  components: {Editor, colors_create},
  mounted() {
    this.Items_Get();
  },
  data(){
    return {
      items:[],
      dialog_items : [],
      dialog_answers : [],
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
          name: 'from_color',
          value: 'from_color',
          label: 'رنگ فعلی' ,
          align: 'left',
          sortable: true,
          field: row => row.from_color,
        },
        {
          name: 'to_color',
          value: 'to_color',
          label: 'رنگ جدید' ,
          align: 'left',
          sortable: true,
          field: row => row.to_color,
        },
        {
          name: 'items',
          value: 'items',
          label: 'اطلاعات',
          align: 'left',
          sortable: false,
          field: row => row.items,
        },
        {
          name: 'answers',
          value: 'answers',
          label: 'مراحل',
          align: 'left',
          sortable: false,
          field: row => row.answers,
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

      Stores_Questions().Index(this.query_params).then(res=>{
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

    Item_Delete(id){
      this.delete_loading=true;
      Stores_Questions().Delete(id).then(res => {
        this.items = this.items.filter(item => {
          return item.id !== id;
        })
        this.Methods_Notify_Delete();
        this.delete_loading=false;
      }).catch(error => {
        if (error.response.status === 409) {
          this.Methods_Notify_Generator( error.response.data.error,'red-8','fas fa-times')
        }else {
          this.Methods_Notify_Error_Server();
        }
        this.delete_loading=false;
      })

    },
    Item_Activation(id){
      this.activation_loading=true;
      Stores_Questions().Activation(id).then(res => {
        this.items = this.items.filter(item => {
          if (item.id === id){
            item.is_active = !item.is_active;
          }
          return item;
        })
        this.activation_loading=false;
      }).catch(error =>{
        if (error.response.status === 409) {
          this.Methods_Notify_Generator( error.response.data.error,'red-8','fas fa-times')
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
  <q-card>
    <q-card-section>
      <global_actions_header_buttons @Create="this.$router.push({name : 'questions_create'})" :create="true"></global_actions_header_buttons>
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
        <template v-slot:body-cell-from_color="props">
          <q-td :props="props">
            <div class="row q-gutter-sm">
              <div :style="'background-color:'+props.row.from_color.color" class="tear"></div>
              <div class="q-mt-md"><strong>{{props.row.from_color.name}}</strong></div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-to_color="props">
          <q-td :props="props">
            <div class="row q-gutter-sm">
              <div :style="'background-color:'+props.row.to_color.color" class="tear"></div>
              <div class="q-mt-md"><strong>{{props.row.to_color.name}}</strong></div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-items="props">
          <q-td :props="props">
            <q-btn @click="dialog_items[props.row.id] = true" glossy rounded color="deep-orange-8" label="مشاهده اطلاعات" size="sm" class="font-12"></q-btn>
            <q-dialog
                v-model="dialog_items[props.row.id]"
                position="top"
            >
              <q-card style="width: 700px; max-width: 85vw;">
                <q-card-section>
                  <strong class="text-deep-orange-8 font-15">مشاهده اطلاعات </strong>
                  <q-btn size="sm" icon="fas fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
                </q-card-section>
                <q-card-section>
                  <div v-for="option in props.row.items" class="row">
                    <div class="col-md-6">
                      <strong class="text-grey-8">{{option.option.name}} : </strong>
                    </div>
                    <div class="col-md-6">
                      <strong>{{option.value}}</strong>
                    </div>
                    <div class="col-12">
                      <q-separator class="q-mt-md q-mb-lg"/>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="text-right">
                    <q-btn color="grey-8" glossy icon="fas fa-times" label="بستن" class="q-mr-sm" v-close-popup></q-btn>
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-td>
        </template>
        <template v-slot:body-cell-answers="props">
          <q-td :props="props">
            <q-btn @click="dialog_answers[props.row.id] = true" glossy rounded color="teal-8" label="مشاهده مراحل" size="sm" class="font-12"></q-btn>
            <q-dialog
                v-model="dialog_answers[props.row.id]"
                position="top"
            >
              <q-card style="width: 1024px; max-width: 85vw;">

                <q-card-section>
                  <strong class="text-deep-orange-8 font-15">مشاهده مراحل </strong>
                  <q-btn size="sm" icon="fas fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
                </q-card-section>
                <q-card-section>
                  <div v-for="answer in props.row.answers" class="q-mb-lg">

                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="text-right">
                    <q-btn color="grey-8" glossy icon="fas fa-times" label="بستن" class="q-mr-sm" v-close-popup></q-btn>
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
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
              <q-btn :to="{name : 'questions_edit',params:{id : props.row.id}}" glossy title="ویرایش آیتم" class="q-ma-xs" color="blue-8" icon="fas fa-edit" size="9px" round  />
              <global_actions_delete_item @Set_Ok="Item_Delete(props.row.id)" :loading="delete_loading"></global_actions_delete_item>
            </div>

          </q-td>
        </template>

      </q-table>
    </q-card-section>
  </q-card>

</template>

<style scoped>
.answer-box{
  padding: 20px 10px;
  border-radius:8px;
  border : 1px dashed #212121;
}
</style>