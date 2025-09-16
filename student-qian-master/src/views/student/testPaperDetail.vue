<template>
    <div class="testPaper">
        <div class="header">
            <div class="examName">
                <i class="el-icon-tickets"></i> &nbsp;{{ testPaperInfo.examinationName }}&nbsp;&nbsp;——&nbsp;&nbsp;{{
                    testPaperInfo.courseName }}
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
            <div class="nav">
                <el-card class="status">
                    <div class="status-div">
                        <span>
                            <div class="tag-default"></div>未答
                        </span>
                        <span>
                            <div class="tag-now"></div>当前
                        </span>
                        <span>
                            <div class="tag-checked"></div>已答
                        </span>
                    </div>
                </el-card>
                <el-card class="qNum">
                    <div class="questType">选择题</div>
                    <span>
                        <div class="tag tag-default" v-for="(item, index) in choiceQuest" :key="item.detail.qid"
                            @click="clickqNum(index + 1)">
                            {{ index + 1 }}
                        </div>
                    </span>
                    <div class="questType">填空题</div>
                    <span>
                        <div class="tag tag-default" v-for="(item, index) in fillQuest" :key="item.detail.qid"
                            @click="clickqNum(index + choiceQuestNumber + 1)">
                            {{ index + choiceQuestNumber + 1 }}
                        </div>
                    </span>

                    <div class="questType">判断题</div>
                    <span>
                        <div class="tag tag-default" v-for="(item, index) in judgeQuest" :key="item.detail.qid"
                            @click="clickqNum(index + choiceQuestNumber + fillQuestNumber + 1)">
                            {{ index + choiceQuestNumber + fillQuestNumber + 1 }}
                        </div>
                    </span>

                    <div class="submitTestPaper">
                        <el-button type="danger" plain round @click="submitTestPaper">提交试卷</el-button>
                    </div>
                </el-card>
            </div>
            <div class="content">
                <el-card class="testInfo">
                    <div>
                        <span>
                            请选择正确选项或填写正确的内容
                        </span>
                        <span>
                            <i class="el-icon-star-off"></i>&nbsp;&nbsp;全卷共{{ testPaperNumber
                            }}道题&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <i class="el-icon-alarm-clock"></i>&nbsp;&nbsp;截止时间：<el-tag type="warning">{{
                                testPaperInfo.endTime
                            }}</el-tag>
                        </span>
                    </div>

                </el-card>
                <el-card class="qInfo">
                    <!-- {{ nowQinfo }} -->
                    <span v-if="nowQinfo.detail.questionType === '1'"> <el-tag size="small">{{ nowQnum
                            }}</el-tag>&nbsp;&nbsp;{{ nowQinfo.option.questionContent }}</span>
                    <span v-else><el-tag size="small">{{ nowQnum }}</el-tag>&nbsp;&nbsp;{{
                        nowQinfo.detail.questionContent }}</span>

                    <div class="options" v-if="nowQinfo.detail.questionType === '1'">
                        <el-radio-group v-model="choiceABCD" @change="checkboxchange()">
                            <div class="abcd"> <el-radio class="break-word" label="A">A、{{ nowQinfo.option.optionA
                                    }}</el-radio></div>
                            <div class="abcd"> <el-radio class="break-word" label="B">B、{{ nowQinfo.option.optionB
                                    }}</el-radio></div>
                            <div class="abcd"> <el-radio class="break-word" label="C">C、{{ nowQinfo.option.optionC
                                    }}</el-radio></div>
                            <div class="abcd"> <el-radio class="break-word" label="D">D、{{ nowQinfo.option.optionD
                                    }}</el-radio></div>
                        </el-radio-group>
                    </div>
                    <div class="options" v-else-if="nowQinfo.detail.questionType === '2'">
                        第一空：<el-input v-model="fillInput" @input="input_fill()" @focus="focus_fill()" type="textarea"
                            :rows="3" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="options" v-else>
                        <div class="radio">
                            <el-radio v-model="judge_radio" label="1" @input="clickjudge_radio()">正确</el-radio>
                            <el-radio v-model="judge_radio" label="0" @input="clickjudge_radio()">错误</el-radio>
                        </div>
                    </div>
                </el-card>
                <el-card class="nextInfo">
                    <div>
                        <el-button @click="previousQuestion" type="primary" plain round><i
                                class="el-icon-arrow-left"></i>上一题</el-button>
                        <el-button @click="nextQuestion" type="primary" plain round>下一题<i
                                class="el-icon-arrow-right"></i></el-button>
                    </div>
                </el-card>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'XiaozhiQianTestPaperDetail',
    data() {
        return {
            test: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            userType: 1,
            //用户信息
            userinfo: "",
            //试卷信息
            testPaperInfo: "",
            //试卷题目信息
            testPaperDetail: "",
            //按选择-填空-判断排列
            sortTestPaperDetail: [],
            //选择
            choiceQuest: [],
            //填空
            fillQuest: [],
            //判断
            judgeQuest: [],
            //选择题数
            choiceQuestNumber: 0,
            //填空题数
            fillQuestNumber: 0,
            //判断题数
            judgeQuestNumber: 0,
            //试卷题目数量
            testPaperNumber: 0,

            //当前点击的题目信息
            nowQinfo: '',
            //当前点击的题目序号
            nowQnum: 1,

            //学生答案
            userAnswer: [],
            //学生答题对错详情
            examStudentDetails: [],
            /*             //选择题答案
                        choiceQuestAnswer: [],
                        //填空题答案
                        fillQuestAnswer: [],
                        //判断题答案
                        judgeQuestAnswer: [], */

            //暂存答案
            choiceABCD: "",
            fillInput: "",
            judge_radio: "",

        };
    },

    beforeMount() {

        this.userinfo = JSON.parse(localStorage.getItem("userinfo"))
        this.testPaperInfo = JSON.parse(localStorage.getItem("testPaperInfo"))
        this.testPaperDetail = JSON.parse(localStorage.getItem("testPaperDetail"))

        for (let i = 0; i < this.testPaperDetail.length; i++) {
            let e = this.testPaperDetail[i];

            if (e.detail.questionType === '1')
                this.choiceQuest.push(e)
            else if (e.detail.questionType === '2')
                this.fillQuest.push(e)
            else this.judgeQuest.push(e)
        }
        // console.log(this.userinfo, this.testPaperInfo, this.testPaperDetail);
        console.log(this.choiceQuest, this.fillQuest, this.judgeQuest);


        //按选择-填空-判断排列,根据编号直接从sortTestPaperDetail中获取数据
        this.sortTestPaperDetail = this.choiceQuest.concat(this.fillQuest).concat(this.judgeQuest)
        //默认选择
        this.nowQinfo = this.sortTestPaperDetail[0];
        // document.getElementsByClassName("tag")[0].classList.add("tag-now")
        //获取试题题数
        this.testPaperNumber = this.testPaperDetail.length;
        this.choiceQuestNumber = this.choiceQuest.length;
        this.fillQuestNumber = this.fillQuest.length;
        this.judgeQuestNumber = this.judgeQuest.length;

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

    methods: {
        // 计算分数
        getScore() {
            // console.log(this.userAnswer, this.sortTestPaperDetail);
            this.examStudentDetails = [];
            let score = 0;

            for (let i = 0; i < this.sortTestPaperDetail.length; i++) {
                let e = this.sortTestPaperDetail[i]
                let examStudentDetail = {
                    sid: this.userinfo.userData.sid,
                    eid: this.testPaperInfo.eid,
                    qid: e.detail.qid,
                    qscore: '',
                    qstatus: '',
                    uanswer: this.userAnswer[i]
                }
                if (this.userAnswer[i] == e.detail.questionAnswer) {
                    examStudentDetail.qscore = 10
                    examStudentDetail.qstatus = 1
                } else {
                    examStudentDetail.qscore = 0
                    examStudentDetail.qstatus = 2
                }
                this.examStudentDetails.push(examStudentDetail)
            }
            for (let i = 0; i < this.examStudentDetails.length; i++) {
                let e = this.examStudentDetails[i];
                if (e.qstatus == 1) {
                    score = score + e.qscore
                }
            }
            return score;
            // return Math.floor(Math.random() * (100 - 70 + 1)) + 70;
        },

        // 提交试卷
        submitTestPaper() {
            let studentExamRecord = {
                "eid": this.testPaperInfo.eid,
                "score": this.getScore(),
                "sid": this.testPaperInfo.sid,
                "status": 3
            }
            let serVO = {
                studentExamRecord,
                examStudentDetails: this.examStudentDetails
            }
            console.log(serVO);
            this.$confirm('确认是否提交?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log("submit");
                this.$axios.post("/examination/addStudentExamRecord", serVO)
                    .then(res => {
                        console.log(res.data);
                        const loading = this.$loading({
                            lock: true,
                            text: '提交中',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.6)'
                        });
                        setTimeout(() => {
                            loading.close();
                            this.$alert('<i class="el-icon-info" style="color:#67C23A;font-size:20px"></i>&nbsp;&nbsp;试卷提交成功', '提示', {
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.$storage.remove("testPaperDetail")
                                    let info = this.$storage.get("testPaperInfo");
                                    info.score = studentExamRecord.score
                                    this.$storage.set("testPaperInfo", info)
                                    window.close();
                                }
                            });
                        }, 1000)
                    })
            }).catch(() => {
            });

        },


        clickqNum(qNum) {
            console.log("qnum", qNum);
            //设置当前题目
            this.nowQinfo = this.sortTestPaperDetail[qNum - 1];
            this.nowQnum = qNum;

            let ds = document.getElementsByClassName("tag");
            //清楚其他的“tag-now”
            for (let i = 0; i < ds.length; i++) {
                //是当前点击的元素
                if (i === qNum - 1 && !ds[i].classList.contains("tag-now")) {
                    ds[i].classList.add("tag-now");
                }

                if (i !== qNum - 1 && ds[i].classList.contains("tag-now"))
                    ds[i].classList.remove("tag-now")
            }


            //获取当前序号的已做答案
            if (qNum <= this.choiceQuestNumber) {
                console.log("test1");
                this.choiceABCD = this.userAnswer[qNum - 1]
                //选择题
            } else if (qNum > this.fillQuestNumber + this.choiceQuestNumber) {
                //判断题
                console.log("test3");
                this.judge_radio = this.userAnswer[qNum - 1]
            } else {
                //填空题
                console.log("test2");
                this.fillInput = this.userAnswer[qNum - 1]
            }
            // console.log("nowQinfo", this.nowQinfo);
        },
        previousQuestion() {
            console.log("previousQuestion", this.nowQnum);
            let n = this.nowQnum
            if (n !== 1) {
                this.clickqNum(n - 1)
            } else {
                this.$message({
                    message: '这是第一道题',
                    type: 'warning'
                });
            }
        },
        nextQuestion() {
            console.log("nextQuestion", this.nowQnum);
            let n = this.nowQnum
            if (n !== this.choiceQuestNumber + this.fillQuestNumber + this.judgeQuestNumber) {
                this.clickqNum(n + 1)
            } else {
                this.$message({
                    message: '这是最后一道题',
                    type: 'warning'
                });
            }
        },
        checkboxchange() {
            console.log(this.choiceABCD);
            this.userAnswer[this.nowQnum - 1] = this.choiceABCD;
            document.getElementsByClassName("tag")[this.nowQnum - 1].classList.add("tag-checked")
            console.log("answer", this.userAnswer);
        },
        input_fill() {
            this.userAnswer[this.nowQnum - 1] = this.fillInput;
            document.getElementsByClassName("tag")[this.nowQnum - 1].classList.add("tag-checked")
            console.log("answer", this.userAnswer);
        },
        focus_fill() {
            this.input_fill();
        },
        clickjudge_radio() {
            console.log(this.judge_radio, this.nowQnum);
            this.userAnswer[this.nowQnum - 1] = this.judge_radio
            document.getElementsByClassName("tag")[this.nowQnum - 1].classList.add("tag-checked")
            console.log("answer", this.userAnswer);
        }
    },
};
</script>

