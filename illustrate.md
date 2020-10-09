# 网站说明

## 1. 工程说明

### 1.1 本网站技术只用到JavaScript和jQuery，新手可以大胆入坑

- 不需要安装模块，也不需要框架知识；
- 适合学习了半年内的前端学习者练手；

 

### 1.2 本网站使用了jQuery的ajax，本地直接双击（不搭建本地服务器时）打开网站会报两个错：
```javascript
	Access to XMLHttpRequest at 'file:///XXXXX/data/sentence.txt' from origin 'null' has been blocked by CORS policy: 
	Cross origin requests are only supported for protocol schemes: http, data, chrome-extension, edge, https.（ajax跨域只支持这些协议框架：http,https,data,chrome（Chrome浏览器）,chrome-extension（Chrome扩展插件），chrome-extension-resource（Chrome扩展资源），就是没有file协议!）
	data/sentence.txt:1 Failed to load resource: net::ERR_FAILED
```

​	

- 报错分析：

>1.判断为ajax的跨域访问问题
>
>2.本地jsp没有通过服务器直接ajax中用jsonp访问本地js，使用file协议！---此处为这个。
[解决办法](https://blog.csdn.net/superit401/article/details/72772658)



- 解决过程：【之前可以，现在这方法又不可以了】
	* 在Chrome浏览器快捷方式上右键—属性—快捷方式标签页—目标（就是Chrome浏览器的安装路径）中路径后面添加" --allow-file-access-from-files",(注意前面有空格)
		* Safari没测试，除了Firfox，IE Edge Chrome Opera用上面方法都可以访问本地数据了。
	* 如果上述步骤不行，找到谷歌浏览器chrome.exe安装路径复制下来，若路径为E:\Google\Application\chrome.exe，再打开cmd，直接输入命令: ```"E:\Google\Application\chrome.exe" --allow-file-access-from-files```

- 更好的解决办法是搭建本地服务器：
	* 可使用自带本地服务器的编辑器，用运行来打开，例如 HBuilder X直接点击运行到浏览器就可以了；VS code需要安装一个“live server”插件，其他编辑器的可以去搜索一下。
	* 本项目提供了nodejs搭建的本地服务器，若电脑已经安装了node，那么在本项目的根目录下的命令行里输入命令 `node server.js`就可以启动本地服务器。




## 2.更新说明

### 2.1 重要更新历史（Release Notes）

- **version 0.1.0**--  2020-05-21   
	* 基本页面的构建完整 
	* 基本功能的实现
- **version 1.0.0**--  2020-07-10  
	* 思维导图的添加
	* 项目卡片页面的搭建及功能的实现(部分)
	* node.js搭建一个本地服务器
- **version 1.1.0**-- 2020-07-17  
	* 项目卡片页面的完全实现
	* 部分样式和逻辑修改
- **version 1.1.1**-- 2020-10-10 
	* 改改改

### 2.2 下次更新方向

- 改版式，现在的布局有点不合理
- 按需求看需不需要增添功能
