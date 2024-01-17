const { Router } = require('express');

const BlogController = require('../controlers/blogController');

const router = new Router;

router.get("/" ,BlogController.getIndex);

router.get("/post/:id" ,BlogController.getSinglePost);

router.post("/search" ,BlogController.handleSearch);

module.exports = router;