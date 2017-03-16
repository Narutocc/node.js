// 引入http模块
var http = require('http');
// 引入mysql第三方模块
var mysql = require('mysql');
// 处理路由的原生模块
var url = require('url');
// 处理路由参数的原生模块
var querystring = require('querystring');

// 进行数据库连接
var connection = mysql.createConnection({
	host: 'localhost',
	user : 'yy',
	password : '111',
	database : 'info'
});
// 执行连接
connection.connect();
// 使用http.createServer()方法创建服务器
http.createServer(function(request,response){
	// 解决跨域
	response.setHeader('Access-Control-Allow-Origin','*');

	// 路由
	console.log('router:' + request.url)//  /index.html?name=naruto&hello=world
	console.log('router.path:' + url.parse(request.url).pathname);// /index.html
	var pathname = url.parse(request.url).pathname;
	console.log('router.params:' + url.parse(request.url).query);// name=naruto&hello=world
	var paramsStr = url.parse(request.url).query;
	// 注意：正确语句：querystring.parse(paramsStr)，菜鸟教程语法有错误
	console.log('router.params.value:' + querystring.parse(paramsStr))//{ name: 'naruto', hello: 'world' }
	var params = querystring.parse(paramsStr);

	var obj = {};

	// 插入命令
	function insert(){
		console.log('INSERT INTO `infoes`(`skill`, `name`) VALUES ("' + params.skill + '","' + params.name + '")');
		// 插入
		connection.query('INSERT INTO `infoes`(`skill`, `name`) VALUES ("' + params.skill + '","' + params.name + '")', function (error, results, fields) {
			if (error) throw error;
			console.log('The solution is: ', results);

			// 查询
			connection.query('SELECT * FROM infoes', function (error, results, fields) {
				if (error) throw error;
				console.log('The solution is: ', results);
				// 处理数据
				obj.lists = results;
				// 发送响应数据:数据必须是字符串格式的才可以输出
				response.end(JSON.stringify(obj))
			});
		});
	}
	// 查询
	function select() {
		connection.query('SELECT * FROM infoes', function(error, results, fields) {
			if(error) throw error;
			console.log('结果集: ', results);
			obj.lists = results
				//connection.end();
			response.end(JSON.stringify(obj))
		});
	}
	// 删除
	function del(){
		connection.query('DELETE FROM `infoes` WHERE id = ' + params.id, function (error, results, fields) {
			if (error) throw error;
			console.log('The solution is: ', results);

			// 查询
			connection.query('SELECT * FROM infoes', function (error, results, fields) {
				if (error) throw error;
				console.log('The solution is: ', results);
				// 处理数据
				obj.lists = results;
				// 发送响应数据:数据必须是字符串格式的才可以输出
				response.end(JSON.stringify(obj))
			});
		});
	}

	function selectDetail(){
		connection.query('SELECT * FROM infoes where id='+params.id, function (error, results, fields) {
				if (error) throw error;
				console.log('The solution is: ', results);
				// 处理数据
				obj.lists = results;
				// 发送响应数据:数据必须是字符串格式的才可以输出
				response.end(JSON.stringify(obj))
			});
	}

	function edit(){
		connection.query('UPDATE `infoes` SET `skill`="' + params.skill + '",`name`= "' + params.name + '" WHERE id = ' + params.id, function(error, results, fields) {
			if(error) throw error;
			console.log('结果集: ', results);
			//obj.lists = results
			//connection.end();
			response.end("你已经成功修改")
		});
	}

	// 根据不同url参数执行不同函数
	switch(pathname){
		// 插入的路由
		case '/insert':
			insert();
			break;
		// 查询的路由
		case '/select':
			select();
			break;
		// 删除的路由
		case '/delete':
			del();
			break;
		case '/selectdetail':
			selectDetail();
			break;
		case '/edit':
			edit();
			break;
	}
}).listen(12345);

// 终端打印如下信息
console.log('success open')


// http://localhost:12345/index.html?name=naruto&hello=world