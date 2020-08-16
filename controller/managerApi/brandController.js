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

// 添加商店分类
function addBrand (params,callBack){


    const {name,url,show_status} = params;

    if (!name){
        callBack(ResultTemp(0,'分类名不能为空',{}));
        return;
    }



    let sql = `INSERT INTO pm_brand(parent_id,name,show_status,url) VALUES (?,?,?,?)`;
    let values = [0,name,show_status,url];

    Query(sql,values).then(data=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'新增分类成功',{}))
        }else {
            callBack(ResultTemp(0,'新增分类失败',{}))
        }
    }).catch(err=>{
        callBack(ResultTemp(0,'新增分类失败',{}))
    })

}

// 更新商店分类
function eitBrand(params,callBack){

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

    let sql = `UPDATE pm_brand SET ${updataSte} WHERE id = ?`;

    Query(sql,[id]).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'更新分类成功',{}))
        }else {
            callBack(ResultTemp(0,'更新分类失败',{}))
        }
    })

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

//根据id获取分类
function getBrandId(params,callBack){
    const {id} = params;
    if(!id){
        callBack(ResultTemp(0,'分类id不能为空',{}));
        return;
    }
    let sql = `SELECT * FROM pm_brand WHERE id = ?`;

    Query(sql,[id]).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'获取分类成功',data.data))
        }else {
            callBack(ResultTemp(0,'获取分类失败',{}))
        }
    })
}

//根据id删除分类
function delBrandId(params,callBack){
    const {id} = params;
    if(!id){
        callBack(ResultTemp(0,'分类id不能为空',{}));
        return;
    }
    let sql = `DELETE FROM pm_brand WHERE id = ?;`;

    console.log(id);
    Query(sql,[id]).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'获取分类成功',data.data))
        }else {
            callBack(ResultTemp(0,'获取分类失败',{}))
        }
    })
}

//获取全部分类
function getBrandAll(params,callBack){

    let sql = `SELECT * FROM pm_brand`;

    Query(sql).then((data)=>{
        callBack(ResultTemp(1,'获取成功',data))
    }).catch((err)=>{
        callBack(ResultTemp(0,'获取失败', {}))
    })

}

//获取待待审核和审核失败的商店
function getBrandAudit(params,callBack){

    let pageNum = params.page_num || 1;
    let pageSize = params.page_size || 5;

    console.log(params);

    let sql2 = []
    for(let k in params){
        if(k !== 'page_num' && k !== 'page_size'){
            if(params[k] !== null && params[k] !== undefined && params[k] !== ''){
                let sql3 = '';
                if(k === 'name'){
                    sql3 = `${k} like "%${params[k]}%"`;
                }else {
                    if(typeof params[k] === 'string'){
                        sql3 = `${k} = "${params[k]}"`;
                    }else {
                        sql3 = `${k} = ${params[k]}`;
                    }
                }

                sql2.push(sql3)

            }
        }
    }

    let sql4 = (sql2.length > 0 ? ` WHERE ` : "") + sql2.join(` AND `);

    console.log(params.isaudit);
    console.log(!params.isaudit);
    console.log(sql4);
    console.log(params);

    if (!params.isaudit && params.isaudit !== 0 && sql2.length > 0){
        sql4 += ` AND isaudit = 0 or isaudit = 2`
    }else if (!params.isaudit && sql2.length <= 0){
        sql4 += ` WHERE isaudit = 0 or isaudit = 2`
    }

    let sql5 = `SELECT COUNT(*) as counts FROM pm_store ${sql4}`
    let sql6 = `SELECT * FROM pm_store ${sql4} LIMIT ${(pageNum-1)*pageSize} , ${pageSize}`



    Query(sql5).then((data)=>{
        Query(sql6).then((data1)=>{
            let data2 = {};
            data2.counts = data.data[0].counts;
            data2.category_list = data1.data;
            callBack(ResultTemp(1,'获取成功',data2))
        })
    }).catch(err=>{
        console.log(err);
    })

}

/*
    根据id更改商店属性
*/
function eitBrandId(params,callBack){
    const {id} = params;
    console.log(params);
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

    console.log(updataSte);

    let sql = `UPDATE pm_store SET ${updataSte} WHERE id = ?`;

    Query(sql,[id]).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'更新分类成功',{}))
        }else {
            callBack(ResultTemp(0,'更新分类失败',{}))
        }
    }).catch(err=>{
        console.log(err);
    })
}

//获取审核通过商店
function getBrandThrough(params,callBack){

    let pageNum = params.page_num || 1;
    let pageSize = params.page_size || 5;

    let sql2 = []
    for(let k in params){
        if(k !== 'page_num' && k !== 'page_size'){
            if(params[k] !== null && params[k] !== undefined && params[k] !== ''){
                let sql3 = '';
                if(k === 'name'){
                    sql3 = `${k} like "%${params[k]}%"`;
                }else {
                    if(typeof params[k] === 'string'){
                        sql3 = `${k} = "${params[k]}"`;
                    }else {
                        sql3 = `${k} = ${params[k]}`;
                    }
                }

                sql2.push(sql3)

            }
        }
    }

    let sql4 = (sql2.length > 0 ? ` WHERE ` : "") + sql2.join(` AND `);

    if(sql2.length <= 0){
        sql4 +=  `WHERE isaudit = 1`
    }else {
        sql4 += ` AND isaudit = 1`
    }

    let sql5 = `SELECT COUNT(*) as counts FROM pm_store ${sql4}`;
    let sql6 = `SELECT * FROM pm_store ${sql4} LIMIT ${(pageNum-1)*pageSize} , ${pageSize}`;



    Query(sql5).then((data)=>{
        Query(sql6).then((data1)=>{
            let data2 = {};
            data2.counts = data.data[0].counts;
            data2.category_list = data1.data;
            callBack(ResultTemp(1,'获取成功',data2))
        }).catch(err1=>{
            console.log(err1);
        })
    }).catch(err=>{
        console.log(err);
    })

}

/*
    根据id获取商店属性
*/
function getStoreDate(params,callBack){
    const {id} = params;
    if(!id){
        callBack(ResultTemp(0,'分类id不能为空',{}));
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

//根据id删除商店
function delStoreId(params,callBack){
    const {id} = params;
    if(!id){
        callBack(ResultTemp(0,'商品id不能为空',{}));
        return;
    }
    let sql = `DELETE FROM pm_store WHERE id = ?;`;

    console.log(id);
    Query(sql,[id]).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'删除商店成功',data.data))
        }else {
            callBack(ResultTemp(0,'删除商店失败',{}))
        }
    }).catch(err=>{
        console.log(err);
    })
}




//随机编号
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

module.exports = {
    addBrand,
    eitBrand,
    getBrandList,
    getBrandId,
    delBrandId,
    getBrandAll,
    getBrandAudit,
    eitBrandId,
    getBrandThrough,
    getStoreDate,
    delStoreId
};