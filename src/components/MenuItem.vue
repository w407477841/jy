<template>
  <el-menu-item  :index="menu.url" :key="menu.id">{{menu.txt}}</el-menu-item>
</template>

<script>
export default {
  name: 'MenuItem',
  props:{
  menu: Object
  }
}
</script>

