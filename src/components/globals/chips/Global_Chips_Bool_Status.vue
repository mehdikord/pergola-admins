<script>
export default {
  name: "Global_Chips_Bool_Status",
  props : ['status']
}
</script>

<template>
  <q-chip size="sm" class="font-12" v-if="status" color="green-7" text-color="white" label="فعال" icon-right="fas fa-check"></q-chip>
  <q-chip size="sm" class="font-12" v-else color="red" text-color="white" label="غیرفعال" icon-right="fas fa-times"></q-chip>
</template>

<style scoped>

</style>
