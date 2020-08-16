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
  注册用户
*/
function addUser(prams, callBack){
    // 1. 获取参数
    const {phone, password, code,name} = prams;
    const md5_password = md5(password, KEY);
    // 2. 判断
    if(!phone || !password || !code){
        callBack(ResultTemp(0, '手机号或者密码不能为空!', {}));
        return;
    }
    if(code !== codes[phone]){
        callBack(ResultTemp(0, '验证码不正确', {}));
        return;
    }
    // 3. 创建时间
    const birthday = Moment().format('YYYY-MM-DD');
    // 4. 插入数据库
    let sql = `INSERT INTO pm_user(phone, password, name, birthday, status) VALUES (?, ?, ?, ?, ?)`;
    let value = [phone, md5_password, name, birthday, 1];
    Query(sql, value).then((result)=>{
        callBack(ResultTemp(1, '注册账号成功!', {}));
    }).catch((error)=>{
        callBack(ResultTemp(0, '注册账号失败!', {}));
    });
}

/*
  用户登录
*/
function loginUser(prams, callBack){
    // 1. 获取数据
    const {phone, password} = prams;
    console.log(phone, password);
    // 2. 判断
    if(!phone || !password){
        callBack(ResultTemp(0, '用户名或密码不能为空!', {}));
        return;
    }

    // 3. 查询数据库
    let sql = `SELECT * FROM pm_user WHERE phone = ? AND status = ?;`;
    let value = [phone, 1];
    Query(sql, value).then((result)=>{
        if(result.data.length > 0){
            // 3.1 取出密码对比

            let pwd = md5(password, KEY);
            if(result.data[0].password === pwd){ // 登录成功
                const {id, name, password, img, birthday, gender,phone} = result.data[0];
                //  3.1 生成一个token
                const userData = {id, name, password};
                const token = jwt.sign(userData, KEY);
                callBack(ResultTemp(1, '登录成功!', {token, id, name, img, birthday, gender,phone}));
            }else {
                callBack(ResultTemp(0, '输入密码不正确!', {}));
            }
        }else {
            callBack(ResultTemp(0, '当前用户未被激活!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

function getPhone(prams, callBack) {


    let data1 = null;
    getphone(prams.phone,data=>{
        data1 = data
    })
    console.log(data1);
    console.log(data1.data);
    callBack(ResultTemp(1, '获取成功!',data1.data));

}

//获取商店分类列表
function getBrandList(params,callBack){

    const {page_num,page_size} = params;

    let pageNum = page_num || 1;
    let pageSize = page_size || 5;


    let sql = `SELECT COUNT(*) as counts FROM pm_brand`
    let sql1 = `SELECT * FROM pm_brand LIMIT ${(pageNum-1)*pageSize} , ${pageSize}`

    Query(sql).then((data)=>{
        Query(sql1).then((data1)=>{
            let data2 = {};
            data2.counts = data.data[0].counts;
            data2.category_list = data1.data;
            callBack(ResultTemp(1,'获取成功',data2))
        })
    })
}

//添加商店
function addStore(params,callBack){

    const {name,parent_id,address,url,imgs,phone,businessEnd,business,latitude,longitude,user_id} = params;

    if (!name){
        callBack(ResultTemp(0,'分类名不能为空',{}));
        return;
    }



    let productSn = like(5);
    let sql = `INSERT INTO pm_store (parent_id,name,address,productSn,url,imgs,phone,businessEnd,business,latitude,longitude,user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
    let values = [parent_id,name,address,productSn,url,imgs,phone,businessEnd,business,latitude,longitude,user_id];
    console.log(values);
    Query(sql,values).then(data=>{
        console.log(data);
        if(data.code === 1){
            callBack(ResultTemp(1,'申请上传成功',{}))
        }else {
            callBack(ResultTemp(0,'申请上传失败',{}))
        }
    }).catch(err=>{
        console.log(err);
        callBack(ResultTemp(0,'申请上传失败',{}))
    })
}

//根据用户id获取商店
function getUserStoreDate(params,callBack){
    const {userId} = params;

    if(!userId){
        callBack(ResultTemp(0,'分类id不能为空',{}));
        return;
    }
    let sql = `SELECT * FROM pm_store WHERE user_id = ?`;

    console.log(userId);

    Query(sql,[userId]).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'获取商店数据成功',data.data))
        }else {
            callBack(ResultTemp(0,'获取商店数据失败',{}))
        }
    }).catch(err=>{
        console.log(err);
    })
}

//获取首页数据
function getTuiJianDate(params,callBack){

    let sql = `SELECT * FROM pm_brand WHERE show_status = ?`;

    let sql1 = `SELECT * FROM pm_store WHERE isaudit = 1 AND isSale = 1 LIMIT 0,5`;

    let sql2 = `SELECT * FROM pm_table`;



    Promise.all([Query(sql,[1]),Query(sql1),Query(sql2)]).then((res)=>{


        console.log(res);

        if(res[0].code === 1 && res[1].code === 1){
            callBack(ResultTemp(1,'获取商店数据成功',res))
        }


    }).catch(err=>{
        console.log(err);
    })


}

//获取table
function getTableDate(params,callBack){

    let sql = `SELECT * FROM pm_table`;


    Query(sql).then(res=>{
        callBack(ResultTemp(1,'获取商店数据成功',res))
    }).catch(err=>{
        console.log(err);
        callBack(ResultTemp(0,'获取失败',{}))
    })




}

/*
  微信qq用户登录
*/
function loginUserwx(prams, callBack){
    // 1. 获取数据
    const {name, img,gender,openId} = prams;
    console.log(prams);

    // 2. 判断
    if(!openId || !name){
        callBack(ResultTemp(0, '用户名或密码不能为空!', {}));
        return;
    }

    const birthday = Moment().format('YYYY-MM-DD');

    // 3. 查询数据库
    let sql = `SELECT * FROM pm_user WHERE openId = ?`;
    let sql1 = `INSERT INTO pm_user(name, img,gender,openId,birthday) VALUES (?, ?, ?, ?)`;
    let value = [openId];
    let value1 = [name, img,gender,openId,birthday];
    Query(sql, value).then((result)=>{
        if(result.data.length > 0){
            // 3.1 取出密码对比
                const {id, name, password, img, birthday, gender,phone} = result.data[0];
                //  3.1 生成一个token
                const userData = {id, name, password};
                const token = jwt.sign(userData, KEY);
                callBack(ResultTemp(1, '登录成功!', {token, id, name, img, birthday, gender,phone,}));
        }else {
            Query(sql1,value1).then(res=>{
                if(res.code === 1){
                    Query(sql, value).then(res=>{
                        console.log(res);
                        if(res.code === 1){
                            const {id, name, password, img, birthday, gender,phone} = result.data[0];
                            const userData = {id, name, password};
                            const token = jwt.sign(userData, KEY);
                            callBack(ResultTemp(1, '登录成功!', {token, id, name, img, birthday, gender,phone}));
                        }else {
                            callBack(ResultTemp(0, '登录失败!', {}));
                        }
                    })
                }
            }).catch(error=>{
                callBack(ResultTemp(error.code, error.msg, error.data));
            })
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}



//工具
function getphone (phone,fun){
    console.log(phone);
    if(!/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)){
        fun({
            status:0,
            msg:'手机不正确'
        });
        return;
    }
    let code = like(6);
    codes[phone] = code ;
    fun({status:1,
        data:{
            phone,
            code
        }})

}

function like(index) {
    const char = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    let result = '';
    for (let i=0; i<index;i++){
        let idx = Math.ceil(Math.random()*26);
        result += char[idx]
    }
    let timestamp =new Date().getTime();
    result += timestamp;
    return result ;
}
let codes=[];


module.exports = {
    addUser,
    loginUser,
    getPhone,
    getBrandList,
    addStore,
    getUserStoreDate,
    getTuiJianDate,
    getTableDate,
    loginUserwx
};
