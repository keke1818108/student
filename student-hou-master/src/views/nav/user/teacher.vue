<template>
    <el-card class="teacher-root">
        <div class="top">
            <div class="search">
                <div class="s_cont">
                    <div class="tag">账号:</div>
                    <el-input v-model="query_tname" placeholder="请输入账号"></el-input>
                </div>
                <div class="s_cont">
                    <div class="tag">昵称:</div>
                    <el-input v-model="query_nickName" placeholder="请输入名称"></el-input>
                </div>
                <div class="s_cont">
                    <div class="tag">状态:</div>
                    <el-select v-model="optionStatusValue" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>

                <el-button type="primary" plain @click="query(1)"><i class="el-icon-search"></i>&nbsp;搜索</el-button>
                <el-button type="primary" plain @click="queryReset()"><i
                        class="el-icon-refresh-right"></i>&nbsp;重置</el-button>
            </div>
            <div class="addQuestion">
                <el-button type="primary" @click="addDialogVisible = true">新增账号</el-button>
            </div>

        </div>

        <div class="exam">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="账号" width="150" prop="tname"></el-table-column>
                <el-table-column label="昵称" width="150" prop="nickName"></el-table-column>
                <el-table-column label="年龄" width="100" prop="age"></el-table-column>
                <el-table-column label="性别" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex == 1">男</span>
                        <span v-else-if="scope.row.sex == 2">女</span>
                        <span v-else>未设置</span>
                    </template>
                </el-table-column>
                <el-table-column label="联系方式" width="160">
                    <template slot-scope="scope">
                        <span v-if="scope.row.tel == ''">未设置</span>
                        <span v-else>{{ scope.row.tel }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="职位" width="130">
                    <template slot-scope="scope">
                        <span v-if="scope.row.zhicheng == 1">院长</span>
                        <span v-else-if="scope.row.zhicheng == 2">教授</span>
                        <span v-else-if="scope.row.zhicheng == 3">讲师</span>
                        <span v-else>未设置</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否启用" width="130">
                    <template slot-scope="scope">
                        <div @click="statusChange(scope.$index, scope.row)">
                            <el-switch v-model="enableStatus[scope.$index]" active-color="#13ce66"
                                inactive-color="#ff4949">
                            </el-switch>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑信息</el-button>
                        <el-button size="mini" @click="handleUpadtePwd(scope.$index, scope.row)">修改密码</el-button>
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


        <el-dialog title="更新账号" :visible.sync="updateDialogVisible" width="40%">
            <el-form ref="updateForm" :rules="updateRules" :model="updateForm" label-width="100px">
                <el-form-item label="账号">
                    <el-input v-model="updateForm.tName" disabled></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="updateForm.nickName" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="updateForm.age" placeholder="请输入年龄"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="tel">
                    <el-input v-model="updateForm.tel" placeholder="请输入联系方式"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio v-model="updateForm.sex" label="1">男</el-radio>
                    <el-radio v-model="updateForm.sex" label="2">女</el-radio>
                </el-form-item>

                <el-form-item label="职称" prop="zhichengOptionValue">
                    <el-select v-model="updateForm.zhichengOptionValue" placeholder="请选择">
                        <el-option v-for="item in zhichengOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateSubmit()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="新增账号" class="addAccount" :visible.sync="addDialogVisible" width="30%"
            :before-close="addhandleClose">
            <el-form ref="resetForm" :rules="rules" :model="resetForm" label-width="100px">
                <el-form-item label="账号" prop="tName">
                    <el-input v-model="resetForm.tName" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="tPwd">
                    <el-input v-model="resetForm.tPwd" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="tPwdNew">
                    <el-input v-model="resetForm.tPwdNew" placeholder="请输入密码"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addhandleClose()">取 消</el-button>
                <el-button type="primary" @click="addSubmit()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改密码" :visible.sync="RestdialogVisible" width="30%" :before-close="pwdhandleClose">
            <el-form ref="resetForm" :rules="rules" :model="resetForm" label-width="100px">
                <el-form-item label="账号">
                    <el-input v-model="resetForm.tName" disabled></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="tPwd">
                    <el-input v-model="resetForm.tPwd" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="tPwdNew">
                    <el-input v-model="resetForm.tPwdNew" placeholder="请输入密码"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="pwdhandleClose()">取 消</el-button>
                <el-button type="primary" @click="resetSubmit()">确 定</el-button>
            </span>
        </el-dialog>

    </el-card>
</template>

<script>
export default {
    name: 'XiaozhiHouIndex',

    data() {
        let validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.resetForm.tPwd) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        let agevalidatePass = (rule, value, callback) => {
            if (value >= 0 & value <= 150) {
                callback();
            } else {
                callback(new Error("请输入0-150数字!"));
            }
        };
        return {
            //查询
            query_tname: "",
            query_nickName: "",
            //当前页
            currentPage: 1,
            //每页条数
            pageSize: 5,
            //总数
            total: 0,
            //总页数
            pages: 0,
            options: [{
                value: 1,
                label: '启用中'
            }, {
                value: 0,
                label: '封禁中'
            }],
            optionStatusValue: "",

            // 更新账号
            zhichengOptions: [{
                value: 1,
                label: '院长'
            }, {
                value: 2,
                label: '教授'
            }, {
                value: 3,
                label: '讲师'
            }],

            updateDialogVisible: false,
            updateForm: {
                tName: "",
                nickName: '',
                age: '',
                sex: "",
                tel: "",
                zhicheng: "",
                zhichengOptionValue: '',
            },
            updateRules: {
                nickName: [
                    { required: true, message: '请输入昵称', trigger: 'blur' }
                ],
                age: [
                    { required: true, message: '请输入年龄', trigger: 'blur' },
                    { type: "number", validator: agevalidatePass, trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ],
                zhichengOptionValue: [
                    { required: true, message: '请选择职称', trigger: 'blur' }
                ],
                tel: [
                    { required: true, message: '请输入联系方式', trigger: 'blur' },
                    { pattern: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/, message: '请输入联系方式', trigger: 'blur' }
                ],
            },


            // 新增账号
            addDialogVisible: false,

            // 修改密码
            row: "",
            RestdialogVisible: false,
            resetForm: {
                tName: "",
                tPwd: "",
                tPwdNew: ""
            },
            rules: {
                tPwdNew: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { required: true, validator: validatePass2, trigger: "blur" },
                ],
                tPwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '密码至少6位', trigger: 'blur' }
                ],
                tName: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { pattern: /^(?!\d)\w{6,}$/, message: '账号只能包含字母和数字，至少6位且不能以数字开头', trigger: 'blur' }
                ]
            },

            tableData: [],
            //启用状态
            enableStatus: []
        };
    },

    mounted() {
        this.query(0)
        console.log("test");
    },

    methods: {

        //编辑信息
        handleEdit(index, row) {
            console.log(index, row);
            this.updateForm.tName = row.tname;
            this.updateForm.nickName = row.nickName;
            this.updateForm.age = row.age;
            this.updateForm.tel = row.tel;

            this.updateDialogVisible = true;
            this.row = row;
        },
        updateSubmit() {
            this.row.sex = Number(this.updateForm.sex)
            this.row.nickName = this.updateForm.nickName
            this.row.age = Number(this.updateForm.age)
            this.row.zhicheng = Number(this.updateForm.zhichengOptionValue)
            this.row.tel = this.updateForm.tel

            console.log("new", this.row);
            this.$refs.updateForm.validate((valid) => {
                if (valid) {
                    this.$axios.post("/teacher/updateOne", this.row)
                        .then(res => {
                            // console.log(res.data);
                            if (res.data.status == '200') {
                                this.$message({
                                    message: '更新成功',
                                    type: "success",
                                    duration: 1000,
                                    onClose: res => {
                                        this.query(0)
                                        this.updateDialogVisible = false;
                                        this.$refs.updateForm.resetFields()
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
                    console.log('error submit!!')
                    return false
                }
            })
        },

        // 修改密码
        handleUpadtePwd(index, row) {
            this.row = row;
            this.resetForm.tName = row.tname;
            console.log(index, row, this.resetForm.tName);
            this.RestdialogVisible = true;
        },
        resetSubmit() {
            this.$refs.resetForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认修改?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // console.log("resetSubmit");
                        this.row.tpwd = this.resetForm.tPwd;
                        this.$axios.post("/teacher/updateOne", this.row)
                            .then(res => {
                                console.log(res.data);
                                if (res.data.status == '200') {
                                    this.$message({
                                        message: "修改成功",
                                        type: "success"
                                    });
                                    this.RestdialogVisible = false;
                                } else {
                                    this.$message({
                                        message: "修改失败",
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

                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        pwdhandleClose() {
            console.log("handleClose");
            this.RestdialogVisible = false
            this.resetForm = {
                tName: "",
                tPwd: "",
                tPwdNew: ""
            }
        },

        // 删除账号
        handleDelete(index, row) {
            console.log(index, row);
            this.$confirm('是否该账号?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post("/teacher/deleteOne", row)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.status == '200') {
                            this.$message({
                                message: '删除成功',
                                type: "success"
                            })
                            this.query(0)
                        } else {
                            this.$message({
                                message: res.data.message,
                                type: "error"
                            })
                        }
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },


        //确认添加
        addSubmit() {
            console.log("addSubmit", this.resetForm);
            let newAccount = {
                tname: this.resetForm.tName,
                tpwd: this.resetForm.tPwd,
                age: 0,
                enable: 1,
                nickName: this.$util.getDefaultAccount(),
                sex: 0,
                zhicheng: 0,
                tel: ""
            }
            this.$refs.resetForm.validate((valid) => {
                if (valid) {
                    this.$axios.post("/teacher/addOne", newAccount).then(res => {
                        console.log(res.data);
                        if (res.data.status == '200') {
                            this.$message({
                                message: "新增成功",
                                type: "success",
                                duration: 1000,
                                onClose: res => {
                                    this.addDialogVisible = false;
                                    this.query(0)
                                }
                            })
                        } else {
                            this.$message({
                                message: res.data.message,
                                type: "error"
                            })
                        }
                        this.resetForm = {
                            sName: "",
                            sPwd: "",
                            sPwdNew: ""
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addhandleClose() {
            this.addDialogVisible = false;
            this.$refs.resetForm.resetFields()
        },

        //启用状态改变
        statusChange(index, row) {
            console.log(index, row, this.enableStatus[index])

            row.enable = Number(this.enableStatus[index]);
            let mes = row.enable == 1 ? '启用成功' : '禁用成功'
            this.$axios.post("/teacher/updateOne", row)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status == '200') {
                        this.$message({
                            message: mes,
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

        /*query
        * 1:条件查询
        * 0:无条件查询
        */
        query(type) {
            if (type == 0) {
                // console.log("type", type);
                this.queryPageData({
                    currentPage: this.currentPage,
                    enable: 2,//代表无条件查询（1启用、0封禁）
                    nickName: "",
                    pageSize: this.pageSize,
                    tname: ""
                });
                return;
            }
            //有条件查询
            // console.log("type", type, this.optionStatusValue);
            if (this.optionStatusValue === '')
                this.optionStatusValue = 2
            if (this.query_nickName === '' && this.query_tname === '' && this.optionStatusValue === '') {
                this.$message({
                    message: "请输入检索条件",
                    type: "warning"
                })
            } else {
                this.queryPageData({
                    currentPage: 1,
                    enable: this.optionStatusValue,
                    nickName: this.query_nickName.trim(),
                    pageSize: this.pageSize,
                    tname: this.query_tname.trim()
                });
                this.optionStatusValue = ''
                this.query_tname = ""
                this.query_nickName = ""
                this.pageSize = 5
                this.currentPage = 1
            }
        },
        queryReset() {
            console.log("queryReset");
            this.query_tname = ""
            this.query_nickName = ""
            this.pageSize = 5
            this.currentPage = 1
            this.query(0)
        },
        queryPageData(query) {
            this.$axios.post("/teacher/queryTeacherByPage", query)
                .then(res => {
                    // console.log(res.data);
                    if (res.data.status === "500") {
                        this.tableData = [];
                        return;
                    }
                    this.tableData = res.data.data.records;
                    this.total = res.data.data.total;
                    this.pages = res.data.data.pages;

                    for (let i = 0; i < this.tableData.length; i++) {
                        if (this.tableData[i].enable == 1)
                            this.enableStatus[i] = true
                        else
                            this.enableStatus[i] = false
                    }
                    console.log(this.total, this.pages, this.tableData, this.enableStatus);
                })
        },
        handleSizeChange(val) {
            this.pageSize = val;
            console.log(`当前页: ${this.currentPage}`, `每页 ${this.pageSize} 条`);
            this.query(0)
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            console.log(`当前页: ${this.currentPage}`, `每页 ${this.pageSize} 条`);
            this.query(0)
        },
    },
};
</script>

<style lang="less" scoped>
.teacher-root {
    margin: 10px 10px 0;

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
}

.page {
    margin-top: 20px;
}
</style>