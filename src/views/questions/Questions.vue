<script>

import {Stores_Questions} from "@/stores/questions/questions.js";
import {Stores_Colors} from "@/stores/colors/colors.js";
import colors_create from "@/views/colors/Colors_Create.vue";
import Question_Answers from "@/views/questions/Question_Answers.vue";
import {format, useQuasar} from "quasar";



export default {
  name: "Questions",
  components: {
    colors_create,
    'question_answers' : Question_Answers,
  },
  mounted() {
    this.Items_Get();
    this.Get_From_Colors();
    this.Get_To_Colors();
  },
  data(){
    return {
      $q: useQuasar(),
      items:[],
      dialog_items : [],
      dialog_answers : [],
      query_params:{
        sort_by : 'id',
        sort_type : 'desc',
        per_page : 15,
        page : 1,
        search :{
          from_color : null,
          to_color : null,
        }
      },
      items_loading:true,
      delete_loading:false,
      activation_loading:false,
      dialog_create:false,
      dialog_edit:[],
      items_selected:[],
      selected: [],
      from_colors:[],
      to_colors:[],
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
          name: 'created_at',
          required: true,
          label: 'ت ایجاد',
          align: 'left',
          sortable: true,
          field: row => row.created_at,
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
      console.log(this.query_params);
      

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
          this.Methods_Notify_Generator( error.response.data.error,'red-8','fa-duotone fa-light fa-times')
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
    Item_Copy(id){
      this.$q.dialog({
        title: 'آیا اطمینان دارید',
        message: 'آیتم مورد کپی شود ؟',
        ok: {
          glossy: true,
          color : "green-7"
        },
        cancel: {
          glossy: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {

        Stores_Questions().Copy(id).then(res => {
          this.items.unshift(res.data.result);
          this.Methods_Notify_Create()

        }).catch(error => {
          this.Methods_Notify_Error_Server();
        })


      }).onCancel(() => {

      }).onDismiss(() => {

      })
    },
     Get_From_Colors() {
      Stores_Colors().All().then(res => {
        this.from_colors = [];
        res.data.result.forEach( item=> {
          this.from_colors.push({value: item.id, label: item.name,color: item.color});
        })
      })
    },

    Get_To_Colors() {
      Stores_Colors().All().then(res => {
        this.to_colors = [];
        res.data.result.forEach( item=> {
          this.to_colors.push({value: item.id, label: item.name,color: item.color});
        })
      })
    },

    Filter_To_Color_Select (val, update, abort) {
      update(() => {
        if (val){
          this.to_colors =  this.to_colors.filter(item => {
            return item.label !== null && item.label.match(val)
          })
        }else {
          this.Get_To_Colors();
        }
      })
    },

    Filter_From_Color_Select (val, update, abort) {
      update(() => {
        if (val){
          this.from_colors =  this.from_colors.filter(item => {
            return item.label !== null && item.label.match(val)
          })
        }else {
          this.Get_From_Colors();
        }
      })
    },

    }

}
</script>

<template>
  <q-card flat>
    <q-card-section>
      <global_actions_header_buttons @Create="this.$router.push({name : 'questions_create'})" :create="true"></global_actions_header_buttons>
      <q-separator class="q-mt-xl"/>
    </q-card-section>
    <q-card-section>
      <strong class="text-deep-orange-7 font-16">فیلتر و جستجو</strong>
      <div class="q-mt-md">
        <div class="row">
          <div class="col-md-4 q-pa-sm">
            <q-select
              class="q-mt-sm"
              outlined
              :options="from_colors"
              emit-value
              map-options
              use-input
              v-model="query_params.search.from_color"
              @filter="Filter_From_Color_Select"
              position="top"
              clearable
              label="رنگ فعلی"
              :error="this.Methods_Validation_Check(errors,'from_color_id')"
              clear-icon="fa-duotone fa-light fa-times-circle text-red-8 font-22"
          >
          
            <template v-slot:error>
              <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'from_color_id')" />
            </template>
          </q-select>
          </div>
          <div class="col-md-4 q-pa-sm">
            <q-select
              class="q-mt-sm"
              outlined
              :options="to_colors"
              emit-value
              map-options
              use-input
              @filter="Filter_To_Color_Select"
              v-model="query_params.search.to_color"
              position="top"
              clearable
              label="رنگ جدید"
              :error="this.Methods_Validation_Check(errors,'to_color_id')"
              clear-icon="fa-duotone fa-light fa-times-circle text-red-8 font-22"
          >
            <template v-slot:error>
              <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'to_color_id')" />
            </template>
          </q-select>
          </div>
          <div class="col-md-12 q-pa-sm">
            <q-btn color="deep-orange-6" label="جستجو" @click="Items_Get()" rounded></q-btn>
          </div>
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
      <template v-slot:body-cell-created_at="props">
          <q-td :props="props">

            <global_filter_date :date="props.row.created_at" />
          </q-td>
        </template>

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
            <div class="row q-gutter-md">
              <div v-for="option in props.row.items">
                <strong>{{option.option.name}} : </strong>
                <strong class="text-red font-14">{{option.value.item}}</strong>
              </div>
            </div>
<!--            <q-btn @click="dialog_items[props.row.id] = true" glossy rounded color="deep-orange-8" label="مشاهده اطلاعات" size="sm" class="font-12"></q-btn>-->
            <q-dialog
                v-model="dialog_items[props.row.id]"
                position="top"
                persistent
            >
              <q-card style="width: 700px; max-width: 85vw;">
                <q-card-section>
                  <strong class="text-deep-orange-8 font-15">مشاهده اطلاعات </strong>
                  <q-btn size="sm" icon="fa-duotone fa-light fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
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
                    <q-btn color="grey-8" glossy icon="fa-duotone fa-light fa-times" label="بستن" class="q-mr-sm" v-close-popup></q-btn>
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
                full-width
                persistent
            >
              <q-card style="width: 1024px; max-width: 85vw;">
                <q-card-section>
                  <strong class="text-indigo font-16">مشاهده و ویرایش مراحل </strong>
                  <q-btn size="sm" icon="fa-duotone fa-light fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
                </q-card-section>
                <q-card-section>
                  <question_answers @Done="dialog_answers[props.row.id] = false" :id="props.row.id" :answers="props.row.answers"></question_answers>
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
              <q-btn :to="{name : 'questions_edit',params:{id : props.row.id}}" glossy title="ویرایش آیتم" class="q-ma-xs" color="blue-8" icon="fa-duotone fa-light fa-edit" size="9px" round  />
              <q-btn @click="Item_Copy(props.row.id)" glossy title="کپی آیتم" class="q-ma-xs" color="teal-8" icon="fa-duotone fa-light fa-copy" size="9px" round  />
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
.tear-selected {
  width: 32px;
  aspect-ratio:1;
  border-radius: 0 50% 50% 50%;
}
</style>