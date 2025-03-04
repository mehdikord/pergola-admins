<script>
import { Stores_Auth } from "/src/stores/auth/auth.js"
import Dashboard_System_Info from "@/views/dashboard/components/Dashboard_System_Info.vue";
import Dashboard_System_Colors from "@/views/dashboard/components/Dashboard_System_Colors.vue";
export default {
  name: "Dashboard",
  components : {
    'system_info' : Dashboard_System_Info,
    'system_colors' : Dashboard_System_Colors
  }


}
</script>

<template>
  <system_info></system_info>
  <system_colors class="q-mt-md"></system_colors>


</template>

<style scoped>

</style>