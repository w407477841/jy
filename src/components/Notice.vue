<template>
<el-badge :value="quantity" class="item" :hidden="hidden" :max="99">
	    <el-menu-item index="/message" @click="handleClick">
      	消息
      </el-menu-item>
</el-badge>
</template>

<script>
export default {
  name: 'Notice',
  created(){
  	 
  },
  data(){
  	return {
  		
  		hidden : false,
  		socket : null,
  		stompClient : null,
  		username : 'admin'
  	}
  },
  methods:{
  	handleClick(){
  		this.$store.commit('pushmessage')
  		this.$router.push({ path: ('/messages') })
  	},
  	connect(){
  	}
  },
  props:{
  },
  computed:{
  	quantity(){
  		return 	this.$store.state.unseemessage.length	
  	}
  }
}
</script>

<style scoped="scoped">
	.item {
  margin-top: 3px;
  margin-right: 40px;
}
</style>