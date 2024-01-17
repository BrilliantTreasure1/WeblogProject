const Blog = require('../models/Blog');
const {formatDate} = require('../utils/jalali');
const {truncate} = require('../utils/helper');


exports.getIndex = async (req,res) => {
    const page = +req.query.page || 1 ;
    const postPerPage = 2;

    try {
        const numberOfPosts = await Blog.find({status: "public"}).countDocuments();
        const posts = await Blog.find({status: "public"}).sort({
            createdAt : "desc",
        }).skip((page - 1) * postPerPage)
          .limit(postPerPage)

        res.render("index" , {
            pageTitle :"وبلاگ",
            path: " / ",
            posts,
            fullname : req.user.fullname,
            formatDate,
            truncate,
            currentPage : page,
            nextPage : page + 1 ,
            previousPage : page - 1,
            hasNextPage : postPerPage * page < numberOfPosts,
            hasPreviousPage : page > 1,
            lastPage :Math.ceil(numberOfPosts / postPerPage) ,
        })
    } catch (error) {
        console.log(error);
        res.render("505")
    }
}


exports.getSinglePost = async (req, res) => {
    try {
        const post = await Blog.findOne({ _id: req.params.id }).populate(
            "user"
        );

        if (!post) return res.redirect("404");

        res.render("post", {
            pageTitle: post.title,
            path: "/post",
            post,
            fullname : req.user.fullname,
            formatDate,
            truncate
        });
    } catch (err) {
        console.log(err);
        res.render("505");
    }
};

exports.handleSearch = async (req , res) => {
    const page = +req.query.page || 1 ;
    const postPerPage = 2;

    try {
        const numberOfPosts = await Blog.find({
            status: "public",
            $text : {$search : req.body.search}
        }).countDocuments();

        const posts = await Blog.find({status: "public", $text : {$search : req.body.search}}).sort({
            createdAt : "desc",
        }).skip((page - 1) * postPerPage)
          .limit(postPerPage)

        res.render("index" , {
            pageTitle :"نتایج جستجو",
            path: " / ",
            posts,
            fullname : req.user.fullname,
            formatDate,
            truncate,
            currentPage : page,
            nextPage : page + 1 ,
            previousPage : page - 1,
            hasNextPage : postPerPage * page < numberOfPosts,
            hasPreviousPage : page > 1,
            lastPage :Math.ceil(numberOfPosts / postPerPage) ,
        })
    } catch (error) {
        console.log(error);
        res.render("505")
    }
}
