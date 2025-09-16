<template>
    <div class="info-root">
        <el-card>
            <div class="error" v-if="netError == 0">
                网络出错
            </div>
            <div v-else class="normal">
                <div class="function">
                    <el-button type="primary" @click="dialogVisible = true"><i class="el-icon-circle-plus-outline"
                            style="margin-right:10px;font-size: 15px;"></i>加入课程</el-button>
                </div>
                <div class="courses">
                    <el-card class="course" v-for="(item, index) in cousers" :key="index">
                        <div class="name">
                            {{ item.courseName }}
                            <div class="outCourse" @click="outCourse(item)">
                                <el-button type="danger" size="small" plain>退出课程</el-button>
                            </div>
                        </div>
                        <div class="time">
                            <!-- <img src="@/assets/date.png">&nbsp;&nbsp; -->
                            <el-tag type="warning" size="mini">{{ item.nickName }}</el-tag>
                            &nbsp;&nbsp;
                            <el-tag type="info" size="mini">{{ item.createTime }}</el-tag>

                        </div>
                        <div class="info">{{ item.courseInfo }}</div>
                    </el-card>

                </div>
                <div class="noMore">
                    <el-divider> <i style="color: #a6a6a6;">没有更多数据了</i></el-divider>
                </div>
            </div>
        </el-card>

        <el-dialog title="加入课程" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false"
            :show-close="false">
            <div class="search">
                <el-input v-model="searchItem" placeholder="请输入课程名称" style="width: 50%;"></el-input>
                <el-button type="primary" round @click="search">搜索</el-button>
            </div>
            <div class="courseList">
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column prop="createTime" label="日期" width="180"></el-table-column>
                    <el-table-column prop="courseName" label="课程名称" width="180"></el-table-column>
                    <el-table-column prop="nickName" label="任课老师" width="180"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">

                            <el-button size="small" type="primary"
                                @click="handleAdd(scope.$index, scope.row)">添加</el-button>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="close()">关闭</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import addCourse from '@/views/student/addCourse.vue';
import Vue from 'vue';
export default {
    components: { addCourse },
    name: 'XiaozhiQianCourseInfo',

    data() {
        return {
            userinfo: "",
            cousers: [],
            netError: 0,
            dialogVisible: false,

            //搜索参数
            searchItem: '',
            //搜索结果数据
            tableData: [],
        };
    },

    beforeMount() {
        this.userinfo = JSON.parse(localStorage.getItem("userinfo"))

        this.getCourse()
    },

    methods: {
        close() {
            console.log("close()");
            this.dialogVisible = false;
            this.getCourse()
        },

        //获取学生所学的课程
        getCourse() {
            console.log("test");
            this.$axios.get("/student/getCourse/" + this.userinfo.userData.sid)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status == "200") {
                        this.cousers = [];
                        for (let i = 0; i < res.data.data.length; i++) {
                            let e = res.data.data[i];
                            e.createTime = this.$util.parseTime(e.createTime, true);
                            Vue.set(this.cousers, i, e)
                        }
                        this.netError = 1
                    }
                })
        },

        //获取教师已发布的课程
        search() {
            if (this.searchItem == '') {
                this.$message({
                    message: '请输出课程名称',
                    type: 'warning'
                });
                return
            }
            console.log("search()", this.searchItem);
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.7)'
            });

            this.$axios.get("/course/getCourseByName?name=" + this.searchItem.trim())
                .then(res => {
                    loading.close();
                    // console.log(res.data);
                    if (res.data.status === "500") {
                        this.tableData = [{
                            createTime: res.data.message,
                            courseName: '',
                            nickName: ''
                        }]
                        return;
                    }
                    this.tableData = res.data.data;
                    for (let i = 0; i < this.tableData.length; i++) {
                        this.tableData[i].createTime = this.$util.parseTime(this.tableData[i].createTime, true);
                    }
                })


        },
        //添加课程
        handleAdd(index, row) {
            console.log(index, row);
            this.$axios.post("/student/addCourse/" + this.userinfo.userData.sid + "/" + row.cid + "/" + row.tid)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status === '200') {
                        this.$message({
                            message: '添加成功',
                            type: 'success',
                            duration: 500,
                            onClose: res => {
                                this.getCourse();
                            }
                        });
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: 'error'
                        });
                    }

                })
                .catch(err => {
                    console.log(err);
                    this.$message.error('网络出错');
                })
        },
        //退出课程
        outCourse(item) {
            this.$confirm('确定退出课程 <i><strong>' + item.courseName + '（' + item.nickName + '）</strong></i>', '提示', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log("outCourse()", item);
                this.$axios.get("/student/outCourse/" + item.sid + "/" + item.cid + "/" + item.tid)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.status === '200') {
                            this.$message({
                                message: '成功退出',
                                type: 'success',
                                duration: 1000,
                                onClose: res => {
                                    this.getCourse()
                                }
                            });
                        } else {
                            this.$message({
                                message: res.data.message,
                                type: 'error'
                            });
                        }
                    })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },
};
</script>

<style lang="less" scoped>
.search {
    display: flex;
    justify-content: space-between;
}

.courseList {
    margin-top: 20px;
}

.info-root {

    // margin-right: 50%;
    .normal {

        .courses {
            margin-top: 20px;

            .course {
                margin-bottom: 30px;

                .name {
                    font-size: 30px;
                    display: flex;
                    justify-content: space-between;

                    .outCourse {
                        font-size: 20px;
                    }
                }

                .time {
                    display: flex;
                    align-items: center;
                    color: #acacac;

                    img {
                        width: 20px;
                    }
                }

                .info {
                    margin-top: 10px;
                    color: brown;
                }
            }
        }
    }

    .noMore {
        display: flex;
        justify-content: center;
        margin-top: 50px;
        color: #acacac;
    }
}
</style>