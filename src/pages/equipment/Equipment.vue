<template>
	<div class="container">
	<el-row >
  <el-col :span="4">
<el-switch
  v-model="isCollapse"
 >
</el-switch>
    <el-menu
      class=""
      router
       :collapse="isCollapse"
      >
      <el-menu-item index="/equipment/plc">
        <i class="el-icon-menu"></i>
        <span slot="title">plc配置</span>
      </el-menu-item>
      <el-menu-item index="/equipment/plc" >
        <i class="el-icon-document"></i>
        <span slot="title">仪器配置</span>
      </el-menu-item>
      <!--el-menu-item index="/equipment" @click="video">
        <i class="el-icon-setting"></i>
        <span slot="title">视频配置</span>
      </el-menu-item-->
      <el-menu-item index="/equipment/video" >
        <i class="el-icon-setting"></i>
        <span slot="title">视频配置</span>
      </el-menu-item>
    </el-menu>
  </el-col>
  <el-col :span="12">
	<router-view/>
  </el-col>
</el-row>
</div>
</template>

<script>
	 export default {
    data() {
      return {
        isCollapse: false
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      video(v){
      	window.open('http://192.168.0.166:8090/html/demo.html')
      }
    }
  }
</script>

<style>
		.container{
		width:100%;
		margin-top: 20px;
	}
	.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>