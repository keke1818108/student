import Vue from 'vue'
import VueRouter from 'vue-router'

import login from "../components/login.vue"
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
        path: "",
        name: "personalInfo",
        component: () => import("@/views/student/personalInfo")
      },
      {
        path: "personalInfo",
        name: "personalInfo",
        component: () => import("@/views/student/personalInfo")
      },

      // 老师
      {
        path: "courseInfo",
        name: "courseInfo",
        component: () => import("@/views/student/courseInfo")
      },
      {
        path: "testPaperInfo",
        name: "testPaperInfo",
        component: () => import("@/views/student/testPaperInfo")
      },

      //教师
      {
        path: "courseInfoT",
        name: "courseInfoT",
        component: () => import("@/views/teacher/courseInfo")
      },
      {
        path: "testPaperInfoT",
        name: "testPaperInfoT",
        component: () => import("@/views/teacher/testPaperInfo")
      },
      {
        path: "questionInfoT",
        name: "questionInfoT",
        component: () => import("@/views/teacher/questionInfo")
      },
      {
        path: "scoreT",
        name: "scoreT",
        component: () => import("@/views/teacher/scoreT")
      },
      {
        path: "scoreS",
        name: "scoreS",
        component: () => import("@/views/student/scoreS")
      },
    ]
  },
  {
    path: "/testPaperDetail",
    name: "testPaperDetail",
    component: () => import("@/views/student/testPaperDetail"),
    props: true
  },
  {
    path: "/viewTest",
    name: "viewTest",
    component: () => import("@/views/student/viewTestPaperDetail"),
    props: true
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/test")
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
