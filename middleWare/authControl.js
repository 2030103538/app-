module.exports = (req, res, next)=>{
    // console.log(req.headers);
    // console.log(req.session);
    // console.log(req.path);
    // 1. 所有非后端相关的接口
    if(req.path && req.path.indexOf('/api/auth/') === -1){
        return next();
    }
    // 不是用户接口
    if(req.path && req.path.indexOf('/api/user/') === -1){
        return next();
    }
    // 用户接口
    if(req.path && req.path.indexOf('/api/user/') !== -1){
        if(req.headers.usertoken){
            return next();
        }
        return res.json({
            status: 2,
            msg: '非法访问, 没有权限!'
        })
    }

    // 2. 所有后端接口 (登录/注册接口放行)
    if(
        req.path.indexOf('/api/auth/admin/login') !== -1 ||
        req.path.indexOf('/api/auth/admin/reg') !== -1 ||
        req.path.indexOf('/api/user/user_reg') !== -1 ||
        req.path.indexOf('/api/user/user_login') !== -1 ||
        req.path.indexOf('/api/user/phone') !== -1 ||
        req.path.indexOf('/api/user/user_getbrand') !== -1 ||
        req.path.indexOf('/api/goods/') !== -1
    ){
        return next();
    }

    // 3. 判断是否处于登录状态
    if(req.session.manager_token){
        return  next();
    }

    // 4. 没有登录 (服务端session中的token失效)
    // 4.1 如果是后端接口相关
    if(req.path.indexOf('/api/auth/') !== -1){
        return res.json({
            status: 2,
            msg: '非法访问, 没有权限!'
        })
    }

    // 4.2 其它情况
    console.log('other------');
};