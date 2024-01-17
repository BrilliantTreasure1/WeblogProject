const {Router} = require('express');
const { authenticated } = require('../route/middlewares/auth');

const adminController = require('../controlers/adminControllers');

const router = new Router;

    router.get("/" , authenticated ,adminController.getDashboard );

    router.get("/add-post" , authenticated ,adminController.getAddpost );
   
    router.get("/edit-post/:id", authenticated, adminController.getEditPost);

    router.get("/delete-post/:id", authenticated, adminController.deletePost);

    router.post("/add-post" , authenticated ,adminController.creatpost );

    router.post("/edit-post/:id" , authenticated ,adminController.editPost );

    router.post("/image-upload" , authenticated ,adminController.uploadImage );

    router.post("/search" , authenticated ,adminController.handleDashSearch );

module.exports = router;