<script>
//#TODO Show full and short date by click
export default {
  name: "Global_Filter_Date_Create",
  props:['date'],
  data(){
    return{
      show:false,
      final_date : null
    }
  },
  mounted() {
    this.final_date = this.$filters.date_jalali(this.date,"jYYYY/jM/jD");
  },
  methods:{
    Change(){
      this.show = !this.show;
      if (this.show){
        this.final_date = this.$filters.date_jalali(this.date);
      }else {
        this.final_date = this.$filters.date_jalali(this.date,"jYYYY/jM/jD")
      }
    }
  },
}
</script>

<template>
  <q-chip v-if="final_date" dir="ltr" color="grey-9" text-color="white" size="sm" class="create cursor-pointer">
    <span @click="Change">{{final_date}}</span>

  </q-chip>
</template>

<style scoped>
.create{
  font-size: 12px;
  font-weight: 450;
}
</style>