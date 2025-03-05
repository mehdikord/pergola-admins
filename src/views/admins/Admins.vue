<script>

import {Stores_Admins} from "@/stores/admins/admins.js";
import Admins_Create from "@/views/admins/Admins_Create.vue";
import Admins_Edit from "@/views/admins/Admins_Edit.vue";

export default {
  name: "Admins",
  components: {
    'admins_create' : Admins_Create,
    'admins_edit' : Admins_Edit,
  },
  mounted() {
    this.Items_Get();
  },
  data(){
    return {
      items:[],
      password_items : {
        id:null,
        password_confirmation : null,
        password:null,
      },
      password_dialog:[],
      password_loading:[],
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
      dialog_plan:[],
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
          label: 'نام',
          align: 'left',
          sortable: true,
          field: row => row.name,
        },
        {
          name: 'phone',
          value: 'phone',
          label: 'موبایل',
          align: 'left',
          sortable: false,
          field: row => row.phone,
        },
        {
          name: 'email',
          value: 'email',
          label: 'سن',
          align: 'left',
          sortable: false,
          field: row => row.email,
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
          name: 'updated_at',
          value: 'updated_at',
          label: 'ت ویرایش',
          align: 'left',
          sortable: true ,
          field: row => row.updated_at,
        },
        {
          name: 'tools',
          value: 'tools',
          label: 'عملیات',
          align: 'left',
        }
      ],
      visible_columns:[],
      errors:[]
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

      Stores_Admins().Index(this.query_params).then(res=>{
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
    Change_Password(item){
      this.password_loading[item.id]=true;
      this.password_items.id = item.id;
      Stores_Admins().Edit_Password(this.password_items).then(res=>{
        this.Methods_Notify_Message_Success('گذرواژه مدیر مورد نظر باموفقیت تغییر کرد')
        this.password_loading[item.id]=false;
        this.password_dialog[item.id]=false;
      }).catch(error=>{
        if (error.response.status === 422) {
          this.Methods_Validation_Notify();
          this.errors = error.response.data;
        }else {
          this.Methods_Notify_Error_Server();

        }
        this.password_loading[item.id]=false;
      })

    },
    Item_Delete(id){
      this.delete_loading=true;
      Stores_Admins().Delete(id).then(res => {
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
      Stores_Admins().Activation(id).then(res => {
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
            <admins_create @Done="(item => { Item_Create(item) })"></admins_create>
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
        <template v-slot:body-cell-name="props">
          <q-td :props="props">

            <div class="row">
              <img src="assets/images/icons/user-default.png" width="35"  alt="user_profile"/>
              <div class="q-ml-sm q-mt-sm"><strong>{{ props.row.name }}</strong></div>
            </div>
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
              <q-btn @click="dialog_edit[props.row.id] = true" glossy title="ویرایش آیتم" class="q-ma-xs" color="blue-8" icon="fa-duotone fa-light fa-edit" size="9px" round  />
              <q-btn @click="password_dialog[props.row.id] = true" glossy title="ویرایش گذرواژه" class="q-ma-xs" color="teal-8" icon="fa-duotone fa-light fa-lock" size="9px" round  />
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
                  <admins_edit :item="props.row" @Done="(item => { Item_Edit(item) })"></admins_edit>
                </q-card-section>
              </q-card>
            </q-dialog>
            <q-dialog
                v-model="password_dialog[props.row.id]"
                position="top"
            >
              <q-card style="width: 1024px; max-width: 85vw;">
                <q-card-section>
                  <strong class="text-blue-8 font-15">ویرایش گذرواژه : <strong class="text-red-8">{{props.row.name}}</strong></strong>
                  <q-btn size="sm" icon="fa-duotone fa-light fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
                </q-card-section>
                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
                      <q-input  :error="this.Methods_Validation_Check(errors,'password')" outlined v-model="password_items.password"  type="password" label="گذرواژه جدید">
                        <template v-slot:error>
                          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'password')" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
                      <q-input  :error="this.Methods_Validation_Check(errors,'password_confirmation')" outlined v-model="password_items.password_confirmation"  type="password" label="تکرار گذرواژه">
                        <template v-slot:error>
                          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'password_confirmation')" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="text-right">
                    <q-btn glossy class="q-mr-sm" color="grey-8" icon="fa-duotone fa-light fa-times" label="بستن " v-close-popup></q-btn>
                    <q-btn glossy @click="Change_Password(props.row)" :loading="password_loading[props.row.id]" color="teal-8" icon="fa-duotone fa-light fa-edit" label="تغییر گذرواژه"></q-btn>
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>


          </q-td>
        </template>

        <template v-slot:body-cell-updated_at="props">
          <q-td :props="props" >
            <global_filter_date :date="props.row.updated_at" />
          </q-td>
        </template>


      </q-table>
    </q-card-section>
  </q-card>




</template>

<style scoped>

</style>
