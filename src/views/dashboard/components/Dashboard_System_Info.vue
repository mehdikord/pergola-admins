<script>
import {Stores_Dashboard} from "@/stores/dashboard/dashboard.js";

export default {
  name: "Dashboard_System_Info",
  data(){
    return {
      loading:true,
      items:[]
    }
  },
  mounted() {
    this.Get_Info();
  },
  methods:{
    Get_Info(){
      Stores_Dashboard().System_Info().then(res=>{
        this.items=res.data.result;
        this.loading=false;
      }).catch(error=>{

      })
    }
  }
}
</script>

<template>
  <q-card flat>
    <q-card-section>
      <global_loading_shape v-if="loading"></global_loading_shape>
      <div v-else class="row animation-fade-in">
        <div class="col-md-3 col-lg-3 col-xl-3 q-px-sm">
          <div class="bg-blue-7 q-pa-lg rounded-borders glossy">
            <q-icon name="fa-duotone fa-light fa-users" class="font-36" color="white"></q-icon>
            <strong class="text-white q-ml-md text-grey-3">همه کاربران</strong>
            <strong class="float-right font-20 q-mt-sm text-white">{{items.users}}</strong>
          </div>
        </div>
        <div class="col-md-3 col-lg-3 col-xl-3 q-px-sm">
          <div class="bg-teal-7 q-pa-lg rounded-borders glossy">
            <q-icon name="fa-duotone fa-light fa-user-unlock" class="font-36" color="white"></q-icon>
            <strong class="text-white q-ml-md text-grey-3">کاربران فعال</strong>
            <strong class="float-right font-20 q-mt-sm text-white">{{ items.users_actives }}</strong>
          </div>
        </div>
        <div class="col-md-3 col-lg-3 col-xl-3 q-px-sm">
          <div class="bg-deep-orange-6 q-pa-lg rounded-borders glossy">
            <q-icon name="fa-duotone fa-light fa-messages-question" class="font-36" color="white"></q-icon>
            <strong class="text-white q-ml-md text-grey-3">کل فرایند ها</strong>
            <strong class="float-right font-20 q-mt-sm text-white">{{ items.questions }}</strong>
          </div>
        </div>
        <div class="col-md-3 col-lg-3 col-xl-3 q-px-sm">
          <div class="bg-deep-purple-7 q-pa-lg rounded-borders glossy">
            <q-icon name="fa-duotone fa-light fa-palette" class="font-36" color="white"></q-icon>
            <strong class="text-white q-ml-md text-grey-3">همه رنگ ها</strong>
            <strong class="float-right font-20 q-mt-sm text-white">{{ items.colors }}</strong>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>