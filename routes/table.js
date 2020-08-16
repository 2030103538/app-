const express = require('express');
const router = express.Router();

// category_up
const {lun_up} = require('./../controller/managerApi/uploadFile');
const tableController = require('./../controller/managerApi/tableController');

// 轮播图和广告
router.post('/lun_up',lun_up.single('lun_img'),(req,res,next)=>{
    const file = req.file;
    console.log(file.originalname);
    res.send({
        status:1,
        msg:'图片上传成功',
        data:{
            name:'/uploads/images/lunbo/'+file.filename,
            oeiginalName:file.originalname,
        }
    })
});


//获取商品
router.post('/add_table',(req,res,next)=>{
    tableController.addTable(req.body,result=>{
        res.send(result)
    })
});

//获取table
router.get('/get_table',(req,res,next)=>{
    tableController.getTableList(req.query,result=>{
        res.send(result)
    })
});

//根据id修改table
router.post('/eit_table',(req,res,next)=>{
    tableController.eitTable(req.body,result=>{
        res.send(result)
    })
});

//根据id获取Table
router.get('/get_table_id',(req,res,next)=>{
    tableController.getTableId(req.query,result=>{
        res.send(result)
    })
});

//根据id获取Table
router.post('/del_table_id',(req,res,next)=>{
    tableController.delTable(req.body,result=>{
        res.send(result)
    })
});




module.exports = router;