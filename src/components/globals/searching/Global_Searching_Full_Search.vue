<script>
import {fasIndianRupeeSign} from "@quasar/extras/fontawesome-v6/index.mjs";

export default {
  name: "Global_Searching_Full_Search",
  props : ['items'],
  mounted() {

    if (this.items.length) {
      this.items.forEach(item => {
        this.options.push({
          label:item.label,
          value:item.field,
        })
      })
    }
  },
  data(){
    return {
      conditions : [],
      condition_counter : 1,
      options:[],
      condition_options:[
        {
          label : "برابر",
          value : "=",
        },
        {
          label : "شامل",
          value : "LIKE",
        },
        {
          label : "بزرگتر از",
          value : ">",
        },
        {
          label : "کوچکتر از",
          value : "<",
        },
        {
          label : "نا مساوی",
          value : "!=",
        },
      ]
    }
  },
  methods : {
    Add_Condition(){
      this.conditions.push({
        "id" : this.condition_counter,
        "field" : null,
        "condition" : '=',
        "value" : null,
      })
      this.condition_counter ++;
    },
    Remove_Condition(id){
      this.conditions = this.conditions.filter(item => {
        return item.id!==id 
      });

    },
    Search_Items(){
      let final_conditions=[];
      this.conditions.forEach(item => {
        if (item.field && item.value || item.value == 0){
          final_conditions.push({
            field : item.field,
            condition : item.condition,
            value : item.value
          })
        }
      })
      this.$emit("Search",final_conditions)
    },
    Convert_Options(field){
      let item = this.items.filter(filter => {return filter.field === field})
       if ( item && item.length){
         return item[0]
       }else {
         return {
           type : null,
           items : null
         }
       }
    },
    Remove_Search(){
      this.conditions=[];
      this.$emit("Cancel_Search",'ok')
    }
  },





}
</script>

<template>

  <div v-if="items">
    <div>
      <q-btn rounded @click="Add_Condition" color="teal-8" class="font-13" icon="fa-duotone fa-light fa-plus fa-beat" glossy label="افزودن شرط"></q-btn>
    </div>
    <div class="q-mt-md">

      <div v-for="(item,index) in conditions" class="row animation-fade-in">
        <div class="col-md-4 col-sm-12 col-xs-12 q-pa-sm">
          <q-select
              outlined
              dense
              v-model="item.field"
              transition-show="flip-up"
              transition-hide="flip-down"
              label="انتخاب فیلد"
              :options="options"
              emit-value
              map-options
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:prepend>
              <q-btn round dense glossy size="xs" color="red-8" @click="Remove_Condition(item.id)" icon="fa-duotone fa-light fa-times" />
            </template>
          </q-select>
        </div>
        <div class="col-md-4 col-sm-12 col-xs-12 q-pa-sm">
          <q-select
              outlined
              v-model="item.condition"
              dense
              transition-show="flip-up"
              transition-hide="flip-down"
              label="انتخاب شرط"
              :options="condition_options"
              emit-value
              map-options
          >

            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>

          </q-select>
        </div>
        <div class="col-md-4 col-sm-12 col-xs-12 q-pa-sm">
          <template v-if="Convert_Options(item.field).type === 'text'">
            <q-input v-model="item.value" dense outlined  type="text" label="مقدار">

            </q-input>
          </template>
          <template v-else-if="Convert_Options(item.field).type === 'select'">
            <q-select
                outlined
                dense
                v-model="item.value"
                transition-show="flip-up"
                transition-hide="flip-down"
                label="انتخاب مقدار"
                :options="Convert_Options(item.field).items"
                emit-value
                map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>

            </q-select>

          </template>


        </div>
      </div>
      <div class="q-mt-md animation-fade-in q-pa-sm" v-if="conditions.length">
        <q-btn rounded @click="Remove_Search" color="red-6" label="حذف جستجتو" glossy icon="fa-duotone fa-light fa-times" class="font-13 q-mr-sm"></q-btn>
        <q-btn rounded @click="Search_Items" color="teal-9" label="اعمال جستجو" glossy icon="fa-duotone fa-light fa-search" class="font-13"></q-btn>
      </div>
    </div>


  </div>

</template>

<style scoped>

</style>