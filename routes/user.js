
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.render('index',{
    title : 'test',
    items : [1,2,3],
  });
};