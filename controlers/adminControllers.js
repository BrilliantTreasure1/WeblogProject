const multer = require('multer');
const sharp = require("sharp");
const uuid = require('uuid').v4;
const appRoot = require('app-root-path');

const Blog = require('../models/Blog');
const {formatDate} = require('../utils/jalali');
const {storage ,fileFilter } = require("../utils/multer");


exports.getDashboard = async (req ,res) => {
        const page = +req.query.page || 1 ;
        const postPerPage = 2;

    try {
        const numberOfPosts = await Blog.find({user: req.user.id}).countDocuments();
        const blog = await Blog.find({user: req.user.id})
        .skip((page - 1) * postPerPage)
        .limit(postPerPage)
        
         res.render("admin/blog", {
             pageTitle :"بخش مدریت",
             path : "/dashboard",
             layout : "./layout/dashLayout",
             blog,
             formatDate,
             currentPage : page,
             nextPage : page + 1 ,
             previousPage : page - 1,
             hasNextPage : postPerPage * page < numberOfPosts,
             hasPreviousPage : page > 1,
             lastPage :Math.ceil(numberOfPosts / postPerPage) ,
    });
    } catch (error) {
        console.log(error);
        res.render("505",{
            path : "/404",
            pageTitle : "server Error"
        })
    }
   
}

exports.getAddpost = (req ,res) => {
    res.render("admin/addPost", {
        pageTitle :"بخش مدریت",
        path : "/dashboard/add-post",
        layout : "./layout/dashLayout"
    });
}

exports.getEditPost = async (req, res) => {
    const post = await Blog.findOne({
        _id: req.params.id,
    });

    const posst = post.user;

    if (!post) {
        return res.redirect("404");
    }
        res.render("admin/editPost", {
            pageTitle: "بخش مدیریت | ویرایش پست",
            path: "/dashboard/edit-post",
            layout: "./layout/dashLayout",
            fullname: req.user.fullname,
            post,
        });
    
};


exports.editPost = async (req, res) => {
    const errorArr = [];

    const post = await Blog.findById(req.params.id);
    try {
           // await Blog.postValidaion();

           const mongoose = require('mongoose');

           if (!mongoose.isValidObjectId(req.params.id) ) {
                return res.redirect("/dashboard")
           }

           if (!post) {
                return res.redirect("/dashboard")
           }

            const { title, status, body } = req.body;
            post.title = title;
            post.status = status;
            post.body = body;

            await post.save();
            return res.redirect("/dashboard");

    } catch (err) {
        console.log(err);
        res.render("admin/editPost", {
            pageTitle: "بخش مدیریت | ویرایش پست",
            path: "/dashboard/edit-post",
            layout: "./layout/dashLayout",
            fullname: req.user.fullname,
            errors: errorArr,
            post,
        });
    }
};


exports.deletePost = async (req, res) => {

    const post = await Blog.findById(req.params.id);

    try {
        const result = await post.deleteOne();
        console.log(result);
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        res.render("505",{path:"/505"});
    }
};

exports.creatpost = async (req,res) => {
    const errorArr = [];

    const thumbnail = req.files ? req.files.thumbnail : {};
    const fileName = `${thumbnail.name}`;
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

    try {
        req.body = { ...req.body, thumbnail };


        await Blog.postValidaion(req.body);
        
        await sharp(thumbnail.data)
            .jpeg({ quality: 60 })
            .toFile(uploadPath)
            .catch((err) => console.log(err));

            await Blog.create({
                ...req.body,
                user: req.user.id,
                thumbnail: fileName,
            });

        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        err.inner.forEach((e)=> {
            errorArr.push({
              name : e.path,
              message : e.message,
            });
          });
          res.render("admin/addPost", {
            pageTitle :"بخش مدریت",
            path : "/dashboard/add-post",
            layout : "./layout/dashLayout",
            errors : errorArr,
        });
    }
}



exports.uploadImage = (req, res) => {
    const upload = multer({
        limits: { fileSize: 4000000 },
        dest: "uploads/",
        storage: storage,
        fileFilter: fileFilter,
    }).single("image");
    //req.file
    // console.log(req.file)

    upload(req, res, (err) => {
        if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res
                    .status(400)
                    .send("حجم عکس ارسالی نباید بیشتر از 4 مگابایت باشد");
            }
            res.status(400).send(err);
        } else {
            if (req.file) {
                const fileName =  `${uuid()}_${req.file.orginalname}`;

                res.status(200).send(
                    `http://localhost:3000/uploads/${fileName}`
                );
            } else {
                res.send("جهت آپلود باید عکسی انتخاب کنید");
            }
        }
    });
};


exports.handleDashSearch = async (req , res) => {
    const page = +req.query.page || 1 ;
        const postPerPage = 2;

    try {
        const numberOfPosts = await Blog.find({user: req.user.id , $text:{$search : req.body.search}}).countDocuments();
        const blog = await Blog.find({user: req.user.id , $text:{$search: req.body.search}})
        .skip((page - 1) * postPerPage)
        .limit(postPerPage)
        
         res.render("admin/blog", {
             pageTitle :"بخش مدریت",
             path : "/dashboard",
             layout : "./layout/dashLayout",
             blog,
             formatDate,
             currentPage : page,
             nextPage : page + 1 ,
             previousPage : page - 1,
             hasNextPage : postPerPage * page < numberOfPosts,
             hasPreviousPage : page > 1,
             lastPage :Math.ceil(numberOfPosts / postPerPage) ,
    });
    } catch (error) {
        console.log(error);
        res.render("505",{
            path : "/404",
            pageTitle : "server Error"
        })
    }
}
