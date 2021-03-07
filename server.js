var http = require('http');
var fs = require('fs');  // 访问文件
var url = require('url'); // url的局部获取

http.createServer(onRequest).listen(3060);  // 创建服务器 --记得输出数据之后，需要添加response.end();

function onRequest (request, response) {  

	var pathname = url.parse(request.url,true).pathname; // 解析请求，包括文件名（搞定访问网页）
	// 对于获取到的这个文件名，为空的时候设置为index.html; 没有后缀时加后缀（这个可以我自己控制，有我方提供的网址嘛。）；
	var filename = "";
	if(pathname==="/"){
		filename = "index.html";
	}else if(/\./.test(pathname)){
		filename = pathname.substr(1);
	}else{
		filename = pathname.substr(1)+".html"; //这里是默认加后缀名.html
	}
	console.log("Request for " + filename + " received."); // 输出请求的文件名
	 
	 
	// 从文件系统中读取请求的文件内容
	fs.readFile(filename, function (err, data) {
			if (err) {  // HTTP 状态码: 404 : NOT FOUND
				 response.writeHead(404, {'Content-Type': 'text/html'});
			}else{ // HTTP 状态码: 200 : OK
        if(/\.css/.test(pathname)){
          response.writeHead(200, {'Content-Type': 'text/css'}); 
        }else{
				 response.writeHead(200, {'Content-Type': 'text/html'});    
        }
				 response.write(data);    // 响应文件内容  
			}
			response.end();//  发送响应数据
	 });   
	 
	 
} 
// 实际上访问的网站：http://127.0.0.1:3060/ 或 localhost:3060
console.log('Server running at http://127.0.0.1:3060/');