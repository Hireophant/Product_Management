const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

//[Get] /admin/products
module.exports.index = async (req, res) => {
   
    const filterStatus = filterStatusHelper(req.query);
    
    let find = {
        deleted: false,
    };

    if(req.query.status){
        find.status = req.query.status;
    }

    //search
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }


    //pagination
    const countProduct = await Product.countDocuments(find);
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4,
    }, req.query, countProduct);



    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
    console.log(products);
    res.render("admin/pages/products/index", {
        pageTitle: "Trang Sản Phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
    });
}