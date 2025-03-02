import Invoices from "@/views/invoices/Invoices.vue";

const users = [
    {
        path: '/invoices',
        name: 'invoices',
        component : Invoices,
        meta:{
            title : 'امور مالی',
            subtitle : 'مدیریت فاکتور ها'
        }
    },


]

export default users;