// 引入数据库查询函数
const Query = require('./../../config/dbHelper');


function ResultTemp(status, msg, data) {
    return {
        status,
        msg,
        data
    }
}

/*
    修改搜索栏信息
*/
function eitSearch(params,callBack){
    const {id} = params;

    console.log(id);
    if(!id){
        callBack(ResultTemp(0,'id不能为空',{}));
        return;
    }
    let updataSearch = '' ;

    for(let k in params){
        if(k !== 'id'){
            let str =`${k} = ${params[k]},`;
            if(typeof params[k] === 'string'){
                str = `${k} = "${params[k]}",`
            }
            updataSearch += str
        }
    }
    updataSearch = updataSearch.slice(0,updataSearch.length-1);

    let sql = `UPDATE pm_search SET ${updataSearch} WHERE id = ?`;

    Query(sql).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'修改成功',{}))
        }else {
            callBack(ResultTemp(0,'修改失败',{}))
        }
    }).catch(err=>{
        console.log(err);
        callBack(ResultTemp(0,'修改失败',{}))
    })
}

/*
    获取搜索栏信息
*/
function getSearch(params,callBack){
    const {id} = params;
    let sql = `SELECT * FROM pm_search WHERE id = ?`
    Query(sql,[id]).then(res=>{
        callBack(ResultTemp(1,'获取成功',res))
    }).catch(err=>{
        console.log(err);
        callBack(ResultTemp(0,'获取失败',{}))
    })
}

module.exports = {
    eitSearch,
    getSearch
}