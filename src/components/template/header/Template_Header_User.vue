<script>

import {Stores_Auth} from "@/stores/auth/auth.js";

export default {
  name: "Template_Header_User",

  data(){
    return {
      user : null
    }
  },
  methods:{

  },
  mounted() {
    this.user = Stores_Auth().AuthGetUser
  }

}
</script>

<template>
  <q-btn title="پروفایل کاربری" v-if="user" round :loading="!user">
    <q-avatar rounded size="30px">
      <img v-if="user.profile" :src="user.profile" alt="">
      <img v-else src="assets/images/icons/user.png" alt="">
    </q-avatar>

    <q-menu
        transition-show="flip-right"
        transition-hide="flip-left"
        >
      <q-list style="width: 240px">
        <q-item>
          <q-item-section>
            <div>
              <q-icon name="fa-duotone fa-light fa-user" size="18px" class="q-mr-sm" color="pink-8" /><strong> {{user.name}} </strong>
            </div>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item>
          <q-item-section>
            <div>
              <q-icon name="fa-duotone fa-light fa-envelope" size="18px" class="q-mr-sm" color="green-8" /><span> {{user.email}} </span>
            </div>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable>
          <q-item-section>
            <div>
              <q-icon name="fa-duotone fa-light fa-cog" size="18px" class="q-mr-sm" color="blue-8" /><span> تنظیمات حساب</span>
            </div>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable>
          <q-item-section>
            <div>
              <q-icon name="fa-duotone fa-light fa-sign-out" size="18px" class="q-mr-sm" color="red-8" /><span> خروج از حساب</span>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<style scoped>

</style>