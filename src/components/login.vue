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
          { required: true, message: "请正确输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在6到12个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 提交前的数据验证
    submitForm(formName) {
      // 先初步判断数据格式是否正确
      this.$refs[formName].validate(valid => {
        // 格式正确
        if (valid) {
          // 然后再调用接口判断数据是否真的正确
          this.$http.post("login",this.formData).then(res=>{
            // console.log(res);
            if (res.data.meta.status == 400) {
              // 数据错误，弹框提示错误原因
              this.$message.error(res.data.meta.msg);
            }else{
              // 数据正确，弹框提示登录成功
              this.$message.success(res.data.meta.msg);
              // 保存token
              window.sessionStorage.setItem('token',res.data.data.token)
              // 去首页  代码式跳转，编程式导航，实际页面没有跳转
              this.$router.push('/');
            }
          })
        } else {
          // 格式错误
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