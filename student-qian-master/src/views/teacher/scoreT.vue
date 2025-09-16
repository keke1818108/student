<template>
    <el-card>
        <!-- -->
        <div class="echarts">
            <div class="top">
                <div ref="numEchart" style="width: 400px;height: 400px;">
                </div>
                <div ref="chapterAexamEchart" style="width: 600px;height: 400px;">
                </div>
            </div>

            <!-- <div ref="echart" style="width: 1100px;height: 400px;"></div> -->
        </div>
    </el-card>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'XiaozhiQianScoreT',

    data() {
        return {
            userinfo: '',
            studentNumData: [],

            chapterNum: [],
            examNum: []
        };
    },

    mounted() {
        this.userinfo = JSON.parse(localStorage.getItem("userinfo"));

        this.getData()
    },

    methods: {

        async getData() {
            await this.$axios.get("/course/getStudentNumByCid?tid=" + this.userinfo.userData.tid).then(res => {
                this.studentNumData = res.data.data
            });

            await this.$axios.post("/teacher/getCEByC/1", this.studentNumData.map(obj => obj.cid))
                .then(res => {
                    // console.log(res.data);

                    this.examNum = res.data.data;
                    this.examNum.sort((a, b) => {
                        const nameA = a.courseName.toLowerCase();
                        const nameB = b.courseName.toLowerCase();
                        return nameA.localeCompare(nameB);
                    })
                })
            await this.$axios.post("/teacher/getCEByC/2", this.studentNumData.map(obj => obj.cid))
                .then(res => {
                    // console.log(res.data);

                    this.chapterNum = res.data.data
                    this.chapterNum.sort((a, b) => {
                        const nameA = a.courseName.toLowerCase();
                        const nameB = b.courseName.toLowerCase();
                        return nameA.localeCompare(nameB);
                    })
                })
            this.getCharts();

        },
        getCharts() {
            // console.log(this.examNum, this.chapterNum, this.studentNumData.map(obj => obj.cid));

            //课程人数情况
            let newData = this.studentNumData.map(obj => {
                return {
                    value: obj.studentNum,
                    name: obj.courseName
                }
            })
            echarts.init(this.$refs.numEchart).setOption({
                title: {
                    text: "课程人数情况",
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
                        name: '学生人数',
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
                                fontSize: 20,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: newData
                    }
                ]
            });

            //课程的章节和试卷数量情况
            let res = {}
            for (const item of this.examNum) {
                if (res[item.courseName]) {
                    res[item.courseName] = res[item.courseName] + item.examNum
                } else {
                    res[item.courseName] = item.examNum;
                }
            }
            let newExamData = []
            Object.keys(res).forEach((key, index) => {
                newExamData[index] = res[key]
            });
            // console.log(newExamData);
            // return;
            echarts.init(this.$refs.chapterAexamEchart).setOption({
                title: {
                    text: "章节试卷详情",
                    textStyle: {
                        fontSize: 20
                    },
                    left: 20,
                    top: '5%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    },
                    top: '5%'
                },
                legend: {
                    data: ['章节', '试卷'],
                    top: '15%'
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.chapterNum.map(obj => obj.courseName),
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '数量',
                    }
                ],
                grid: {
                    left: '15%',
                    right: '4%',
                    top: '30%'
                },
                series: [
                    {
                        name: '章节',
                        type: 'bar',
                        barMaxWidth: 40,
                        barMinWidth: 30,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + ' 章';
                            }
                        },
                        data: this.chapterNum.map(obj => obj.chapterNum)
                    },
                    {
                        name: '试卷',
                        type: 'bar',
                        barMaxWidth: 40,
                        barMinWidth: 30,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + ' 套';
                            }
                        },
                        data: newExamData
                    }
                ]
            })



            function getEchart() {
                echarts.init(this.$refs.echart).setOption({
                    title: {
                        text: 'Stacked Line'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            dataView: { show: true, readOnly: true },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            show: true
                        },
                    },
                    series: [
                        {
                            name: 'Email',
                            type: 'line',
                            stack: 'Total',
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: 'Union Ads',
                            type: 'line',
                            stack: 'Total',
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: 'Video Ads',
                            type: 'line',
                            stack: 'Total',
                            data: [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name: 'Direct',
                            type: 'line',
                            stack: 'Total',
                            data: [320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            name: 'Search Engine',
                            type: 'line',
                            stack: 'Total',
                            data: [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                }
                )
            }
        }
    },
};
</script>

<style lang="less" scoped>
.echarts {
    .top {
        display: flex;
    }
}
</style>