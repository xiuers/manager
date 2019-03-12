<template>
  <div class="login">
    <el-form
      :model="formData"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      label-position="top"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model.trim="formData.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model.trim="formData.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          // required必填项 message提示信息 trigger触发方式
          { required: true, message: "请正确输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在3到8个字符", trigger: "blur" }
        ],
        password: [
          // required必填项 message提示信息 trigger触发方式
          { required: true, message: "请正确输入用户名", trigger: "blur" },
          { min: 6, max: 12, message: "长度在6到12个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert("submit!");
          // 数据正确
        } else {
          // console.log("error submit!!");
          // 数据错误
          this.$message.error('请正确输入用户名和密码！');
          return false;
        }
      });
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
body > div:first-of-type {
  height: 100%;
}
.login {
  background-color: #324152;
  display: flex;
  /* 左右居中 */
  justify-content: center;
  /* 上下居中 */
  align-items: center;
  height: 100%;
}
.el-form {
  width: 580px;
  height: 440px;
  background-color: #fff;
  padding: 40px;
  border-radius: 10px;
}
.login-btn {
  width: 100%;
}
</style>