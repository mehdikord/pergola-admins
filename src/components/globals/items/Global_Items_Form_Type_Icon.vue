<script>
export default {
  name: "Global_Items_Form_Type_Icon",
  props:['type']
}
</script>

<template>
  <q-icon color="teal-7" v-if="type === 'text'" name="fa-duotone fa-light fa-file-lines" size="sm"/>
  <q-icon color="teal-7" v-if="type === 'number'" name="fa-duotone fa-light fa-hashtag"  size="sm" />
  <q-icon color="teal-7" v-if="type === 'select'" name="fa-duotone fa-light fa-table-list"  size="sm" />
  <q-icon color="teal-7" v-if="type === 'checkbox'" name="fa-duotone fa-light fa-square-check"  size="sm" />
  <q-icon color="teal-7" v-if="type === 'textarea'" name="fa-duotone fa-light fa-file"  size="sm" />
  <q-icon color="teal-7" v-if="type === 'email'" name="fa-duotone fa-light fa-envelope"  size="sm" />
  <q-icon color="teal-7" v-if="type === 'password'" name="fa-duotone fa-light fa-lock"  size="sm" />

</template>

<style scoped>

</style>