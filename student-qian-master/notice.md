1、数据中直接判断试卷（examination中start_time和end_time）是否结束，已结束的话直接在 exam_student表中添加所有学生的考试记录

2、[text](src/views/student/testPaperDetail.vue)中提交试卷时，生成分数

3、试卷上传试题时，第一次会请求当前地址栏地址而非aciton中的地址，第二次才会正常请求

4、试卷被删除时，上传过试题才会删除成功，否则会失败