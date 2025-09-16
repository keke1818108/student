<template>
    <div class="cRoot">
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
                        <el-table-column label="课程名称" width="180">
                            <template slot-scope="scope">
                                <el-tag size="medium">{{ scope.row.courseName }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="教师" width="210">
                            <template slot-scope="scope">
                                <el-tag size="medium">{{ scope.row.nickName }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini"
                                    @click="viewStudent(scope.row.cid, scope.row.tid)">查看学生</el-button>
                                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

                        <el-form-item label="教师" style="width: 70%;" prop="teacher">
                            <el-select v-model="addForm.tid" placeholder="请选择">
                                <el-option v-for="item in teachers" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>


                        <el-form-item>
                            <el-button type="primary" @click="addCourse('addForm')">立即创建</el-button>
                            <el-button @click="resetForm('addForm')">重置</el-button>
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

            <el-drawer title="课程所选学生" :visible.sync="drawer" size="50%">
                <div class="drawer" style="margin: 0px 20px;">
                    <template v-if="studentsByCTID.length == 0">
                        <el-empty description="暂无学生选课"></el-empty>
                    </template>
                    <template v-else>
                        <el-table :data="studentsByCTID" style="width: 100%">
                            <el-table-column label="账号" width="120">
                                <template slot-scope="scope">
                                    {{ scope.row.sname }}
                                </template>
                            </el-table-column>
                            <el-table-column label="昵称" width="120">
                                <template slot-scope="scope">
                                    {{ scope.row.nickName }}
                                </template>
                            </el-table-column>
                            <el-table-column label="年龄" width="80">
                                <template slot-scope="scope">
                                    {{ scope.row.age }}
                                </template>
                            </el-table-column>
                            <el-table-column label="性别" width="80">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.sex == 1">男</span>
                                    <span v-else-if="scope.row.sex == 2">女</span>
                                    <span v-else>暂无设置</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="联系方式" width="180">
                                <template slot-scope="scope">
                                    {{ scope.row.tel }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="danger"
                                        @click="outCourse(scope.$index, scope.row)">退出课程</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </div>
            </el-drawer>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'XiaozhiHouIndex',

    data() {
        return {
            teachers: [],

            //查看某课程下学生
            drawer: false,
            studentsByCTID: [],
            // 当前课程
            tidByCTID: '',
            cidByCTID: "",

            activeName: "1",
            tableData: [],
            dialogVisible: false,

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
                addDate2: "",
                tid: ''
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
                ]
            }
        };
    },

    beforeMount() {
        this.getAllCourse();
        this.getAllTeacher();
    },

    methods: {
        TabHandleClick(tab, event) {
            // console.log(tab.name, event);
            if (tab.name === "1") {
                this.getAllCourse();
            }
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
                this.$axios.post("/teacher/deleteCourse?cid=" + row.cid + "&tid=" + row.tid)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.status === "200") {
                            this.$message({
                                message: "删除成功",
                                type: "success"
                            })
                            this.getAllCourse();
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
                    // console.log(this.addForm.addDate1, this.addForm.addDate2);
                    let course = {
                        cid: null,
                        courseName: this.addForm.addCourseName,
                        courseInfo: this.addForm.addCourseInfo,
                        createTime: this.addForm.addDate1 + " " + this.addForm.addDate2
                    }
                    this.$axios.post("/teacher/addCourse?tid=" + this.addForm.tid, course)
                        .then(res => {
                            console.log(res.data);
                            if (res.data.status === '200') {
                                this.resetForm(addForm);
                                this.$message({
                                    message: "添加成功",
                                    type: "success"
                                })
                                localStorage.removeItem("optionsCourse")
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

        //获取所有教学课程
        getAllCourse() {
            this.$axios.get("/course/getCourseByName?name=")
                .then(res => {
                    // console.log(res.data);
                    if (res.data.status == "200") {
                        for (let i = 0; i < res.data.data.length; i++) {
                            let e = res.data.data[i];
                            e.createTime = this.$util.parseTime(e.createTime, false);
                        }
                        this.tableData = res.data.data
                    }
                })
        },
        //获得所有的教师
        getAllTeacher() {
            this.$axios.get("/teacher/getAllTeacher")
                .then(res => {
                    console.log(res.data);
                    if (res.data.status == '200') {
                        this.teachers = [];
                        for (let i = 0; i < res.data.data.length; i++) {
                            let e = res.data.data[i]
                            let t = {
                                value: e.tid,
                                label: e.tname + '（' + e.nickName + '）'
                            }
                            this.teachers.push(t)
                        }
                    }
                    console.log(this.teachers);

                })
        },
        //查看学生
        viewStudent(cid, tid) {
            console.log("查看学生", cid, tid);

            this.$axios.get("/student/queryStudentByCourseTeacher/" + cid + "/" + tid)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status == '200') {
                        this.drawer = true;
                        this.studentsByCTID = res.data.data.students
                        this.tidByCTID = res.data.data.tid
                        this.cidByCTID = res.data.data.cid
                        console.log("student:", this.studentsByCTID);
                    } else {
                        this.$message({
                            message: "网络错误",
                            type: "error"
                        })
                    }
                })
        },
        // 学生退出课程
        outCourse(index, row) {
            console.log(index, row);
            this.$axios.get("/student/outCourse/" + row.sid + "/" + this.cidByCTID + "/" + this.tidByCTID)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status == '200') {
                        this.$message({
                            message: res.data.message,
                            type: "success",
                            duration: 1000,
                            onClose: res => {
                                this.viewStudent(this.cidByCTID, this.tidByCTID)
                            }
                        })
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: "error"
                        })
                    }
                })
        }
    },
};
</script>

<style lang="less" scoped>
.cRoot {
    // margin: 10px;
    margin: 10px 10px 0;
}
</style>