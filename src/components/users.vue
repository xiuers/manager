<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="MianBaoXie">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 栅格布局 搜索栏 -->
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <!-- el-input最终生成的是一个div包着的一个input，
          不可以直接使用 @keyup.enter事件
          必须用 @keyup.native.enter-->
          <el-input
            placeholder="请输入内容"
            @keyup.native.enter="search"
            v-model="sendData.query"
            class="input-with-select"
          >
            <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content bg-purple-light">
          <!-- 添加按钮 plain是朴素样式 -->
          <el-button type="success" @click="addFormVisiable=true" plain>添加</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border>
      <!-- 默认值是布尔值true的属性，直接添加属性名就可以了 -->
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- template告诉饿了么ui这里我要自己写，
        表单自定义模板规定了只有通过scope才能获取到表单数据，
        slot-scope属性是vue提供的一个作用域插槽，
        scope是当前数据别名，指令数据开头必须要保持跟它一致-->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="changeStatus(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 因为编辑用户对话框在点击按钮之后就要立马获取数据渲染页面，
          所以弹出对话框和调用接口渲染页面就要几乎同时运行，
          就不能单单的弹出对话框，只有调用封装好的方法才能同时完成任务 -->
          <el-button
            type="primary"
            @click="updateOne(scope.row)"
            icon="el-icon-edit"
            size="mini"
            plain
          ></el-button>
          <el-button
            type="danger"
            @click="delOne(scope.row)"
            icon="el-icon-delete"
            size="mini"
            plain
          ></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    ></el-pagination>
    <!-- 对话框 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addFormVisiable">
      <el-form
        :model="addFormData"
        :rules="rules"
        label-position="right"
        label-width="80px"
        class="my-form"
        status-icon
        ref="addForm"
      >
        <!-- status-icon 输入框验证结果反馈的图标 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFormData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFormData.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFormData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addFormData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="updateFormVisiable">
      <el-form
        :model="updateFormData"
        :rules="rules"
        label-position="right"
        label-width="80px"
        class="my-form"
        status-icon
        ref="updateForm"
      >
        <!-- status-icon 输入框验证结果反馈的图标 -->
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="updateFormData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateFormData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="updateFormData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('updateForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义的邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      // 延迟验证
      setTimeout(() => {
        // 定义正则表达式
        let reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        // 验证是否匹配
        if (reg.test(value)) {
          // 格式匹配
          callback();
        } else {
          // 不匹配
          callback(new Error("请正确输入邮箱"));
        }
      }, 1000);
    };
    // 自定义的电话校验规则
    var checkMobile = (rule, value, callback) => {
      // 延迟验证
      setTimeout(() => {
        // 定义正则表达式
        let reg = /^(0|86|17951)?(13[0-9]|15[0123456789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
        // 验证是否匹配
        if (reg.test(value)) {
          // 格式匹配
          callback();
        } else {
          // 不匹配
          callback(new Error("请正确输入手机号"));
        }
      }, 1000);
    };
    return {
      // 提交的数据
      sendData: {
        query: "",
        pagenum: "1",
        pagesize: "10"
      },
      // table数据
      tableData: [],
      // 标记新增用户框是否显示
      addFormVisiable: false,
      // 标记编辑用户框是否显示
      updateFormVisiable: false,
      // 新增用户的表单数据
      addFormData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 编辑用户的表单数据
      updateFormData: {
        username: "",
        email: "",
        mobile: ""
      },
      // 新增用户的表单数据验证
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }]
      }
    };
  },
  // 方法Data
  methods: {
    // 查询用户列表的数据
    async search() {
      let res = await this.$http.get("users", { params: this.sendData });
      // 因为请求拦截器已经设置统一添加token，所以这里不用添加token
      // console.log(res);
      // 把获取到的数据赋值给用户列表的表单数据
      this.tableData = res.data.data.users;
    },
    // 新增用户的表单验证
    submitForm(formName) {
      // 先判断数据是否正确
      this.$refs[formName].validate(async valid => {
        // 数据正确
        if (valid) {
          // 提交数据
          // 提升res声明
          let res;
          if (formName == "addForm") {
            res = await this.$http.post("users", this.addFormData);
          } else if (formName == "updateForm") {
            // 因为在updateOne()方法中已经把获取到的所有数据赋值给了updateFormData,
            // 所以这里可以直接点出this.updateFormData.id
            res = await this.$http.put(`users/${this.updateFormData.id}`,this.updateFormData);
          }
          // 如果数据返回成功了
          if (res.data.meta.status == "201" || res.data.meta.status == "200") {
            // 再重新获取数据
            this.search();
            // 然后收起添加用户弹框
            this.addFormVisiable = false;
            // 然后收起编辑用户弹框
            this.updateFormVisiable = false;
          }
        } else {
          // 数据错误
          this.$message.error("请正确输入数据！");
          return false;
        }
      });
    },
    // 用户列表switch改变状态
    async changeStatus(item) {
      // 调用接口
      let res = await this.$http.put(`users/${item.id}/state/${item.mg_state}`);
    },
    // 用户列表的编辑数据
    async updateOne(item) {
      // 弹框
      this.updateFormVisiable = true;
      // 调用接口获取数据
      let res = await this.$http.get(`users/${item.id}`);
      // 把获取到的数据赋值给编辑的表单数据
      this.updateFormData = res.data.data;
    },
    // 用户列表的删除数据
    delOne(item) {
      this.$confirm("你真的真的不要人家了吗?", "提示", {
        confirmButtonText: "狠下心肠",
        cancelButtonText: "良心发现",
        type: "warning"
      })
        .then(async () => {
          // 确认删除
          let res = await this.$http.delete(`users/${item.id}`);
          // console.log(res);
          // 如果数据返回成功了
          if (res.data.meta.status == 200) {
            // 再重新获取数据
            this.search();
          }
        })
        .catch(() => {
          // 不删除
          this.$message({
            type: "info",
            message: "(｡･㉨･｡)ﾉ♡ 爱你么么哒"
          });
        });
    }
  },
  // 获取用户列表的数据
  created() {
    this.search();
  }
};
</script>
<style>
.MianBaoXie {
  height: 45px;
  line-height: 45px;
  background-color: #d3dce6;
}
.el-form.my-form {
  height: auto;
  padding: 0;
}
.el-dialog {
  width: 666px;
}
</style>