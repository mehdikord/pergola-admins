import { defineStore } from 'pinia'
export const Stores_invoices = defineStore('invoices',{
    state : ()=>({}),
    actions : {
        Index(params){
           return new Promise((resolve, reject) => {
               axios.get('admins/invoices',{params : params}).then(response =>{
                   return resolve(response);
               }).catch(error =>{
                   return reject(error);
               })
           })
       },
    },
    getters :{

    }




})
