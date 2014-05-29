var edge = require('edge');

var getUsers = edge.func('./sql-demo.csx');

var page = { currentPage: 1, pageSize: 3 };

getUsers(page, function (err, result) {
  if (err) throw err;
  console.log(result);
});