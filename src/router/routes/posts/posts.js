import Colors from "@/views/colors/Colors.vue";
import Posts from "@/views/posts/Posts.vue";
import Posts_Category from "@/views/post_categories/Posts_Category.vue";

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
    {
        path: '/posts/categories',
        name: 'posts_categories',
        component : Posts_Category,
        meta:{
            title : 'محتوا',
            subtitle : 'مدیریت دسته بندی نوشته ها'
        }
    },


]

export default users;