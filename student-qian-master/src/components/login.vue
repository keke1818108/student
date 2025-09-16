<template>
    <div>
        <div id="particles"></div>
        <el-card class="box-card login" style="width: 30%;">
            <div class="title">系统登录</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px" class="demo-ruleForm">
                <el-form-item label="账号" prop="account">
                    <el-input v-model="ruleForm.account" placeholder="请输入用户名"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>

                <el-form-item label="身份">
                    <el-select v-model="ruleForm.userType" placeholder="请选择身份">
                        <el-option label="学生" value="0"></el-option>
                        <el-option label="老师" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button class="submitBtn" type="primary" @click="submitForm('ruleForm')">登录
                    </el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
            <i class="tips el-icon-info">账号信息请联系老师或管理员获取 </i>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ruleForm: {
                password: "",
                account: "",
                userType: "",
            },
            rules: {
                password: [
                    {
                        pattern: /^[a-zA-Z0-9_*]{6,50}$/,
                        message: "长度在 6 到 50 个字符",
                        trigger: "blur",
                    },
                ],
                account: [
                    {
                        pattern: /^[a-zA-Z][a-zA-Z0-9]{5,50}$/,
                        message: "必须以字母开头，只能有数字、字母，且长度为6-50",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //请求
                    var datastr = JSON.stringify(this.ruleForm);
                    // console.log(datastr);
                    this.$axios.post("/user/login", datastr, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((resp) => {
                            const str = resp.data;
                            // console.log("str", str);
                            if (str.status === "200") {
                                this.$message({
                                    message: '登录成功',
                                    type: 'success'
                                });
                                this.$router.replace("/index");
                                localStorage.setItem("userinfo", JSON.stringify(str.data));
                                // this.$GLOBAL.userinfo = str.data;
                            } else {
                                this.$message.error(str.message);
                            }
                            this.$refs[formName].resetFields();
                        }).catch(res => {
                            console.log("catch:", res)
                            if (res.message === "Network Error" || res.code === "ERR_NETWORK") {
                                this.$message({
                                    message: '网络超时',
                                    type: 'error'
                                });
                            }
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
    },
    mounted() {
        console.log("mounted()");

        //粒子形状配置
        particlesJS("particles", {
            particles: {
                number: {
                    value: 200, //粒子数量
                    density: {
                        //区域散布密度大小
                        enable: true,
                        value_area: 800,
                    },
                },
                color: {
                    value: "#8ACAFF",
                },
                shape: {
                    /**
                     * 原子的形状
                     * "circle" "edge" "triangle" "polygon" "star" "image" ["circle", "triangle", "image"]
                     */
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000",
                    },
                    polygon: {
                        nb_sides: 5,
                    },
                    image: {
                        src: "@/assets/logo.png",
                        width: 100,
                        height: 100,
                    },
                },
                opacity: {
                    value: 1, //不透明度
                    random: false, //随机不透明度
                    anim: {
                        enable: false, //渐变动画
                        speed: 0.5, //渐变动画速度
                        opacity_min: 0.1, //渐变动画不透明度
                        sync: false,
                    },
                },
                size: {
                    value: 3, //原子大小随机
                    random: true, //原子大小
                    anim: {
                        enable: false, //原子渐变
                        speed: 80, //原子渐变速度
                        size_min: 0.1,
                        sync: false,
                    },
                },
                line_linked: {
                    enable: true, //连接线
                    distance: 100, //连接线距离
                    color: "#8ACAFF",
                    opacity: 0.6,
                    width: 1,
                },
                move: {
                    enable: true, //原子移动
                    speed: 5, //原子移动速度
                    direction: "none", //原子移动方向
                    random: false, //移动随机方向
                    straight: false, //直接移动
                    out_mode: "out", //是否移动出画布
                    bounce: false, //是否跳动移动
                    attract: {
                        enable: false, //原子之间吸引
                        rotateX: 600,
                        rotateY: 1200,
                    },
                },
            },
            interactivity: {
                detect_on: "canvas", //原子之间互动检测
                events: {
                    /**悬停
                    "grab"     抓取临近的
                    "bubble"  泡沫球效果
                    "repulse"  击退效果
                    */
                    onhover: {
                        enable: true,
                        mode: "grab",
                    },
                    /**点击效果
                     * "push" 
                      "remove" 
                      "bubble" 
                      "repulse"
                     */
                    onclick: {
                        enable: true,
                        mode: "repulse",
                    },
                    resize: true, //互动事件调整
                },
                modes: {
                    grab: {
                        distance: 300, //原子互动抓取距离
                        line_linked: {
                            opacity: 1, //原子互动抓取距离连线不透明度
                        },
                    },
                    bubble: {
                        distance: 800, //原子抓取泡沫效果之间的距离
                        size: 80, //大小
                        duration: 2, //持续时间
                        opacity: 0.8, //透明度
                        speed: 3, //速度
                    },
                    repulse: {
                        distance: 200, //击退效果距离
                        duration: 0.4, //击退效果持续时间
                    },
                    push: {
                        //粒子推出的数量
                        particles_nb: 4,
                    },
                    remove: {
                        particles_nb: 2,
                    },
                },
            },
            retina_detect: true,
        });
        if (localStorage.getItem("userinfo") != null) {
            this.$router.replace("/index");
        }
    },
};
</script>

<style scoped lang="less">
#particles {
    height: 100vh;
    background-color: rgb(255, 255, 255);
    position: absolute;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
}

.login {
    position: absolute;
    top: 25%;
    left: 35%;

    .title {
        margin: 10px;
        font-size: 30px;
    }

    .tips {
        color: rgb(121, 120, 119);
        padding-left: 20px;
    }

    .submitBtn {
        margin-right: 100px;
    }
}
</style>