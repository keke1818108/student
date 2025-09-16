<template>
    <div class="n-root">
        <el-card>
            <div class="top">
                <div class="search">
                    <div class="s_cont s_b">
                        <div class="tag">标题：</div>
                        <el-input v-model="noticeTitle" placeholder="请输入标题"></el-input>
                    </div>
                    <div class="s_cont s_b">
                        <div class="tag">内容：</div>
                        <el-input v-model="noticeContent" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="s_cont s_b">
                        <div class="tag">状态：</div>
                        <el-select v-model="noticeStatus" placeholder="请选择状态" clearable>
                            <el-option v-for="item in noticeStatusType" :key="item.type" :label="item.label"
                                :value="item.type">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="s_cont">
                        <div class="tag">开始时间：</div>
                        <el-date-picker v-model="startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                    <div class="s_cont">
                        <div class="tag">结束时间：</div>
                        <el-date-picker v-model="endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                    <el-button type="primary" size="medium" plain @click="query(1)"><i
                            class="el-icon-search"></i>&nbsp;搜索</el-button>
                    <el-button type="primary" size="medium" plain @click="queryReset()"><i
                            class="el-icon-refresh-right"></i>&nbsp;重置</el-button>
                </div>
                <div class="addQuestion">
                    <el-button type="primary" @click="addDialogVisible = true">新增公告</el-button>
                </div>

            </div>

            <div class="question">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column label="标题" width="210" prop="noticeTitle" fixed="left"></el-table-column>
                    <el-table-column label="内容" width="300" prop="noticeContent"></el-table-column>
                    <el-table-column label="状态" width="120">
                        <template slot-scope="scope">
                            <el-tag size="medium" type="warning" v-if="scope.row.noticeStatus == 1">{{
                                scope.row.noticeStatusType }}</el-tag>
                            <el-tag size="medium" type="success" v-else-if="scope.row.noticeStatus == 2">{{
                                scope.row.noticeStatusType }}</el-tag>
                            <el-tag size="medium" type="danger" v-else>{{ scope.row.noticeStatusType }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="浏览量" width="80" prop="noticeViewNum"></el-table-column>

                    <el-table-column label="开始时间" width="180" prop="startTime"></el-table-column>
                    <el-table-column label="结束时间" width="180" prop="endTime"></el-table-column>

                    <el-table-column label="操作" width="150" fixed="right">
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

            <el-dialog title="添加公告" :visible.sync="addDialogVisible" width="40%" :before-close="addFormClose">
                <el-form ref="addForm" :model="addForm" label-width="80px">
                    <el-form-item label="标题">
                        <el-input v-model="addForm.noticeTitle" placeholder="请输入公告标题"></el-input>
                    </el-form-item>
                    <el-form-item label="内容">
                        <el-input type="textarea" v-model="addForm.noticeContent" placeholder="请输入公告内容"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-date-picker v-model="addForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker v-model="addForm.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="addNotice('addForm', 1)">暂存草稿</el-button>
                        <el-button type="primary" @click="addNotice('addForm', 2)">立即发布</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>

            <el-dialog title="编辑公告" :visible.sync="updateDialogVisible" width="40%" :before-close="updateFormClose">
                <div v-if="updateForm != ''">
                    <el-form ref="updateForm" :model="updateForm" label-width="80px">
                        <el-form-item label="标题">
                            <el-input v-model="updateForm.noticeTitle" placeholder="请输入公告标题"></el-input>
                        </el-form-item>
                        <el-form-item label="内容">
                            <el-input type="textarea" v-model="updateForm.noticeContent"
                                placeholder="请输入公告内容"></el-input>
                        </el-form-item>
                        <el-form-item label="开始时间">
                            <el-date-picker v-model="updateForm.startTime" type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间">
                            <el-date-picker v-model="updateForm.endTime" type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>

                        <template>
                            <el-form-item label="状态">
                                <el-radio-group v-model="updateForm.noticeStatus">
                                    <el-radio :label="1">暂存草稿</el-radio>
                                    <el-radio :label="2">发布中</el-radio>
                                    <el-radio :label="3">停止发布</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </template>

                        <el-form-item>
                            <el-button type="primary" @click="updateNoticeSubmit()">保存</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'XiaozhiHouNotice',

    data() {
        return {
            // 更新公告
            updateDialogVisible: false,
            updateForm: '',

            // 新增公告
            addDialogVisible: false,
            addForm: {
                noticeTitle: "",
                noticeContent: "",
                startTime: "",
                endTime: ""
            },

            // 查询条件
            noticeTitle: '',
            noticeContent: "",
            noticeStatus: '',
            noticeStatusType: [
                {
                    type: 1,
                    label: '暂存草稿'
                }, {
                    type: 2,
                    label: '发布中'
                }, {
                    type: 3,
                    label: '停止发布'
                }
            ],
            startTime: "",
            endTime: "",
            // 分页查询到的数据
            tableData: [],

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

    mounted() {
        this.query(0)
    },

    methods: {

        // 添加公告
        addFormClose() {
            console.log("close");
            this.addDialogVisible = false;
        },
        addNotice(form, type) {
            // console.log(form, type, this.addForm);
            if (this.addForm.noticeTitle === '' || this.addForm.noticeContent === '' ||
                this.addForm.endTime === '' || this.addForm.startTime === '') {
                this.$message({
                    message: "请输入公告信息",
                    type: "warning"
                });
                return;
            }
            this.addForm.noticeViewNum = 0;
            this.addForm.noticeStatus = type;
            console.log(this.addForm);
            this.$axios.post("/notice/addNotice", this.addForm)
                .then(res => {
                    // console.log(res.data.data);
                    if (res.data.status == '200') {
                        this.$message({
                            message: "添加成功",
                            type: "success",
                            duration: 1000,
                            onClose: res => {
                                this.addForm = {
                                    noticeTitle: "",
                                    noticeContent: "",
                                    startTime: "",
                                    endTime: ""
                                };
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
                })
        },

        //编辑公告
        handleEdit(index, row) {
            this.updateForm = Object.assign({}, row)
            console.log(this.updateForm, row);
            this.updateDialogVisible = true;
        },
        updateFormClose() {
            this.$confirm('确认退出后不会保存修改, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.updateForm = {};
                // console.log(this.updateForm);
                this.updateDialogVisible = false;
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        updateNoticeSubmit() {
            console.log(this.updateForm);
            // return;
            this.$axios.post("/notice/updateNotice", this.updateForm)
                .then(res => {
                    if (res.data.status == '200') {
                        this.$message({
                            message: "更新成功",
                            type: "success",
                            duration: 1000,
                            onClose: res => {
                                this.query(0);
                                this.updateDialogVisible = false;
                            }
                        })
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: "error"
                        })
                    }
                })
        },

        //删除公告
        handleDelete(index, row) {
            this.$confirm('将永久删除公告, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(index, row);
                this.$axios.delete("/notice/deleteNotice/" + row.nid)
                    .then(res => {
                        if (res.data.status == '200') {
                            this.$message({
                                message: "删除成功",
                                type: "success",
                                duration: 1000,
                                onClose: res => {
                                    this.query(0)
                                }
                            })
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

        /*query
        * 1:条件查询
        * 0:无条件查询
        */
        query(query) {
            // console.log("query:", this.noticeTitle, this.noticeContent, this.noticeStatus, this.startTime, this.endTime);
            // return
            //无条件查询
            if (query == 0) {
                this.getPageData({
                    noticeTitle: this.noticeTitle.trim(),
                    noticeContent: this.noticeContent.trim(),
                    noticeStatus: this.noticeStatus,
                    startTime: this.startTime,
                    endTime: this.endTime,

                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                });
                return;
            }

            //有条件查询
            if (this.noticeTitle === '' && this.noticeContent === '' && this.noticeStatus === '' &&
                this.endTime === '' && this.startTime === '' && query == 1) {
                this.$message({
                    message: "请输入检索条件",
                    type: "warning"
                })
            } else {
                this.getPageData({
                    noticeTitle: this.noticeTitle.trim(),
                    noticeContent: this.noticeContent.trim(),
                    noticeStatus: this.noticeStatus,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    currentPage: 1,
                    pageSize: this.pageSize
                });
            }

        },
        queryReset() {
            this.noticeTitle = '';
            this.noticeContent = "";
            this.noticeStatus = '';
            this.startTime = "";
            this.endTime = "";

            this.pageSize = 5;
            this.currentPage = 1;
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
            // console.log(query);
            this.$axios.post("/notice/getNoticeByPage", query).then(res => {
                console.log(res.data);
                if (res.data.status === "500") {
                    this.tableData = [];
                    return;
                }
                for (let i = 0; i < res.data.data.records.length; i++) {
                    let e = res.data.data.records[i];
                    if (e.noticeStatus == 1)
                        e.noticeStatusType = "暂存草稿"
                    else if (e.noticeStatus == 2)
                        e.noticeStatusType = "发布中"
                    else
                        e.noticeStatusType = "停止发布";
                }
                this.tableData = res.data.data.records;
                this.total = res.data.data.total;
                this.pages = res.data.data.pages;
                // console.log(this.total, this.pages, this.tableData);
            })
        }
    },
};
</script>

<style lang="less" scoped>
.n-root {
    margin: 10px 10px 0;

    .top {
        display: flex;
        justify-content: space-between;

        .search {
            display: flex;
            flex-wrap: wrap;
            flex: 8;

            .s_cont {
                display: flex;
                width: 300px;
                margin-right: 10px;

                .tag {
                    width: 90px;
                    display: flex;
                    align-items: center;
                }
            }

            .s_b {
                margin-bottom: 10px;
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
}
</style>