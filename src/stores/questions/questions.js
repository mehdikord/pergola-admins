import { defineStore } from 'pinia'
export const Stores_Questions = defineStore('questions',{
    state : ()=>({}),
    actions : {
        Index(params){
           return new Promise((resolve, reject) => {
               axios.get('admins/questions',{params : params}).then(response =>{
                   return resolve(response);
               }).catch(error =>{
                   return reject(error);
               })
           })
       },
        Create(params){
            return new Promise((resolve, reject) => {
                axios.post('admins/questions',params).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Show(id){
            return new Promise((resolve, reject) => {
                axios.get('admins/questions/'+id).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Edit(params){
            return new Promise((resolve, reject) => {
                axios.put('admins/questions/'+params.id,params).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Edit_Answers(params){
            return new Promise((resolve, reject) => {
                axios.post('admins/questions/'+params.id+"/answers",params).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

        Delete(id){
            return new Promise((resolve, reject) => {
                axios.delete('admins/questions/'+id).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Activation(id){
            return new Promise((resolve, reject) => {
                axios.get('admins/questions/'+id+'/activation').then(response =>{
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