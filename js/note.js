var forNote = {
	id: "88888888",
	username: "女王大人",
	seltxt: "",
	praiseList: [],
	discussList: [],
	commentNum: 0,
	commentId: "",
	comment: [],
	commentsList: [],
	limitWords: 200,
	canpublish: false,
	tempTask: ''
};
var defaultAnalyseStr = "2021/02/28 内容关于：“合格版”（方式）<br />总任务是：天天开心，身体健康<br />优先解决：……，[计划26分钟] [难度……颗星] <br />实际用时：37分钟，完成度：70%<br />困难或障碍出自：…… <br />打算：……。^2021/02/28 内容关于：“优等版”（方式）<br />总任务是：天天开心，身体健康<br />优先解决：……，[计划26分钟] [难度……颗星] <br />实际用时：30分钟，完成度：87%<br />困难或障碍出自：…… <br />打算：……。^2021/02/27 内容关于：“默认空版”（方式）<br />总任务是：天天开心，身体健康(可自定义默认的)<br />优先解决：……，[计划……分钟] [难度……颗星] <br />实际用时：……分钟，完成度：……<br />困难或障碍出自：…… <br />打算：……。";
// commentId 来存放临时评论id的，当发表之后再次设置回空字符串。

// 函数1. noteOn()  总体的事件调用
var odate = new Date(); //这时间获取的是本地的？
var month = "";

function formarDate(data) {
	if (data < 9) {
		return "0" + (data + 1);
	} else {
		return data + 1 + "";
	}
}
var nowDate = odate.getFullYear() + "/" + formarDate(odate.getMonth()) + "/" + formarDate(odate.getDate());

function toGet(name, type, plural = false) {
	if (type === 'id') {
		return document.getElementById(name);
	} else if (type === 'name') {
		return document.getElementsByName(name);
	} else if (type === 'classname') {
		return plural ? document.getElementsByClassName(name) : document.getElementsByClassName(name)[0];
	}
}


function noteOn() {
	var spanOrigin = document.getElementsByClassName("attentionBtn"); // 关注与点赞 初始值赋值
	for (let i = 0; i < spanOrigin.length; i++) {
		spanInitial(spanOrigin[i]);
	}

	document.getElementById("existList").onclick = staChangeBtn; // 关注与点赞 点击样式改变

	var oComments = document.getElementsByClassName("commentBtn"); // 评论时
	for (let i = 0; i < oComments.length; i++) {
		oComments[i].onclick = writeSomething;
	}

	//  实现侦听输入的字数，进行计算剩下字数。
	document.getElementById("disWords").addEventListener("keyup", function() {
		forNote.seltxt = document.getElementById("disWords").value;
		forNote.limitWords = 200 - forNote.seltxt.length;
		let oLeftWords = document.getElementsByClassName("wordsCanIn")[0];
		oLeftWords.innerText = '还可以输入' + forNote.limitWords + '字';
		if (forNote.limitWords < 0) {
			oLeftWords.style.color = "red";
			document.getElementById("disSubmitBtn").setAttribute("disabled", true);
		} else if (forNote.limitWords == 0) {
			oLeftWords.style.color = "#aaa";
			document.getElementById("disSubmitBtn").removeAttribute("disabled");
		}
	});

	document.getElementById("nBtnSetThings").onclick = function() {
		openSliceBox("setThings");
	};

	document.getElementById("disSubmitBtn").onclick = publishWords; // 发表评论

	document.getElementById("reSetBtn").onclick = reSetBtndo;

	document.getElementById("disNoteBtn").onclick = function() { // 讨论区保存笔记
		var discussWords = document.getElementById("disWords");
		btnAddNote(discussWords);
	}
	document.getElementById("addNoteBtn").onclick = function() { // 笔记区保存笔记
		var notesInput = document.getElementById("noteWords");
		btnAddNote(notesInput);
	}

	
	document.getElementsByClassName("dataSTNoteBtn")[0].onclick = generateFormData; //生成表单信息

	document.getElementsByClassName("dataSTNoteBtn")[1].onclick = function() {
		var oTextAreaS = document.getElementById("allTaskData");
		btnAddNote(oTextAreaS, "analyseData");
	};

	document.getElementById("outputNotes").onclick = function() {
		window.location.href = "./download.html";
	}

	// 笔记区转到讨论区--为什么会多个搜索？
	document.getElementById("turnDisBtn").onclick = function() {
		document.getElementsByClassName("noteArea")[0].style.display = "none";
		document.getElementsByClassName("winBack")[0].style.display = "block";
		document.getElementsByClassName("newWin")[0].style.display = "block";
		document.getElementsByClassName("discussArea")[0].style.display = "block";
	};
	// 界面打开和关闭
	document.getElementById("turnNoteBtn").onclick = function() { // 讨论区显示笔记区
		openSliceBox("noteArea","writebox");
		showNote();
	}

	document.getElementById("nBtnNote").onclick = function() { // 事件 ---打开笔记区
		openSliceBox("noteArea","writebox");
		showNote();
	}
	document.getElementById("nBtnDiscuss").onclick = function() { // 事件 ---回到讨论区
		openSliceBox("discussArea","writebox");
	};
	document.getElementsByClassName("analyseBtn")[0].onclick = function() {
		openSliceBox("analyseArea");
		showNote("analyseData");
	}
	document.getElementsByClassName("winBack")[0].onclick = closeTc; // 事件 ---【界面】关闭弹出的界面【看需求用吧】

	document.getElementById("clearNoteBtn").onclick = function() { // 事件 ---【笔记区】清空所有笔记
		var newlist = [];
		localStorage.setItem("note", newlist); // 保存note
		showNote();
		document.getElementById("tipsOfChange").innerHTML = "清空完成。";
	}


	document.getElementById("saveNoteBtn").onclick = saveChange; // 事件 ---【笔记区】保存当前修改 


	// 事件 ---提问（实现：获取选区的文本，并显示在提问框中。特别：需要对提问的文本内容进行整合？）
	// document.getElementById("nBtnAsk").onclick = function() { // 之前是提问
	// 	// getSelectionText();
	// 	// openSliceBox("discussArea");
	// 	// document.getElementById("disWords").value = forNote.seltxt;
	// }



}


