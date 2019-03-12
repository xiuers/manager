<template>
  <el-container class="index-container">
    <el-header class="index-header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../assets/logo.png" alt>
          </div>
        </el-col>
        <el-col class="header-center" :span="16">
          <div class="grid-content bg-purple-light">电商后台管理系统</div>
        </el-col>
        <el-col class="header-right" :span="4">
          <div class="grid-content bg-purple">
            <el-button type="danger" @click="logout">退出</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="index-aside">Aside</el-aside>
      <el-main class="index-main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 根据缓存判断没用到数据所以用这个钩子就可以了
  beforeCreate() {
    if (window.sessionStorage.getItem("token")) {
      // token存在，不用管
    } else {
      // 提示用户
      this.$message.warning("不登录，人家不让你访问");
      // 回到登录页，编程式导航
      this.$router.push("/login");
    }
  },
  methods: {
    logout() {
      this.$confirm("你真的真的真的要走吗？(︶︹︺)", "提示", {
        confirmButtonText: "狠心离开",
        cancelButtonText: "决定留下",
        type: "warning"
      })
        .then(() => {
          // 确定
          // 删除token
          window.sessionStorage.removeItem("token");
          // 返回登录页
          this.$router.push("/login");
        })
        .catch(() => {
          // 取消
          this.$message({
            type: "info",
            message: "(｡･㉨･｡)ﾉ♡ 爱你么么哒"
          });
        });
    }
  }
};
</script>

<style>
.index-container {
  height: 100%;
}
.index-header {
  height: 60px;
  background-color: #b3c0d1;
  line-height: 60px;
}
.header-center {
  font-size: 30px;
  text-align: center;
  color: #fff;
  font-weight: 700;
}
.header-right {
  text-align: right;
}
.index-main {
  background-color: #e9eef3;
}
</style>
