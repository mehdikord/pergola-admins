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
        Category_Index(params){
           return new Promise((resolve, reject) => {
               axios.get('admins/posts/categories',{params : params}).then(response =>{
                   return resolve(response);
               }).catch(error =>{
                   return reject(error);
               })
           })
       },
        Category_All(params){
           return new Promise((resolve, reject) => {
               axios.get('admins/posts/categories/all',{params : params}).then(response =>{
                   return resolve(response);
               }).catch(error =>{
                   return reject(error);
               })
           })
       },
        Remove_File(params){
           return new Promise((resolve, reject) => {
               axios.get('admins/posts/files/remove/'+params.id).then(response =>{
                   return resolve(response);
               }).catch(error =>{
                   return reject(error);
               })
           })
       },
        Add_File(params){
           return new Promise((resolve, reject) => {
               let data = new FormData();
               if (params.file){data.append('file',params.file,params.file.name);}

               axios.post('admins/posts/'+params.id+'/file',data,{
                   headers: { "Content-Type": "multipart/form-data" },
               }).then(response =>{
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
                if (params.post_category_id){data.append('post_category_id',params.post_category_id);}
                if (params.slug){data.append('slug',params.slug);}
                if (params.description){data.append('description',params.description);}
                if (params.image){data.append('image',params.image,params.image.name);}
                if(params.files){
                    params.files.forEach((item, index) => {
                        data.append(`files[${index}][title]`, item.title)
                        data.append(`files[${index}][file]`, item.file)
                    })
                }

                axios.post('admins/posts',data, {
                    headers: { "Content-Type": "multipart/form-data" },
                }).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Category_Create(params){
            return new Promise((resolve, reject) => {
                axios.post('admins/posts/categories',params).then(response =>{
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
        Category_Show(id){
            return new Promise((resolve, reject) => {
                axios.get('admins/posts/categories/'+id).then(response =>{
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
        Category_Edit(params){
            return new Promise((resolve, reject) => {
                axios.put('admins/posts/categories/'+params.id,params).then(response =>{
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
        Category_Delete(id){
            return new Promise((resolve, reject) => {
                axios.delete('admins/posts/categories'+id).then(response =>{
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