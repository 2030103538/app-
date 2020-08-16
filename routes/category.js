const express = require('express');
const router = express.Router();

// category_up
const {category_up} = require('./../controller/managerApi/uploadFile');
const categoryController = require('./../controller/managerApi/categoryController');

// 分类图片上传
router.post('/category_up',category_up.single('cartg_img'),(req,res,next)=>{
    const file = req.file;
    console.log(file.originalname);
    res.send({
        status:1,
        msg:'图片上传成功',
        data:{
            name:'/uploads/images/category/'+file.filename,
            oeiginalName:file.originalname,
        }
    })
});

//上传商品分类
router.post('/add_category',(req,res,next)=>{
    categoryController.addCategor(req.body,result=>{
        res.send(result)
    })
});
//获取商品分类
router.get('/get_category',(req,res,next)=>{
    categoryController.getCategor(req.query,result=>{
        res.send(result)
    })
});
router.get('/get_category_list',(req,res,next)=>{
    categoryController.getCategorList(req.query,result=>{
        res.send(result)
    })
});
//删除商品分类
router.post('/del_category',(req,res,next)=>{
    categoryController.delCategor(req.body,result=>{
        res.send(result)
    })
});
//编辑商品分类
router.post('/update_category',(req,res,next)=>{
    categoryController.updateCategor(req.body,result=>{
        res.send(result)
    })
});
//编辑商品分类
router.post('/eit_category',(req,res,next)=>{
    categoryController.eitCategor(req.body,result=>{
        res.send(result)
    })
});
//编辑商品分类
router.post('/view_category',(req,res,next)=>{
    categoryController.viewCategor(req.body,result=>{
        res.send(result)
    })
});


module.exports = router;