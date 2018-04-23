<template>
	<el-row>
  <template v-for="m in menus">
		<el-checkbox  :label="m.id" :key="m.id">{{m.txt}}</el-checkbox>
		<Checkbox v-if="m.childs&&m.childs.length>0" :menus="m.childs" :label="m.id" :key="m.id">{{m.txt}}</Checkbox>  	
  </template>
  </el-row>
</template>

<script>
	import Checkbox from '@/components/Checkbox'
export default {
  name: 'Checkbox',
  props:{
  menus: Array
  },components:{
  	Checkbox
  }
}
</script>

