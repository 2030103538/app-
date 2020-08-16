const express = require('express');
const router = express.Router();

// category_up
const {search_up} = require('./../controller/managerApi/uploadFile');
const searchController = require('./../controller/managerApi/searchController');


// 分类图片上传
router.post('/search_up',search_up.single('search_img'),(req,res,next)=>{
    const file = req.file;
    res.send({
        status:1,
        msg:'图片上传成功',
        data:{
            name:'/uploads/images/search/'+file.filename,
            oeiginalName:file.originalname,
        }
    })
});


//修改搜索栏信息
router.post('/dit_search',(req,res,next)=>{

    searchController.eitSearch(req.body,result=>{
        res.send(result)
    })
});

//获取搜索栏信息
router.get('/get_search',(req,res,next)=>{

    searchController.getSearch(req.query,result=>{
        res.send(result)
    })
});



module.exports = router;