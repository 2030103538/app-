const express = require('express');
const router = express.Router();
// 引入MD5
const md5 = require('blueimp-md5');
// 引入token生成器
const jwt = require('jsonwebtoken');

// 引入数据库查询函数
const Query = require('./../config/dbHelper');
const KEY = require('./../config/config').KEY;

const {admin_up} = require('../controller/managerApi/uploadFile');

const adminController = require('./../controller/managerApi/adminController');

// 注册主管理员的接口
/*
  admin
  admin
*/
router.post('/reg', (req, res, next)=>{
    adminController.regMainAdmin(req.body, result=>{
        res.send(result);
    });
});

// 管理员登录
router.post('/login', (req, res, next)=>{
   adminController.loginAdmin(req.body, result=>{
      // 往服务器端存储token
       if(result.status === 1){
           req.session.manager_token = result.data.token;
       }
       res.send(result);
   });
});

// 退出登录
router.get('/logout', (req, res, next)=>{
    req.session.manager_token = null;
    res.json({
        status: 1,
        msg: '退出登录成功!',
        data: {}
    });
});



module.exports = router;
