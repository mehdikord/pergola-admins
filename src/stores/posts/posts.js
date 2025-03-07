import { defineStore } from 'pinia'
export const Stores_Posts = defineStore('posts',{
    state : ()=>({}),
    actions : {
        Index(params){
           return new Promise((resolve, reject) => {
               axios.get('admins/posts',{params : params}).then(response =>{
                   return resolve(response);
               }).catch(error =>{
                   return reject(error);
               })
           })
       },

        Create(params){
            return new Promise((resolve, reject) => {
                let data = new FormData();

                if (params.title){data.append('title',params.title);}
                if (params.slug){data.append('slug',params.slug);}
                if (params.description){data.append('description',params.description);}
                if (params.image){data.append('image',params.image,params.image.name);}
                axios.post('admins/posts',params, {
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
                axios.get('admins/posts/'+id).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Edit(params){
            return new Promise((resolve, reject) => {
                axios.put('admins/posts/'+params.id,params).then(response =>{
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
                axios.post('admins/posts/'+params.id+'/image',params,{
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
                axios.delete('admins/posts/'+id).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Activation(id){
            return new Promise((resolve, reject) => {
                axios.get('admins/posts/'+id+'/activation').then(response =>{
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