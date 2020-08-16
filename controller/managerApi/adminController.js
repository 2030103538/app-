// 引入MD5
const md5 = require('blueimp-md5');
// 引入token生成器
const jwt = require('jsonwebtoken');
// 引入moment
const Moment = require('moment');


// 引入数据库查询函数
const Query = require('./../../config/dbHelper');
const KEY = require('./../../config/config').KEY;

function ResultTemp(status, msg, data) {
    return {
        status,
        msg,
        data
    }
}

/*
  注册主管理员
*/
function regMainAdmin(prams, callBack){
    // 1. 获取参数
    const {username, password} = prams;
    const md5_password = md5(password, KEY);
    // 2. 判断
    if(!username || !password){
        callBack(ResultTemp(0, '用户名或者密码不能为空!', {}));
        return;
    }
    // 3. 创建时间
    const createTime = Moment().format('YYYY-MM-DD hh:mm:sss');
    // 4. 插入数据库
    let sql = `INSERT INTO um_admin(username, password, nickname, roleid, createtime, status) VALUES (?, ?, ?, ?, ?, ?)`;
    let value = [username, md5_password, '主管理员', 1, createTime, 1];
    Query(sql, value).then((result)=>{
        callBack(ResultTemp(1, '注册主管理员账号成功!', {}));
    }).catch((error)=>{
        callBack(ResultTemp(0, '注册主管理员账号失败!', {}));
    });
}


/*
  管理员登录
*/
function loginAdmin(prams, callBack){
    // 1. 获取数据
    const {username, password} = prams;
    // 2. 判断
    if(!username || !password){
        callBack(ResultTemp(0, '用户名或密码不能为空!', {}));
        return;
    }

    // 3. 查询数据库
    let sql = `SELECT * FROM um_admin WHERE username = ? AND status = ?;`;
    let value = [username, 1];
    Query(sql, value).then((result)=>{
        if(result.data.length > 0){
            // 3.1 取出密码对比
            let pwd = result.data[0].password;
            if(password === pwd){ // 登录成功
                const {id, username, password, icon, email, nickname} = result.data[0];
                //  3.1 生成一个token
                const userData = {id, username, password};
                const token = jwt.sign(userData, KEY);
                callBack(ResultTemp(1, '登录成功!', {token, id, username, icon, email, nickname}));
            }else {
                callBack(ResultTemp(0, '输入密码不正确!', {}));
            }
        }else {
            callBack(ResultTemp(0, '当前管理员未被激活!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

module.exports = {
    regMainAdmin,
    loginAdmin
};
