// 引入moment
const Moment = require('moment');


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
   添加商品分类
*/
function addCategor(params,callBack){
    const obj = params;
    const {parent_id, name, product_count, show_status, url, keywords, description, old_url} = obj
    console.log(parent_id, name, product_count, show_status, url, keywords, description, old_url);
    if(!name){
        callBack(ResultTemp(0,'分类名不能为空',{}));
        return;
    }
    let sql = `INSERT INTO pm_category(parent_id,name,product_count,show_status,url,keywords,description,old_url) VALUES (?,?,?,?,?,?,?,?)`;
    let values = [parent_id,name,product_count,show_status,url,keywords,description,old_url];

    Query(sql,values).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'新增分类成功',{}))
        }else {
            callBack(ResultTemp(0,'新增分类失败',{}))
        }
    }).catch((err)=>{
        callBack(ResultTemp(0,'新增分类失败',{}))
    })
}

/*
   获取商品分类列表
*/
function getCategorList(params,callBack){

    const {page_num,page_size} = params;

    let pageNum = page_num || 1;
    let pageSize = page_size || 5;


    let sql = `SELECT COUNT(*) as counts FROM pm_category`
    let sql1 = `SELECT * FROM pm_category LIMIT ${((pageNum-1)*pageSize) + 1} , ${pageSize}`

    Query(sql).then((data)=>{
        Query(sql1).then((data1)=>{
            let data2 = {};
            data2.counts = data.data[0].counts;
            data2.category_list = data1.data;
            callBack(ResultTemp(1,'获取成功',data2))
        })
    })
}


/*
   获取商品分类
*/
function getCategor(params,callBack){

    const {parent_id} = params;

    if(!parent_id){
        callBack(ResultTemp(0,数据不完整,{}));
        return;
    }
    let sql1 = `SELECT * FROM pm_category WHERE parent_id = ?;`;


    Query(sql1,[parent_id]).then((data1)=>{
        callBack(ResultTemp(1,'获取成功',data1))
    }).catch((err)=>{
        console.log(err);
    })

}


/*
   删除商品分类
*/
function delCategor(params,callBack){

    const {id} = params;
    if(!id){
        callBack(ResultTemp(0,'分类id不能为空',{}));
        return;
    }
    let sql = `DELETE FROM pm_category WHERE id = ? OR parent_id = ?`;

    Query(sql,[id,id]).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'删除分类成功',{}))
        }else {
            callBack(ResultTemp(0,'删除分类失败',{}))
        }
    })

}

/*
    编辑商品分类
*/
function eitCategor(params,callBack){
    const {id} = params;
    console.log(id);
    if(!id){
        callBack(ResultTemp(0,'分类id不能为空',{}));
        return;
    }
    let updataSte = '' ;

    for(let k in params){
        if(k !== 'id'){
            let str =`${k} = ${params[k]},`;
            if(typeof params[k] === 'string'){
                str = `${k} = "${params[k]}",`
            }
            updataSte += str
        }
    }
    updataSte = updataSte.slice(0,updataSte.length-1);

    let sql = `UPDATE pm_category SET ${updataSte} WHERE id = ?`;

    Query(sql,[id]).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'更新分类成功',{}))
        }else {
            callBack(ResultTemp(0,'更新分类失败',{}))
        }
    })
}

/*
    更新商品分类
*/
function updateCategor(params,callBack){
    const {id} = params;
    if(!id){
        callBack(ResultTemp(0,'分类id不能为空',{}));
        return;
    }
    let sql = `SELECT * FROM pm_category WHERE id = ?`;

    Query(sql,[id]).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'获取分类成功',data.data))
        }else {
            callBack(ResultTemp(0,'获取分类失败',{}))
        }
    })
}

/*
    更新商品分类
*/
function viewCategor(params,callBack){
    const {id} = params;
    if(!id){
        callBack(ResultTemp(0,'分类id不能为空',{}));
        return;
    }
    let sql = `SELECT * FROM pm_category WHERE parent_id = ?`;

    Query(sql,[id]).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'获取分类成功',data.data))
        }else {
            callBack(ResultTemp(0,'获取分类失败',{}))
        }
    })
}


module.exports = {
    addCategor,
    getCategor,
    delCategor,
    updateCategor,
    eitCategor,
    getCategorList,
    viewCategor
};
