const express = require('express');
const router = express.Router();

// category_up
const {brand_up} = require('./../controller/managerApi/uploadFile');
const brandController = require('./../controller/managerApi/brandController');

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


//上传商店分类
router.post('/add_brand',(req,res,next)=>{
    brandController.addBrand(req.body,result=>{
        res.send(result)
    })
});

//更新商店分类
router.post('/eit_brand',(req,res,next)=>{
    brandController.eitBrand(req.body,result=>{
        res.send(result)
    })
});

//获取商店分类
router.get('/get_brand',(req,res,next)=>{
    brandController.getBrandList(req.query,result=>{
        res.send(result)
    })
});

//根据id获取商店分类
router.get('/id_brand',(req,res,next)=>{
    brandController.getBrandId(req.query,result=>{
        res.send(result)
    })
});

//根据id获取商店分类
router.get('/del_brand',(req,res,next)=>{
    brandController.delBrandId(req.query,result=>{
        res.send(result)
    })
});

//获取所有商店分类
router.get('/all_brand',(req,res,next)=>{
    brandController.getBrandAll(req.query,result=>{
        res.send(result)
    })
});

//获取待审核和审核失败商店
router.post('/audit_brand',(req,res,next)=>{
    brandController.getBrandAudit(req.body,result=>{
        res.send(result)
    })
});

//根据id更改商店属性
router.post('/eit_brand_id',(req,res,next)=>{
    brandController.eitBrandId(req.body,result=>{
        res.send(result)
    })
});

//获取审核通过的商店
router.post('/get_brand_through',(req,res,next)=>{
    brandController.getBrandThrough(req.body,result=>{
        res.send(result)
    })
});

//根据id获取商店属性
router.get('/get_store_data',(req,res,next)=>{
    brandController.getStoreDate(req.query,result=>{
        res.send(result)
    })
});

//根据id删除商店
router.post('/del_store_id',(req,res,next)=>{
    brandController.delStoreId(req.body,result=>{
        res.send(result)
    })
});



module.exports = router;