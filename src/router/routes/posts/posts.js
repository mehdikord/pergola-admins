import Colors from "@/views/colors/Colors.vue";
import Posts from "@/views/posts/Posts.vue";

const users = [
    {
        path: '/posts',
        name: 'posts',
        component : Posts,
        meta:{
            title : 'نوشته ها',
            subtitle : 'مدیریت نوشته ها'
        }
    },


]

export default users;