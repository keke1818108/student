<template>
    <el-card class="info-root">
        <el-descriptions class="margin-top" title="个人信息" :column="1" :size="size">
            <template slot="extra">
                <el-button type="primary" size="small" @click="updateDialogVisible = true">编辑</el-button>
            </template>
            <el-descriptions-item label="账号">{{ username }}</el-descriptions-item>

            <el-descriptions-item label="手机号">{{ userinfo.userData.tel }}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{ userinfo.userData.nickName }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{ userinfo.userData.age }}</el-descriptions-item>

            <el-descriptions-item label="性别" v-if="userinfo.userData.sex == 1">男</el-descriptions-item>
            <el-descriptions-item label="性别" v-else-if="userinfo.userData.sex == 2">女</el-descriptions-item>
            <el-descriptions-item label="性别" v-else>未设置</el-descriptions-item>

            <el-descriptions-item label="职位" v-if="userinfo.userType == 1">
                <el-tag size="small">{{ userinfo.zhicheng }}</el-tag>
            </el-descriptions-item>

        </el-descriptions>


        <el-dialog title="更新账号" :visible.sync="updateDialogVisible" width="40%" :before-close="cancel">
            <el-form ref="updateForm" :rules="updateRules" :model="updateForm" label-width="100px">
                <el-form-item label="账号">
                    <el-input v-model="username" disabled></el-input>
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

                <el-form-item label="职称" prop="zhichengOptionValue" v-if="userinfo.userType == 1">
                    <el-select v-model="updateForm.zhichengOptionValue" placeholder="请选择">
                        <el-option v-for="item in zhichengOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel()">取 消</el-button>
                <el-button type="primary" @click="updateSubmit()">确 定</el-button>
            </span>
        </el-dialog>

    </el-card>
</template>

<script>
export default {
    name: 'XiaozhiQianPersonalInfo',

    data() {
        let agevalidatePass = (rule, value, callback) => {
            if (value >= 0 & value <= 150) {
                callback();
            } else {
                callback(new Error("请输入0-150数字!"));
            }
        };
        return {
            userinfo: "",
            username: "",
            size: "medium",

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
                nickName: '',
                age: '',
                sex: "",
                tel: "",
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
        };
    },

    beforeMount() {
        this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
        this.updateForm.nickName = this.userinfo.userData.nickName
        this.updateForm.age = this.userinfo.userData.age
        this.updateForm.sex = this.userinfo.userData.sex + ''
        this.updateForm.tel = this.userinfo.userData.tel
        if (this.userinfo.userType == 0) {
            this.username = this.userinfo.userData.sname;
        } else {
            this.username = this.userinfo.userData.tname;
            this.updateForm.zhichengOptionValue = this.userinfo.userData.zhicheng
        }

    },

    methods: {
        updateSubmit() {
            let newInfo = {
                nickName: this.updateForm.nickName,
                age: Number(this.updateForm.age),
                sex: Number(this.updateForm.sex),
                tel: this.updateForm.tel,
                enable: this.userinfo.userData.enable
            }
            if (this.userinfo.userType == 0) {
                newInfo.sname = this.userinfo.userData.sname;
                newInfo.sid = this.userinfo.userData.sid;
                newInfo.spwd = this.userinfo.userData.spwd;
            } else {
                newInfo.tname = this.userinfo.userData.tname;
                newInfo.tid = this.userinfo.userData.tid;
                newInfo.tpwd = this.userinfo.userData.tpwd;
                newInfo.zhicheng = this.updateForm.zhichengOptionValue
            }

            this.$refs.updateForm.validate((valid) => {
                if (valid) {
                    console.log("update", newInfo);
                    if (this.userinfo.userType == 0) {
                        this.submit("/student/updateOne", newInfo)
                    } else {
                        this.submit("/teacher/updateOne", newInfo)
                    }

                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submit(url, newInfo) {
            this.$axios.post(url, newInfo)
                .then(res => {
                    if (res.data.status == '200') {
                        this.$message({
                            message: '更新成功',
                            type: "success",
                            duration: 1000,
                            onClose: res => {
                                this.userinfo.userData = newInfo;
                                let info = this.$storage.get("userinfo");
                                // console.log("success", info);
                                info.userData = newInfo;

                                this.$storage.set("userinfo", info)
                                this.updateDialogVisible = false;
                                this.$refs.updateForm.resetFields();
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
        cancel() {
            let that = this
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
            function done() {
                that.updateDialogVisible = false;
                that.$refs.updateForm.resetFields()
            }
        }
    },
};
</script>

<style lang="less" scoped>
.info-root {
    margin-right: 50%;
}
</style>