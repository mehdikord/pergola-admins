import { defineStore } from 'pinia'
export const Stores_Colors = defineStore('colors',{
    state : ()=>({}),
    actions : {
        Index(params){
           return new Promise((resolve, reject) => {
               axios.get('admins/colors',{params : params}).then(response =>{
                   return resolve(response);
               }).catch(error =>{
                   return reject(error);
               })
           })
       },

        Searchable(){
            return new Promise((resolve, reject) => {
                axios.get('admins/colors/searchable').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

        All(){
            return new Promise((resolve, reject) => {
                axios.get('admins/colors/all').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Create(params){
            return new Promise((resolve, reject) => {

                let data = new FormData();
                if (params.color_group_id){data.append('color_group_id',params.color_group_id);}
                if (params.name){data.append('name',params.name);}
                if (params.color){data.append('color',params.color);}
                if (params.description){data.append('description',params.description);}
                if (params.image){data.append('image',params.image,params.image.name);}
                axios.post('admins/colors',params, {
                    headers: { "Content-Type": "multipart/form-data" },
                }).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Show(id){
            return new Promise((resolve, reject) => {
                axios.get('admins/colors/'+id).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Edit(params){
            return new Promise((resolve, reject) => {
                axios.put('admins/colors/'+params.id,params).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Edit_image(params){
            return new Promise((resolve, reject) => {
                let data = new FormData();
                if (params.image){data.append('image',params.image,params.image.name);}
                axios.post('admins/colors/'+params.id+'/image',params,{
                    headers: { "Content-Type": "multipart/form-data" },
                }).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

        Delete(id){
            return new Promise((resolve, reject) => {
                axios.delete('admins/colors/'+id).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Activation(id){
            return new Promise((resolve, reject) => {
                axios.get('admins/colors/'+id+'/activation').then(response =>{
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