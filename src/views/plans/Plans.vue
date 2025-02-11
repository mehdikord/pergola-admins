<script>

import {Stores_Plans} from "@/stores/plans/plans.js";
import Plans_Create from "@/views/plans/Plans_Create.vue";
import Plans_Edit from "@/views/plans/Plans_Edit.vue";

export default {
  name: "Plans",
  components: {
    'plans_create' : Plans_Create,
    'plans_edit' : Plans_Edit
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
          label: 'عنوان اشتراک',
          align: 'left',
          sortable: true,
          field: row => row.name,
        },
        {
          name: 'access',
          value: 'access',
          label: 'زمان (ماه)',
          align: 'left',
          sortable: false,
          field: row => row.access,
        },
        {
          name: 'price',
          value: 'price',
          label: 'قیمت (تومان)',
          align: 'left',
          sortable: false,
          field: row => row.price,
        },
        {
          name: 'sale',
          value: 'sale',
          label: 'قیمت با تخفیف',
          align: 'left',
          sortable: false,
          field: row => row.sale,
        },
        {
          name: 'active_users',
          value: 'active_users',
          label: 'کاربران فعال',
          align: 'left',
          sortable: false,
          field: row => row.active_users,
        },
        {
          name: 'total_users',
          value: 'total_users',
          label: 'تعداد کل خریداری شده',
          align: 'left',
          sortable: false,
          field: row => row.total_users,
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

      Stores_Plans().Index(this.query_params).then(res=>{
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
      Stores_Plans().Delete(id).then(res => {
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
      Stores_Plans().Activation(id).then(res => {
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
      <global_actions_header_buttons @Create="dialog_create=true" :create="true"></global_actions_header_buttons>

      <q-dialog
          v-model="dialog_create"
          position="top"
      >
        <q-card style="width: 1024px; max-width: 85vw;">

          <q-card-section>
            <strong class="text-indigo-8 font-15">افزودن آیتم جدید</strong>
            <q-btn size="sm" icon="fas fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
          </q-card-section>
          <q-card-section>
            <plans_create @Done="(item => { Item_Create(item) })"></plans_create>
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
              <div class="q-ml-sm q-mt-sm"><strong>{{ props.row.name }}</strong></div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-access="props">
          <q-td :props="props">
            <q-chip color="blue-8" text-color="white" size="sm" class="font-13"><strong>{{props.row.access}}</strong></q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-price="props">
          <q-td :props="props">
            <strong class="text-teal-7 font-14">{{this.$filters.number_format(props.row.price)}}</strong>
          </q-td>
        </template>
        <template v-slot:body-cell-sale="props">
          <q-td :props="props">
            <strong class="text-grey-8 font-14">{{this.$filters.number_format(props.row.sale)}}</strong>
          </q-td>
        </template>
        <template v-slot:body-cell-active_users="props">
          <q-td :props="props">
            <q-chip color="deep-orange-8" text-color="white" size="sm" class="font-13">{{props.row.active_users}}</q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-total_users="props">
          <q-td :props="props">
            <q-chip color="deep-purple-8" text-color="white" size="sm" class="font-13">{{props.row.total_users}}</q-chip>
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
              <q-btn @click="dialog_edit[props.row.id] = true" glossy title="ویرایش آیتم" class="q-ma-xs" color="blue-8" icon="fas fa-edit" size="9px" round  />
              <global_actions_delete_item @Set_Ok="Item_Delete(props.row.id)" :loading="delete_loading"></global_actions_delete_item>
            </div>

            <q-dialog
                v-model="dialog_edit[props.row.id]"
                position="top"
            >
              <q-card style="width: 1024px; max-width: 85vw;">

                <q-card-section>
                  <strong class="text-blue-8 font-15">ویرایش اطلاعات : <strong class="text-red-8">{{props.row.name}}</strong></strong>
                  <q-btn size="sm" icon="fas fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
                </q-card-section>
                <q-card-section>
                  <plans_edit :item="props.row" @Done="(item => { Item_Edit(item) })"></plans_edit>
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