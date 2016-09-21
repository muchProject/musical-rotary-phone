var express = require('express');
var router = express.Router();

router.get('/', function(req,res,next)  {
	res.render('aa',{title: 'AA'});
});


module.exports = router;

