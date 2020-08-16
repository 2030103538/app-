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
   获取商品分类
   INSERT INTO `shop_db`.`pm_product` (`id`, `productInfoValue`, `name`, `Introduction`, `brand`, `originaPrice`, `price`, `inventory`, `newSale`, `recommendSale`, `typeSale`, `keywordSale`, `preferential`, `startTiemSale`, `endTiemSale`, `priceSale`, `dialogImageUrl`, `content`, `image`, `homeKillSale`) VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
*/
function getProduct(params,callBack){
    let sql = `SELECT * FROM pm_category`;
    Query(sql).then((val)=>{
        let arrays = [];
        for(let i=0;i<val.data.length;i++){
            if(val.data[i].parent_id === 0){
                let puArr = val.data[i];
                puArr.children = [];
                arrays.push(puArr);
            }
        }

        for (let j=0;j<val.data.length;j++){
            if(val.data[j].parent_id !== 0){
                for (let g=0;g<arrays.length;g++){
                    if(arrays[g].id === val.data[j].parent_id){
                        arrays[g].children.push(val.data[j])
                    }
                }
            }
        }


        callBack(ResultTemp(1,'分类获取成功',arrays));

    })
}

/*
  新增一个商品
*/
function addProduct(params, callBack){
    // 1. 获取数据
    const {name, Introduction, brand, price, originaPrice, inventory, productInfoValue, isSale,  newSale, recommendSale, typeSale, keywordSale,preferential, startTiemSale, endTiemSale, priceSale, count, discount, dialogImageUrl, content, image} = params;

    // 2. 容错处理
    if(!name){
        callBack(ResultTemp(0, '上传的参数不完整!', {}));
        return;
    }
    let productSn = like(6);
    // 3. 创建商品
    let sql = `INSERT INTO pm_product(name, Introduction, brand, price, originaPrice, inventory, productInfoValue, isSale,  newSale, recommendSale, typeSale, keywordSale,preferential, startTiemSale, endTiemSale, priceSale, count, discount, dialogImageUrl, content, image,productSn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); `;
    let value = [name, Introduction, brand, price, originaPrice, inventory, productInfoValue, isSale,  newSale, recommendSale, typeSale, keywordSale,preferential, startTiemSale, endTiemSale, priceSale, count, discount, dialogImageUrl, content, image, productSn];
    Query(sql, value).then((data)=>{
        callBack(ResultTemp(1, "商品添加成功", {}));
    }).catch((error)=>{
        console.log(error);
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
   获取商品
*/
function setProduct(params,callBack){

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

    let sql4 = (sql2.length > 0 ? `WHERE ` : "") + sql2.join("AND");

    let sql5 = `SELECT COUNT(*) as counts FROM pm_product ${sql4}`
    let sql6 = `SELECT * FROM pm_product ${sql4} LIMIT ${(pageNum-1)*pageSize} , ${pageSize}`



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
   删除商品
*/
function delProduct(params,callBack){

    const {id} = params;
    let ids1 = null;
    // if (typeof id === 'number'){
    //     ids1 = id
    // }else {
    //     ids1 = id.split(',').map(Number);
    // }
    //
    //
    // if(!ids1){
    //     callBack(ResultTemp(0,'参数不完整',{}));
    //     return
    // }


    let sql = `DELETE FROM pm_product WHERE id in (${id})`;

    Query(sql).then(data=>{
        callBack(ResultTemp(1,'删除成功',data));
    }).catch(err=>{
        callBack(ResultTemp(0,'删除失败',{}));
    })

}

/*
   更新商品
*/
function updateProduct(params,callBack) {

    const {id} = params;
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

    let sql = `UPDATE pm_product SET ${updataSte} WHERE id = ?`;

    Query(sql,[id]).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'更新分类成功',{}))
        }else {
            callBack(ResultTemp(0,'更新分类失败',{}))
        }
    })

}


/*
   根据id获取商品
*/
function updateProductId(params,callBack) {

    const {id} = params;

    if(!id){
        callBack(ResultTemp(0,'商品数据不全',{}));
        return;
    }

    console.log(id);
    let sql = `SELECT * FROM pm_product WHERE id = ?`

    Query(sql,[id]).then(data=>{
        callBack(ResultTemp(1,'商品数据获取成功',data));
    }).catch(err=>{
        callBack(ResultTemp(0,'商品数据获取失败',{}));
    })

}

/*
   根据id修改商品
*/
function modifyProductId(params,callBack) {

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

    let sql = `UPDATE pm_product SET ${updataSte} WHERE id = ?`;

    Query(sql,[id]).then((data)=>{
        if(data.code === 1){
            callBack(ResultTemp(1,'商品修改成功',{}))
        }else {
            callBack(ResultTemp(0,'商品修改失败',{}))
        }
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
    getProduct,
    setProduct,
    delProduct,
    addProduct,
    updateProduct,
    updateProductId,
    modifyProductId
};
