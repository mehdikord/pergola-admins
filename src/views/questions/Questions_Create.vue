<script>
import {Stores_Options} from "@/stores/options/options.js";
import {Stores_Colors} from "@/stores/colors/colors.js";
import {Stores_Questions} from "@/stores/questions/questions.js";

export default {
name: "Questions_Create",
  mounted() {
    this.Get_From_Colors();
    this.Get_To_Colors();
    this.Get_Options();
    this.Add_Attributes();
  },
  data() {
    return {
      items : {
        from_color_id:null,
        to_color_id:null,
        items : [],
        answers:[],
      },
      item_counter:1,
      loading: false,
      errors: [],
      from_colors:[],
      to_colors:[],
      options:[],
      special_selection:[
        {
          label : "بله",
          value : 1,
        },
        {
          label : "خیر",
          value : 0,
        }
      ]
    }
  },
  methods: {
    Create_Item() {
      if (this.items.from_color_id === this.items.to_color_id) {
        return this.Methods_Notify_Message_Error("رنگ فعلی و رنگ جدید نمیتواند باهم برابر باشد !")
      }
      this.loading = true;
      if(this.items.items.length){
        this.items.items = this.items.items.filter(item => item !== null);
      }
      Stores_Questions().Create(this.items).then(response => {
        this.Methods_Notify_Create()
        this.loading = false;
        this.$router.push({name : 'questions'});
      }).catch(error => {
        if (error.response.status === 422) {
          this.Methods_Validation_Notify();
          this.errors = error.response.data;
        }
        this.loading=false;
      });




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
    Get_Options() {
      Stores_Options().All().then(res => {
        this.options = res.data.result;
        this.options.forEach( item=> {
          this.items.items[item.id]={id : item.id,value : null}
          let new_items=[];
          item.items.forEach( get_item=> {
            new_items.push({value: get_item.id, label: get_item.item});
          })
          item.items = new_items;
        });

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
    Add_Attributes() {
      this.items.answers.push({id : this.item_counter,answer:null,is_special:0});
      this.item_counter++;
    },
    Remove_Attributes(id){
      this.items.answers = this.items.answers.filter(item => item.id !== id)
    },

  }
}
</script>

<template>
  <q-card>

    <q-card-section>
      <strong class="text-indigo-8 font-17">افزودن پرسش جدید</strong>
      <global_actions_header_buttons @Index="this.$router.push({name : 'questions'})" :index="true"></global_actions_header_buttons>
      <q-separator class="q-mt-xl"/>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-6 q-pa-sm">
          <label for=""><strong>رنگ فعلی </strong></label>
          <q-select
              class="q-mt-sm"
              outlined
              :options="from_colors"
              emit-value
              map-options
              use-input
              v-model="items.from_color_id"
              @filter="Filter_From_Color_Select"
              position="top"
              clearable
              :error="this.Methods_Validation_Check(errors,'from_color_id')"
              clear-icon="fas fa-times-circle text-red-8 font-22"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <div class="tear" :style="'background-color:'+scope.opt.color"></div>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                  <span>
                    {{ scope.opt.label }}
                  </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected-item="scope">
              <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <div class="tear-selected" :style="'background-color:'+scope.opt.color"></div>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <strong>
                    {{ scope.opt.label }}
                  </strong>
                </q-item-label>
              </q-item-section>
              </q-item>
            </template>
            <template v-slot:error>
              <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'from_color_id')" />
            </template>
          </q-select>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 q-pa-sm">
          <label for=""><strong> رنگ جدید</strong></label>
          <q-select
              class="q-mt-sm"
              outlined
              :options="to_colors"
              emit-value
              map-options
              use-input
              @filter="Filter_To_Color_Select"
              v-model="items.to_color_id"
              position="top"
              clearable
              :error="this.Methods_Validation_Check(errors,'to_color_id')"
              clear-icon="fas fa-times-circle text-red-8 font-22"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <div class="tear" :style="'background-color:'+scope.opt.color"></div>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                  <span>
                    {{ scope.opt.label }}
                  </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected-item="scope">
              <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <div class="tear-selected" :style="'background-color:'+scope.opt.color"></div>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <strong>
                    {{ scope.opt.label }}
                  </strong>
                </q-item-label>
              </q-item-section>
              </q-item>
            </template>
            <template v-slot:error>
              <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'to_color_id')" />
            </template>
          </q-select>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 q-pa-sm q-mt-sm">
          <q-banner class="bg-teal-6 rounded-borders">
            <strong class="text-white">وارد کردن اطلاعات </strong>
            <p class="text-white q-mt-sm">
              از ویژگی های مورد نظر مقادیر مناسب را برای فرایند انتخاب کنید
            </p>
          </q-banner>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 q-pa-sm q-mt-sm">
          <div class="row">
            <div v-for="option in options" class="col-md-4 col-xs-12 q-px-sm q-mb-sm">
              <q-select
                  class="q-mt-sm"
                  outlined
                  :label="option.name"
                  :options="option.items"
                  emit-value
                  map-options
                  use-input
                  v-model="items.items[option.id].value"
                  position="top"
                  clearable
                  clear-icon="fas fa-times-circle text-red-8 font-22"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>
                    {{ scope.opt.label }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>

              </q-select>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 q-pa-sm q-mt-sm">
          <strong class="text-red-7">ایجاد مراحل انجام کار :</strong>
          <q-banner class="q-mt-sm bg-teal-6 rounded-borders text-white">
            اگر مرحله ای مهم است میتوانید گزینه مهم بودن مرحله را " بله " انتخاب کنید و مهم بودن این مرحله برای کاربر مشخص میشود
          </q-banner>
          <div class="q-mt-md">
            <q-btn @click="Add_Attributes" dense color="blue-7" label="افزودن مرحله" icon="fas fa-plus-circle" rounded glossy></q-btn>
          </div>
          <div class="q-mt-md row">
              <div v-for="(answer,index) in items.answers"  class="col-md-6 col-xs-12 q-px-md q-mb-md">
                <div>
                  <q-select
                      dense
                      class="q-mt-sm"
                      outlined
                      label="مرحله مهم ؟"
                      :options="special_selection"
                      emit-value
                      map-options
                      v-model="items.answers[index].is_special"
                  >
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label>
                            {{ scope.opt.label }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>

                  </q-select>
                </div>
                <div class="q-mt-sm">
                  <q-input outlined v-model="items.answers[index].answer"  type="textarea" rows="4" label="توضیحات مرحله">
                  </q-input>
                </div>
                <div class="q-mt-sm text-right">
                  <q-btn :disable="items.answers.length < 2" @click="Remove_Attributes(answer.id)" color="red-7" label="حذف این مرحله" icon="fas fa-trash" glossy dense class="font-12"></q-btn>
                </div>
              </div>
            </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 q-pa-sm q-mt-md">
          <q-btn @click="Create_Item" color="indigo-8" glossy rounded label="افزودن پرسش" icon="fas fa-plus"></q-btn>
        </div>

      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.tear-selected {
  width: 32px;
  aspect-ratio:1;
  border-radius: 0 50% 50% 50%;
}
</style>