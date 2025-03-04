import { defineStore } from 'pinia'
export const Stores_Dashboard = defineStore('dashboard',{
    state : ()=>({}),
    actions : {
        System_Info(){
            return new Promise((resolve, reject) => {
                axios.get('admins/dashboard/info/system').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        System_Colors(){
            return new Promise((resolve, reject) => {
                axios.get('admins/dashboard/info/colors').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
    },

})