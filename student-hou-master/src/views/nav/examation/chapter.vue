<template>
    <div class="cRoot">
        <el-card>
            <el-tabs v-model="activeName" @tab-click="TabHandleClick">

                <el-tab-pane label="教学课程" name="1">
                    <div class="search">
                        <div class="s_cont">
                            <div class="tag">教师：</div>
                            <el-select v-model="query_teacher" placeholder="请选择教师" clearable
                                @change="teacherChange($event)">
                                <el-option v-for="item in optionsTeacher" :key="item.cid" :label="item.nickName"
                                    :value="item.tid">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="s_cont">
                            <div class="tag">课程：</div>
                            <el-select v-model="query_course" placeholder="请选择课程" clearable
                                @visible-change="visibleChange($event, 2)">
                                <el-option v-for="item in optionsCourse" :key="item.cid" :label="item.courseName"
                                    :value="item.cid">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="s_cont">
                            <div class="tag">内容：</div>
                            <el-input v-model="query_cont" placeholder="请输入试题内容"></el-input>
                        </div>

                        <el-button type="primary" plain @click="query(1)"><i
                                class="el-icon-search"></i>&nbsp;搜索</el-button>
                        <el-button type="primary" plain @click="queryReset()"><i
                                class="el-icon-refresh-right"></i>&nbsp;重置</el-button>
                    </div>

                    <el-table class="chapterTable" :data="chapterData" style="width: 100%">

                        <el-table-column label="教师名称" width="180">
                            <template slot-scope="scope">
                                {{ scope.row.nickName }}
                            </template>
                        </el-table-column>
                        <el-table-column label="课程名称" width="180">
                            <template slot-scope="scope">
                                {{ scope.row.courseName }}
                            </template>
                        </el-table-column>
                        <el-table-column label="章节序号" width="150">
                            <template slot-scope="scope">
                                <el-tag size="medium">{{ scope.row.chapter }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="章节名称" width="360">
                            <template slot-scope="scope">
                                <div class="oldName">
                                    <span class="name">{{ scope.row.chapterName }}</span>
                                </div>
                                <div class="newName">
                                    <div>
                                        <el-input v-model="scope.row.chapterName" placeholder="请输入名称"></el-input>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <el-button type="primary" size="mini"
                                            @click="submitNewChapter(scope.$index, scope.row)">确认</el-button>
                                        <el-button type="primary" size="mini"
                                            @click="ChapterEdit(scope.$index, 1)">取消</el-button>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="章节状态" width="150">
                            <template slot-scope="scope">
                                <div @click="chapterStatusChange(scope.$index, scope.row)">
                                    <el-switch v-model="chapterStatus[scope.$index]" active-color="#13ce66"
                                        inactive-color="#ff4949">
                                    </el-switch>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" circle size="mini"
                                    @click="ChapterEdit(scope.$index, 2)"></el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" circle
                                    @click="ChapterDelete(scope.$index, scope.row)"></el-button>

                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="page">
                        <el-pagination background layout="prev, pager, next,sizes,total" :total="total"
                            :pageSize="pageSize" :page-sizes="[5, 10]" @size-change="handleSizeChange"
                            @current-change="handleCurrentChange">
                        </el-pagination>
                    </div>
                </el-tab-pane>


                <el-tab-pane label="添加章节" name="2">
                    <el-form ref="addChapterForm" :model="addChapterForm" :rules="chapterRules" label-width="120px">
                        <el-form-item label="课程名称" style="width: 70%;" prop="addCourseName">
                            <el-select v-model="addChapterForm.addCourseName" placeholder="请选择课程名称">
                                <el-option v-for="item in courseData" :key="item.cid"
                                    :label="item.courseName + '（' + item.nickName + '）'" :value="item.cid">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="章节序号" style="width: 70%;" prop="addChapterNum">
                            <el-select v-model="addChapterForm.addChapterNum" placeholder="请选择章节序号">
                                <el-option
                                    v-for="(item, index) in ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '二十一', '二十二', '二十三', '二十四']"
                                    :key="index" :label="'第' + item + '章'" :value="index + 1">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="章节名称" style="width: 70%;" prop="addChapterName">
                            <el-input v-model="addChapterForm.addChapterName" placeholder="请输入章节名称"></el-input>
                        </el-form-item>

                        <el-form-item label="章节开放状态" style="width: 70%;" prop="addChapterStatus">
                            <el-switch v-model="addChapterForm.addChapterStatus" active-color="#13ce66"
                                inactive-color="#ff4949" active-value="1" inactive-value="0">
                            </el-switch>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="submitChapterForm('addChapterForm')">立即添加</el-button>
                            <el-button @click="resetChapterForm('addChapterForm')">重置</el-button>
                        </el-form-item>
                    </el-form>

                </el-tab-pane>

            </el-tabs>
        </el-card>
    </div>

</template>

<script>
export default {
    name: 'XiaozhiHouChapter',

    data() {
        return {
            //当前页
            currentPage: 1,
            //每页条数
            pageSize: 5,
            //总数
            total: 0,
            //总页数
            pages: 0,
            //query
            query_cont: "",
            query_course: "",
            query_teacher: '',
            optionsCourse: [],
            optionsTeacher: [],

            activeName: '1',

            // 添加章节
            addChapterForm: {
                addCourseName: "",
                addChapterNum: "",
                addChapterName: "",
                addChapterStatus: "1"
            },
            chapterRules: {
                addCourseName: [
                    { required: true, message: '请选择课程名称', trigger: 'change' }
                ],
                addChapterNum: [
                    { required: true, message: '请选择章节序号', trigger: 'change' }
                ],
                addChapterName: [
                    { required: true, message: '请输入章节名称', trigger: 'blur' }
                ],
                addChapterStatus: [
                    { required: true, message: '请选择章节状态', trigger: 'change' }
                ],
            },

            //课程数据
            courseData: [],
            //处理后的课程数据
            processedCourseData: [],

            // 章节数据
            chapterData: [],
            // 章节状态
            chapterStatus: [],
        };
    },

    mounted() {
        this.getAllCourse();
        this.query(0);
    },

    methods: {
        /*query
                * 1:条件查询
                * 0:无条件查询
                */
        query(query) {
            console.log("query 条件：", this.query_cont, this.query_course, this.query_teacher);
            // return
            //无条件查询
            if (query == 0) {
                this.getPageData({
                    cid: this.query_course,
                    tid: this.query_teacher,
                    chapterName: this.query_cont.trim(),
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                });
                return;
            }

            //有条件查询
            if (this.query_cont === '' && this.query_teacher === '' && this.query_course === '' && query == 1) {
                this.$message({
                    message: "请输入检索条件",
                    type: "warning"
                })
            } else {
                // console.log("query 条件：", this.query_cont, this.query_course, this.query_teacher, this.type);
                this.getPageData({
                    tid: this.query_teacher,
                    cid: this.query_course,
                    chapterName: this.query_cont.trim(),
                    currentPage: 1,
                    pageSize: this.pageSize
                });
            }

        },
        queryReset() {
            this.query_cont = ""
            this.query_course = ""
            this.query_teacher = ""
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
            this.$axios.get("/chapter/getChapterCourseByPage", {
                params: query
            }).then(res => {
                // console.log(res.data);
                let records = res.data.data.records;
                if (records.length == 0) {
                    this.chapterData = [];
                    return;
                }
                records.sort((a, b) => {
                    // 首先比较 nickName 属性
                    if (a.nickName !== b.nickName) {
                        return a.nickName.localeCompare(b.nickName);
                    }
                    // 如果 nickName 相同，则比较 courseName 属性
                    if (a.courseName !== b.courseName) {
                        return a.courseName.localeCompare(b.courseName);
                    }
                    // 如果 courseName 也相同，则比较 chapterNum 属性
                    return a.chapterNum - b.chapterNum;
                });
                for (let i = 0; i < records.length; i++) {
                    let e = records[i];
                    e.chapter = '第' + this.$util.numberToChinese(e.chapterNum) + '章';

                    if (e.chapterStatus == '1') {
                        this.chapterStatus[i] = true
                    } else {
                        this.chapterStatus[i] = false
                    }
                }
                this.chapterData = records;
                this.total = res.data.data.total;
                this.pages = res.data.data.pages;
                // console.log(this.total, this.pages, this.chapterData, this.chapterStatus);
            })
        },

        /**
         * 
         * @param {*} status 出现则为 true，隐藏则为 false
         */
        visibleChange(status, index) {
            if (status) {
                // console.log(this.courseData);

                if (index == 2 && this.query_teacher == '') {
                    this.$message({
                        message: '请先选择教师',
                        type: "warning"
                    })
                }
            }
        },
        teacherChange() {
            // console.log("t:", this.query_teacher);
            for (let i = 0; i < this.optionsTeacher.length; i++) {
                let e = this.optionsTeacher[i];
                if (e.tid == this.query_teacher) {
                    this.optionsCourse = e.optionsCourse
                }
            }

            // console.log(this.optionsTeacher, this.optionsCourse);
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
                        this.courseData = res.data.data;
                        this.handCourseData()
                    }
                })
        },
        //处理课程数据
        /* this.optionsTeacher = [{
                tid: e.tid,
                nickName: e.nickName,
                tname: e.tname,
                optionsCourse:[{
                    cid: e.cid,
                    courseInfo: e.courseInfo,
                    courseName: e.courseName,
                    createTime: e.createTime
                }]
            }] */
        handCourseData() {

            // 假设这是你的原始数组
            let originalArray = this.courseData

            // 使用reduce函数处理数组
            let processedCourseData = originalArray.reduce((acc, cur) => {
                // 查找是否已经存在相同tid的对象
                let existingItem = acc.find(item => item.tid === cur.tid);
                // 如果存在相同tid的对象，则将当前课程数据加入到optionsCourse中
                if (existingItem) {
                    existingItem.optionsCourse.push({
                        cid: cur.cid,
                        courseInfo: cur.courseInfo,
                        courseName: cur.courseName,
                        createTime: cur.createTime
                    });
                } else {
                    // 如果不存在相同tid的对象，则创建一个新的对象
                    acc.push({
                        tid: cur.tid,
                        nickName: cur.nickName,
                        tname: cur.tname,
                        optionsCourse: [{
                            cid: cur.cid,
                            courseInfo: cur.courseInfo,
                            courseName: cur.courseName,
                            createTime: cur.createTime
                        }]
                    });
                }
                return acc;
            }, []);
            this.optionsTeacher = processedCourseData
        },
        TabHandleClick(tab, event) {
            console.log(tab.name, event);
        },

        // 添加章节
        submitChapterForm() {
            this.$refs.addChapterForm.validate((valid) => {
                if (valid) {
                    console.log(this.addChapterForm);
                    if (this.addChapterForm.addChapterName.trim() == '') {
                        this.$message({
                            message: "请输入章节名称",
                            type: "error"
                        })
                        return false;
                    }
                    let numRes = this.$util.convertToNumber(this.addChapterForm.addChapterStatus);
                    let newChapter = {
                        cid: this.addChapterForm.addCourseName,
                        chapterNum: this.addChapterForm.addChapterNum,
                        chapterName: this.addChapterForm.addChapterName.trim(),
                        chapterStatus: numRes.success ? numRes.number : 0
                    }
                    console.log(newChapter);
                    this.$axios.post("/chapter/addChapter", newChapter)
                        .then(res => {
                            console.log(res.data);
                            if (res.data.status == '200') {
                                this.$message({
                                    message: "添加成功",
                                    type: "success",
                                    duration: 1000,
                                    onClose: res => {
                                        this.resetChapterForm()
                                    }
                                })
                            } else {
                                this.$message({
                                    message: res.data.message,
                                    type: "error"
                                })
                            }
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetChapterForm() {
            this.$refs.addChapterForm.resetFields();
        },

        // 编辑章节
        handleEditChapter(cid) {
            // console.log(row, this.userinfo.userData);

            this.$axios.get("/chapter/getChapter/" + this.userinfo.userData.tid + "/" + cid)
                .then(res => {
                    // console.log(res.data.data);
                    if (res.data.data == null || res.data.data.length == 0) {
                        this.$message({
                            message: "暂无章节，请上传章节",
                            type: "error"
                        })
                    } else {
                        this.drawer = true;
                        this.chapterData = res.data.data
                        this.chapterData.sort((a, b) => a.chapterNum - b.chapterNum);
                        for (let i = 0; i < this.chapterData.length; i++) {
                            this.chapterData[i].chapterNum = '第' + this.$util.numberToChinese(this.chapterData[i].chapterNum) + '章'
                            if (this.chapterData[i].chapterStatus == 1) {
                                this.chapterStatus[i] = true
                            } else {
                                this.chapterStatus[i] = false
                            }

                        }
                    }

                    console.log(this.chapterData);
                })
        },
        // 删除章节
        ChapterDelete(index, row) {
            console.log(index, row);
            this.$confirm('是否删除该章节?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete("/chapter/deleteChapter/" + row.chid)
                    .then(res => {
                        if (res.data.status == '200') {
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                                duration: 1000,
                                onClose: res => {
                                    this.query(0)
                                }
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: this.data.message
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
        //修改章节信息
        ChapterEdit(index, type) {
            let oldName = document.getElementsByClassName('oldName')[index];
            let newName = document.getElementsByClassName('newName')[index];

            let oldDisplay = window.getComputedStyle(oldName).getPropertyValue('display');
            let newDisplay = window.getComputedStyle(newName).getPropertyValue('display');

            // 取消编辑
            if (type == 1) {
                oldDisplay = 'block'
                newDisplay = 'none'
            }

            //编辑
            if (type == 2) {
                oldDisplay = 'none'
                newDisplay = 'block'
            }
            console.log("after:", oldDisplay, newDisplay);
            oldName.style.display = oldDisplay;
            newName.style.display = newDisplay;
        },
        submitNewChapter(index, row) {
            console.log(row);
            this.$axios.post("/chapter/updateChapter", row)
                .then(res => {
                    if (res.data.status == '200') {
                        this.chapterData[index] = res.data.data;
                        this.ChapterEdit(index, 1)
                        this.$message({
                            message: "修改成功",
                            type: "success"
                        })
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: "error"
                        })
                    }
                })
        },
        // 修改状态
        chapterStatusChange(index, row) {
            row.chapterStatus = Number(this.chapterStatus[index])
            console.log(this.chapterStatus[index], row);


            this.$axios.post("/chapter/updateChapter", row)
                .then(res => {
                    if (res.data.status == '200') {
                        this.$message({
                            message: this.chapterStatus[index] ? '已设置成可见' : '已设置成不可见',
                            type: this.chapterStatus[index] ? "success" : 'error'
                        })
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: "error",
                            duration: 500,
                            onClose: () => {
                                this.chapterStatus[index] = !this.chapterStatus[index]
                            }
                        })
                    }
                })
        },
    },
};
</script>

<style lang="less" scoped>
.cRoot {
    // margin: 10px;
    margin: 10px 10px 0;

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


    .chapterTable {
        .oldName {

            .name {
                margin-right: 20px;
            }

            i {
                width: 50px;
                color: #4b77fa;
            }
        }

        .newName {
            display: none;

            div {
                display: flex;
            }
        }

    }

}
</style>