// 表单生成数据
function generateFormData() {
	var frontTask = '';
	let oTextArea = toGet("allTaskData", 'id');
	let othingsType = toGet("thingsType", 'name');
	let ovaSkills = toGet("vaSkills", 'name');
	let oInputData = toGet("oData", 'classname', true);

	for (let i = 0; i < othingsType.length; i++) {
		if (othingsType[i].checked) {
			frontTask = frontTask + othingsType[i].value + '\+';
		}
	}
	var length = frontTask.length - 1;
	frontTask = nowDate + ' 内容关于：' + frontTask.substring(0, length) + '（方式是';
	for (let i = 0; i < ovaSkills.length; i++) {
		if (ovaSkills[i].checked) {
			frontTask = frontTask + ovaSkills[i].value + '\+';
		}
	}

	let inputDataArr = [];
	for (let i = 0; i < oInputData.length; i++) {
		if (oInputData[i].value) {
			inputDataArr[i] = oInputData[i].value;
		} else {
			inputDataArr[i] = '……';
			if (i === 0) {
				if(localStorage && localStorage.getItem("defaultTask")){
					inputDataArr[i] = localStorage.getItem("defaultTask");
				}else{
					inputDataArr[i] = '今日事今日毕，每天进步一点点';
				}
			}
		}
	}
	length = frontTask.length - 1;
	frontTask = frontTask.substring(0, length) + '）<br />\n总任务是：' + inputDataArr[0] + '<br />\n优先解决：' + inputDataArr[1] +
		'，[计划' + inputDataArr[2] +
		'分钟] [难度' + inputDataArr[3] + '颗星] <br />\n实际用时：' + inputDataArr[5] + '分钟，完成度：' + inputDataArr[6] +
		'<br />\n困难或障碍出自：' + inputDataArr[7] + ' <br />\n打算：' + inputDataArr[8] + '。';
	oTextArea.value = frontTask;
	forNote.tempTask = frontTask;
};

