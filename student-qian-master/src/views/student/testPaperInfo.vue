<template>
    <div class="test-root">
        <el-card>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="未考试" name="1">
                    <div class="notest-if" v-if="testPapers.length > 0">
                        <el-table :data="incompleteTest" style="width: 100%">
                            <el-table-column prop="examinationName" label="测试名称" width="180">
                                <template slot-scope="scope">
                                    <div class="img-name">
                                        <img src="@/assets/exam2.png" />
                                        <span style="margin-left: 10px">{{ scope.row.examinationName }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="courseName" label="课程名称" width="150">
                                <template slot-scope="scope">
                                    <el-tag type="success"><span>{{ scope.row.courseName }}</span></el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="chapter" label="章节" width="120">
                                <template slot-scope="scope">
                                    <el-tag type="success"><span>{{ scope.row.chapter }}</span></el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="courseName" label="教师" width="120">
                                <template slot-scope="scope">
                                    <el-tag type="success"><span>{{ scope.row.nickTName }}</span></el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
                            <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="startTest(scope.$index, scope.row)" type="primary"
                                        plain>开始考试</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="notest-else" v-else>
                        <el-empty description="暂无考试"></el-empty>
                    </div>
                </el-tab-pane>
                <!-- <el-tab-pane label="考试中" name="2">考试中</el-tab-pane> -->
                <el-tab-pane label="已结束" name="3">
                    <div class="notest-if" v-if="testPapers.length > 0">
                        <el-table :data="completedTest" style="width: 100%">
                            <el-table-column prop="examinationName" label="测试名称" width="180">
                                <template slot-scope="scope">
                                    <div class="img-name">
                                        <img src="@/assets/exam2.png" />
                                        <span style="margin-left: 10px">{{ scope.row.examinationName }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="courseName" label="课程名称" width="150">
                                <template slot-scope="scope">
                                    <el-tag type="success"><span>{{ scope.row.courseName }}</span></el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="chapter" label="章节" width="120">
                                <template slot-scope="scope">
                                    <el-tag type="success"><span>{{ scope.row.chapter }}</span></el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="courseName" label="教师" width="120">
                                <template slot-scope="scope">
                                    <el-tag type="success"><span>{{ scope.row.nickTName }}</span></el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
                            <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
                            <el-table-column prop="score" label="分数" width="100"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.isLook == 1">
                                        <el-button size="mini" @click="viewTest(scope.$index, scope.row)" type="danger"
                                            plain>点击查看试卷详情</el-button>
                                    </div>
                                    <div v-else>
                                        <el-button size="mini" disabled type="danger" plain>教师设置，不可查看</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="notest-else" v-else>
                        <el-empty description="暂无考试"></el-empty>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'XiaozhiQianTestPaperInfo',

    data() {
        return {
            userinfo: "",
            activeName: '1',
            testPapers: [],

            //未考试
            incompleteTest: [],
            //已完成
            completedTest: [],
        };
    },

    beforeMount() {
        this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
        this.getTestInfo()
    },

    methods: {
        handleClick(tab, event) {
            // console.log(tab, event);
            this.getTestInfo();
            // console.log("未考试:", this.completedTest.length);
        },
        //获取学生的试卷信息
        getTestInfo() {
            this.$axios.get("/student/getTestInfo/" + this.userinfo.userData.sid)
                .then(res => {
                    console.log("123:", this.userinfo.userData.sid, res.data);
                    // console.log(this.testPapers);
                    if (res.data.status = '200') {
                        this.testPapers = res.data.data;
                        if (this.testPapers === null)
                            return;
                        // console.log(this.testPapers);
                        this.incompleteTest = [];
                        this.completedTest = [];

                        for (let i = 0; i < this.testPapers.length; i++) {
                            let e = this.testPapers[i];
                            e.chapter = '第' + this.$util.numberToChinese(e.chapterNum) + '章'
                            e.startTime = this.$util.parseTime(e.startTime, false);
                            e.endTime = this.$util.parseTime(e.endTime, false);
                            //未考试
                            if (e.status == 1) {
                                this.incompleteTest.push(e);
                                continue;
                            }
                            //已完成
                            if (e.status == 3) {
                                this.completedTest.push(e);
                                continue;
                            }
                        }
                    }
                })
        },

        //开始考试
        startTest(index, item) {
            console.log(index, item);
            this.$axios("/examination/getDetailByEid/" + item.eid).then(res => {
                // console.log(res.data);
                if (res.data.data.length == 0) {
                    this.$message({
                        message: "暂未上传题目",
                        type: "error"
                    })
                    return;
                }
                let testPaperDetail = res.data.data;
                this.$confirm('是否开始考试？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        localStorage.setItem("testPaperInfo", JSON.stringify(item));
                        localStorage.setItem("testPaperDetail", JSON.stringify(testPaperDetail));
                        let newTab = window.open("http://localhost:8080/testPaperDetail", '_blank')

                    }).catch(() => { });

            })
                .catch(err => {
                    this.$message({
                        message: "网络出错",
                        type: "error"
                    })
                })

        },
        viewTest(index, item) {
            // console.log("查看试卷", index, item);

            this.$axios.get("/student/getViewTestInfo/" + item.sid + "/" + item.eid)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status == '200') {
                        window.open("http://localhost:8080/viewTest", '_blank')
                        this.$storage.set("viewTestItem", res.data.data);
                        this.$storage.set("viewTestInfo", item);
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: "warning"
                        })
                    }
                })

        },
    },
};
</script>

<style lang="less" scoped>
.test-root {
    .img-name {
        display: flex;
        align-items: center
    }

    img {
        width: 30px;
    }
}
</style>