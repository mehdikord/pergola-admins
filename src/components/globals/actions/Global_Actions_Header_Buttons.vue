<script>
export default {
  name: "Global_Actions_Header_Buttons",
  props:['index','create','archive']
}
</script>

<template>


    <q-btn v-if="create" @click="this.$emit('Create','ok')" class="float-right" color="indigo-8"  glossy icon="fa-duotone fa-light fa-plus" size="11px" round>
      <q-tooltip  transition-show="scale" transition-hide="scale" class="bg-blue-grey-9 font-12">
        افزودن آیتم
      </q-tooltip>
    </q-btn>
    <q-btn v-if="index" @click="this.$emit('Index','ok')" class="float-right q-mr-sm" color="blue-8"  glossy icon="fa-duotone fa-light fa-list" size="11px" round>
      <q-tooltip  transition-show="scale" transition-hide="scale" class="bg-blue-grey-9 font-12">
        لیست موراد
      </q-tooltip>
    </q-btn>
    <q-btn v-if="archive"  class="float-right q-mr-sm" color="red-8"  glossy icon="fa-duotone fa-light fa-archive" size="11px" round>
      <q-tooltip  transition-show="scale" transition-hide="scale" class="bg-blue-grey-9 font-12">
        آرشیو شده
      </q-tooltip>
    </q-btn>




</template>

<style scoped>

</style>