<style lang="less" scoped>
.testPaper {
    // background-color: #EEEEEE;
    background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    height: 100vh;

    .el-card__body {
        margin: 10px;
    }

    .header {
        display: flex;
        font-size: 25px;
        background-color: rgb(156, 156, 244);
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
        padding: 10px;
        display: flex;

        .nav {
            flex: 1;
            margin-right: 10px;

            //未答
            .tag-default {
                background-color: #e0e0e3;
                color: #909399;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 5px 5px;
            }

            //当前
            .tag-now {
                background-color: #d0e6ff;
                color: #479bf4;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 5px 5px;
            }

            //已答
            .tag-checked {
                background-color: #e1f0d9;
                color: #91ca74;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 5px 5px;
            }

            .status {
                margin-bottom: 10px;

                .status-div {
                    display: flex;
                    justify-content: space-around;

                    span {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                }
            }

            .qNum {
                span {
                    display: flex;
                    flex-wrap: wrap;
                }

                .questType {
                    margin: 30px 0 10px;
                }

                .submitTestPaper {
                    margin-top: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }

        .content {
            flex: 4;

            .testInfo {
                margin-bottom: 10px;

                div {
                    display: flex;
                    justify-content: space-between;
                }

                span {
                    display: flex;
                    align-items: center;
                }

                i {
                    color: rgb(111, 165, 235);
                }
            }

            .qInfo {
                margin-bottom: 10px;
                height: 400px;

                .options {
                    margin-top: 20px;

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

            }

            .nextInfo {
                div {
                    display: flex;
                    justify-content: space-around;
                }
            }
        }
    }

}
</style>