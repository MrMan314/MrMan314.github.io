function time() {
	date = new Date();
	h = date.getHours();
	m = date.getMinutes();
	s = date.getSeconds();
	document.getElementById("clock").innerHTML = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
	setTimeout(time, 1000);
}

function drag(e2) {
	var dx = 0, dy = 0;
	document.getElementById(e2.id + "header").onmousedown = dragMouseDown;
	document.getElementById(e2.id + "header").addEventListener("touchstart", dragMouseDown, {passive: false});
	e2.onmousedown = focusMouseDown;
	e2.addEventListener("touchstart", focusMouseDown, {passive: false});
	function focusMouseDown(e) {
		e = e || window.event;
		var max = 0, min = 2147483647;
		l = document.getElementsByClassName("window");
		[].forEach.call(l, (t) => {max = parseInt(t.style.zIndex) > max ? parseInt(t.style.zIndex) : max});
		[].forEach.call(l, (t) => {min = parseInt(t.style.zIndex) < min ? parseInt(t.style.zIndex) : min});
		e2.style.zIndex = parseInt(max) + (e2.style.zIndex == parseInt(max) ? 0 : 1);
		[].forEach.call(l, (t) => {t.style.zIndex -= min});
		
		l = document.getElementsByClassName("active");
		[].forEach.call(l, (t) => {if (t !== e2) t.classList.remove("active")});
		e2.classList.add("active");
	}
	
	function dragMouseDown(e) {
		e = e || window.event;
		dx = e2.offsetLeft - (e.clientX === undefined ? e.touches[0].clientX : e.clientX);
		dy = e2.offsetTop - (e.clientY === undefined ? e.touches[0].clientY : e.clientY);
		var max = 0, min = 2147483647;
		l = document.getElementsByClassName("window");
		[].forEach.call(l, (t) => {max = parseInt(t.style.zIndex) > max ? parseInt(t.style.zIndex) : max});
		[].forEach.call(l, (t) => {min = parseInt(t.style.zIndex) < min ? parseInt(t.style.zIndex) : min});
		e2.style.zIndex = parseInt(max) + (e2.style.zIndex == parseInt(max) ? 0 : 1);
		[].forEach.call(l, (t) => {t.style.zIndex -= min});
		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
		document.addEventListener("touchend", closeDragElement, {passive: false});
		document.addEventListener("touchmove", elementDrag, {passive: false});
	}
	
	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		x = e.clientX === undefined ? e.touches[0].clientX : e.clientX;
		y = e.clientY === undefined ? e.touches[0].clientY : e.clientY;
		e2.style.left = (x + dx) + "px";
		e2.style.top = (y + dy) + "px";
		/*
		dx = x0 - x;
		dy = y0 - y;
		x0 = x;
		y0 = y;
		e2.style.top = (e2.offsetTop - dy) + "px";
		e2.style.left = (e2.offsetLeft - dx) + "px";
		*/
	}
	
	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;
		document.removeEventListener("touchend", closeDragElement);
		document.removeEventListener("touchmove", elementDrag);
	}
}

function show(name) {
	e = document.getElementById(name);
	e.style.display="block";
	document.getElementById(name+"-dock").style.display="none";
	var max = 0;
	l = document.getElementsByClassName("window");
	[].forEach.call(l, (t) => {max = parseInt(t.style.zIndex) > max ? parseInt(t.style.zIndex) : max});
	l = document.getElementsByClassName("active");
	[].forEach.call(l, (t) => {if (t !== e) t.classList.remove("active")});
	e.classList.add("active");
	console.log(max);
	e.style.zIndex = max + (e.style.zIndex == max ? 0 : 1);
}

function hide(name) {
	document.getElementById(name).style.display="none";
	document.getElementById(name+"-dock").style.display="block";
}

function center(name) {
	e = document.getElementById(name);
	e.style.top = (window.innerHeight/2)-(e.offsetHeight/2);
	e.style.left = (window.innerWidth/2)-(e.offsetWidth/2);
}

function disperseWindow(elem) {
	elem.style.top = Math.floor(Math.random() * (window.innerHeight-elem.offsetHeight)) + "px";
	elem.style.left = Math.floor(Math.random() * (window.innerWidth-elem.offsetWidth)) + "px"
}

