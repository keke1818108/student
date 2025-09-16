<template>
    <div class="testPaper">
        <div class="header">
            <div class="examName">
                <i class="el-icon-tickets"></i> &nbsp;{{ viewTestInfo.examinationName }}
                <!-- &nbsp;&nbsp;——&nbsp;&nbsp;{{viewTestInfo.courseName }} -->
            </div>

            <div class="nickname">
                <span class="nickname-span" v-if="userinfo">{{ userinfo.userData.nickName }}</span>
                <img v-if="userType == 1" src="../../assets/student-man.png" class="img">
                <img v-else-if="userType == 2" src="../../assets/student-woman.png" class="img">
                <img v-else-if="userType == 3" src="../../assets/teacher-man.png" class="img">
                <img v-else-if="userType == 4" src="../../assets/teacher-woman.png" class="img">

            </div>
        </div>

        <div class="body">
            <div class="testInfo">
                <el-card>
                    <div class="info">
                        <div class="score">
                            <span class="t">总分</span>
                            <div class="s">{{ viewTestInfo.score }}</div>
                        </div>

                        <div class="i">课程：{{ viewTestInfo.courseName }}</div>
                        <div class="i">教授：{{ viewTestInfo.nickTName }}</div>
                        <div class="i">时间：{{ this.$util.parseTime(viewTestInfo.endTime, true) }}</div>
                    </div>

                    <div class="poetry">
                        <span>{{ poetry.hitokoto }}</span>
                        <span class="author" v-if="poetry.from_who != ''">——{{ poetry.from_who }}</span>
                    </div>
                </el-card>
            </div>

            <div class="qInfo">
                <el-card class="q" v-for="(item, index) in viewTestItem" :key="item.qid">

                    <div>
                        <el-tag size="small">{{ index + 1 }}</el-tag>&nbsp;&nbsp; {{ item.questionContent }}
                    </div>

                    <div class="options" v-if="item.questionType === 1">
                        <el-radio-group v-model="choiceABCD">
                            <div class="abcd"> <el-radio label="A" class="break-word" disabled>A、<span>{{ item.optionA
                                        }}</span></el-radio>
                            </div>
                            <div class="abcd"> <el-radio label="B" class="break-word" disabled>B、<span>{{ item.optionB
                                        }}</span></el-radio>
                            </div>
                            <div class="abcd"> <el-radio label="C" class="break-word" disabled>C、<span>{{ item.optionC
                                        }}</span></el-radio>
                            </div>
                            <div class="abcd"> <el-radio label="D" class="break-word" disabled>D、<span>{{ item.optionD
                                        }}</span></el-radio>
                            </div>
                        </el-radio-group>
                    </div>
                    <div class="options" v-else-if="item.questionType === 2">
                        第一空：<el-input v-model="fillInput" disabled type="textarea" :rows="3"
                            placeholder="请输入内容"></el-input>
                    </div>
                    <div class="options" v-else>
                        <div class="radio">
                            <el-radio v-model="judge_radio" disabled label="1">正确</el-radio>
                            <el-radio v-model="judge_radio" disabled label="0">错误</el-radio>
                        </div>
                    </div>

                    <div class="ans">
                        <div class="qAns">
                            <el-tag>正确答案</el-tag>&nbsp;&nbsp;
                            <span v-if="item.questionType === 1 || item.questionType === 2">{{ item.questionAnswer
                                }}</span>
                            <span v-if="item.questionType === 3 && item.questionAnswer === '1'">对</span>
                            <span v-if="item.questionType === 3 && item.questionAnswer === '0'">错</span>
                        </div>
                        <div class="uAns">
                            <el-tag :type="item.qstatus == 1 ? 'success' : 'danger'">你的答案</el-tag>&nbsp;&nbsp;
                            <span v-if="item.questionType === 1 || item.questionType === 2">{{ item.uanswer }}</span>
                            <span v-if="item.questionType === 3 && item.uanswer === '1'">对</span>
                            <span v-if="item.questionType === 3 && item.uanswer === '0'">错</span>
                        </div>
                        <div class="scoreOne">
                            <el-tag>得分</el-tag>&nbsp;&nbsp;
                            <span class="s">{{ item.qscore }}</span>
                        </div>
                    </div>
                </el-card>
            </div>

        </div>

    </div>
</template>

