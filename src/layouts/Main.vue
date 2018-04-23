<template>
	
	<el-container>
		<!--el-header :style="'background:'+themecolor"-->
		<el-header>
	<el-menu default-active="4" class="el-menu-demo" mode="horizontal" router >
   <!--
      	第一级 开始
      -->
      <template v-for="m in menus">
      	<Submenu v-if="m.childs&&m.childs.length>0" :menu="m" :key="m.id"></Submenu>
  		<MenuItem v-if="!m.childs||m.childs.length==0" :menu="m" :key="m.id"></MenuItem>
      </template>
  <!--
      	第一级 结束
      -->
      
      	<Notice></Notice>
      	
  		
</el-menu>	
</el-header>
<el-container>
	<router-view/>
</el-container>
	</el-container>
  <!--div class="container">
    <ul>
      <li>
      	<router-link to="/"  slot="left">
      		Home
  		</router-link>
  		<router-link to="/about"  slot="left">
      		About
  		</router-link>
  		<router-link to="/login"  slot="left">
      		Login
  		</router-link>
      </li>
    </ul>
   <router-view/>
  </div-->
</template>

<script>
	/*
  import VLink from '../components/VLink.vue'
  export default {
    components: {
      VLink
    }
  }*/
 import MenuItem from '@/components/MenuItem'
 import Submenu from '@/components/Submenu'
 import Notice from '@/components/Notice'
 export default{
 	
 	created(){
 		
 	},
 	data(){
 		
 		return {
 			module:'menu'
 		}
 	},
 	methods:{
 		back(){
 			this.$router.go(-1)
 		},
 		forward(){
 			this.$router.go(1)
 		}
 		
 		
 	},
    computed:{
    	token(){
    		return this.$store.state.token
    	},
    	menus(){
    		return this.$store.state.menus
    	},themecolor(){
    		return this.$store.state.themecolor
    	}
    },
   components: {
    MenuItem,Submenu,Notice
  }
 	
 }
 
</script>

<style scoped>
</style>