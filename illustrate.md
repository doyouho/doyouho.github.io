# 网站说明

## 1. 工程说明

### 1.1 使用说明
- 名称：意休
- 网址：[国内推荐地址](https://kathy_candy.gitee.io/doyouho.io/) [国外地址](https://doyouho.github.io/)
- 主旨：让生活更简单一点，更高效一点
- 外观：简约、方便行事
- 内容：让使用者逐渐成为一个会搜索，会学习的人。（学习内容主要是前端学习）
- 技术栈：JavaScript+jQuery+jsMind
- 高效处：
	* 多项事件处理 - 理清头绪，专注
	* 学习记录（包括打卡，事件完成进程和总结）- 了解自己，更好地学习
		+ 事件完成进程，包括用时，对知识的分类和方法等 （分析卡片）
		+ 哪一天，学了哪些项，学习天数 （打卡）
	* 更丰富的资源收集（前端为主）- 减少查找路径，省时
	* 精神层面的修身养性以及问题解决 - 除杂，整理包袱，减负和导向
	* 丰富的玩耍姿势，花样选择，主动出击 - 不知道干什么？不存在滴
- 笔记的种类==导出功能
	* 打卡 （towork页面-打卡）
	* 事件完成进程 （towork页面-写入 ==> 分析卡片）
	* 过程总结-随意想法（towork页面-本子）
	* 众事件处理（toreview页面） ①备份数据(各清单&检查卡)+②处理数据(参考&完成&分析)
	* 思维导图（mind页面）下载格式支持.png .jm .html .md .txt  (jm==换成市面上的？)
- 布局：尚可
- 性能：尚可
- 前端学习交流Q群：417911729



### 1.2 数据不显示说明
> 本网站使用了jQuery的ajax，本地直接双击（不搭建本地服务器时）打开网站会报两个错：
```javascript
	Access to XMLHttpRequest at 'file:///XXXXX/data/sentence.txt' from origin 'null' has been blocked by CORS policy: 
	Cross origin requests are only supported for protocol schemes: http, data, chrome-extension, edge, https.（ajax跨域只支持这些协议框架：http,https,data,chrome（Chrome浏览器）,chrome-extension（Chrome扩展插件），chrome-extension-resource（Chrome扩展资源），就是没有file协议!）
	data/sentence.txt:1 Failed to load resource: net::ERR_FAILED
```

- ① 报错分析：

>1.判断为ajax的跨域访问问题
>
>2.本地jsp没有通过服务器直接ajax中用jsonp访问本地js，使用file协议！---此处为这个。
[解决办法](https://blog.csdn.net/superit401/article/details/72772658)


- ② 解决方法一：【之前可以，现在这方法又不可以了】
	* 在Chrome浏览器快捷方式上右键—属性—快捷方式标签页—目标（就是Chrome浏览器的安装路径）中路径后面添加" --allow-file-access-from-files",(注意前面有空格)
		* Safari没测试，除了Firfox，IE Edge Chrome Opera用上面方法都可以访问本地数据了。
	* 如果上述步骤不行，找到谷歌浏览器chrome.exe安装路径复制下来，若路径为E:\Google\Application\chrome.exe，再打开cmd，直接输入命令: ```"E:\Google\Application\chrome.exe" --allow-file-access-from-files```

- ③ 解决办法二：可利用插件搭建本地服务器：
	* 可使用自带本地服务器的编辑器，用运行来打开，例如 HBuilder X直接点击运行到浏览器就可以了；VS code需要安装一个“live server”插件，其他编辑器的可以去搜索一下。
	* 另外，本项目提供了nodejs搭建的本地服务器，若电脑已经安装了node，那么在本项目的根目录下的命令行里输入命令 `node server.js`就可以启动本地服务器。

### 1.3 localstorage数据说明
- localstorage变量   存储的数据        数据类型          使用位置                  相关说明
  * lastDaka       最新的打卡日期      字符串            towork.html      用来核查今天是不是第一次打卡，如2021/2/22
	* praiseData     点赞的评论id号      字符串（,）       towork.html      逗号拼接的多个评论id号
	* discussData    关注的评论id号      字符串（,）       towork.html      逗号拼接的多个评论id号
	* commentNum     总评论的条数       数值的字符串       towork.html      
	* commentsData   评论内容            字符串（,）       towork.html      评论id号，名称，内容，点赞数
  * note           笔记区域内容        字符串（^）       towork.html      本子里添加的笔记
  * collectBoxNew  记载最新的写入      字符串（$）       towork.html      为了保障新事项添加后，动态提醒需要处理
  * collectIndex   最新处理事项的索引 数值的字符串       towork.html      
  * collectBox     收集的所有数据      字符串（$）       towork.html      
  * saveData       打卡项与天数       对象的字符串       towork.html      打开的天数是按照此数据计算出来的
  * solvedAll      判断是否保存所有    字符串 0/1        towork.html      
  * noFirstSave    不是第一次保存？      yes             towork.html      数据若存在则说明不是第一次保存
	* analyseData    事件实践的整合内容   字符串（^）      towork.html      
	* defaultTask    自定义的默认总任务   字符串           towork.html    
	* hotlink        自定义的热链接      字符串（^）       share.html/towork.html    
	
  * checklist      检查卡的事项       数组的字符串       toreview.html    总结面板的检查卡，一般是自定义的周任务等清单内容
  * finishlist     完成卡的事项       数组的字符串       toreview.html    总结面板的完成卡，是已经处理过的全部事项，方便观察自己的执行能力
  * summarylist    分析卡的事项       数组的字符串       toreview.html    总结面板的分析卡，进行事件处理时有什么感悟或想法总结的地方
  * dolist         执行清单事项        字符串（*）       toreview.html    执行清单数据，这个记载方便在work页面快速写入“优先解决”事项
  * collectSortBox  all事项数据        字符串（~ $）     toreview.html   
	* allDayNum      每日完成度收集     对象的字符串       toreview.html    日期:完成事项数
	* userJSMindData 思维导图样式       对象的字符串       mind.html
	* userJSMindDataTemp 模板数据       对象的字符串       mind.html


## 2. 更新说明

### 2.1 重要更新历史（Release Notes）

- **version 0.2.0**--  2021-03-05   
	* 具体内容的多方面增添和修改 
	* 功能的完善
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

## 3. 想改的地方

### 3.1 功能完善
- index页面 -- 介绍内容，突出重点，过去总结=时间轴  （轮播图的选择）
- mind页面 -- ①更通用的格式 ②更多实用常用的模板 


### 3.2 探索功能
 
- 图表制作--时间图分析下载（用echarts）
- problem 与 reading 页面
- 在实现的基础上再加动效那些  首页按照上一次学习内容踩脚印
- 遗忘曲线下的学习推荐
- 事件处理+思维导图  批量导入
- 学习扩展的实现 -- 新事物 接触不同的概念->认识图谱/时间轴 游戏 桌面软件等等
- 音乐歌词实现
- 视频的变速和界面处理
- 理财 运动 学习（读书 实践 专业学习 思维锻炼）娱乐社交  工作 


### 3.3 体验提升
- 整篇的统一风格 色调 布局 颜色搭配 
- 动画的速度运动和用意 
- 下载等的进度条
- 加载图案

### 3.4 内容补充
> 这是个长期任务，现在就还有 heal里面的文章修改以及小说更新。
