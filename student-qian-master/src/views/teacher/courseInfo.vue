<template>
    <el-card class="info-root">
        <el-tabs v-model="activeName" @tab-click="TabHandleClick">
            <el-tab-pane label="教学课程" name="1">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="课程名称">
                                    <el-tag size="medium">{{ props.row.courseName }}</el-tag>
                                </el-form-item>
                                <br>
                                <el-form-item label="简介">
                                    <span>{{ props.row.courseInfo }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建日期" width="210">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="课程名称" width="210">
                        <template slot-scope="scope">
                            <el-tag size="medium">{{ scope.row.courseName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改课程</el-button>
                            <el-button size="mini" @click="handleEditChapter(scope.row.cid)">编辑章节</el-button>
                            <el-button size="mini" type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="增加课程" name="2">
                <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="80px">
                    <el-form-item label="课程名称" style="width: 70%;" prop="addCourseName">
                        <el-input v-model="addForm.addCourseName" placeholder="请输入课程名称"></el-input>
                    </el-form-item>

                    <el-form-item label="创建时间" style="width: 70%;" required>
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.addDate1"
                                value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2" style="display: flex;justify-content: center;">-</el-col>
                        <el-col :span="11">
                            <el-time-picker placeholder="选择时间" v-model="addForm.addDate2" value-format="HH:mm:ss"
                                style="width: 100%;"></el-time-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="课程简介" style="width: 70%;" prop="addCourseInfo">
                        <el-input type="textarea" v-model="addForm.addCourseInfo" placeholder="请输入简介"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="addCourse('addForm')">立即创建</el-button>
                        <el-button @click="resetForm('addForm')">重置</el-button>
                    </el-form-item>
                </el-form>

            </el-tab-pane>

            <el-tab-pane label="添加章节" name="3">
                <el-form ref="addChapterForm" :model="addChapterForm" :rules="chapterRules" label-width="120px">
                    <el-form-item label="课程名称" style="width: 70%;" prop="addCourseName">
                        <el-select v-model="addChapterForm.addCourseName" placeholder="请选择课程名称">
                            <el-option v-for="item in tableData" :key="item.cid" :label="item.courseName"
                                :value="item.cid">
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

        <el-dialog title="修改课程信息" :visible.sync="dialogVisible" width="50%">
            <div>
                <el-form ref="updateForm" :model="updateForm" :rules="addRules" label-width="80px">
                    <el-form-item label="课程名称" prop="addCourseName">
                        <el-input v-model="updateForm.addCourseName" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="创建日期" required>
                        {{ updateForm.createTime }}
                    </el-form-item>

                    <el-form-item label="课程简介" prop="addCourseInfo">
                        <el-input type="textarea" :rows="4" v-model="updateForm.addCourseInfo"
                            placeholder="请输入简介"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="updateCourse('updateForm')">修改</el-button>
                        <el-button @click="dialogVisible = false">取 消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>

        <el-drawer class="drawer" title="课程章节信息" :visible.sync="drawer" size="50%">
            <div style="padding: 0 20px;">
                <el-table :data="chapterData" style="width: 100%">

                    <el-table-column label="章节序号" width="100">
                        <template slot-scope="scope">
                            <el-tag size="medium">{{ scope.row.chapter }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="章节名称" width="260">
                        <template slot-scope="scope">
                            <div class="oldName">
                                <span class="name">{{ scope.row.chapterName }}</span>
                                <el-button type="primary" icon="el-icon-edit" circle size="mini"
                                    @click="ChapterEdit(scope.$index, 2)"></el-button>
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
                            <!-- <el-button size="mini" @click="ChapterEdit(scope.$index, scope.row)">修改章节</el-button> -->
                            <el-button size="mini" type="danger"
                                @click="ChapterDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-drawer>
    </el-card>
</template>

<script>
export default {
    name: 'XiaozhiQianCourseInfo',

    data() {
        return {
            userinfo: "",
            activeName: "1",
            tableData: [],
            dialogVisible: false,


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
            chapterData: [],
            drawer: false,
            chapterStatus: [],

            //updateCourse的参数
            updateForm: {
                addCourseName: "",
                addCourseInfo: "",
                createTime: ""
            },
            //addCourse的参数
            addForm: {
                addCourseName: "",
                addCourseInfo: "",
                addDate1: "",
                addDate2: ""
            },
            addRules: {
                addCourseName: [
                    { required: true, message: '请输入课程名称', trigger: 'blur' }
                ],
                addCourseInfo: [
                    { required: true, message: '请输入课程简介', trigger: 'blur' }
                ],
                addDate1: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                addDate2: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ],
            }
        };
    },

    beforeMount() {
        this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
        this.getAllCourseByTid();
    },

    methods: {
        TabHandleClick(tab, event) {
            console.log(tab.name, event);
            if (tab.name === "1") {
                this.getAllCourseByTid();
            }
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
                            this.chapterData[i].chapter = '第' + this.$util.numberToChinese(this.chapterData[i].chapterNum) + '章'
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
                                    this.handleEditChapter(row.cid)
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



        // 编辑课程
        handleEdit(index, row) {
            console.log(index, row);
            this.updateForm = {
                cid: row.cid,
                addCourseName: row.courseName,
                addCourseInfo: row.courseInfo,
                createTime: row.createTime
            }
            this.dialogVisible = true;
        },
        updateCourse() {
            console.log("新信息：", this.updateForm);
            let course = {
                cid: this.updateForm.cid,
                courseName: this.updateForm.addCourseName,
                courseInfo: this.updateForm.addCourseInfo,
                createTime: this.updateForm.createTime
            }
            console.log("update Course", course);
            this.$axios.post("/teacher/updateCourse", course).then(res => {
                console.log(res.data);
                if (res.data.status == "200") {
                    this.$message({
                        message: "修改成功",
                        type: "success"
                    })
                    for (let i = 0; i < this.tableData.length; i++) {
                        let e = this.tableData[i];
                        if (e.cid == this.updateForm.cid) {
                            e.courseInfo = this.updateForm.addCourseInfo
                        }
                    }
                    this.dialogVisible = false;
                } else {
                    this.$message({
                        message: res.data.message,
                        type: "error"
                    })
                }
            })

        },

        //删除课程
        handleDelete(index, row) {
            console.log(index, row);
            this.$confirm('是否删除该课程?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post("/teacher/deleteCourse?cid=" + row.cid + "&tid=" + this.userinfo.userData.tid)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.status === "200") {
                            this.$message({
                                message: "删除成功",
                                type: "success"
                            })
                            this.getAllCourseByTid();
                        }
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },

        //增加课程
        addCourse(addForm) {
            this.$refs[addForm].validate((valid) => {
                if (valid) {
                    // console.log("addCourse", this.addForm);
                    console.log(this.addForm.addDate1, this.addForm.addDate2);
                    let course = {
                        cid: null,
                        courseName: this.addForm.addCourseName,
                        courseInfo: this.addForm.addCourseInfo,
                        createTime: this.addForm.addDate1 + " " + this.addForm.addDate2
                    }

                    this.$axios.post("/teacher/addCourse?tid=" + this.userinfo.userData.tid, course)
                        .then(res => {
                            console.log(res.data);
                            if (res.data.status === '200') {
                                this.resetForm(addForm);
                                this.$message({
                                    message: "添加成功",
                                    type: "success"
                                })
                                localStorage.removeItem("optionsCourse")
                                this.getAllCourseByTid();
                            }
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(addForm) {
            this.$refs[addForm].resetFields();
        },

        //根据tid获取老师的教学课程
        getAllCourseByTid() {
            // console.log("test");
            this.$axios.get("/teacher/getAllCourseByTid/" + this.userinfo.userData.tid)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status == "200") {
                        for (let i = 0; i < res.data.data.length; i++) {
                            let e = res.data.data[i];
                            e.createTime = this.$util.parseTime(e.createTime, false);
                        }
                        this.tableData = res.data.data
                    }
                })
        }
    },
};
</script>

<style lang="less" scoped>
.drawer {
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
</style>