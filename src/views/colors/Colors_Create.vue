<script>
import {Stores_Colors} from "@/stores/colors/colors.js";
import {Stores_Color_Group} from "@/stores/colors/color_groups.js";
import Items from "@/views/items/Items.vue";

export default {
  name: "Colors_Create",
  mounted() {
    this.Get_Groups();
  },
  computed: {
    Items() {
      return Items
    }
  },
  data() {
    return {
      items : {
        color_group_id : null,
        name : null,
        color : null,
        description : null,
        image : null,
      },
      loading: false,
      groups:[],
      errors: [],
    }
  },
  methods: {
    Create_Item() {
      this.loading = true;
      Stores_Colors().Create(this.items).then(response => {
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
    Filter_Group_Select (val, update, abort) {
      update(() => {
        if (val){
          this.groups =  this.groups.filter(item => {
            return item.label !== null && item.label.match(val)
          })
        }else {
          this.Get_Groups();
        }
      })
    },
    Get_Groups() {
      Stores_Color_Group().All().then(res => {
        this.groups = [];
        res.data.result.forEach(item => {
          this.groups.push({label: item.name, value: item.id});
        })
      })

    }
  }
}
</script>

<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'name')" outlined v-model="items.name"  type="text" label="عنوان رنگ">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'name')" />
        </template>
      </q-input>

    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-select
          class="q-mt-sm"
          label="انتخاب گروه بندی "
          outlined
          :options="groups"
          emit-value
          map-options
          use-input
          @filter="Filter_Group_Select"
          v-model="items.color_group_id"
          position="top"
          clearable
          :error="this.Methods_Validation_Check(errors,'color_group_id')"
          clear-icon="fa-duotone fa-light fa-times-circle text-red-8 font-22"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>
                  <span>
                    {{ scope.opt.label }}
                  </span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'color_group_id')" />
        </template>
      </q-select>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input
          :error="this.Methods_Validation_Check(errors,'color')" outlined v-model="items.color" label="انتخاب رنگ"
      >
        <template v-slot:append>
          <q-icon name="fa-duotone fa-light fa-eye-dropper" class="cursor-pointer" color="teal-8">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-color v-model="items.color" />
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'color')" />
        </template>
      </q-input>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-file outlined bottom-slots v-model="items.image" label="انتخاب تصویر رنگ" counter>
        <template v-slot:prepend>
          <q-icon name="fa-duotone fa-light fa-upload" @click.stop.prevent />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click.stop.prevent="items.image = null" class="cursor-pointer" />
        </template>
      </q-file>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 q-pa-xs">
      <q-input  :error="this.Methods_Validation_Check(errors,'description')" outlined v-model="items.description"  type="textarea" rows="4" label="توضیحات">
        <template v-slot:error>
          <global_validations_errors :errors="this.Methods_Validation_Errors(errors,'description')" />
        </template>
      </q-input>
    </div>

    <div class="col-12 q-mt-sm q-pa-xs text-right">
      <q-btn color="grey-8" glossy icon="fa-duotone fa-light fa-times" label="بستن" class="q-mr-sm" v-close-popup></q-btn>
      <q-btn @click="Create_Item" :loading="loading" color="indigo-7" glossy icon="fa-duotone fa-light fa-plus-circle" label="افزودن آیتم جدید"></q-btn>

    </div>
  </div>

</template>

<style scoped>

</style>