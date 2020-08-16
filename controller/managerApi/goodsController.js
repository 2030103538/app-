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
  获取数据
*/
function getGoods(prams, callBack){

    let pageNum = prams.page_num || 1;
    let pageSize = prams.page_size || 5;

    let sql = `SELECT * FROM pm_store LIMIT ${(pageNum-1)*pageSize} , ${pageSize}`

    console.log(sql);

    Query(sql).then(data=>{
        callBack(ResultTemp(1,'获取成功',data))
    }).catch(err=>{
        console.log(err);
        callBack(ResultTemp(0,'获取失败', {}))
    })
}

//根据id获取商店
function getStoreDate(params,callBack){
    const {id} = params;

    if(!id){
        callBack(ResultTemp(0,'id不能为空',{}));
        return;
    }
    let sql = `SELECT * FROM pm_store WHERE id = ?`;

    console.log(id);

    Query(sql,[id]).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'获取商店数据成功',data.data))
        }else {
            callBack(ResultTemp(0,'获取商店数据失败',{}))
        }
    }).catch(err=>{
        console.log(err);
    })
}

//根据id获取商店
function chooseStoreDate(params,callBack){
    const {name} = params;
    console.log(params);
    let pageNum = params.page_num || 1;
    let pageSize = params.page_size || 5;

    if(!name){
        callBack(ResultTemp(0,'搜索不能为空',{}));
        return;
    }

    let sql = `SELECT * FROM pm_store WHERE name LIKE '%${name}%' LIMIT ${(pageNum-1)*pageSize} , ${pageSize}`;



    Query(sql,[name]).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'获取商店数据成功',data.data))
        }else {
            callBack(ResultTemp(0,'获取商店数据失败',{}))
        }
    }).catch(err=>{
        console.log(err);
    })
}


module.exports = {
    getGoods,
    getStoreDate,
    chooseStoreDate
};