async function addWindowFromMD(id, icon, title, width, height, zind) {
	document.getElementById('windows').innerHTML += '<div id="'+id+'" class="window">\n<div id="'+id+'header" class="windowheader">\n<ul class="navbar">\n<li class="navlink"><a><i class="'+icon+'"></i></a></li>\n<li class="rightlink"><a><i class="icon icon-close" onclick="hide(\''+id+'\')"></i></a></li>\n<li class="centerlink"><a>'+title+'</a></li>\n</ul>\n</div>\n<div id="'+id+'content" style="width:'+width+';height:'+height+';text-align:left;margin:10px;overflow:scroll;"></div></div>';
	document.getElementById('dock').innerHTML += '<li class="navlink" id="'+id+'-dock" style="display: none"><a onclick="show(\''+id+'\')"><i class="'+icon+'"></i></i></a></li>'
	document.getElementById('icons').innerHTML += '<li class="dticon" onclick="show(\''+id+'\');" ondblclick="show(\''+id+'\');center(\''+id+'\')"><div class="dtaccicon"><i class="'+icon+' icon-large dticonicon"></i></div><p>'+title+'</p></li>';
	let response = await fetch("/windows/"+id+".html");
	let text = await response.text();
	document.getElementById(id+'content').innerHTML = text;
	document.getElementById(id).style.zIndex = zind;
	drag(document.getElementById(id));
}

var MDList = [
	['aboutme', 'icon icon-home', 'About Me', '500', '500'],
	['gallery', 'icon icon-gallery', 'Gallery', '750', '500'],
	['skills', 'icon icon-tools', 'Skills', '500', '500'],
	['achievements', 'icon icon-star', 'Achievements', '550', '350'],
	['activities', 'icon icon-ring', 'Activities', '550', '350'],
	['experience', 'icon icon-check', 'Experiences', '500', '500'],
];

var hidden = ['aboutme', 'youtube', 'discord', 'contact', 'experience', 'activities', 'achievements', 'skills']

function init() {
	time();
	var zind = 3;
	for (var i in MDList) {
		addWindowFromMD(MDList[i][0], MDList[i][1], MDList[i][2], MDList[i][3], MDList[i][4], zind);
		zind++;
	}
	var windowList=document.getElementsByClassName('window');
	for (var i = 0; i < windowList.length; i++) {
		drag(windowList[i]);
		disperseWindow(windowList[i]);
	}
	for (var i in hidden) {
		hide(hidden[i]);
	}
	document.querySelector("#icons").addEventListener("click", (e)=>{
		if(e.target === e.currentTarget) {
			l = document.getElementsByClassName("active");
			[].forEach.call(l, (t) => {t.classList.remove("active")});
		}
	});
	hljs.initHighlightingOnLoad();
	center('gallery');
	if(localStorage.getItem("blech") == "true") blech();
	document.getElementById("loadingscreen").remove();
}

function blech() {
	document.getElementById("body").classList.toggle("blech");
	document.getElementById("blechindicator").classList.toggle("icon-moon");
	document.getElementById("blechindicator").classList.toggle("icon-sun");
	document.getElementById("icons").classList.toggle("blech");
	var windowList=document.getElementsByClassName('window');
	for (var i = 0; i < windowList.length; i++) {
		windowList[i].classList.toggle("blech");
	}
	windowList=document.getElementsByClassName('windowheader');
	for (var i = 0; i < windowList.length; i++) {
		windowList[i].classList.toggle("blech");
	}
	windowList=document.getElementsByClassName('navbar');
	for (var i = 0; i < windowList.length; i++) {
		windowList[i].classList.toggle("blech");
	}
	var windowList=document.getElementsByClassName('forminput');
	for (var i = 0; i < windowList.length; i++) {
		windowList[i].classList.toggle("blech");
	}
	var windowList=document.getElementsByClassName('button');
	for (var i = 0; i < windowList.length; i++) {
		windowList[i].classList.toggle("blech");
	}
	if(document.getElementById("body").classList.contains("blech")) {
		document.getElementById("discordcont").src = "https://canary.discord.com/widget?id=781661443782475786&theme=light"
		localStorage.setItem("blech", "true");
	} else {
		localStorage.setItem("blech", "false");
		document.getElementById("discordcont").src = "https://canary.discord.com/widget?id=781661443782475786&theme=dark"
	}
}