// 函数2. getSelectionText() ---获取选中文本的操作  用 forNote.seltxt 存选中的文字
// function getSelectionText() {
// 	if (window.getSelection) {
// 		forNote.seltxt = window.getSelection().toString();
// 	} else if (document.getSelection) {
// 		forNote.seltxt = document.getSelection().toString();
// 	} else if (document.selection) {
// 		forNote.seltxt = document.selection.createRange().text;
// 	}
// }

function openSliceBox(name, type) {
	document.getElementsByClassName("winBack")[0].style.display = "block";
	document.getElementsByClassName("newWin")[0].style.display = "block";
  let owrap = document.getElementsByClassName(name)[0];
	owrap.style.display = "block";
  if(type==="writebox"){
    owrap.getElementsByTagName("textarea")[0].focus();
  }
	var list = ["setThings", "discussArea", "noteArea", "analyseArea"];
	for (let i = 0; i < 4; i++) {
		if (name !== list[i]) {
			document.getElementsByClassName(list[i])[0].style.display = "none";
		}
	}
	document.getElementsByTagName("body")[0].style.overflowY = "hidden";
}

// 函数5. closeTc()  ---关闭弹出区
function closeTc() {
	document.getElementsByClassName("newWin")[0].style.display = "none";
	document.getElementsByClassName("winBack")[0].style.display = "none";
	document.getElementsByClassName("discussArea")[0].style.display = "none";
	document.getElementsByClassName("noteArea")[0].style.display = "none";
	document.getElementsByClassName("setThings")[0].style.display = "none";
	document.getElementsByTagName("body")[0].style.overflowY = "scroll";
}

// 函数6. saveChange()  ---把笔记修改存库
function saveChange() {
	var newlist = [];
	let biji = document.getElementById("existNoteList");
	var newlist_p = biji.querySelectorAll("p"); //nodelist
	// 问题：关于用querySelectorAll()获取到nodelist，其内容用nodelist[i].innerText访问。
	for (let i = 0; i < newlist_p.length; i++) {
		newlist[i] = newlist_p[i].innerText;
	}
	var listStr = newlist.join("^");
	localStorage.setItem("note", listStr); // 保存note
	document.getElementById("tipsOfChange").innerHTML = "当前页面笔记已成功存库。";

}

