import { createRouter, createWebHistory } from 'vue-router'
//import routes
import {Stores_Auth} from "@/stores/auth/auth.js";

import auth from "@/router/routes/auth/auth.js"
import dashboard from "@/router/routes/dashboard/dashboard.js";
import users from "@/router/routes/users/users.js";
import colors from "@/router/routes/colors/colors.js";
import options from "@/router/routes/options/options.js";
import questions from "@/router/routes/questions/questions.js";



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      ...auth,
      ...dashboard,
      ...users,
      ...colors,
      ...options,
      ...questions,

  ],
})






// Check Authenticate
router.beforeEach((to, from, next) => {
    // trying to access a restricted page + not logged in
    // redirect to login page
    if (to.path !== '/authentication' && !Stores_Auth().AuthGetCheckAuth) {
        next('/authentication');
    }else if (to.path === '/authentication' && Stores_Auth().AuthGetCheckAuth){
        next('/');
    }
    else {
        next();
    }
});

export default router
