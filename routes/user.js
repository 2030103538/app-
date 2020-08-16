const express = require('express');
const router = express.Router();

// category_up
const {user_up} = require('./../controller/managerApi/uploadFile');
const userController = require('./../controller/managerApi/userController');

// 分类图片上传
router.post('/user_up',user_up.single('user_up'),(req,res,next)=>{
    const file = req.file;
    res.send({
        status:1,
        msg:'图片上传成功',
        data:{
            name:'/uploads/images/user/'+file.filename,
            oeiginalName:file.originalname,
        }
    })
});


//获取验证码
router.get('/phone',(req,res,next)=>{
    console.log(req.query.phone);
    userController.getPhone(req.query,result=>{
        console.log(result);
        res.send(result)
    })
});
//注册
router.post('/user_reg',(req,res,next)=>{
    userController.addUser(req.body,result=>{
        res.send(result)
    })
})
//登录
router.post('/user_login',(req,res,next)=>{
    userController.loginUser(req.body,result=>{
        res.send(result)
    })
})

//登录
router.get('/user_getbrand',(req,res,next)=>{
    userController.getBrandList(req.query,result=>{
        res.send(result)
    })
})

//申请商店
router.post('/user_addstore',(req,res,next)=>{
    userController.addStore(req.body,result=>{
        res.send(result)
    })
})

//根据id商店获取
router.post('/get_user_store_data',(req,res,next)=>{
    userController.getUserStoreDate(req.body,result=>{
        res.send(result)
    })
})

//根据id商店获取
router.get('/get_tuijian_data',(req,res,next)=>{
    userController.getTuiJianDate(req.query,result=>{
        res.send(result)
    })
})

//根据id商店获取
router.get('/get_table_data',(req,res,next)=>{
    userController.getTableDate(req.query,result=>{
        res.send(result)
    })
})

//第三方登录
router.post('/wx_qq_login',(req,res,next)=>{
    userController.loginUserwx(req.body,result=>{
        res.send(result)
    })
})




module.exports = router;