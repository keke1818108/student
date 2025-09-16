import Vue from 'vue'
import VueRouter from 'vue-router'

import login from "../views/login.vue"
import index from "../views/index.vue"


Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "index-login",
    component: login
  },
  {
    path: "/index",
    name: "index",
    component: index,
    children: [
      {
        path: "indexinfo",
        name: "indexinfo",
        component: () => import("../views/nav/indexinfo.vue")
      },

      {
        path: "teacher",
        name: "teacher",
        component: () => import("../views/nav/user/teacher.vue")
      }, {
        path: "student",
        name: "student",
        component: () => import("../views/nav/user/student.vue")
      },

      {
        path: "question",
        name: "question",
        component: () => import("../views/nav/examation/question.vue")
      },
      {
        path: "examPaper",
        name: "examPaper",
        component: () => import("../views/nav/examation/examPaper.vue")
      },
      {
        path: "course",
        name: "course",
        component: () => import("../views/nav/examation/course.vue")
      },
      {
        path: "chapter",
        name: "chapter",
        component: () => import("../views/nav/examation/chapter.vue")
      },
      {
        path: "notice",
        name: "notice",
        component: () => import("../views/nav/system/notice.vue")
      },
    ]
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//解决vue-router重复点击报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) { return originalPush.call(this, location).catch((err) => err) }
export default router
