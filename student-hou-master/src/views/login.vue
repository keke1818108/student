<template>
    <div class="login-root">
        <div class="top">
            <div @click="iMethod()">
                <i class="el-icon-place"></i>
            </div>
        </div>
        <div class="cont">
            <el-card>
                <div class="login">
                    <div class="wallpaper"></div>
                    <div class="loginForm">
                        <el-form ref="loginform" :rules="rules" :model="loginform" label-width="60px">
                            <el-form-item label="账号" prop="adminName">
                                <el-input v-model="loginform.adminName" placeholder="请输入账号"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="adminPwd">
                                <el-input v-model="loginform.adminPwd" placeholder="请输入密码" show-password></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="medium" @click="onSubmit">登录</el-button>
                            </el-form-item>
                        </el-form>
                        <div class="tip">
                            <div class="info">Tips：管理员登录</div>
                            <a class="reset" href="#" @click="dialogVisible = true">重置密码</a>
                        </div>

                    </div>
                </div>
            </el-card>
        </div>

        <el-dialog title="重置密码" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
            <el-form ref="resetForm" :rules="rules" :model="resetForm" label-width="100px">
                <el-form-item label="账号" prop="adminName">
                    <el-input v-model="resetForm.adminName" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="adminPwd">
                    <el-input v-model="resetForm.adminPwd" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="adminPwdNew">
                    <el-input v-model="resetForm.adminPwdNew" placeholder="请输入密码"></el-input>
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
    name: 'XiaozhiHouLogin',

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
            loginform: {
                adminName: "",
                adminPwd: ""
            },
            resetForm: {
                adminName: "",
                adminPwd: "",
                adminPwdNew: ""
            },
            rules: {
                adminPwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '密码至少6位', trigger: 'blur' }
                ],
                adminPwdNew: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { required: true, validator: validatePass2, trigger: "blur" },
                ],
                adminName: [
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ]
            },
            dialogVisible: false,
        };
    },

    mounted() {
        if (this.$storage.get("admin") !== '') {
            this.$router.replace("/index/indexinfo")
        }
    },

    methods: {
        //重置密码
        resetSubmit() {
            this.$refs.resetForm.validate((valid) => {
                if (valid) {

                    this.$confirm('确认重置?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        console.log("resetSubmit");
                        this.$axios.post("/admin/reset", this.resetForm)
                            .then(res => {
                                console.log(res.data);
                                if (res.data.status == '200') {
                                    this.$message({
                                        message: "重置成功",
                                        type: "success"
                                    });
                                    this.dialogVisible = false;
                                } else {
                                    this.$message({
                                        message: "重置失败",
                                        type: "error"
                                    });
                                }
                            })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });

                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleClose() {
            console.log("handleClose");
            this.dialogVisible = false
            this.resetForm = {
                adminName: "",
                adminPwd: ""
            }
        },

        // 登录
        onSubmit() {
            console.log("onSubmit");
            this.$refs.loginform.validate((valid) => {
                if (valid) {
                    this.$axios.get("/admin/login?adminName=" + this.loginform.adminName.trim() + "&adminPwd=" + this.loginform.adminPwd.trim())
                        .then(res => {
                            console.log(res.data);
                            if (res.data.status == "200") {
                                let data = res.data.data;
                                this.$message({
                                    message: "登录成功",
                                    type: "success",
                                    duration: 1500,
                                    onClose: () => {
                                        this.$router.replace("/index/indexinfo");
                                        this.$storage.set("admin", data);
                                    }
                                })
                            } else {
                                this.$message({
                                    message: res.data.message,
                                    type: "error"
                                });
                                this.loginform.adminPwd = ''
                            }
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },

        iMethod() {
            this.$confirm('是否前往用户端?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                window.open("http://localhost:8080/")
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },
};
</script>

<style lang="less" scoped>
:deep(.el-card .el-card__body) {
    padding: 0px;
}

.login-root {
    // background-color: rgb(246, 246, 241);
    // background-image: linear-gradient(34deg, #649173, #dbd5a4);
    background-image: linear-gradient(34deg, #cc95c0, #dbd4b4, #7aa1d2);

    .top {
        height: 5vh;
        font-size: 20px;
        display: flex;
        flex-direction: row-reverse;

        i {
            margin: 20px 20px 0 0;
        }
    }

    .cont {
        width: 100vw;
        height: 95vh;
        display: flex;
        align-items: center;
        justify-content: center;


        .login {
            width: 600px;
            height: 250px;
            display: flex;
            // border: 1px salmon solid;

            .wallpaper {
                width: 60%;
                height: 100%;
                background-image: url("/src/assets/loginwallpaper.jpg");
                background-size: cover;
            }

            .loginForm {
                width: 40%;
                height: 100%;
                padding: 20px;

                .tip {
                    display: flex;
                    justify-content: space-around;
                    font-size: 14px;

                    .info {
                        color: darkgray;
                    }

                    .reset {
                        color: #46a9e3;
                        text-decoration: none;
                    }
                }
            }

        }
    }
}
</style>