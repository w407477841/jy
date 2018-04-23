Vue-cli构建单页应用

1、安装node 2、在使用npm之前，最好把镜像换成淘宝的,长久使用，跑一下命令：npm config set registry https://registry.npm.taobao.org、 替换成功后跑npm config get registry命令显示淘宝镜像路径的话就代表替换成功。 3、全局安装vue-cli，在命令窗口输入npm install -g vue-cli，然后跑vue -V出现版本号证明安装成功。 4、生成项目 ：vue init webpack Vue-Project（项目名称） 项目配置 vue-router选择yes，其他no 最后选择自己执行

      npm install

安装依赖

      npm install

本地开发跑代码

      npm run dev

打包

      npm run build

修改端口

      config/index.js

引入sass预编译工具

      npm install node-sass --save-dev
      
      npm install sass-loader --save-dev

引入axios接口请求框架

      npm install axios --save-dev,npm install qs --save-dev;

引入element-ui 前端框架

      npm install element-ui --save-dev

引入 vuex状态管理

      npm install vuex --save-dev
      
      --导入HBULIDER -现有的文件夹作为新项目

