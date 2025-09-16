<template>
  <div class="index-root">
    <div class="top">
      <div class="title">
        <span>后台管理</span>
        <i class="el-icon-s-operation"></i>
      </div>
      <div class="poetry">
        <span>{{ poetry.hitokoto }}</span>
        <span class="author" v-if="poetry.from_who != ''"
          >&nbsp;&nbsp;——{{ poetry.from_who }}</span
        >
      </div>
      <div class="info">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link" style="color: #ffffff">
            <a href="javascript:void(0);">Admin<i class="el-icon-arrow-down el-icon--right"></i></a>
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="reset">修改密码</el-dropdown-item>
            <el-dropdown-item command="exit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <img src="@/assets/admin.png" style="width: 20px; margin-left: 10px" />
      </div>
    </div>
    <div class="body">
      <div class="nav">
        <el-menu
          :default-active="activeUrl"
          class="el-menu-vertical-demo"
          background-color="#556D84"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          unique-opened
        >
          <el-menu-item index="/index/indexinfo">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span slot="title">用户管理</span>
            </template>

            <el-menu-item index="/index/student">
              <img src="../assets/student.png" />
              <span>学生管理</span>
            </el-menu-item>
            <el-menu-item index="/index/teacher">
              <img src="../assets/teacher.png" />
              <span>教师管理</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-claim"></i>
              <span>考试管理</span>
            </template>
            <el-menu-item index="/index/course">
              <i class="el-icon-reading"></i>
              <span>课程管理</span>
            </el-menu-item>
            <el-menu-item index="/index/chapter">
              <i class="el-icon-files"></i>
              <span>章节管理</span>
            </el-menu-item>
            <el-menu-item index="/index/question">
              <i class="el-icon-notebook-1"></i>
              <span>试题管理</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>系统设置</span>
            </template>
            <el-menu-item index="/index/notice">
              <i class="el-icon-date"></i>
              <span>公告管理</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="nav-right">
        <div class="tap">
          <el-tag
            effect="dark"
            style="width: 70px; display: flex; justify-content: center"
            >首页</el-tag
          >
        </div>
        <div class="cont">
          <router-view></router-view>
        </div>
      </div>
    </div>

    <el-dialog
      title="修改密码"
      :visible.sync="RestdialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        ref="resetForm"
        :rules="rules"
        :model="resetForm"
        label-width="100px"
      >
        <el-form-item label="账号">
          <el-input v-model="resetForm.adminName" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="adminPwd">
          <el-input
            v-model="resetForm.adminPwd"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="adminPwdNew">
          <el-input
            v-model="resetForm.adminPwdNew"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="resetSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "XiaozhiHouIndex",

  data() {
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.resetForm.adminPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      admin: "",
      tags: [
        { name: "标签二", type: "success" },
        { name: "标签三", type: "info" },
        { name: "标签四", type: "warning" },
        { name: "标签五", type: "danger" },
      ],
      //修改密码
      resetForm: {
        adminName: "admin",
        adminPwd: "",
        adminPwdNew: "",
      },
      rules: {
        adminPwdNew: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
        adminPwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码至少6位", trigger: "blur" },
        ],
      },
      RestdialogVisible: false,

      poetry: "",

      activeUrl: "",
    };
  },

  mounted() {
    let admin = this.$storage.get("admin");
    if (admin == "") {
      this.$router.push("/");
      return;
    }
    this.admin = admin;
    this.getPoetry();

    this.activeUrl = this.$route.path;
    console.log("当前路由路径:", this.activeUrl);
  },

  methods: {
    getPoetry() {
      this.$axios.get("https://v1.hitokoto.cn/?c=i").then((res) => {
        // console.log(res.data);
        this.poetry = res.data;
      });
    },

    handleCommand(command) {
      if (command == "reset") {
        this.reset();
      }
      if (command == "exit") {
        this.exit();
      }
    },
    //修改密码
    resetSubmit() {
      this.$refs.resetForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认修改?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              console.log("resetSubmit");
              this.$axios.post("/admin/reset", this.resetForm).then((res) => {
                console.log(res.data);
                if (res.data.status == "200") {
                  this.$message({
                    message: "修改成功",
                    type: "success",
                    duration: 1000,
                    onClose: () => {
                      this.$storage.clear();
                      this.$router.replace("/");
                    },
                  });
                  this.RestdialogVisible = false;
                } else {
                  this.$message({
                    message: "修改失败",
                    type: "error",
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除",
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleClose() {
      console.log("handleClose");
      this.RestdialogVisible = false;
      this.resetForm = {
        adminName: "",
        adminPwd: "",
      };
    },
    reset() {
      console.log("reset");
      this.RestdialogVisible = true;
    },
    //退出系统
    exit() {
      console.log("exit");
      this.$confirm("是否系统?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$storage.clear();
          this.$router.replace("/");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
@topHeight: 55px;
@navWidth: 200px;

.index-root {
  // background-color: #384585;
  height: 100%;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  .top {
    position: fixed;
    z-index: 100;
    color: #ffffff;

    width: 100%;
    height: @topHeight;

     background-color: #556D84;
/*    background-image: radial-gradient(73% 147%, #eadfdf 59%, #ece2df 100%),
      radial-gradient(
        91% 146%,
        rgba(255, 255, 255, 0.5) 47%,
        rgba(0, 0, 0, 0.5) 100%
      );
    background-blend-mode: screen;*/
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #ebe9e6;
    border-bottom: 0px #c4d6e6 solid;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);

    .title {
      font-size: 20px;
      margin-left: 50px;

      span {
        margin-right: 70px;
      }
    }

    .info {
      margin-right: 20px;
      a{
        color: #ffffff;
      }
    }

    .poetry {
      flex: 2;
      display: flex;
      justify-content: flex-end;
      padding-right: 100px;
      font-family: "jiangxi2", "Courier New", Courier, monospace;
      //color: #8e7d7d;
    }
  }

  .body {
    display: flex;

    .nav {
      position: fixed;
      margin-top: @topHeight;

      width: @navWidth;
      height: 93vh;
      background-color: #556d84;

      img {
        width: 17px;
        margin-right: 10px;
      }
    }

    .nav-right {
      width: 86vw;

      margin-top: @topHeight;
      margin-left: 198px;

      .tap {
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        box-shadow: 0px 4px 8px -7px #888888;

        span {
          margin: 0 10px;
        }
      }

      .cont {
        width: 100%;
      }
    }
  }
}
</style>