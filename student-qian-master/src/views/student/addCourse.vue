<template>
    <div class="add-root">

    </div>
</template>

<script>
export default {
    name: 'XiaozhiQianAddCourse',

    data() {
        return {
            //是否选中
            // isCheck: [],
            //已选中的数据
            // checked: [],

        };
    },

    mounted() {
        // localStorage.removeItem("checkedCourse");
        console.log("test");
    },

    methods: {
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


            this.$axios.get("/course/getCourseByName/" + this.searchItem)
                .then(res => {
                    loading.close();

                    if (res.data.status === "500") {
                        this.tableData = [{
                            createTime: res.data.message,
                            courseName: '',
                            nickName: ''
                        }]
                        return;
                    }
                    // console.log(res.data);
                    this.tableData = res.data.data;
                    for (let i = 0; i < this.tableData.length; i++) {
                        this.tableData[i].createTime = this.$util.parseTime(this.tableData[i].createTime, true);
                        // this.checked[i] = null;
                    }
                })


        },
        handleAdd(index, row) {
            console.log(index, row);
            this.$axios.post("/student/addCourse/" + this.userinfo.userData.sid + "/" + cids)
                .then(res => {
                    if (res.data.status === '200') {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                    }

                })
                .catch(err => {
                    console.log(err);
                    this.$message.error('网络出错');
                })
        },

        /* filterEmpty(array) {
            console.log("checked", array);

            let newArray = [];
            let j = 0;
            for (let i = 0; i < array.length; i++) {
                if (array[i] !== null) {
                    newArray[j] = array[i];
                } else {
                    j++;
                }
            }
            console.log("newArray", newArray);
        }
 */
    },
};
</script>

<style lang="less" scoped>
.add-root {
    // height: 60vh;

    .search {
        display: flex;
        justify-content: space-between;
    }

    .courseList {
        margin-top: 20px;
    }
}
</style>