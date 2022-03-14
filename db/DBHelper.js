var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

var pageQuery = function (page, pageSize, Model, populate, queryParams, sortParams, callback) {
    var start = (page - 1) * pageSize;
    var $page = {
        pageNumber: page
    };
    return async.parallel({
        count: function (done) {  // 查询数量
            Model.count(queryParams).exec(function (err, count) {
                // console.log("数据总数:" + count);
                done(err, count);
            });
        },
        records: function (done) {   // 查询一页的记录
            Model.find(queryParams).skip(start).limit(pageSize).populate(populate).sort(sortParams).exec(function (err, doc) {
                done(err, doc);
            });
        }
    })
    .then(results => {
        var count = results.count;
        // console.log("Count:" + count + ", pageSize:" + pageSize);
        $page.pageCount = parseInt((count - 1) / pageSize) + 1;
        // console.log("$page.pageCount:" + $page.pageCount);
        $page.results = pageDataFormat(page, $page.pageCount, pageSize, count, results.records);
        callback( $page);
    }).catch(err => {
        console.log(err);
    });
};

function pageDataFormat(currentPage, totalPage, pageSize, totalCount, data){
    return {"currentPage" : currentPage, "totalPage" : totalPage, "totalCount": totalCount, "pageSize" : pageSize, "data" : data};
}

module.exports = {
    pageQuery: pageQuery,
    pageDataFormat: pageDataFormat
};