// 函数8. showNote()  ---已有笔记的显示 
// 曾出现的--问题1没有笔记的时候添加不上  问题2有笔记时候，只添加一次，后续都是修改第一项【笔记显示和笔记添加应该分开写】
function showNote(dataname = "note") {
	var outputList_s = ''; // 把添加好html标签的数组元素结合成字符串
	var outputList = []; // 中间值
	var outputListStr = '';
	var day = [];
	var name = dataname;
	if (!localStorage.getItem(name)) {
		if (name === "note") {
			outputList_s = '<li>暂无笔记，赶快留下你感兴趣的内容或感悟和想法吧~</li>';
		}else{
			outputListStr = defaultAnalyseStr;
			specifyDo(name);
		}
	} else {
		var totaltime = 0;
		outputListStr = localStorage.getItem(name);
		specifyDo(name);
	}
	function specifyDo(dataname){
		if (/\^+/.test(outputListStr)) { // 数据多项
			outputList = outputListStr.split('^'); // 若内存有值，则取出转成数组赋值。
			for (let i = 0; i < outputList.length; i++) {
				if (dataname === "note") {
					outputList[i] = "<li><p>" + outputList[i] +
						"</p><button onclick='btnModNote(this)'>改</button><button onclick='btnDelNote(this)'>删</button></li>";
				} else { // 内容显示
					let num = outputList[i].substring(0, 10);
					// console.log(num);
					let otime = /用时：[0-9]+/g.exec(outputList[i]); // 得到的是一个数组对象 
					let oprogress = /完成度：[0-9]+/.exec(outputList[i]);
					let tempdiv = '';
					if (otime && oprogress) {
						let time = otime[0].substring(3) * 1;
						totaltime += time;
						let progress = oprogress[0].substring(4) * 1;
						if (progress >= 80 ) {
							tempdiv = "<div class='levela'><span class='timer'>" + time + "</span>" + outputList[i].substring(10) + "</div>";
						} else if (progress >= 65 ) {
							tempdiv = "<div class='levelb'><span class='timer'>" + time + "</span>" + outputList[i].substring(10) + "</div>";
						} else {
							tempdiv = "<div><span class='timer'>" + time + "</span>" + outputList[i].substring(10) + "</div>";
						}
						// console.log(time,progress); levela
						if (num === day[day.length - 1]) {
							outputList[i] = "<li>" + tempdiv + "</li>";
						} else {
							day.push(num);
							outputList[i] = "<li><b>" + num + "</b>" + tempdiv + "</li>";
						}
					} else {
						if (num === day[day.length - 1]) {
							outputList[i] = "<li><div>" + outputList[i].substring(10) + "</div></li>";
						} else {
							day.push(num);
							outputList[i] = "<li><b>" + num + "</b><div>" + outputList[i].substring(10) + "</div></li>";
						}
					}
		
				}
			}
			outputList_s = outputList.join('');
		} else { // 数据只有一项的时候 
			if (dataname === "note") {
				outputList_s = "<li><p>" + outputListStr +
					"</p><button onclick='btnModNote(this)'>改</button><button onclick='btnDelNote(this)'>删</button></li>";
			} else {
				let tempdiv2 = '';
				let num = outputListStr.substring(0, 10);
				let otime = /用时：[0-9]+/g.exec(outputListStr); // 得到的是一个数组对象
				let oprogress = /完成度：[0-9]+/.exec(outputListStr);
				if (otime && oprogress) {
					let time = otime[0].substring(3) * 1;
					totaltime = time;
					let progress = oprogress[0].substring(4) * 1;
					// console.log(progress);
					if (progress >= 80 ) {
						tempdiv2 = "<div class='levela'><span class='timer'>" + time + "</span>" + outputListStr.substring(10) + "</div>";
					} else if (progress >= 65 ) {
						tempdiv2 = "<div class='levelb'><span class='timer'>" + time + "</span>" + outputListStr.substring(10) + "</div>";
					} else {
						tempdiv2 = "<div><span class='timer'>" + time + "</span>" + outputListStr.substring(10) + "</div>";
					}
					outputList_s = "<li><b>" + num + "</b>" + tempdiv2 + "</li>";
				} else {
					outputList_s = "<li><b>" + num + "</b><div>" + outputListStr.substring(10) + "</div></li>";
				}
		
			}
		}
		// console.log(dataname,outputList_s);
		// return outputList_s;
	}
	
	if (dataname === "note") {
		document.getElementById("existNoteList").innerHTML = outputList_s;
	} else {
		document.getElementsByClassName("analyseContent")[0].innerHTML = outputList_s;
	}

}

// 函数9. spanInitial(node)  ---关注/点赞本机数据原始加载
function spanInitial(node) {
	let dataId = node.getAttribute("data-id");
	if (!window.localStorage) {
		alert("抱歉！您的浏览器不支持localStorage.");
	} else {
		if (localStorage.getItem("praiseData") && (localStorage.getItem("praiseData") !== "")) {
			let praiseL = localStorage.getItem("praiseData");
			if (/\^+/.test(praiseL)) {
				forNote.praiseList = praiseL.split("^");
			} else {
				forNote.praiseList[0] = praiseL;
			}
		}
		if (localStorage.getItem("discussData") && (localStorage.getItem("discussData") !== "")) {
			let discussL = localStorage.getItem("discussData");
			if (/\^+/.test(discussL)) {
				forNote.discussList = discussL.split("^");
			} else {
				forNote.discussList[0] = discussL;
			}
		}
		if (localStorage.getItem("commentNum")) {
			let commentNum = localStorage.getItem("commentNum");
			forNote.commentNum = commentNum;
		}

		let fullArr = forNote.praiseList.concat(forNote.discussList);

		function showInitial(arr) {
			if (arr.length > 0) {
				if (arr.includes(dataId)) {
					node.classList.add("active");
					node.setAttribute("data-click", -1);
				} else {
					node.classList.remove("active");
					node.setAttribute("data-click", 0);
				}
			}
		}
		showInitial(fullArr);
	}
}


