// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import Vuex from 'vuex'
import App from './layouts/Main'
import router from './router'
import ElementUI from 'element-ui'
import './theme/index.css'
//import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

import jquery from  './js/jquery-1.7.1.min.js'
//import WebVideoCtrl from './js/webVideoCtrl.js'

Vue.prototype.$http = axios
Vue.use(Vuex)
Vue.use(ElementUI)
//Vue.config.productionTip = false
/* eslint-disable no-new */
Vue.prototype.handleOpDetail=function(){
}
const store = new Vuex.Store({
  state: {
    isLogin:false,//是否登录
    token : '',//令牌
    baseUrl : 'http://192.168.0.166:8090',//服务器地址
    username :'',
    factory : 0,
    userType :'',
    themecolor:'#40DCFF',
    menus:[],//导航菜单
    connect: false,//socket是否连接
    need_reconnect:true,//是否需要重连，当退出后就不需要重连
    unseemessage: [],//未读socket消息
    message: [],//已读socket消息
    time:"",
    socket :null,
    stompClient:null 

  },
  mutations: {//存放一组同步方法
    login (state,payload) {
      state.isLogin=true
      state.token=payload.token
      state.username =payload.username
      state.userType =payload.type
      state.factory = payload.factory
      //初始化消息服务
      this.commit('initNotice')
      
    },changeTheme(state,payload){
    	state.themecolor=payload.color
    },
    loadmenu(state,payload){
    	state.menus=payload.menus
    },
    logout (state) {
      state.isLogin=false
      state.token=''
      state.username =''
      state.userType=''
      state.factory= 0
      state.menus=[]
      if(state.connect&&state.stompClient !=null){
      	try{
      	state.stompClient.disconnect(()=>{
      		state.connect=false
      		state.need_reconnect=false
      	})
      	}catch(error){
      		state.connect=false
      		state.need_reconnect=false
      	}
      }
    },
    initNotice(state,payload){//初始化  socket
    				state.socket = new SockJS(state.baseUrl+"/hello");
            state.stompClient = Stomp.over(state.socket)  
            state.stompClient.connect({}, (frame)=> {//success 
            	state.connect=true
            	//订阅广播消息
            this.commit('subscribe',{destination:'/topic/greetings'})
            	//订阅用户消息
						this.commit('subscribe',{destination:'/user/'+state.username+'/message'})
							//广播登录信息
						//this.commit('sendLogin')
            },(frame)=>{//error
            console.log('unconnection')
            if(state.need_reconnect){//如果需要重连
           	 	state.connect=false
            	this.commit('initNotice')
            }
            });
    },
    subscribe(state,payload){//订阅
    	if(state.connect){
    	//先退订，以防订阅两份
    	state.stompClient.unsubscribe(payload.destination)
    	state.stompClient.subscribe(payload.destination,greeting=>{
    	let h= this._vm.$createElement
    	this._vm.$notify({
          title: '注意',
          message: h('i', { style: 'color: red'},JSON.parse(greeting.body).content )
        });
    	state.unseemessage.push({msg:JSON.parse(greeting.body).content,time:new Date()})//将消息存入message
    	})
    	}
    	else{
    		console.log('conect is false2')
    	}
    },
    pushmessage(state){
    	
    	state.message=state.message.concat(state.unseemessage)	
    	state.unseemessage=[]
    },
    sendLogin(state,payload){//广播信息
    	if(state.connect){
    	state.stompClient.send("/app/greetings",{from:state.username},"用户["+state.username+"]登录了！")
    	}else{
    		console.log('conect is false1')
    	}
    },
    sendMessage(state,payload){//私发信息
    		if(state.connect){
    	state.stompClient.send("/app/message",{from:state.username,to:payload.to},payload.msg)
    	}else{
    		console.log('conect is false1')
    	}
    }
    
  }
})
Array.prototype.indexOf1=function (val){
	  for (var i = 0; i < this.length; i++) {
        if (this[i].id == val.id) return i;
    }
	  return -1;
}
Array.prototype.remove=function (val){
	  var index = this.indexOf1(val);
    if (index > -1) {
        this.splice(index, 1);
    }
}
const app = new Vue({
	el:"#app",
	router,
	store ,
 components:{
 	App
 },
 template: '<App/>'
})

