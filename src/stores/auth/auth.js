import { defineStore } from 'pinia'
export const Stores_Auth = defineStore('auth',{
    state : ()=>({
        user : null,
        token : null
    }),
    actions : {
        AuthLogin(user,token){
            this.user = user;
            this.token = token
            localStorage.setItem('admin_pergola_token', token)
            localStorage.setItem('admin_pergola_user', JSON.stringify(user));
        },

        AuthSyncData(){
            if (localStorage.getItem('admin_pergola_token')){
                this.token = localStorage.getItem('admin_pergola_token');
            }
            if (localStorage.getItem('admin_pergola_user')){
                this.user = JSON.parse(localStorage.getItem('admin_pergola_user'));
            }
        },
        AuthLogout(){
            localStorage.removeItem('admin_pergola_token');
            localStorage.removeItem('admin_pergola_user');
            window.location.reload();
        }
    },
    getters :{
        AuthGetUser(){
            return this.user;
        },
        AuthGetToken(){
            return this.token;
        },
        AuthGetCheckAuth(){
            return !!this.token;
        }




    }




})