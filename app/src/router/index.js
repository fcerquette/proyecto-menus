import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/Users'
import UsersForm from '@/components/UsersForm'
import Menus from '@/components/Menus'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },{
      path: '/home',
      name: 'Home',
      component: Home
    },{
      path:'/users',
      name: 'Users',
      component: Users,
      /*children:[{
        path: 'create',
        name: 'Create',
        component: UsersForm
        },{
          path: 'edit/:id',
          name: 'Edit',
          component: UsersForm
        }]*/
    },{
      path: '/users/create',
      name: 'Create',
      component: UsersForm
      },{
        path: '/users/edit/:id',
        name: 'Edit',
        component: UsersForm
      },{
      path: '/menus',
      name: 'Menus',
      component: Menus
    }
  ]
})
