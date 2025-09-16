<template>
    <div class="index">
        <div class="header">
            <div class="logo">欢迎进入题库管理系统</div>
            <div class="user">
                <el-popover placement="bottom" width="300" trigger="hover" visible-arrow="false">
                    <div class="notices">
                        <div class="title">公告通知</div>
                        <li v-for="( item, index) in notices" :key="item.nid">
                            <a href="#" @click.prevent="clikeGong(index, item)">{{ item.noticeTitle }}</a>
                        </li>
                    </div>
                    <a class="notice" slot="reference" href="#" @click.prevent>
                        <el-badge :value="noticeNum" :max="10" :hidden="isHidden" class="item">
                            <img src="@/assets/gong3.png" />
                        </el-badge>
                    </a>
                </el-popover>

                <img v-if="userType == 1" src="../assets/student-man.png" class="img">
                <img v-else-if="userType == 2" src="../assets/student-woman.png" class="img">
                <img v-else-if="userType == 3" src="../assets/teacher-man.png" class="img">
                <img v-else-if="userType == 4" src="../assets/teacher-woman.png" class="img">
                <span class="nickname-span" v-if="userinfo">{{ userinfo.userData.nickName }}</span>
                <div class="exit" @click="exit()"><img src="../assets/exit.png"></div>
            </div>
        </div>
        <div class="content">
            <span v-if="this.userinfo.userType == 0">
                <navS></navS>
            </span>
            <span v-else>
                <navT></navT>
            </span>
        </div>


        <el-dialog :title="notice.noticeTitle" :visible.sync="dialogVisible" width="40%">
            <div class="noticeDialog">
                <!-- <div class="nTitle">{{ notice.noticeTitle }} </div> -->
                <div class="nTime">发布时间：{{ notice.startTime }} &nbsp;&nbsp;&nbsp;浏览量：{{ notice.noticeViewNum }}</div>
                <div class="nContent">{{ notice.noticeContent }}</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import navS from './student/nav-s.vue';
import navT from './teacher/nav-t.vue';
export default {
    components: { navS, navT },
    name: 'XiaozhiQianIndex',

    data() {
        return {
            userinfo: "",
            userType: "",

            // 公告数据
            notices: [],
            // 公告数量
            noticeNum: 0,
            isHidden: true,

            dialogVisible: false,
            // 公告详情
            notice: ""
        }
    },

    // 1 老师、0学生
    // 1 男、2女
    mounted() {
        if (localStorage.getItem("userinfo") == null) {
            this.$router.replace("/");
        } else {
            this.userinfo = JSON.parse(localStorage.getItem("userinfo"))
            // console.log(this.userinfo);

            if (this.userinfo.userType == 0 && this.userinfo.userData.sex == 1) {
                //男学生
                this.userType = 1
            } else if (this.userinfo.userType == 0 && this.userinfo.userData.sex == 2) {
                //女学生
                this.userType = 2
            } else if (this.userinfo.userType == 1 && this.userinfo.userData.sex == 1) {
                //男老师
                this.userType = 3
            } else if (this.userinfo.userType == 1 && this.userinfo.userData.sex == 2) {
                //女老师
                this.userType = 4
            }
        };
        this.getNotice()
    },

    methods: {
        exit() {
            this.$confirm('是否退出系统', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                localStorage.clear();
                this.$router.replace("/");
            }).catch(err => {
                console.log(err);
            })

        },
        getNotice() {
            let noticePage = {
                currentPage: 1,
                pageSize: 4,
                noticeStatus: 2
            }
            this.$axios.post("/notice/getNoticeByPage", noticePage)
                .then(res => {
                    // console.log(res.data);
                    if (res.data.status == '200') {
                        this.notices = res.data.data.records;
                    }
                    this.noticeNum = this.notices.length;
                    this.isHiddenAfterClick(this.noticeNum);
                })
        },
        clikeGong(index, item) {
            // console.log("clikeGong", index, item, this.notices);
            this.notice = item
            this.isHiddenAfterClick(--this.noticeNum)
            item.noticeViewNum = item.noticeViewNum + 1;
            this.addViewNum(item)
            this.dialogVisible = true;
        },
        // 根据当前的noticeNum判断是否显示角标
        isHiddenAfterClick(num) {
            if (num == 0) {
                this.isHidden = true
            } else {
                this.isHidden = false
            }
        },
        // 点击一次公告，增加一次浏览量
        addViewNum(item) {
            this.$axios.post("/notice/updateNotice", item)
                .then(res => {
                    console.log("addViewNum:", res.data);
                })
        }
    },
};
</script>

<style lang="less" scoped>
.noticeDialog {
    .nContent {
        margin-top: 10px;
        font-size: 20px;
        height: 300px;
    }
}

.el-dialog__body {
    padding: 20px 20px;
}

.notices {
    width: 100%;

    .title {
        font-size: 25px;
    }

    li {
        width: 100%;
        margin: 10px 0;
        font-size: 18px;

        a {
            width: 100%;
            text-decoration: none;
            color: #000;
        }
    }

    li:hover,
    a:hover {
        color: #0059ff;
    }
}

.index {
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #4C4C4C;
        color: aliceblue;

        .logo {
            font-size: 30px;
            margin-left: 30px;
        }

        .user {
            display: flex;
            margin-right: 50px;
            padding: 5px 0 5px;


            .notice {
                display: flex;
                align-items: center;
                // margin-right: 50px;

                img {
                    width: 30px;
                }

                .item {
                    margin-top: 10px;
                    margin-right: 40px;
                }
            }

            .img {
                width: 40px;
                margin-right: 10px;
            }

            .nickname-span {
                display: flex;
                align-items: center;
                margin-right: 30px;
            }

            .exit {
                display: flex;
                align-items: center;

                img {
                    width: 20px;
                }
            }
        }
    }

    .content {
        // display: flex;
        padding-top: 30px;
        background-color: #fefdfd;
    }
}
</style>