<template>
    <el-card>
        <div class="top">
            <div class="search">
                <div class="s_cont">
                    <div class="tag">课程:</div>
                    <el-input v-model="query_course" placeholder="请输入课程"></el-input>
                </div>
                <div class="s_cont">
                    <div class="tag">名称:</div>
                    <el-input v-model="query_ExamName" placeholder="请输入试卷名称"></el-input>
                </div>

                <el-button type="primary" plain @click="query(1)"><i class="el-icon-search"></i>&nbsp;搜索</el-button>
                <el-button type="primary" plain @click="queryReset()"><i
                        class="el-icon-refresh-right"></i>&nbsp;重置</el-button>
            </div>

            <div class="addQuestion">
                <el-button type="primary" @click="addExamDialogVisible = true">新增试卷</el-button>
            </div>

        </div>

        <div class="exam">
            <el-table :data="tableData" style="width: 100%">

                <el-table-column label="试卷名称" width="180" prop="examinationName" fixed></el-table-column>

                <el-table-column label="课程名称" width="150" prop="courseName"></el-table-column>
                <el-table-column label="章节" width="120" prop="chapter"></el-table-column>
                <el-table-column label="开始时间" width="180" prop="startTime"></el-table-column>
                <el-table-column label="结束时间" width="180" prop="endTime"></el-table-column>
                <el-table-column label="状态" width="150">
                    <template slot-scope="scope">
                        <el-tag size="medium" type="success" v-if="scope.row.counts > 1">已上传试题</el-tag>
                        <el-tag size="medium" type="danger" v-else>未上传试题</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="查看试卷" fixed="right" width="100">
                    <template slot-scope="scope">
                        <div @click="statusChange(scope.$index, scope.row)">
                            <el-switch v-model="enableStatus[scope.$index]" active-color="#13ce66"
                                inactive-color="#ff4949">
                            </el-switch>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="300">
                    <template slot-scope="scope">
                        <!-- <el-button size="mini" @click="handleUpQuestionToExam(scope.$index, scope.row)"
                            v-if="scope.row.counts > 1" disabled>编辑试题</el-button> -->
                        <el-button size="mini" @click="handleUpQuestionToExam(scope.$index, scope.row)">编辑试题</el-button>

                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑信息</el-button>
                        <el-button size="mini" type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination background layout="prev, pager, next,sizes,total" :total="total" :pageSize="pageSize"
                    :page-sizes="[5, 10]" @size-change="handleSizeChange" @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>


        <el-dialog title="新增试卷" class="addExam" :visible.sync="addExamDialogVisible" width="40%">
            <div><span>课程名称：</span><el-select v-model="optionsCourseValue" placeholder="请选择课程"
                    @visible-change="visibleChange($event, 1)">
                    <el-option v-for="item in optionsCourse" :key="item.cid" :label="item.courseName" :value="item.cid">
                    </el-option>
                </el-select>
            </div>
            <div><span>章节：</span><el-select v-model="optionsChapterValue" placeholder="请选择章节"
                    @visible-change="visibleChange($event, 2)">
                    <el-option v-for="(item, index) in optionsChapter" :key="index" :label="item" :value="index + 1">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>试卷名称：</span><el-input v-model="ExamName" placeholder="请输入试卷名称"
                    style="margin-left: 17px;"></el-input>
            </div>
            <div><span>开始时间：</span>
                <el-date-picker v-model="startTime" type="datetime" placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
            </div>
            <div><span>结束时间：</span>
                <el-date-picker v-model="endTime" type="datetime" placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addExamDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSubmit()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑试卷信息" class="updateExam" :visible.sync="updateExamDialogVisible" width="40%">
            <div><span>课程名称：</span><el-input v-model="examInfo.courseName" style="margin-left: 17px;"
                    disabled></el-input>
            </div>
            <div>
                <span>试题名称：</span><el-input v-model="examInfo.examinationName" placeholder="请输入试题名称"
                    style="margin-left: 17px;"></el-input>
            </div>
            <div><span>开始时间：</span>
                <el-date-picker v-model="examInfo.startTime" type="datetime" placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
            </div>
            <div><span>结束时间：</span>
                <el-date-picker v-model="examInfo.endTime" type="datetime" placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateExamDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateSubmit()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑试题" class="editQuestionExam" :visible.sync="UpQuestionToExamDialogVisible" width="50%">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="抽取试题" name="first" class="first">
                    <div class="tips">Tips：题库中抽取试题</div>
                    <div class="examinfo">
                        <div><span>课程名称：</span><el-tag>{{ examInfo.courseName }}</el-tag></div>
                        <div><span>章节：</span><el-tag>{{ examInfo.chapter + ' ' + examInfo.chapterName }}</el-tag></div>
                        <div><span>试卷名称：</span><el-tag>{{ examInfo.examinationName }}</el-tag></div>
                    </div>

                    <el-form ref="questionCountForm" :model="questionCountForm" label-width="120px">
                        <el-form-item label="选择题数量：">
                            <el-input v-model="questionCountForm.optionCount" style="width: 250px;"></el-input>
                        </el-form-item>
                        <el-form-item label="填空题数量：">
                            <el-input v-model="questionCountForm.fillCount" style="width: 250px;"></el-input>
                        </el-form-item>
                        <el-form-item label="判断题数量：">
                            <el-input v-model="questionCountForm.judgeCount" style="width: 250px;"></el-input>
                        </el-form-item>
                    </el-form>

                </el-tab-pane>
                <el-tab-pane label="上传试题" name="second" class="second">
                    <div class="tips">Tips：上传试卷的所有试题</div>
                    <div class="examinfo">
                        <div><span>课程名称：</span><el-tag>{{ examInfo.courseName }}</el-tag></div>
                        <div><span>章节：</span><el-tag>{{ examInfo.chapter + ' ' + examInfo.chapterName }}</el-tag></div>
                        <div><span>试卷名称：</span><el-tag>{{ examInfo.examinationName }}</el-tag></div>
                    </div>
                    <div class="upFile">
                        上传试题:
                        <el-upload class="upload-demo" drag ref="upload" :action="fileUpUrl" :auto-upload="false"
                            :on-success="onSuccess" :on-error="onError">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传Excel文件,上传模板请联系管理员</div>
                        </el-upload>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button @click="UpQuestionToExamDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="UpQuestionToExamSubmit()">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    name: 'XiaozhiQianTestPaperInfo',

    data() {
        return {
            userinfo: "",
            tableData: [],
            //启用状态
            enableStatus: [],

            //上传试题
            UpQuestionToExamDialogVisible: false,
            activeName: "first",
            fileUpUrl: "",

            questionCountForm: {
                optionCount: "",
                fillCount: "",
                judgeCount: ""
            },

            //编辑试卷信息弹窗
            updateExamDialogVisible: false,
            examInfo: "",

            //新增试卷弹窗
            addExamDialogVisible: false,
            optionsCourse: [],//老师已教的课程
            optionsCourseValue: "",
            ExamName: "",
            endTime: "",
            startTime: "",
            optionsChapterValue: '',
            optionsChapter: [],

            //查询条件
            query_course: "",
            query_ExamName: "",
            //当前页
            currentPage: 1,
            //每页条数
            pageSize: 5,
            //总数
            total: 0,
            //总页数
            pages: 0

        };
    },

    mounted() {
        this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
        this.query(0)

        //获得老师已教的课程
        this.$axios.get("/teacher/getAllCourseByTid/" + this.userinfo.userData.tid)
            .then(res => {
                console.log(res.data);
                this.optionsCourse = res.data.data;
            })

    },

    methods: {
        //启用状态改变
        statusChange(index, row) {
            // console.log(index, row, this.enableStatus[index])

            let enable = Number(this.enableStatus[index]);
            let mes = enable == 1 ? '提交后允许查看试卷' : '提交后不允许查看试卷'
            // console.log(mes);
            let updateData = {
                cid: row.cid,
                eid: row.eid,
                examinationName: row.examinationName,
                startTime: row.startTime,
                endTime: row.endTime,
                isLook: enable
            }
            this.$axios.post("/examination/updateExam", updateData)
                .then(res => {
                    // console.log(res.data);
                    if (res.data.status == '200') {
                        this.$message({
                            message: mes,
                            type: enable == 1 ? "success" : "error"
                        })
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: "error"
                        })
                    }
                })
        },



        //为试卷上传试题
        handleUpQuestionToExam(index, row) {
            // console.log(index, row);
            this.examInfo = row
            this.UpQuestionToExamDialogVisible = true;
        },

        jiaoyanshuzi() {
            let option = this.$util.convertToNumber(this.questionCountForm.optionCount)
            let fill = this.$util.convertToNumber(this.questionCountForm.fillCount)
            let judge = this.$util.convertToNumber(this.questionCountForm.judgeCount)

            if ((option.number + fill.number + judge.number) > 10 || (option.number + fill.number + judge.number) == 0)
                return false;

            if (option.success && fill.success && judge.success) {
                if ((0 <= option.number && option.number <= 10) &&
                    (0 <= fill.number && fill.number <= 10) &&
                    (0 <= judge.number && judge.number <= 10)) {
                    this.questionCountForm.optionCount = option.number
                    this.questionCountForm.fillCount = fill.number
                    this.questionCountForm.judgeCount = judge.number
                    return true;
                } else
                    return false;
            } else
                return false;
        },
        UpQuestionToExamSubmit() {
            //抽题
            if (this.activeName == 'first') {
                console.log(this.activeName, this.examInfo, 'first');
                if (this.jiaoyanshuzi()) {
                    console.log("up", this.questionCountForm);

                    this.handleOptionQuestion()
                } else {
                    this.$message({
                        message: "每种类型0-10道题，总共10道题",
                        type: "error"
                    })

                }
                this.questionCountForm = {
                    optionCount: "",
                    fillCount: "",
                    judgeCount: ""
                }
                return
            }
            // 上传试题
            if (this.activeName == 'second') {
                console.log(this.activeName, this.examInfo, 'second');
                this.fileUpUrl = "http://localhost:8888/examination/questionToExamByUp?cid=" + this.examInfo.cid +
                    "&eid=" + this.examInfo.eid + "&chid=" + this.examInfo.chid;
                this.$refs.upload.submit();
            }

        },

        //抽题
        handleOptionQuestion() {
            let optionData = {
                eid: this.examInfo.eid,
                cid: this.examInfo.cid,
                chid: this.examInfo.chid,
                optionCount: this.questionCountForm.optionCount,
                fillCount: this.questionCountForm.fillCount,
                judgeCount: this.questionCountForm.judgeCount
            }
            console.log(optionData);
            // return;
            this.$axios.post("/examination/questionToExamByOption", optionData)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status == '200') {
                        this.$message({
                            message: "成功生成试卷",
                            type: "success"
                        })
                        this.UpQuestionToExamDialogVisible = false;
                        this.query(0)
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: "error"
                        })
                    }
                })
        },
        //上传试题
        onSuccess(res, file, fileList) {
            console.log("res", res, file, fileList);
            if (res.status === "200") {
                this.$message({
                    message: "上传成功",
                    type: "success",
                    duration: 1000,
                    onClose: res => {
                        this.$refs.upload.clearFiles();
                        this.UpQuestionToExamDialogVisible = false;
                    }
                })

            }
            this.query(0)
        },
        onError(err, file, fileList) {
            console.log("err", err);
            if (err.status === "500") {
                this.$message({
                    message: "上传失败",
                    type: "error"
                })
            }
        },
        handleClick(tab, event) {
            // console.log(tab, event);
        },



        visibleChange(status, index) {
            console.log(status);
            if (status) {
                if (index == 1) {
                    console.log("course");
                    this.optionsChapter = new Array(24);
                    for (let i = 0; i < this.optionsChapter.length; i++) {
                        this.optionsChapter[i] = '第' + this.$util.numberToChinese(i + 1) + '章'
                    }
                    return
                }
                if (index == 2 && this.optionsCourseValue == '') {
                    this.$message({
                        message: "请先选择课程",
                        type: "warning"
                    })
                }

            }
        },
        //添加试卷
        addSubmit() {
            // console.log("addSubmit()", this.optionsCourseValue, this.optionsChapterValue, this.ExamName, this.startTime, this.endTime);
            // return;
            let addData = {
                examinationName: this.ExamName.trim(),
                startTime: this.startTime,
                endTime: this.endTime,
                cid: this.optionsCourseValue,
                chid: this.optionsChapterValue,
                isLook: 0
            }
            if (addData.examinationName.trim() === '' || !addData.startTime || !addData.endTime || !addData.cid || !addData.chid) {
                this.$message({
                    message: "请输入试卷信息",
                    type: "warning"
                })
                return;
            }
            this.$axios.post("/examination/addExam/" + this.userinfo.userData.tid, addData)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status == "200") {
                        this.$message({
                            message: "添加成功",
                            type: "success",
                            onClose: res => {
                                this.optionsCourseValue = "",
                                    this.ExamName = "",
                                    this.endTime = "",
                                    this.startTime = "",
                                    this.optionsChapterValue = ''
                            }
                        });
                        this.addExamDialogVisible = false;
                        this.query(0)
                    } else {
                        this.$message({
                            message: "添加失败",
                            type: "error"
                        });
                    }
                })
        },

        //删除试卷
        handleDelete(index, row) {
            console.log(index, row);
            this.$confirm('是否删除试卷?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete("/examination/deleteExam/" + row.eid)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.status == '200') {
                            this.$message({
                                message: "删除成功",
                                type: "success"
                            });
                            this.updateExamDialogVisible = false;
                            this.query(0)
                        } else {
                            this.$message({
                                message: res.data.message,
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



        },

        //编辑试卷信息
        handleEdit(index, row) {
            // console.log(index, row);
            this.examInfo = row
            this.updateExamDialogVisible = true;
        },
        updateSubmit() {
            console.log("examInfo:", this.examInfo);
            let updateData = {
                cid: this.examInfo.cid,
                eid: this.examInfo.eid,
                examinationName: this.examInfo.examinationName.trim(),
                startTime: this.examInfo.startTime,
                endTime: this.examInfo.endTime,
            }
            this.$axios.post("/examination/updateExam", updateData)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status == '200') {
                        this.$message({
                            message: "编辑成功",
                            type: "success",
                            duration: 1000,
                            onClose: res => {
                                this.updateExamDialogVisible = false;
                            }
                        });
                        this.query(0)
                    } else {
                        this.$message({
                            message: "编辑失败",
                            type: "error"
                        });
                    }
                })
        },

        /*query
        * 1:条件查询
        * 0:无条件查询
        */
        query(query) {
            // console.log("query()", this.query_ExamName, this.query_course);
            //无条件查询
            if (query == 0) {
                this.getPageData({
                    tid: this.userinfo.userData.tid,
                    queryCourse: this.query_course.trim(),
                    queryExamName: this.query_ExamName.trim(),
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                });
                return;
            }

            //有条件查询
            if (this.query_ExamName === '' && this.query_course === '' && query == 1) {
                this.$message({
                    message: "请输入检索条件",
                    type: "warning"
                })
            } else {
                this.getPageData({
                    tid: this.userinfo.userData.tid,
                    queryCourse: this.query_course.trim(),
                    queryExamName: this.query_ExamName.trim(),
                    currentPage: 1,
                    pageSize: this.pageSize
                });
            }

        },
        queryReset() {
            this.query_ExamName = ""
            this.query_course = ""
            this.pageSize = 5
            this.currentPage = 1
            this.query(0)
        },

        //处理分页
        handleCurrentChange(val) {
            this.currentPage = val;
            console.log(`当前页: ${this.currentPage}`, `每页 ${this.pageSize} 条`);
            this.query(0)
        },
        handleSizeChange(val) {
            this.pageSize = val;
            console.log(`当前页: ${this.currentPage}`, `每页 ${this.pageSize} 条`);
            this.query(0)
        },
        //分页数据请求
        getPageData(query) {
            this.$axios.get("/examination/getTestByTid", {
                params: query
            }).then(res => {
                console.log(res.data);
                if (res.data.status === "500") {
                    this.tableData = [];
                    return;
                }
                this.tableData = res.data.data.records;
                this.total = res.data.data.total;
                this.pages = res.data.data.pages;
                this.tableData.sort((a, b) => {
                    // 首先比较 courseName 属性
                    if (a.cid !== b.cid) {
                        return a.cid - b.cid
                    }
                    // 如果 courseName 相同，则比较 chapterNum 属性
                    return a.chapterNum - b.chapterNum;
                });
                for (let i = 0; i < this.tableData.length; i++) {
                    //格式化章节序号
                    this.tableData[i].chapter = '第' + this.$util.numberToChinese(this.tableData[i].chapterNum) + '章'

                    if (this.tableData[i].isLook == 1)
                        this.enableStatus[i] = true
                    else
                        this.enableStatus[i] = false
                }
                console.log(this.total, this.pages, this.tableData);
                // console.log(this.enableStatus);
            })
        },


    },
};
</script>

<style lang="less" scoped>
.top {
    display: flex;
    justify-content: space-between;

    .search {
        width: 80%;
        display: flex;

        .s_cont {
            display: flex;
            width: 200px;
            margin-right: 20px;

            .tag {
                width: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
}

.page {
    margin-top: 20px;
}

.editQuestionExam {
    .second {
        .upFile {
            margin-top: 30px;
            display: flex;

            .upload-demo {
                margin-left: 20px;
            }
        }
    }

    .tips {
        margin: 10px 0;
    }

    .examinfo {
        display: flex;
        margin-bottom: 20px;

        div {
            flex: 1;

            span {
                margin-right: 10px;
            }
        }

    }
}

.addExam,
.updateExam {
    div {
        display: flex;
        margin: 10px 0;
        align-items: center;

        span {
            width: 100px;
        }
    }
}
</style>