// 函数10. staChangeBtn(ev)	  ---关注/点赞 状态(样式)切换
function staChangeBtn(ev) {
	var e = ev || window.event;
	var target = e.target || window.event.srcElement;
	var dataInit = target.getAttribute("data-click");
	var dataClick;
	// 把选中的数据暂存。
	function dataSet(arr, id) {
		if (arr.indexOf(id) >= 0) {
			let index = arr.indexOf(id);
			arr.splice(index, 1);
			target.classList.remove("active");
			target.setAttribute("data-click", 0);
			dataClick = 0;
		} else {
			arr.push(id);
			target.classList.add("active");
			target.setAttribute("data-click", 1);
			dataClick = 1;
		}

		return arr;
	}

	if (target.nodeName.toLowerCase() == "span") {
		var id = target.getAttribute("data-id");
		var type = target.getAttribute("data-type");
		var dataNum = target.getAttribute("data-comment");
		if (type === "atten") {
			forNote.discussList = dataSet(forNote.discussList, id);
			if (dataInit == -1) {
				dataClick = -1;
				let result = dataClick + dataNum * 1;
				target.setAttribute("data-comment", result);
				target.innerText = "关注：" + result;
			} else {
				target.innerText = "关注：" + (dataClick + dataNum * 1);
			}

		} else if (type === "praise") {
			forNote.praiseList = dataSet(forNote.praiseList, id);
			if (dataInit == -1) {
				dataClick = -1;
				let result = dataClick + dataNum * 1;
				target.setAttribute("data-comment", result);
				target.nextSibling.innerText = result;
			} else {
				target.nextSibling.innerText = dataClick + dataNum * 1;
			}
		}

		saveCommentData(forNote.praiseList, forNote.discussList);
	}

	function showNumChange(node, ) {
		let dataClick = node.getAttribute("data-click");
	}
}


// ---按钮点击样式（关注数，点赞数）		
// 这里设用户对于点赞和关注的数据用变量 commentData 存起来，它是一个对象。包含praise数组和discuss数组

// 函数11. saveCommentData(localStorage 存放 praise数组和discuss数组)   
function saveCommentData(praise, discuss) {
	// Check browser support  运用了H5的 localStorage 来实现.
	if (typeof(Storage) !== "undefined") {
		// Store

		localStorage.setItem("praiseData", praise.toString());
		localStorage.setItem("discussData", discuss.toString());
	} else {
		alert("抱歉！您的浏览器不支持该功能.");
	}
}


// 函数12. btnModNote(当前元素e)    ---按钮点击 修改当前笔记内容
function btnModNote(e) {
	var e = e || window.event;
	var shuru = document.getElementById("noteWords").value;
	if (shuru != "") {
		e.parentNode.firstChild.innerText = shuru;
		document.getElementById("tipsOfChange").innerHTML = "修改成功，点击'保存当前修改'才最后生效哦~";
	} else {
		document.getElementById("tipsOfChange").innerHTML = "修改内容不允许为空，请在上面输入框输入内容后再点击修改。";
	}
}


// 函数13. btnDelNote(当前元素e)    ---按钮点击 删除当前笔记内容
function btnDelNote(e) {
	e.parentNode.remove();
	document.getElementById("tipsOfChange").innerHTML = "删除成功,点击'保存当前修改'才最后生效哦~";
}


// 函数14. btnAddNote  ---添加笔记  不要怕步骤麻烦，先实现再说（实现原理很重要）
function btnAddNote(node, dataname = "note") {
	var inputVal = node.value;
	var olist = [];
	// console.log("btnAddNote");
	if (inputVal != "") {
		if (!localStorage.getItem(dataname)) {
			//  以前没有笔记存在内存中
			localStorage.setItem(dataname, inputVal);
			// console.log("以前没有数据");
		} else {
			var olistStr = localStorage.getItem(dataname);
			if (/\^+/.test(olistStr)) {
				olist = olistStr.split('^');
			} else {
				olist[0] = olistStr;
			}
			// olist[olist.length] = inputVal;
			olist.unshift(inputVal);
			// console.log("目前数组是"+olist);
			olistS = olist.join("^");
			localStorage.setItem(dataname, olistS);
		}
		if(dataname === "note"){
			document.getElementById("tipsOfChange").innerHTML = "笔记写入成功。";
			showNote();
		}else{
			document.getElementById("tips").innerHTML = "分析写入成功。";
		}
	} else {
		if(dataname === "note"){
			document.getElementById("tipsOfChange").innerHTML = "空内容无法写入。";
		}else{
			document.getElementById("tips").innerHTML = "空内容无法写入。";
		}
	}
}

