<script>

import {Stores_invoices} from "@/stores/invoices/invoices.js";
import colors_create from "@/views/colors/Colors_Create.vue";
import colors_edit from "@/views/colors/Colors_Edit.vue";

export default {
  name: "Invoices",
  components: {colors_edit, colors_create},
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
          name: 'user',
          value: 'user',
          label: 'کاربر',
          align: 'left',
          sortable: false,
          field: row => row.user,
        },
        {
          name: 'amount',
          value: 'amount',
          label: 'مبلغ',
          align: 'left',
          sortable: true,
          field: row => row.amount,
        },
        {
          name: 'method',
          value: 'method',
          label: 'نوع پرداخت',
          align: 'left',
          sortable: false,
          field: row => row.method,
        },
        {
          name: 'gateway',
          value: 'gateway',
          label: 'درگاه',
          align: 'left',
          sortable: false,
          field: row => row.gateway,
        },
        {
          name: 'is_paid',
          value: 'is_paid',
          label: 'وضعیت پرداخت',
          align: 'left',
          sortable: true,
          field: row => row.is_paid,
        },
        {
          name: 'paid_at',
          value: 'paid_at',
          label: 'ت پرداخت',
          align: 'left',
          sortable: true,
          field: row => row.paid_at,
        },
        {
          name: 'created_at',
          value: 'created_at',
          label: 'ت ثبت',
          align: 'left',
          sortable: true,
          field: row => row.created_at,
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
      Stores_invoices().Index(this.query_params).then(res=>{
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
        <template v-slot:body-cell-user="props">
          <q-td :props="props">
            <div class="row">
              <q-img v-if="props.row.user.image" :src="props.row.user.image" width="45px" class="rounded-borders" />
              <img v-else src="assets/images/icons/profile.png" width="45px" class="rounded-borders" />
              <strong class="q-ml-sm q-mt-md text-blue-8">{{props.row.user.name}}</strong>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-amount="props">
          <q-td :props="props">
            <strong class="font-15 text-teal-8">{{this.$filters.number_format(props.row.amount)}}</strong>
            <span class="font-13 q-ml-sm">تومان</span>
          </q-td>
        </template>

        <template v-slot:body-cell-method="props">
          <q-td :props="props">
            <div class="text-center">
              <q-chip color="blue-8" text-color="white" :label="props.row.method" size="sm" class="font-13"></q-chip>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-gateway="props">
          <q-td :props="props">
            <div class="text-center">
              <q-chip color="yellow-10" text-color="dark" :label="props.row.gateway" size="sm" class="font-13"></q-chip>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-is_paid="props">
          <q-td :props="props">
            <q-chip v-if="props.row.is_paid" color="green-7" text-color="white" label="پرداخت شده" icon="fa-duotone fa-light fa-check" size="sm" class="font-12 font-weight-500"></q-chip>
            <q-chip v-else color="red-7" text-color="white" label="پرداخت نشده" icon="fa-duotone fa-light fa-times" size="sm" class="font-12 font-weight-500"></q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-paid_at="props">
          <q-td :props="props">
            <global_filter_date v-if="props.row.paid_at" :date="props.row.paid_at" />
          </q-td>
        </template>
        <template v-slot:body-cell-created_at="props">
          <q-td :props="props">
            <global_filter_date v-if="props.row.created_at" :date="props.row.created_at" />
          </q-td>
        </template>
        <template v-slot:body-cell-tools="props">
          <q-td :props="props">
            <div class="text-center">
              <q-btn glossy title="مشاهده جزئیات" class="q-ma-xs" color="purple-8" icon="fa-duotone fa-light fa-list" size="9px" round  />

            </div>
          </q-td>
        </template>

      </q-table>
    </q-card-section>
  </q-card>



</template>

<style scoped>

</style>