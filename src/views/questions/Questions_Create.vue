<script>
import {Stores_Options} from "@/stores/options/options.js";
import {Stores_Colors} from "@/stores/colors/colors.js";

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

      },
      item_counter:1,
      loading: false,
      errors: [],
      from_colors:[],
      to_colors:[],
      options:[],
    }
  },
  methods: {
    Create_Item() {
      if (!this.items.items.length) {
        return this.Methods_Notify_Message_Error("هیچ گزینه ای برای این ویژگی ثبت نشده است")
      }
      this.loading = true;
      Stores_Options().Create(this.items).then(response => {
        this.$emit('Done', response.data.result);
        this.loading = false;
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
      this.items.items.push({id : this.item_counter,value:null})
      this.item_counter++;
    },
    Remove_Attributes(id){
      this.items.items = this.items.items.filter(item => item.id !== id)
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
        <div class="col-xs-12 col-sm-12 col-md-12 q-pa-sm q-mt-sm">
          <q-banner class="bg-teal-8 rounded-borders">
            <strong class="text-white">وارد کردن اطلاعات :</strong>

          </q-banner>
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