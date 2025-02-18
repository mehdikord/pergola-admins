<script>
import {Stores_Options} from "@/stores/options/options.js";
import {Stores_Colors} from "@/stores/colors/colors.js";
import {Stores_Questions} from "@/stores/questions/questions.js";
import plans_create from "@/views/plans/Plans_Create.vue";

export default {
name: "Questions_Create",
  components: {plans_create},
  mounted() {
    this.Get_From_Colors();
    this.Get_To_Colors();
    this.Get_Colors();
    this.Get_Options();
    // this.Add_Attributes();
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
      add_level_dialog:false,
      errors: [],
      from_colors:[],
      to_colors:[],
      colors : [],
      all_colors : [],
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
      ],
      add_color:null,
      add_color_val:null,
      add_file:null,
      answer_colors:[],
      answer_text:null,
      answer_declare:null
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
        // this.$router.push({name : 'questions'});
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
    Get_Colors() {
      Stores_Colors().All().then(res => {
        this.all_colors = [];
        this.all_colors = res.data.result;
        this.colors = [];
        res.data.result.forEach( item=> {
          this.colors.push({value: item.id, label: item.name,color: item.color});
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
    Filter_Color_Select (val, update, abort) {
      update(() => {
        if (val){
          this.colors =  this.colors.filter(item => {
            return item.label !== null && item.label.match(val)
          })
        }else {
          this.Get_Colors();
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
      this.items.answers.push({id :this.item_counter,colors : this.answer_colors , declare : this.answer_declare , text:this.answer_text });
      this.item_counter++;
      this.answer_colors=[];
      this.answer_declare=null;
      this.answer_text=null
      this.add_level_dialog = false
      return this.Methods_Notify_Message_Success('به لیست پاسخ ها اضافه شد')
    },
    Remove_Attributes(id){
      this.items.answers = this.items.answers.filter(item => item.id !== id)
    },
    Add_Answer_Color(){
      if(!this.add_color || !this.add_color_val){
        return this.Methods_Notify_Message_Error('مقادیر خواسته شده را تکمیل کنید')
      }
      let color_code = null;
      let color_name = null;
      this.all_colors.map(item => {
        if (this.add_color === item.id){
          color_code = item.color;
          color_name = item.name;
        }
      })
      this.answer_colors.push({
        id : this.add_color,
        name : color_name,
        color : color_code,
        val : this.add_color_val,
      });
      return this.Methods_Notify_Message_Success('به لیست تلفیق رنگ ها اضافه شد')
    },
    Remove_Answer_Color(id){
      this.answer_colors = this.answer_colors.filter(item => item.id !== id)
    },
    Add_Answer_File(){

    }

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
          <div class="q-mt-md">
            <q-btn @click="add_level_dialog=true" dense color="blue-7" label="افزودن مرحله" icon="fas fa-plus-circle" rounded glossy></q-btn>
          </div>
          <q-dialog
              v-model="add_level_dialog"
              position="top"
          >
            <q-card style="width: 960px; max-width: 85vw;">
              <q-card-section>
                <strong class="text-indigo-8 font-15">افزودن مرحله پرسش</strong>
                <q-btn size="sm" icon="fas fa-times" glossy round dense v-close-popup color="red" class="q-mr-sm float-right"/>
              </q-card-section>
              <q-card-section>
                <strong class="text-red-7"> تلفیق رنگ ها : </strong>
                <div class="row q-mt-sm">
                  <div class="col-md-6 col-sm-12 col-xs-12 q-px-sm">
                    <q-select
                        outlined
                        :options="colors"
                        emit-value
                        map-options
                        use-input
                        v-model="add_color"
                        @filter="Filter_Color_Select"
                        position="top"
                        clearable
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
                    </q-select>
                  </div>
                  <div class="col-md-6 col-sm-12 col-xs-12 q-px-sm">
                    <q-input outlined v-model="add_color_val"  type="text" label="مقدار رنگ">
                    </q-input>
                  </div>
                  <div class="col-12 q-px-sm text-right">
                    <q-btn @click="Add_Answer_Color" class="q-mt-md font-13" color="teal-8" glossy size="sm" label="افزودن به لیست رنگ ها"></q-btn>
                  </div>
                </div>
                <q-separator class="q-mt-md q-mb-md" />
                <strong class="text-teal-8">لیست رنگ ها و مقادیر</strong>
                <div class="q-mt-md">
                  <template v-if="this.answer_colors.length">
                    <div class="row">
                      <div v-for="item in answer_colors" class="col-md-4 col-sm-6 col-xs-6 q-px-sm q-mb-sm">
                        <div class="talfig-box row">
                          <div class="col q-px-sm ">
                            <q-icon class="font-18 cursor-pointer" color="red-8" name="fas fa-times" @click="Remove_Answer_Color(item.id)"></q-icon>
                          </div>
                          <div class="col q-px-sm ">
                            <div class="tear-selected" :style="'background-color:'+item.color"></div>
                          </div>
                          <div class="col q-px-sm ">
                            <div class="q-mt-sm"><strong class="q-mt-md" >{{item.name}}</strong></div>
                          </div>
                          <div class="col q-px-sm ">
                            <div> : <q-chip color="red-8" text-color="white" size="sm" class="font-13">{{item.val}}</q-chip></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <q-banner class="rounded-borders bg-red-4 text-white text-center" >
                      لیست تلفیق رنگ ها خالی است !
                    </q-banner>
                  </template>
                </div>
                <div class="q-mt-md">
                  <q-input outlined v-model="answer_declare" type="text" label="درصد دکلره">
                  </q-input>
                </div>
                <div class="q-mt-md">
                  <q-input outlined v-model="answer_text" type="textarea" rows="3" label="توضیحات">
                  </q-input>
                </div>
<!--               <div class="q-mt-md">-->
<!--                <strong> فایل ها : </strong>-->
<!--                 <div class="q-mt-md">-->
<!--                   <q-file outlined bottom-slots v-model="add_file" label="انتخاب فایل" counter>-->
<!--                     <template v-slot:prepend>-->
<!--                       <q-icon name="fas fa-file" @click.stop.prevent />-->
<!--                     </template>-->
<!--                     <template v-slot:append>-->
<!--                       <q-icon name="close" @click.stop.prevent="add_file = null" class="cursor-pointer" />-->
<!--                     </template>-->
<!--                   </q-file>-->
<!--                 </div>-->
<!--                 <div class="text-right">-->
<!--                   <q-btn @click="Add_Answer_File" class="q-mt-sm font-13" color="teal-8" glossy size="sm" label="افزودن به لیست فایل ها"></q-btn>-->
<!--                 </div>-->
<!--               </div>-->
                <div class="q-mt-lg q-mb-md text-right">
                  <q-separator class="q-mt-md q-mb-md" />
                  <q-btn @click="Add_Attributes" color="indigo" label="افزودن به لیست پاسخ ها" glossy ></q-btn>
                </div>
              </q-card-section>
            </q-card>
          </q-dialog>
          <div class="q-mt-md">
            <div v-for="answer in items.answers" class="answer-box q-mb-md">
              <strong class="text-teal-8">لیست تلفیق رنگ ها : </strong>
              <q-btn @click="Remove_Attributes(answer.id)" rounded glossy class="float-right font-12" color="red-7" label="حذف مرحله" icon="fas fa-trash" size="sm"></q-btn>
              <div class="q-mt-sm">
                <div class="row">
                  <div v-for="color in answer.colors" class="col-md-3 col-sm-6 col-xs-6 q-px-sm q-mb-sm">
                    <div class="talfig-box row">
                      <div class="col q-px-sm ">
                        <div class="tear-selected" :style="'background-color:'+color.color"></div>
                      </div>
                      <div class="col q-px-sm ">
                        <div class="q-mt-sm"><strong class="q-mt-md text-dark" >{{color.name}}</strong></div>
                      </div>
                      <div class="col q-px-sm ">
                        <div> : <q-chip color="blue-8" text-color="white" size="sm" class="font-13">{{color.val}}</q-chip></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <q-separator class="q-mt-md q-mb-md" />
              <div>
                <strong class="text-teal-8">درصد دکلره : </strong>
                <strong class="text-red-8">{{answer.declare}}</strong>
              </div>
              <q-separator class="q-mt-md q-mb-md" />
              <div>
                <strong class="text-teal-8">توضیحات : </strong>
                <p class="text-dark q-mt-md">{{answer.text}}</p>
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
.talfig-box{
  border-radius: 7px;
  padding:11px 8px;
  border: 1px solid rgba(0, 0, 0, 0.03);
  background-color: rgba(0,0,0,0.03);
}
.answer-box{
  border-radius: 7px;
  padding: 14px 8px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  color: rgba(0,0,0,0.03);
}
</style>