<script>
export default {
    name: 'XiaozhiQianViewTestPaperDetail',

    data() {
        return {
            userinfo: '',
            viewTestInfo: '',
            viewTestItem: [],
            userType: "",

            choiceABCD: '',
            fillInput: "",
            judge_radio: '',

            poetry: ''
        };
    },

    beforeMount() {
        this.userinfo = this.$storage.get("userinfo")
        this.viewTestInfo = this.$storage.get("viewTestInfo")
        let viewTestItem = this.$storage.get("viewTestItem");
        console.log(viewTestItem, this.viewTestInfo, this.userinfo);

        this.viewTestItem = [];
        for (let i = 0; i < viewTestItem.length; i++) {
            let e = viewTestItem[i];
            let q = this.$util.parseQuestion(e)
            delete e.questionContent
            delete q.cid
            delete q.courseName
            delete q.qid
            delete q.questionAnswer
            delete q.questionType

            // console.log(e, q);
            this.viewTestItem.push(Object.assign({}, e, q))
        }
        console.log(this.viewTestItem);

        if (this.userinfo.userType == 0 && this.userinfo.userData.sex == 1) {
            //男学生
            this.userType = 1
        } else if (this.userinfo.userType == 0 && this.userinfo.userData.sex == 0) {
            //女学生
            this.userType = 2
        } else if (this.userinfo.userType == 1 && this.userinfo.userData.sex == 1) {
            //男老师
            this.userType = 3
        } else if (this.userinfo.userType == 1 && this.userinfo.userData.sex == 0) {
            //女老师
            this.userType = 4
        }
    },
    mounted() {
        this.getPoetry()
    },
    methods: {
        getPoetry() {
            this.$axios.get("https://v1.hitokoto.cn/?c=i")
                .then(res => {
                    // console.log(res.data);
                    this.poetry = res.data
                })
        }
    },
};
</script>

<style lang="less" scoped>
.testPaper {
    background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    height: 100%;

    .el-card__body {
        margin: 10px;
    }

    .header {
        position: fixed;
        width: 100%;
        z-index: 9999;
        box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.5);

        display: flex;
        font-size: 25px;
        background-color: rgb(171, 171, 249);
        height: 50px;
        color: aliceblue;

        .examName {
            flex: 1;
            margin-left: 20px;
            display: flex;
            align-items: center;
        }

        .nickname {
            flex: 1;
            display: flex;
            align-items: center;
            flex-direction: row-reverse;
            margin-right: 20px;

            img {
                width: 25px;
            }
        }
    }

    .body {
        display: flex;
        justify-content: center;

        .testInfo {
            position: fixed;
            z-index: 9998;
            top: 60px;
            left: 40px;
            width: 250px;


            .info {
                .score {
                    margin-bottom: 30px;
                    display: flex;
                    align-items: center;
                    font-family: 'jiangxi2', 'Courier New', Courier, monospace;

                    .t {
                        margin-right: 20px;
                        font-size: 20px;
                    }

                    .s {
                        color: red;
                        font-size: 40px;
                    }
                }

                .i {
                    margin: 10px 0;
                    color: #a8a5a5;
                }
            }

            .poetry {
                display: flex;
                flex-direction: column;
                font-family: 'jiangxi2', 'Courier New', Courier, monospace;
                color: darkgray;
                margin-top: 30px;

                .author {
                    display: flex;
                    justify-content: flex-end
                }
            }
        }

        .qInfo {
            width: 60%;
            margin: 50px 0;

            .q {
                margin: 10px 0;

                .options {
                    margin-top: 10px;

                    .break-word {
                        vertical-align: text-top;
                        white-space: normal;
                        word-break: break-all;
                        line-height: 1.5;
                    }

                    .radio {
                        width: 400px;
                    }

                    .abcd {
                        margin: 20px;
                    }
                }

                .ans {
                    display: flex;
                    align-items: center;
                    margin: 20px 0;

                    .qAns {
                        margin-right: 50px;
                    }

                    .uAns {
                        margin-right: 50px;
                    }

                    .scoreOne {
                        display: flex;
                        align-items: center;

                        .s {
                            font-family: 'jiangxi2', 'Courier New', Courier, monospace;
                            color: rgb(240, 58, 58);
                            font-size: 30px;
                        }
                    }
                }

            }

        }

    }
}
</style>