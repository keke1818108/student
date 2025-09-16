<template>
  <div class="noticeList">
    <template v-if="notices.length == 0">
      <el-empty description="暂无公告"></el-empty>
    </template>
    <template v-else>
      <div class="n" v-for="item in notices" :key="item.nid">
        <div class="nTitle">
          <a href="#" @click.prevent="noticeClick(item)">
            <div>
              <div></div>
              {{ item.noticeTitle }}
            </div>
          </a>
        </div>
        <div class="nTime"><img src="@/assets/time.png" />{{ item.startTime }}</div>
      </div>
    </template>


    <el-dialog :title="notice.noticeTitle" :visible.sync="noticeDialog" width="40%">
      <div class="noticeDialog">
        <div class="nTime">发布时间：{{ notice.startTime }} &nbsp;&nbsp;&nbsp;浏览量：{{ notice.noticeViewNum }}</div>
        <div class="nContent">{{ notice.noticeContent }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="noticeDialog = false">关 闭</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "noticeList",
  data() {
    return {
      // 公告
      notices: [],
      notice: '',
      noticeDialog: false,
    }
  },
  mounted() {
    this.getNotice();
  },
  methods: {
    getNotice() {
      let noticePage = {
        currentPage: 1,
        pageSize: 4,
        noticeStatus: 2
      }
      this.$axios.post("/notice/getNoticeByPage", noticePage)
          .then(res => {
            console.log(res.data);
            if (res.data.status === '200') {
              this.notices = res.data.data.records
            }
          })
    },

    noticeClick(n) {
      this.notice = n;
      // console.log("noticeClick", this.notice);
      n.noticeViewNum = n.noticeViewNum + 1;
      this.addViewNum(n);
      this.noticeDialog = true;
    },
    // 点击一次公告，增加一次浏览量
    addViewNum(item) {
      this.$axios.post("/notice/updateNotice", item)
          .then(res => {
            console.log("addViewNum:", res.data);
          })
    }
  },
}
</script>

<style scoped lang="less">
// 每个公告标题和图标之间的间距
@nT: 10px;

.noticeList{
  .n {
    margin: 5px 10px;

    .nTime {
      display: flex;
      align-items: center;
      font-size: 15px;
      color: gray;

      img {
        width: 15px;
        margin-right: @nT;
      }
    }

    .nTitle {
      font-size: 25px;

      a {
        text-decoration: none;
        color: black;

        div {
          display: flex;
          align-items: center;

          div {
            width: 13px;
            height: 13px;
            border-radius: 50%;
            background-color: cornflowerblue;
            margin-right: @nT;
          }
        }

      }

      a:hover {
        color: #409eff;
      }
    }

  }
  .noticeDialog {
    .nContent {
      margin-top: 10px;
      font-size: 20px;
      height: 300px;
    }
  }
}
</style>