// 函数15. writeSomething  ---给某人评论
function writeSomething(ev) {
	var e = ev || window.event;
	var target = e.target || window.event.srcElement;
	forNote.commentId = target.getAttribute("data-id");
	const odiscussBox = document.getElementById("disWords");
	odiscussBox.focus();
	document.getElementById("disSubmitBtn").setAttribute("value", "评论");
	document.getElementById("disWords").setAttribute("placeholder", "这个话题触动了你哪根神经，吐槽一下吧~");
};

function reSetBtndo() {
	document.getElementById("disSubmitBtn").setAttribute("value", "提问");
	document.getElementById("disWords").setAttribute("placeholder", "想要问什么……");
	document.getElementById("disWords").value = "";
	forNote.commentId = '';
}

function safeInputCheck() {
	// 检查forNote.seltxt的内容，至于规则以后再说……
	forNote.canpublish = ture;
}

// 函数16. publishWords  ---输入后的发表
function publishWords() {
	var commentWords = document.getElementById("disWords").value;
	if (commentWords != "" && forNote.limitWords >= 0) {
		forNote.commentNum++;
		let ccname = forNote.username + "(我)";
		let cccommentid = 'us' + (forNote.commentNum + forNote.id * 100000000);
		forNote.comment = [cccommentid, ccname, commentWords, 0];
		forNote.commentsList.push(forNote.comment);
		if (forNote.commentId != "") {
			let comment = '<img src="images/sentence/1.jpg" alt="回答者用户头像" /><div class="comment"><p>用户： ' +
				forNote.comment[1] + '</p>' + forNote.comment[2] + '</div><div class="praise"><span class="attentionBtn" data-id=' +
				forNote.comment[0] + ' data-click=0 data-type="praise" data-comment=' + forNote.comment[3] +
				'>赞</span><b class="praiseNumber">' +
				forNote.comment[3] + '</b></div>';
			let odt = document.createElement("dt");
			let odl = document.getElementsByClassName(forNote.commentId)[0];
			odt.classList.add("answerItem");
			odt.innerHTML = comment;
			odl.appendChild(odt);
			forNote.seltxt = '';
			forNote.comment = [];
			forNote.commentId = "";
			reSetBtndo();
			document.getElementsByClassName("wordsCanIn")[0].innerText = "评论发表成功！";
		} else {
			// 一般发表，新起一个问题
			let content = '<div class="quesFront" data-id=' + cccommentid +
				' ><img src="images/sentence/0.jpg" alt="提问者用户头像" /><h4>' +
				ccname + ': ' + commentWords + '</h4><span class="attentionBtn" data-id=' + cccommentid +
				' data-click=0 data-type="atten" data-comment=0' +
				'>关注：0 </span><b class="commentBtn" data-id=' + cccommentid + ' >添加评论</b></div>';
			let allComment = content + '<dl class="answerList ' + cccommentid + ' " ></dl>';
			const existList = document.getElementById("existList");
			let oli = document.createElement("li");
			oli.innerHTML = allComment;
			existList.appendChild(oli);
			oli.getElementsByClassName("commentBtn")[0].onclick = writeSomething;
			forNote.seltxt = '';
			reSetBtndo();
			document.getElementsByClassName("wordsCanIn")[0].innerText = "提问发表成功！";
		}
	} else {
		document.getElementsByClassName("wordsCanIn")[0].innerText = "发表失败！";
	}
	forNote.canpublish = false;
	// 把次数存好。
	localStorage.setItem("commentsData", forNote.commentsList);
	localStorage.setItem("commentNum", forNote.commentNum);

}
