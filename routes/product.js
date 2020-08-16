const express = require('express');
const router = express.Router();

// category_up
const {product_up} = require('./../controller/managerApi/uploadFile');
const productController = require('./../controller/managerApi/productController');

// 分类图片上传
router.post('/product_up',product_up.single('product_img'),(req,res,next)=>{
    const file = req.file;
    res.send({
        status:1,
        msg:'图片上传成功',
        data:{
            name:'/uploads/images/product/'+file.filename,
            oeiginalName:file.originalname,
        }
    })
});

//分类获取
router.get('/product_fl',(req,res,next)=>{
    productController.getProduct(req.query,result=>{
        res.send(result)
    })
})

//添加商品
router.post('/product_add',(req,res,next)=>{
    productController.addProduct(req.body,result=>{
        res.send(result)
    })
})
//获取商品
router.post('/product_set',(req,res,next)=>{
    productController.setProduct(req.body,result=>{
        res.send(result)
    })
})
//删除商品
router.post('/product_del',(req,res,next)=>{
    productController.delProduct(req.body,result=>{
        res.send(result)
    })
})


//更新商品
router.post('/product_update',(req,res,next)=>{
    productController.updateProduct(req.body,result=>{
        res.send(result)
    })
})


//更新商品
router.post('/product_updateid',(req,res,next)=>{
    productController.updateProductId(req.body,result=>{
        res.send(result)
    })
})

//修改商品
router.post('/product_modifyid',(req,res,next)=>{
    productController.modifyProductId(req.body,result=>{
        res.send(result)
    })
})




module.exports = router;