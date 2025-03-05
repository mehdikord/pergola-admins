<script>
import Editor from "@tinymce/tinymce-vue";
import {Stores_Colors} from "@/stores/colors/colors.js";
import {Stores_Options} from "@/stores/options/options.js";
import items from "@/views/items/Items.vue";
import {Stores_Questions} from "@/stores/questions/questions.js";

export default {
  name: "Question_Answers",
  mounted() {
    if (this.answers){
      this.items = this.answers;
    }
    this.Get_Colors();
    this.Get_Options();
  },
  data(){
    return {
      loading : false,
      items:[],
      colors : [],
      all_colors : [],
      options:[],
      add_color:[],
      add_color_val:[],
      add_file:[],
      answer_colors:[],
      answer_text:[],
      answer_oxidant:[],
      answer_oxidant_percent:[],
      answer_oxidant_time:[],
    }
  },
  components: {Editor},
  props:['id','answers'],
  methods: {
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
    Remove_Attributes(id){
      this.items = this.items.filter(item=> { return item.id !== id })
    },
    Add_Answer_Color(item_id){
      if(!this.add_color[item_id] || !this.add_color_val[item_id]){
        return this.Methods_Notify_Message_Error('مقادیر خواسته شده را تکمیل کنید')
      }
      let color_code = null;
      let color_name = null;
      this.all_colors.map(item => {
        if (this.add_color[item_id] === item.id){
          color_code = item.color;
          color_name = item.name;
        }
      })

      let add_data = {
        id : this.add_color[item_id],
        name : color_name,
        color : color_code,
        val : this.add_color_val[item_id],
      }
      this.answers.map(item => {
        if (item.id === item_id){
          item.answer.colors.push(add_data)
        }
      })

      return this.Methods_Notify_Message_Success('به لیست تلفیق رنگ ها اضافه شد')
    },

    Remove_Answer_Color(id,item_id){
      let final_data=[];
      let select_data=[];
      this.answers.forEach(item => {
        if (item.id === item_id){
          select_data = item.answer.colors
        }
      })
      select_data = select_data.filter(item => item.id !== id)
      this.answers = this.answers.filter(item => {
        if (item.id === item_id){
          item.answer.colors = select_data;
        }
        return item;
      })
    },
    async HandleImageUpload(blobInfo, success, failure) {
      try {
        const formData = new FormData();
        formData.append("file", blobInfo.blob()); // ارسال تصویر به بک‌اند

        const response = await axios.post("admins/questions/uploader", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data && response.data.location) {
          console.log(response.data.location);
          success( {}); // TinyMCE باید مقدار URL معتبر دریافت کند
        } else {
          failure("خطا در دریافت آدرس تصویر");
        }
      } catch (error) {
        failure("آپلود ناموفق بود");
      }
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
    Edit_Items(){
      if (!this.items.length){
        return this.Methods_Notify_Message_Error('حداقل باید یک مرحله اضافه کنید !')
      }
      let answers = [];
      this.items.forEach(item => {
        answers.push(item.answer)
      })
      let data = {
        id: this.id,
        answers: answers,
      }
      console.log(data)
      Stores_Questions().Edit_Answers(data).then(res => {
        this.Methods_Notify_Update();
        this.loading = false;
        this.$emit('Done')

      }).catch(error => {
        this.Methods_Notify_Error_Server();
        this.loading=false;
      });
    }
  }
}
</script>

<template>
 <template v-if="answers && id">
   <div v-for="answer in items" class="q-px-sm q-mb-xl">
     <div class="q-pa-lg" style="border: 1px dashed #0c1219; border-radius: 8px; background-color: rgba(162,162,162,0.08);">
       <div class="q-mb-xl">
         <q-btn @click="Remove_Attributes(answer.id)" color="red" glossy rounded icon="fa-duotone fa-light fa-trash" label="حذف مرحله" class="float-right"></q-btn>
       </div>
       <strong class="text-red-7"> تلفیق رنگ ها : </strong>
       <div class="row q-mt-sm">
         <div class="col-md-6 col-sm-12 col-xs-12 q-px-sm">
           <q-select
               outlined
               :options="colors"
               emit-value
               map-options
               use-input
               v-model="add_color[answer.id]"
               @filter="Filter_Color_Select"
               position="top"
               clearable
               clear-icon="fa-duotone fa-light fa-times-circle text-red-8 font-22"
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
           <q-input outlined v-model="add_color_val[answer.id]"  type="text" label="مقدار رنگ">
           </q-input>
         </div>
         <div class="col-12 q-px-sm text-right">
           <q-btn @click="Add_Answer_Color(answer.id)" class="q-mt-md font-13" color="teal-8" glossy size="sm" label="افزودن به لیست رنگ ها"></q-btn>
         </div>
       </div>
       <q-separator class="q-mt-md q-mb-md" />
       <strong class="text-teal-8">لیست رنگ ها و مقادیر</strong>
       <div class="q-mt-md">
         <template v-if="answer.answer.colors">
           <div class="row">
             <div v-for="item in answer.answer.colors" class="col-md-4 col-sm-6 col-xs-6 q-px-sm q-mb-sm">
               <div class="talfig-box row">
                 <div class="col q-px-sm ">
                   <q-icon class="font-18 cursor-pointer" color="red-8" name="fa-duotone fa-light fa-times" @click="Remove_Answer_Color(item.id,answer.id)"></q-icon>
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
       <div class="q-mt-lg">
         <div class="row">
           <div class="col-md-4 q-px-sm">
             <q-input outlined v-model="answer.answer.oxidant" type="text" label="مقدار اکسیدان">
             </q-input>
           </div>
           <div class="col-md-4 q-px-sm">
             <q-input outlined v-model="answer.answer.oxidant_percent" type="text" label="درصد اکسیدان">
             </q-input>
           </div>
           <div class="col-md-4 q-px-sm">
             <q-input outlined v-model="answer.answer.oxidant_time" type="text" label="مدت زمان">
             </q-input>
           </div>

         </div>

       </div>
       <div class="q-mt-md">
         <Editor
             v-model="answer.answer.text"
             api-key="pt855e3h7yxtda2zr97ldurjwwrotxv1gmy7afdhxegvcpu9"
             :init="{
                        language: 'fa',
                        directionality: 'rtl',
                        plugins: 'lists link image table code help wordcount',
                        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image',
                        content_style: 'body { font-family: Vazirmatn, sans-serif; font-size: 14px; direction: rtl; text-align: right; }',
                        images_upload_url: 'https://core.pergola.ir/admins/questions/uploader',
                        automatic_uploads: true

                      }"
         />
       </div>

     </div>
   </div>
   <div class="q-mt-xl q-mb-lg text-right">
     <q-btn class="q-mr-sm" color="grey-8" label="بستن" glossy rounded v-close-popup icon="fa-duotone fa-light fa-times"></q-btn>
     <q-btn :loading="loading" color="indigo" label="ذخیره اطلاعات مراحل" icon="fa-duotone fa-light fa-check" glossy rounded @click="Edit_Items"></q-btn>
   </div>
 </template>


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
  border: 1px solid rgba(0, 0, 0, 0.4);
  background-color: rgba(0,0,0,0.03);
}
.answer-box{
  border-radius: 7px;
  padding: 14px 8px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  color: rgba(0,0,0,0.03);
}

</style>