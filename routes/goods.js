const express = require('express');
const router = express.Router();

const {brand_up} = require('./../controller/managerApi/uploadFile');

// 客户端
const goodsController = require('./../controller/managerApi/goodsController');


// 分类图片上传
router.post('/brand_up',brand_up.single('brand_img'),(req,res,next)=>{
    const file = req.file;
    console.log(file.originalname);
    res.send({
        status:1,
        msg:'图片上传成功',
        data:{
            name:'/uploads/images/brand/'+file.filename,
            oeiginalName:file.originalname,
        }
    })
});



//获取商品
router.get('/get_goods',(req,res,next)=>{
    goodsController.getGoods(req.query,result=>{
        res.send(result)
    })
});

//获取商品
router.get('/get_goods_id',(req,res,next)=>{
    goodsController.getStoreDate(req.query,result=>{
        res.send(result)
    })
});

//获取商品
router.post('/choose_store_date',(req,res,next)=>{
    goodsController.chooseStoreDate(req.body,result=>{
        res.send(result)
    })
});





module.exports = router;