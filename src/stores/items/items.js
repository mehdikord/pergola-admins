import { defineStore } from 'pinia'
export const Stores_Items = defineStore('items',{
    state : ()=>({}),
    actions : {
        Index(params){
           return new Promise((resolve, reject) => {
               axios.get('admins/answers/options',{params : params}).then(response =>{
                   return resolve(response);
               }).catch(error =>{
                   return reject(error);
               })
           })
       },
        All(){
            return new Promise((resolve, reject) => {
                axios.get('admins/answers/options/all').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Create(params){
            return new Promise((resolve, reject) => {
                axios.post('admins/answers/options',params).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Show(id){
            return new Promise((resolve, reject) => {
                axios.get('admins/answers/options/'+id).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Edit(params){
            return new Promise((resolve, reject) => {
                axios.put('admins/answers/options/'+params.id,params).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

        Delete(id){
            return new Promise((resolve, reject) => {
                axios.delete('admins/answers/options/'+id).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Activation(id){
            return new Promise((resolve, reject) => {
                axios.get('admins/answers/options/'+id+'/activation').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        }

    },
    getters :{

    }




})