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
  新增一个table
*/
function addTable(params, callBack){

    // 1. 获取数据
    const {name,imgUrl1,img1,imgUrl2,img2,imgUrl3,img3,imgUrl4,img4,imgUrl5,img5,imgUrl6,img6,advertising1,advertisingUrl1,advertising2,advertisingUrl2}
    = params;


    // 2. 容错处理
    if(!name){
        callBack(ResultTemp(0, '上传的参数不完整!', {}));
        return;
    }
    // 3. 添加table
    let sql = `INSERT INTO pm_table(name,imgUrl1,img1,imgUrl2,img2,imgUrl3,img3,imgUrl4,img4,imgUrl5,img5,imgUrl6,img6,advertising1,advertisingUrl1,advertising2,
    advertisingUrl2) VALUES ( ?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?); `;
    let value = [name,imgUrl1,img1,imgUrl2,img2,imgUrl3,img3,imgUrl4,img4,imgUrl5,img5,imgUrl6,img6,advertising1,advertisingUrl1,advertising2,advertisingUrl2];

    Query(sql, value).then((data)=>{
        callBack(ResultTemp(1, "Table添加成功", {}));
    }).catch((error)=>{
        console.log(error);
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
   获取table列表
*/
function getTableList(params,callBack){

    const {page_num,page_size} = params;

    let pageNum = page_num || 1;
    let pageSize = page_size || 5;


    let sql = `SELECT COUNT(*) as counts FROM pm_table`
    let sql1 = `SELECT * FROM pm_table LIMIT ${(pageNum-1)*pageSize} , ${pageSize}`

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
    编辑商品分类
*/
function eitTable(params,callBack){
    const {id} = params;

    console.log(id);
    if(!id){
        callBack(ResultTemp(0,'分类id不能为空',{}));
        return;
    }
    let updataTable = '' ;

    for(let k in params){
        if(k !== 'id'){
            let str =`${k} = ${params[k]},`;
            if(typeof params[k] === 'string'){
                str = `${k} = "${params[k]}",`
            }
            updataTable += str
        }
    }
    updataTable = updataTable.slice(0,updataTable.length-1);

    let sql = `UPDATE pm_table SET ${updataTable} WHERE id = ?`;

    Query(sql,[id]).then((data)=>{
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
   根据id获取table
*/
function getTableId(params,callBack){

    const {id} = params;

    if(!id){
        callBack(ResultTemp(0,数据不完整,{}));
        return;
    }
    let sql1 = `SELECT * FROM pm_table WHERE id = ?;`;


    Query(sql1,[id]).then((data1)=>{
        callBack(ResultTemp(1,'获取成功',data1))
    }).catch((err)=>{
        console.log(err);
    })

}


/*
   根据id删除table
*/
function delTable(params,callBack){

    const {id} = params;

    let sql = `DELETE FROM pm_table WHERE id = ?`;

    Query(sql,[id]).then(data=>{
        callBack(ResultTemp(1,'删除成功',data));
    }).catch(err=>{
        console.log(err);
        callBack(ResultTemp(0,'删除失败',{}));
    })

}

module.exports = {
    addTable,
    getTableList,
    eitTable,
    getTableId,
    delTable
}