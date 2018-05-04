import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Login from '@/pages/Login'
import Password from '@/pages/Password'
import Register from '@/pages/Register'
import PersonalInfo from '@/pages/PersonalInfo'
import Messages from '@/pages/Messages'
import Phone from '@/pages/Phone'
import User from '@/pages/user/User'
import UserAdd from '@/pages/user/Add'
import UserEdit from '@/pages/user/Edit'
import Role from '@/pages/role/Role'
import RoleAdd from '@/pages/role/Add'
import RoleEdit from '@/pages/role/Edit'
import RoleRight from '@/pages/role/Right'
import Right from '@/pages/right/Right'
import RightAdd from '@/pages/right/Add'
import RightEdit from '@/pages/right/Edit'
import Menu from '@/pages/menu/Menu'
import MenuAdd from '@/pages/menu/Add'
import MenuEdit from '@/pages/menu/Edit'
import MenuImage from '@/pages/menu/Image'
import Log from '@/pages/log/Log'
import Job from '@/pages/job/Job'
import JobAdd from '@/pages/job/Add'
import JobEdit from '@/pages/job/Edit'
import ShangjiGeren from '@/pages/shangji/Geren'
import ShangjiStart from '@/pages/shangji/Start'
import ShangjiShenpi from '@/pages/shangji/Shenpi'
import ShangjiBianhao from '@/pages/shangji/Bianhao'
import ShangjiGongshi from '@/pages/shangji/Gongshi'
import ShangjiHuiyituijin from '@/pages/shangji/huiyituijin'
import Todotasks from '@/pages/flow/Todotasks'
import LoadForm from '@/pages/flow/LoadForm'
import Factory from '@/pages/factory/Factory'
import FactoryAdd from '@/pages/factory/Add'
import FactoryEdit from '@/pages/factory/Edit'
import Equipment from '@/pages/equipment/Equipment'
import PLC from '@/pages/equipment/PLC'
import Video from '@/pages/equipment/video/Video'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },   
    {
      path: '/about',
      name: 'About',
      component: About
    },{
    	path:'/login',
    	name:'Login',
    	component: Login
    },{
    	path:'/password',
    	name:'Password',
    	component: Password
    },{
    	path:'/register',
    	name:'Register',
    	component: Register
    },{
    	path:'/personalinfo',
    	name:'PersonalInfo',
    	component: PersonalInfo
    },{
    	path:'/messages',
    	name:'Messages',
    	component: Messages
    },{
    	path:'/phone',
    	name:'Phone',
    	component: Phone
    },{
    	path:'/user',
    	name:'User',
    	component: User
    },{
    	path:'/user/add',
    	name:'UserAdd',
    	component: UserAdd
    },{
    	path:'/user/edit/:id',
    	name:'UserEdit',
    	component: UserEdit
    },{
    	path:'/role',
    	name:'Role',
    	component: Role
    },{
    	path:'/role/add',
    	name:'RoleAdd',
    	component: RoleAdd
    },{
    	path:'/role/edit/:id',
    	name:'RoleEdit',
    	component: RoleEdit
    },{
    	path:'/role/right/:id',
    	name:'RoleRight',
    	component: RoleRight
    },{
    	path:'/right',
    	name:'Right',
    	component: Right
    },{
    	path:'/right/add',
    	name:'RightAdd',
    	component: RightAdd
    },{
    	path:'/right/edit/:id',
    	name:'RightEdit',
    	component: RightEdit
    },{
    	path:'/menu',
    	name:'Menu',
    	component: Menu
    },{
    	path:'/menu/add',
    	name:'MenuAdd',
    	component: MenuAdd
    },{
    	path:'/menu/edit/:id',
    	name:'MenuEdit',
    	component: MenuEdit
    },{
    	path:'/menu/image',
    	name:'MenuImage',
    	component: MenuImage
    },{
    	path:'/log',
    	name:'Log',
    	component: Log
    },{
    	path:'/job',
    	name:'Job',
    	component: Job
    },{
    	path:'/job/add',
    	name:'JobAdd',
    	component: JobAdd
    },{
    	path:'/job/edit/:id',
    	name:'JobEdit',
    	component: JobEdit
    },{
    	path:'/shangji/geren',
    	name:'ShangjiGeren',
    	component: ShangjiGeren
    },{
    	path:'/shangji/gongshi',
    	name:'ShangjiGongshi',
    	component: ShangjiGongshi
    },{
    	path:'/shangji/start',
    	name:'ShangjiStart',
    	component: ShangjiStart
    },{
    	path:'/flow/todotasks',
    	name:'Todotasks',
    	component: Todotasks
    },{
    	path:'/flow/loadform/:taskid',
    	name:'LoadForm',
    	component: LoadForm,
    	 children: [
          {path: 'shangji/shenpi/:id', component:ShangjiShenpi },
          {path: 'shangji/bianhao/:id', component:ShangjiBianhao },
          {path: 'shangji/huiyituijin/:id', component:ShangjiHuiyituijin }
        ]
    },{
    	path:'/factory',
    	name:'Factory',
    	component: Factory
    },{
    	path:'/factory/add',
    	name:'FactoryAdd',
    	component: FactoryAdd
    },{
    	path:'/factory/edit/:id',
    	name:'FactoryEdit',
    	component: FactoryEdit
    },{
    	path:'/equipment',
    	name:'Equipment',
    	component: Equipment,
    	 children: [
          {path: 'plc', component:PLC },
          {path: 'video', component:Video }
        ]
    }
  ]
})
