<template>
    <div class="r">
        <el-card>
            <div class="top">
                <div class="search">
                    <div class="s_cont">
                        <div class="tag">课程：</div>
                        <el-select v-model="query_course" placeholder="请选择课程" clearable>
                            <el-option v-for="item in optionsCourse" :key="item.cid"
                                :label="item.courseName + '（' + item.nickName + '）'" :value="JSON.stringify(item)">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="s_cont">
                        <div class="tag">章节：</div>
                        <el-select v-model="query_chapter" placeholder="请选择章节" :loading="loading" clearable
                            @visible-change="visibleChange($event, 1)">
                            <el-option v-for="item in optionChapter" :key="item.type" :label="item.chapter"
                                :value="item.chapterNum">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="s_cont">
                        <div class="tag">类型：</div>
                        <el-select v-model="type" placeholder="请选择类型" clearable>
                            <el-option v-for="item in optionsType" :key="item.type" :label="item.label"
                                :value="item.type">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="s_cont">
                        <div class="tag">内容：</div>
                        <el-input v-model="query_cont" placeholder="请输入试题内容"></el-input>
                    </div>

                    <el-button type="primary" plain @click="query(1)"><i class="el-icon-search"></i>&nbsp;搜索</el-button>
                    <el-button type="primary" plain @click="queryReset()"><i
                            class="el-icon-refresh-right"></i>&nbsp;重置</el-button>
                </div>

                <div class="addQuestion">
                    <el-button type="primary" @click="dialogVisible = true">新增试题</el-button>
                </div>

            </div>

            <div class="question">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column label="课程名称" width="150" prop="courseName"></el-table-column>
                    <el-table-column label="章节" width="80" prop="chapter"></el-table-column>
                    <el-table-column label="类型" width="80">
                        <template slot-scope="scope">
                            <el-tag size="medium" type="success">{{ scope.row.questionType }}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="试题内容" width="700" prop="questionContent"></el-table-column>

                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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


            <el-dialog class="dialog" title="批量新增试题" :visible.sync="dialogVisible" width="40%">
                <div class="row">
                    <span>课程名称：</span>
                    <div>
                        <el-select v-model="optionsCourseValue" placeholder="请选择" @change="CourseOptionChange()"
                            clearable>
                            <el-option v-for="item in optionsCourse" :key="item.cid" :label="item.courseName"
                                :value="JSON.stringify(item)">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="row">
                    <span>章节：</span>
                    <div>
                        <el-select v-model="option_one_chapter" placeholder="请选择章节" :loading="loading" clearable
                            @change="CourseOptionChange()" @visible-change="visibleChange($event, 2)">
                            <el-option v-for="item in optionChapter" :key="item.type" :label="item.chapter"
                                :value="item.chapterNum">
                            </el-option>
                        </el-select>
                    </div>
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
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitAddQuestion()">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="编辑试题" :visible.sync="EditDialogVisible" width="40%">
                <div class="editQ" v-if="updateFormInfo != ''">

                    <el-form ref="updateFormInfo" :model="updateFormInfo" label-width="80px">
                        <el-form-item label="课程名称">
                            <el-input v-model="updateFormInfo.courseName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="章节">
                            <el-input v-model="updateFormInfo.chapter" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="类型">
                            <el-tag type="success">{{ updateFormInfo.questionType }}</el-tag>
                        </el-form-item>
                        <el-form-item label="试题题目">
                            <el-input v-model="updateFormInfo.questionContent"></el-input>
                        </el-form-item>

                        <div class="options" v-if="updateFormInfo.questionType == '选择题'">
                            <el-form-item class="option" label="A、"><el-input
                                    v-model="updateFormInfo.optionA"></el-input></el-form-item>
                            <el-form-item class="option" label="B、"><el-input
                                    v-model="updateFormInfo.optionB"></el-input></el-form-item>
                            <el-form-item class="option" label="C、"><el-input
                                    v-model="updateFormInfo.optionC"></el-input></el-form-item>
                            <el-form-item class="option" label="D、"><el-input
                                    v-model="updateFormInfo.optionD"></el-input></el-form-item>

                            <el-form-item label="答案">
                                <el-radio v-model="updateFormInfo.questionAnswer" label="A">A</el-radio>
                                <el-radio v-model="updateFormInfo.questionAnswer" label="B">B</el-radio>
                                <el-radio v-model="updateFormInfo.questionAnswer" label="C">C</el-radio>
                                <el-radio v-model="updateFormInfo.questionAnswer" label="D">D</el-radio>
                            </el-form-item>
                        </div>
                        <div class="judge" v-else-if="updateFormInfo.questionType == '判断题'">
                            <el-form-item label="答案">
                                <el-radio v-model="updateFormInfo.questionAnswer" label="1">正确</el-radio>
                                <el-radio v-model="updateFormInfo.questionAnswer" label="0">错误</el-radio>
                            </el-form-item>
                        </div>
                        <div class="fill" v-else>
                            <el-form-item label="答案">
                                <el-input v-model="updateFormInfo.questionAnswer" required></el-input>
                            </el-form-item>
                        </div>

                        <el-form-item>
                            <el-button type="primary" @click="updateCourse('updateFormInfo')">修改</el-button>
                            <el-button @click="EditDialogVisible = false">取 消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'XiaozhiQianQuestionInfo',

    data() {
        return {
            //edit
            EditDialogVisible: false,
            updateFormInfo: "",
            Rules: [],

            //addQuestion
            dialogVisible: false,
            optionsCourse: [],
            optionsCourseValue: '',
            option_one_chapter: '',
            fileUpUrl: "",


            tableData: [],
            //query条件：试题内容
            query_cont: "",
            query_course: "",
            optionsType: [{
                type: 1,
                label: '选择题'
            }, {
                type: 2,
                label: '填空题'
            }, {
                type: 3,
                label: '判断题'
            }],
            type: "",
            query_chapter: "",
            optionChapter: [],
            loading: true,


            //当前页
            currentPage: 1,
            //每页条数
            pageSize: 5,
            //总数
            total: 0,
            //总页数
            pages: 0,
        };
    },

    beforeMount() {
        //分页数据初始请求
        this.query(0);

        this.getAllCourse()

    },

    methods: {

        //章节列表下拉框
        visibleChange(type, index) {
            if (type) {
                let id = 0;
                this.optionChapter = [];
                // console.log("show", index, this.query_course, this.optionsCourseValue);

                if (index == 1 && this.query_course != '') {
                    id = JSON.parse(this.query_course)
                } else if (index == 2 && this.optionsCourseValue != '') {
                    id = JSON.parse(this.optionsCourseValue)
                } else {
                    this.$message({
                        message: '请先选择课程',
                        type: "warning"
                    })
                }
                if (id == 0)
                    return

                this.$axios.get("/chapter/getChapter/" + id.tid + "/" + id.cid)
                    .then(res => {
                        // console.log(res.data);
                        if (res.data.data.length != 0) {
                            this.optionChapter = res.data.data
                            this.optionChapter.sort((a, b) => a.chapterNum - b.chapterNum);
                            for (let i = 0; i < this.optionChapter.length; i++) {
                                this.optionChapter[i].chapter = '第' + this.$util.numberToChinese(this.optionChapter[i].chapterNum) + '章'
                            }
                            this.loading = false
                            // console.log(this.optionChapter);
                        } else {
                            this.loading = false
                            this.$message({
                                message: '暂无章节',
                                type: "warning"
                            })
                        }
                    })
            }
        },

        //获取所有的教学课程
        getAllCourse() {
            this.$axios.get("/course/getCourseByName?name=")
                .then(res => {
                    // console.log(res.data);
                    if (res.data.status == "200") {
                        for (let i = 0; i < res.data.data.length; i++) {
                            let e = res.data.data[i];
                            e.createTime = this.$util.parseTime(e.createTime, false);
                        }
                        this.optionsCourse = res.data.data
                    }
                })
        },

        //编辑试题
        handleEdit(index, row) {
            console.log(index, row, this.$util.parseQuestion(row));
            this.updateFormInfo = this.$util.parseQuestion(row);
            this.EditDialogVisible = true;
        },
        updateCourse() {
            console.log(this.updateFormInfo);
            let data = {
                cid: this.updateFormInfo.cid,
                qid: this.updateFormInfo.qid,
                questionAnswer: this.updateFormInfo.questionAnswer,
                questionContent: this.updateFormInfo.questionContent,
                questionType: this.updateFormInfo.questionType,
            }
            if (this.updateFormInfo.questionType == "选择题") {
                data.questionContent = this.updateFormInfo.questionContent +
                    "~A)" + this.updateFormInfo.optionA +
                    "~B)" + this.updateFormInfo.optionB +
                    "~C)" + this.updateFormInfo.optionC +
                    "~D)" + this.updateFormInfo.optionD;
            }
            switch (this.updateFormInfo.questionType) {
                case "选择题":
                    data.questionType = 1;
                    break;
                case "填空题":
                    data.questionType = 2;
                    break;
                default:
                    data.questionType = 3;
                    break;
            }
            console.log("edit submit", data);
            this.$axios.post("/question/updateQuestion", data)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status == '200') {
                        this.$message({
                            message: "修改成功",
                            type: "success",
                            duration: 1000,
                            onClose: res => {
                                this.query(0)
                            }
                        })
                        this.EditDialogVisible = false;
                    }
                })
        },

        //删除试题
        handleDelete(index, row) {
            console.log(index, row);
            this.$confirm('将永久删除该试题, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.get("/question/deleteQuestion/" + row.qid)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.status == '200') {
                            this.$message({
                                message: "删除成功",
                                type: "success",
                                duration: 1000,
                                onClose: res => {
                                    this.query(0)
                                }
                            })
                        }
                    })
                this.query(0);
                this.$forceUpdate();

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });


        },

        //新增试题
        submitAddQuestion() {
            this.$refs.upload.submit();
        },
        onSuccess(res, file, fileList) {
            console.log("res", res, file, fileList);
            if (res.status === "200") {
                this.$message({
                    message: "上传成功",
                    type: "success"
                })
                this.$refs.upload.clearFiles();
                this.dialogVisible = false;
            }
            this.query(0)
        },
        onError(err, file, fileList) {
            console.log("err", err, file, fileList);
            if (err.status === "500") {
                this.$message({
                    message: "上传失败",
                    type: "error"
                })
            }
        },
        CourseOptionChange() {
            this.fileUpUrl = "http://localhost:8888/question/uploadQuestionByExcel?cid=" + JSON.parse(this.optionsCourseValue).cid +
                '&chid=' + this.option_one_chapter;
        },

        /*query
        * 1:条件查询
        * 0:无条件查询
        */
        query(query) {


            // return
            //无条件查询
            if (query == 0) {
                this.getPageData({
                    courseName: this.query_course != '' ? JSON.parse(this.query_course).cid : '',
                    questionChapter: this.query_chapter,
                    questionContent: this.query_cont.trim(),
                    questionType: this.type,
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                });
                return;
            }

            //有条件查询
            if (this.query_cont === '' && this.query_chapter === '' && this.query_course === '' && this.type == 0 && query == 1) {
                this.$message({
                    message: "请输入检索条件",
                    type: "warning"
                })
            } else {
                // console.log("query 条件：", this.query_cont, JSON.parse(this.query_course), this.query_chapter, this.type);
                this.getPageData({
                    courseName: JSON.parse(this.query_course).cid,
                    questionChapter: this.query_chapter,
                    questionContent: this.query_cont.trim(),
                    questionType: this.type,
                    currentPage: 1,
                    pageSize: this.pageSize
                });
            }

        },
        queryReset() {
            this.query_cont = ""
            this.query_course = ""
            this.query_chapter = ""
            this.type = ""
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
            console.log(query);
            this.$axios.post("/question/getQuestionPageByTid?tid=0", query).then(res => {
                // console.log(res.data);
                if (res.data.status === "500") {
                    this.tableData = [];
                    return;
                }
                for (let i = 0; i < res.data.data.records.length; i++) {
                    let e = res.data.data.records[i];
                    e.chapter = '第' + this.$util.numberToChinese(e.chapterNum) + '章'
                    if (e.questionType == 1)
                        e.questionType = "选择题"
                    else if (e.questionType == 2)
                        e.questionType = "填空题"
                    else
                        e.questionType = "判断题";
                }
                this.tableData = res.data.data.records;
                this.total = res.data.data.total;
                this.pages = res.data.data.pages;
                console.log(this.total, this.pages, this.tableData);
            })
        }
    },
};
</script>

<style lang="less" scoped>
.r {
    margin: 10px 10px 0;
}

.top {
    display: flex;
    justify-content: space-between;

    .search {
        // width: 90%;
        display: flex;
        flex: 9;

        .s_cont {
            display: flex;
            width: 200px;
            margin-right: 20px;

            .tag {
                width: 90px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }

    .addQuestion {
        flex: 1;
    }
}

.question {
    .page {
        margin-top: 20px;
    }
}

.dialog {
    .row {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        span {
            flex: 1;
            display: flex;
            justify-content: flex-end
        }

        div {
            flex: 7;
        }
    }
}

.upFile {
    margin-top: 30px;
    display: flex;

    .upload-demo {
        margin-left: 10px;
    }
}

.editQ {
    .options {
        .el-form-item {
            margin-bottom: 10px;
        }
    }
}
</style>