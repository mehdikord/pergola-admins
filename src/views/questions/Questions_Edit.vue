<script>
import {Stores_Questions} from "@/stores/questions/questions.js";
import {Stores_Colors} from "@/stores/colors/colors.js";
import {Stores_Options} from "@/stores/options/options.js";

export default {
  name: "Questions_Edit",
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
      loading: true,
      edit_loading: false,
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
    Get_Item() {
      Stores_Questions().Show(this.items).then(response => {

        this.loading = false;
      }).catch(error => {

        this.loading=false;
      });




    },
    Edit_Item() {
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

</template>

<style scoped>

</style>