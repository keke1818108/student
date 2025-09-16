<template>
    <div class="nav-s">
        <el-card class="nav">
            <div class="nickname">
                <img v-if="userType == 1" src="../../assets/student-man.png" class="img">
                <img v-else-if="userType == 2" src="../../assets/student-woman.png" class="img">
                <img v-else-if="userType == 3" src="../../assets/teacher-man.png" class="img">
                <img v-else-if="userType == 4" src="../../assets/teacher-woman.png" class="img">
                <span class="nickname-span" v-if="userinfo">{{ userinfo.userData.nickName }}</span>
            </div>
            <div class="nav-list">
                <router-link to="/index/personalInfo">个人信息</router-link>
                <router-link to="/index/courseInfo">课程</router-link>
                <router-link to="/index/testPaperInfo">试卷</router-link>
                <!-- <router-link to="/index/scoreT">成绩统计</router-link> -->
            </div>
        </el-card>

        <div class="info">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: 'XiaozhiQianNavS',

    data() {
        return {
            userinfo: "",
            userType: ''
        };
    },

    mounted() {
        this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
        console.log(this.userinfo);
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
            this.userType = 4;
        }
    },

    methods: {

    },
};
</script>

<style lang="less" scoped>
.nav-s {
    display: flex;
    width: 100%;
}

.nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 0 40px;
    height: 350px;

    .nickname {
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
            width: 80px;
        }

        .nickname-span {
            font-size: 20px;
        }
    }

    .nav-list {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        align-items: center;

        a {
            text-decoration: none;
            margin: 5px 0;
            font-size: 16px;
            color: #000;
        }

        a:hover {
            background-color: antiquewhite;
            border-radius: 5%;
            color: rgb(177, 52, 43);
        }
    }
}

.info {
    flex: 5;
}
</style>