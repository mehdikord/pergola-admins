<script>
import {Stores_Users} from "@/stores/users/users.js";
import {Stores_Plans} from "@/stores/plans/plans.js";

export default {
  name: "Users_Create",
  props:['item'],
  mounted() {
    this.Get_Plans();
    if (this.item){
      this.items.id = this.item.id;
    }
  },
  data() {
    return {
      items : {
        'id' : null,
        plan_id : null,
        invoice_status : 1,
        description : null,
      },
      loading: false,
      errors: [],
      plans:[],
      invoices :[
        {
          label : 'پرداخت شده',
          value : 1,
        },
        {
          label : 'پرداخت نشده',
          value : 0,
        }
      ]
    }
  },
  methods: {
    Create_Item() {
      this.loading = true;
      Stores_Users().Add_Plan(this.items).then(response => {
        this.$emit('Panel_Done', response.data.result);
        this.loading = false;
      }).catch(error => {
        if (error.response.status === 422) {
          this.Methods_Validation_Notify();
          this.errors = error.response.data;
        }
        this.loading=false;
      });
    },
    Get_Plans() {
      Stores_Plans().All().then(res => {
        this.plans = [];
        res.data.result.forEach(item => {
          this.plans.push({label : item.name,value : item.id,access : item.access});
        })
      })
    }
  }
}
</script>

<template>
  <q-banner class="q-mb-md bg-orange-5 rounded-borders">
    اگر کاربر دارای اشتراک فعال باشد ، اشتراک جدید به صورت رزرو شده برای کاربر ثبت خواهد شد
  </q-banner>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-select
          outlined
          label="انتخاب اشتراک"
          :options="plans"
          emit-value
          map-options
          use-input
          v-model="items.plan_id"
          :error="this.Methods_Validation_Check(errors,'plan_id')"
          position="top"
          clearable
          clear-icon="fas fa-times-circle text-red-8 font-22"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>
                  <span>
                   <strong class="text-teal-8">{{ scope.opt.label }} </strong> - <strong class="text-red-8">( {{scope.opt.access}} )</strong> ماه دسترسی
                  </span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'plan_id')" />
        </template>
      </q-select>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-select
          outlined
          label="وضعیت فاکتور"
          :options="invoices"
          emit-value
          map-options
          use-input
          v-model="items.invoice_status"
          position="top"
          clearable
          clear-icon="fas fa-times-circle text-red-8 font-22"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>
                  <span>
                   <strong  :class="{'text-green-8' : scope.opt.value === 1 , 'text-red-8' : scope.opt.value === 0}">{{ scope.opt.label }} </strong>
                  </span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'plan_id')" />
        </template>
      </q-select>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs q-mt-md">
      <q-input outlined v-model="items.description"  type="textarea" rows="3" label="توضیحات فاکتور">
      </q-input>
    </div>
    <div class="col-12 q-mt-md q-pa-xs text-right">
      <q-btn color="grey-8" glossy icon="fas fa-times" label="بستن" class="q-mr-sm" v-close-popup></q-btn>
      <q-btn @click="Create_Item" :loading="loading" color="teal-8" glossy icon="fas fa-plus-circle" label="ثبت اشتراک"></q-btn>

    </div>
  </div>

</template>

<style scoped>

</style>
