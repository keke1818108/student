<template>
    <div class="i-root">
        <!-- <el-card> -->
        <div class="card">
            <div class="admin">
                <div class="avatar">
                    <img src="@/assets/admin-1.png" />
                </div>
                <span>欢迎登录，</span><el-tag type="danger">Admin</el-tag>
            </div>
            <div class="lunbo">
                <el-carousel height="300px">
                    <el-carousel-item v-for="item in imgs" :key="item.id">
                        <img :src="item.url" />
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="notice">
                <div class="t"><img src="@/assets/gong2.png" />&nbsp;<span>系统公告</span></div>
                <template v-if="notices.length == 0">
                    <el-empty description="暂无公告"></el-empty>
                </template>
                <template v-else>
                    <div class="n" v-for="item in notices" :key="item.nid">
                        <div class="nTitle">
                            <a href="#" @click.prevent="noticeClick(item)">
                                <div>
                                    <div></div>
                                    {{ item.noticeTitle }}
                                </div>
                            </a>
                        </div>
                        <div class="nTime"><img src="@/assets/time.png" />{{ item.startTime }}</div>
                    </div>
                </template>
            </div>
        </div>
        <!-- </el-card> -->

        <div class="numInfo">
            <el-row :gutter="80">
                <el-col :span="6">
                    <el-card>
                        <div class="num">

                            <el-statistic group-separator="," :precision="0" decimal-separator="."
                                :value="questions.length" title="试题数量">
                                <template slot="prefix">
                                    <i class="el-icon-s-flag" style="color: red"></i>
                                </template>
                            </el-statistic>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card>
                        <div class="num">
                            <el-statistic group-separator="," :precision="0" decimal-separator="."
                                :value="courses.length" title="课程数量">
                                <template slot="prefix">
                                    <i class="el-icon-s-flag" style="color: red"></i>
                                </template>
                            </el-statistic>
                        </div>

                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card>
                        <div class="num">
                            <el-statistic group-separator="," :precision="0" decimal-separator="."
                                :value="students.length" title="学生人数">
                                <template slot="prefix">
                                    <i class="el-icon-s-flag" style="color: red"></i>
                                </template>
                            </el-statistic>
                        </div>

                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card>
                        <div class="num"><el-statistic group-separator="," :precision="0" decimal-separator="."
                                :value="teachers.length" title="教师人数">
                                <template slot="prefix">
                                    <i class="el-icon-s-flag" style="color: red"></i>
                                </template>
                            </el-statistic></div>

                    </el-card>
                </el-col>
            </el-row>
        </div>

        <div class="echarts">
            <div ref="question" class="question" style="width: 400px; height: 400px;"></div>
            <div ref="studentNum" class="studentNum" style="width: 900px; height: 400px;"></div>
        </div>

        <el-dialog title="公告" :visible.sync="noticeDialog" width="30%">
            <div class="noticeDialog">
                <div class="nTitle">{{ notice.noticeTitle }} </div>
                <div class="nTime"><img src="@/assets/time.png" />&nbsp;{{ notice.startTime }}</div>
                <div class="nContent">{{ notice.noticeContent }}</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="noticeDialog = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'XiaozhiHouIndex',

    data() {
        return {
            questions: [],
            courses: [],
            students: [],
            teachers: [],

            // 公告
            notices: [],
            notice: '',
            noticeDialog: false,

            //每门课下的学生数量
            studentNumData: [],

            imgs: [
                { id: 1, url: require('../../assets/lunbo/img1.jpg') },
                { id: 2, url: require('../../assets/lunbo/img2.jpg') },
            ],
        };
    },

    mounted() {
        this.getNotice();
        this.getNumInfo();
    },

    methods: {
        async getNumInfo() {
            await this.$axios.get("/question/getAllQuestion").then(res => {
                // console.log("qNum", res.data);
                this.questions = res.data.data
            })
            await this.$axios.get("/course/getAllCourse").then(res => {
                // console.log("cNum", res.data);
                this.courses = res.data.data
            })
            await this.$axios.get("/student/getAllStudent").then(res => {
                // console.log("sNum", res.data);
                this.students = res.data.data
            })
            await this.$axios.get("/teacher/getAllTeacher").then(res => {
                // console.log("tNum", res.data);
                this.teachers = res.data.data
            })

            await this.$axios.get("/course/getStudentNumByCid?tid=-1").then(res => {
                // console.log(res.data);
                this.studentNumData = res.data.data
            })
            this.getChart()
        },

        getChart() {
            // console.log(this.courses, this.students, this.teachers, this.studentNumData);

            //试题类型图表
            let qType = this.$util.groupBy(this.questions, u => {
                if (u.questionType == 1) {
                    return '选择题'
                } else if (u.questionType == 2) {
                    return '填空题'
                } else {
                    return '判断题'
                }
            })
            // console.log(qType);
            echarts.init(this.$refs.question).setOption({
                title: {
                    text: "试题详情",
                    textStyle: {
                        fontSize: 20
                    },
                    left: 20,
                    top: '5%'
                },
                tooltip: {
                    trigger: 'item'
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: { show: true, readOnly: true },
                        restore: {},
                        saveAsImage: {}
                    },
                    top: '5%'
                },
                legend: {
                    top: '15%',
                    left: 'center'
                },
                series: [
                    {
                        name: '试题数量',
                        type: 'pie',
                        top: '15%',

                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        padAngle: 3,
                        itemStyle: {
                            borderRadius: 10
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 30,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: qType[Object.keys(qType)[0]], name: Object.keys(qType)[0] },
                            { value: qType[Object.keys(qType)[1]], name: Object.keys(qType)[1] },
                            { value: qType[Object.keys(qType)[2]], name: Object.keys(qType)[2] }
                        ]
                    }
                ]
            })

            // 每门课下的学生数量
            let studentNum = this.studentNumData.map(obj => obj.studentNum);
            let courseName = this.studentNumData.map(obj => obj.courseName);
            let nickName = this.studentNumData.map(obj => obj.nickName);
            console.log(studentNum, courseName, nickName);
            let studentNumEchart = echarts.init(this.$refs.studentNum)
            let studentNumOption = {
                title: {
                    text: "学生选课详情",
                    textStyle: {
                        fontSize: 20
                    },
                    left: 20,
                    top: '5%'
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: { show: true, readOnly: true },
                        restore: {},
                        saveAsImage: {}
                    },
                    top: '5%'
                },
                grid: {
                    top: '20%',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        let tooltipContent = '';
                        // 遍历params数组，获取每个数据项的信息，并拼接成tooltipContent字符串
                        params.forEach(function (item) {
                            let nick = nickName[item.dataIndex] != null ? nickName[item.dataIndex] : '暂无'
                            tooltipContent += item.name + "（" + nick + "）"
                                + "<br><div style='display: flex;align-items: center;'>"
                                + "<div style='width:10px;height: 10px;border-radius: 50%;background-color: rgb(61, 89, 229);'></div>"
                                + "&nbsp;学生数量&nbsp;&nbsp;&nbsp;"
                                + "<span style='font-weight: bolder;'>" + item.value + "</span></div>";
                        });
                        return tooltipContent;
                    }
                },
                xAxis: [
                    {
                        name: '课程',
                        type: 'category',
                        data: courseName,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        name: '学生数量/人',
                        type: 'value',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            show: true
                        },
                    }
                ],
                series: [
                    {
                        name: '学生数量',
                        type: 'bar',
                        barWidth: '50%',
                        top: '30%',
                        data: studentNum
                    }
                ]
            }
            studentNumEchart && studentNumEchart.setOption(studentNumOption)

        },


        getNotice() {
            let noticePage = {
                currentPage: 1,
                pageSize: 3,
                noticeStatus: 2
            }
            this.$axios.post("/notice/getNoticeByPage", noticePage)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status == '200') {
                        this.notices = res.data.data.records
                    }
                })
        },
        noticeClick(n) {
            this.notice = n
            console.log("noticeClick", this.notice);
            this.noticeDialog = true
        }
    },
};
</script>

