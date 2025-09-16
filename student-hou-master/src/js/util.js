/**
 * 
 * @param {*} array 原数组
 * @param {*} generateKey 统计/分组的条件
 * @returns 
 */
function groupBy(array, generateKey) {
    const result = {};
    for (const item of array) {
        const key = generateKey(item);
        if (result[key]) {
            result[key]++
        }
        else {
            result[key] = 1
        }
    }
    return result;
}


// 生成唯一账号
function getDefaultAccount() {
    return 'xiaozhi_' + uuid(8, 10)
}
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}


/**
 * 将数字转化为'第几章'
 * @param {*} num 
 */
function numberToChinese(number) {
    const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const chineseUnits = ['', '十', '百', '千', '万'];

    if (number === 0) {
        return '零';
    }

    let chineseStr = '';
    let numStr = number.toString();

    for (let i = 0; i < numStr.length; i++) {
        const digit = parseInt(numStr[i]);
        const unit = chineseUnits[numStr.length - i - 1];
        if (digit !== 0) {
            chineseStr += chineseNumbers[digit - 1] + unit;
        } else {
            if (i < numStr.length - 1 && parseInt(numStr[i + 1]) !== 0) {
                chineseStr += '零';
            }
        }
    }

    return chineseStr;
}



//将一个变量转化为数字，并返回是否转化成功
function convertToNumber(value) {
    var numberValue = Number(value);
    if (!isNaN(numberValue)) {
        return {
            success: true,
            number: numberValue
        };
    } else {
        return {
            success: false,
            number: NaN
        };
    }
}

//格式化试题信息
function parseQuestion(q) {

    let res = {
        cid: q.cid,
        courseName: q.courseName,
        chapter: q.chapter,
        qid: q.qid,
        questionAnswer: q.questionAnswer,
        questionContent: q.questionContent,
        questionType: q.questionType,
    }
    if (q.questionType == "选择题") {
        let arr = q.questionContent.split(/~[A-D]\)/);
        res.questionContent = arr[0]
        res.optionA = arr[1]
        res.optionB = arr[2]
        res.optionC = arr[3]
        res.optionD = arr[4]
    }

    return res;
}

//解析时间戳
function parseTimestamp(timestamp) {
    let date = new Date(parseInt(timestamp));

    let Year = date.getFullYear();
    let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    let Second = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    let GMT = Year + '-' + Moth + '-' + Day + ' ' + Hour + ':' + Minute + ':' + Second;

    console.log(GMT)  // 2022-09-07 15:56:07
    return GMT;
}

//解析时间字符串，返回与当前时间戳的差值
function parseTimeStr(timeStr) {
    let now = Date.now();

    let year = parseInt(timeStr.substring(0, 4));
    let month = parseInt(timeStr.substring(5, 7));
    let day = parseInt(timeStr.substring(8, 10));
    let hours = parseInt(timeStr.substring(11, 13));
    let minutes = parseInt(timeStr.substring(14, 16));
    let seconds = parseInt(timeStr.substring(17, 19));
    let newDate = new Date(year, month - 1, day, hours, minutes, seconds);
    let date = newDate.getTime();

    return now - date
}

//解析token
function parseToken(tokenstr) {
    let arr = tokenstr.split("_");
    let userType = arr[0];
    let account = arr[1];
    let password = arr[2];
    return {
        userType,
        account,
        password
    };
}

//解析字符串
function parseTime(timeString, isAccurate) {
    // const timeString = "2023-04-05T15:11:21";
    const dateObj = new Date(timeString);

    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1; // 月份从0开始，需要加1
    let day = dateObj.getDate();
    let hour = dateObj.getHours();
    let minute = dateObj.getMinutes();
    let second = dateObj.getSeconds();
    if (isAccurate) {
        return `${year}-${month}-${day}`;
    }
    if (month < 10)
        month = "0" + month
    if (day < 10)
        day = "0" + day
    if (hour < 10)
        hour = "0" + hour
    if (minute < 10)
        minute = "0" + minute
    if (second < 10)
        second = "0" + second
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

let util = {
    parseToken,
    parseTime,
    parseTimestamp,
    parseTimeStr,
    parseQuestion,
    convertToNumber,
    getDefaultAccount,
    numberToChinese,
    groupBy
};
export default util
