<template>
  	<el-submenu v-show="menu.childs&&menu.childs.length>0" :index="'index'+menu.id" :key="menu.id">
  		<template slot="title">{{menu.txt}}</template>
  		<template v-for="m  in  menu.childs" >
  		<Submenu v-if="m.childs&&m.childs.length>0" :menu="m" :key="m.id"></Submenu>
  		<MenuItem v-if="!m.childs||m.childs.length==0" :menu="m" :key="m.id"></MenuItem>
  		</template>
  	</el-submenu>
</template>

<script>
import MenuItem from '@/components/MenuItem'	
import Submenu from '@/components/Submenu'
export default {
  name: 'Submenu',
  props:{
  menu: Object
  },
   components: {
    Submenu,
    MenuItem
  }
}
</script>