<style lang="less" scoped>
// 公告栏的高度
@height: 300px;
// 每个公告标题和图标之间的间距
@nT: 10px;



.i-root {
    padding: 10px;

    .echarts {
        display: flex;
        justify-content: space-around;
        border-radius: 5px;
        background-image: linear-gradient(319deg, #c9d6ff, #e2e2e2);

        .studentNum {
            margin: 10px;
            border-radius: 5px;
            background-color: white;
        }

        .question {
            margin: 10px;
            border-radius: 5px;
            background-color: white;
        }
    }

    .card {
        display: flex;

        .admin {
            flex: 2;

            .avatar img {
                width: 70px;
            }
        }

        .lunbo {
            flex: 5;
            margin: 0 10px;
        }

        .notice {
            // background-color: #d3a7da;
            flex: 3;
            height: @height;

            .t {
                font-size: 40px;
                display: flex;
                align-items: center;
                font-family: 'chunfeng', 'Courier New', Courier, monospace;

                img {
                    width: 30px;
                }
            }

            .n {
                margin: 5px 10px;

                .nTime {
                    display: flex;
                    align-items: center;
                    font-size: 15px;
                    color: gray;

                    img {
                        width: 15px;
                        margin-right: @nT;
                    }
                }

                .nTitle {
                    font-size: 25px;

                    a {
                        text-decoration: none;
                        color: black;

                        div {
                            display: flex;
                            align-items: center;

                            div {
                                width: 13px;
                                height: 13px;
                                border-radius: 50%;
                                background-color: cornflowerblue;
                                margin-right: @nT;
                            }
                        }

                    }

                    a:hover {
                        color: #409eff;
                    }
                }

                /*      .nTitle:hover {
                    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
                    border-radius: 3%;
                } */

            }

        }
    }


    .numInfo {
        margin: 10px 0;
        padding: 30px;
        border-radius: 5px;
        background-image: linear-gradient(285deg, #d3a7da, #7bc6cc);

        .el-row {
            margin: 0 !important;
        }

    }


}

.el-carousel__item img {
    width: 100%;
    height: 100%;
}

。.el-dialog__body {
    padding: 15px 20px;
}

.noticeDialog {
    .nTime {
        display: flex;
        align-items: center;
        font-size: 15px;
        color: gray;
        margin: 5px 0 10px;

        img {
            width: 15px;
        }
    }


    .nTitle {
        font-size: 25px;

        a {
            text-decoration: none;
            color: black;
        }
    }

    .nContent {
        font-size: medium;
    }
}
</style>