import Questions from "@/views/questions/Questions.vue";
import Questions_Create from "@/views/questions/Questions_Create.vue";
import Questions_Edit from "@/views/questions/Questions_Edit.vue";

const users = [
    {
        path: '/questions',
        name: 'questions',
        component : Questions,
        meta:{
            title : 'پرسش ها',
            subtitle : 'مدیریت پرسش ها'
        }
    },
    {
        path: '/questions/create',
        name: 'questions_create',
        component : Questions_Create,
        meta:{
            title : 'پرسش ها',
            subtitle : 'ایجاد پرسش '
        }
    },
    {
        path: '/questions/edit/:id',
        name: 'questions_edit',
        component : Questions_Edit,
        meta:{
            title : 'پرسش ها',
            subtitle : 'ویرایش پرسش '
        }
    },


]

export default users;