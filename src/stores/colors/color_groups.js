import { defineStore } from 'pinia'
export const Stores_Color_Group = defineStore('color_group',{
    state : ()=>({}),
    actions : {
        Index(params){
           return new Promise((resolve, reject) => {
               axios.get('admins/colors/groups',{params : params}).then(response =>{
                   return resolve(response);
               }).catch(error =>{
                   return reject(error);
               })
           })
       },

        All(){
            return new Promise((resolve, reject) => {
                axios.get('admins/colors/groups/all').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Create(params){
            return new Promise((resolve, reject) => {
                axios.post('admins/colors/groups',params).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Show(id){
            return new Promise((resolve, reject) => {
                axios.get('admins/colors/groups/'+id).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Edit(params){
            return new Promise((resolve, reject) => {
                axios.put('admins/colors/groups/'+params.id,params).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

        Delete(id){
            return new Promise((resolve, reject) => {
                axios.delete('admins/colors/groups/'+id).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Activation(id){
            return new Promise((resolve, reject) => {
                axios.get('admins/colors/groups/'+id+'/activation').then(response =>{
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