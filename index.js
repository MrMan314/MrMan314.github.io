function time() {
	var date = new Date();
	var h = date.getHours();
	var m = date.getMinutes();
	var s = date.getSeconds();
	document.getElementById("clock").innerHTML = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
	setTimeout(time, 1000);
}

const touches = new Map();
function drag(elem, disable = false) {
	var dx = 0, dy = 0;
	if (!touches.has(elem)) touches.set(elem, [dragMouseDown, focusMouseDown]);
	[dragCb, focusCb] = touches.get(elem);
	if (disable) {
		document.getElementById(elem.id + "header").onmousedown = null;
		document.getElementById(elem.id + "header").removeEventListener("touchstart", dragCb);
		elem.onmousedown = null;
		elem.removeEventListener("touchstart", focusCb);
	} else {
		document.getElementById(elem.id + "header").onmousedown = dragMouseDown;
		document.getElementById(elem.id + "header").addEventListener("touchstart", dragCb, {passive: false});
		elem.onmousedown = focusMouseDown;
		elem.addEventListener("touchstart", focusCb, {passive: false});
	}

	function reindex() {
		var max = 0, min = 2147483647;
		var l = document.getElementsByClassName("window");
		[].forEach.call(l, (t) => {max = parseInt(t.style.zIndex) > max ? parseInt(t.style.zIndex) : max});
		[].forEach.call(l, (t) => {min = parseInt(t.style.zIndex) < min ? parseInt(t.style.zIndex) : min});
		elem.style.zIndex = parseInt(max) + (elem.style.zIndex == parseInt(max) ? 0 : 1);
		[].forEach.call(l, (t) => {t.style.zIndex -= min - 1});
	}

	function focusMouseDown(e) {
		e = e || window.event;
		reindex();
		var l = document.getElementsByClassName("active");
		[].forEach.call(l, (t) => {if (t !== elem) t.classList.remove("active")});
		elem.classList.add("active");
	}
	
	function dragMouseDown(e) {
		e = e || window.event;
		dx = elem.offsetLeft - (e.clientX === undefined ? e.touches[0].clientX : e.clientX);
		dy = elem.offsetTop - (e.clientY === undefined ? e.touches[0].clientY : e.clientY);
		reindex();
		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
		document.addEventListener("touchend", closeDragElement, {passive: false});
		document.addEventListener("touchmove", elementDrag, {passive: false});
	}
	
	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		var x = e.clientX === undefined ? e.touches[0].clientX : e.clientX;
		var y = e.clientY === undefined ? e.touches[0].clientY : e.clientY;
		elem.style.left = (x + dx) + "px";
		var ypos = y + dy;
		var max_y = window.innerHeight - 52;
		elem.style.top = (ypos > 0 ? (ypos < window.innerHeight - 52 ? ypos : window.innerHeight - 52) : 0) + "px";
	}
	
	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;
		document.removeEventListener("touchend", closeDragElement);
		document.removeEventListener("touchmove", elementDrag);
	}
}

function show(name) {
	var e = document.getElementById(name);
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
	var e = document.getElementById(name);
	e.style.top = (window.innerHeight-e.offsetHeight)/2;
	e.style.left = (window.innerWidth-e.offsetWidth)/2;
}

function disperseWindow(elem) {
	elem.style.top = Math.floor(Math.random() * (window.innerHeight-elem.offsetHeight)) + "px";
	elem.style.left = Math.floor(Math.random() * (window.innerWidth-elem.offsetWidth)) + "px"
}

async function addWindow(id, icon, title, width, height, maximizable, zind) {
	w = document.createElement("div");
	w.id=id;
	w.classList.add('window');
	w.innerHTML = '<div id="'+id+'header" class="windowheader"' + (maximizable ? ' ondblclick="maximize(\''+id+'\')"' : '') + '>\n<ul class="navbar">\n<li class="navlink"><a><i class="'+icon+'"></i></a></li>\n<li class="rightlink"><a><i class="icon icon-close" onclick="hide(\''+id+'\')"></i></a></li>\n' + (maximizable ? '<li class="rightlink"><a><i class="icon icon-maximize" onclick="maximize(\''+id+'\')"></i></a></li>\n' : '') + '<li class="centerlink"><a>'+title+'</a></li>\n</ul>\n</div>\n<div id="'+id+'content" class="windowcontent" style="width:'+width+';height:'+height+';"></div>'
	document.getElementById('windows').appendChild(w);
	document.getElementById('dock').innerHTML += '<li class="navlink" id="'+id+'-dock" style="display: none"><a onclick="show(\''+id+'\')"><i class="'+icon+'"></i></i></a></li>'
	document.getElementById('icons').innerHTML += '<li class="dticon" onclick="show(\''+id+'\');" ondblclick="show(\''+id+'\');center(\''+id+'\')"><div class="dtaccicon"><i class="'+icon+' icon-large dticonicon"></i></div><p>'+title+'</p></li>';
	let response = await fetch("/windows/"+id+".html");
	let text = await response.text();
	document.getElementById(id+'content').innerHTML = text;
	w.style.zIndex = zind;
	disperseWindow(w);
	drag(w);
}

var windowList = [
	['aboutme', 'icon icon-home', 'About Me', '500', '500', false],
	['gallery', 'icon icon-gallery', 'Gallery', '700', '500', true],
	['skills', 'icon icon-tools', 'Skills', '500', '500', false],
	['achievements', 'icon icon-star', 'Achievements', '550', '350', false],
	['activities', 'icon icon-ring', 'Activities', '550', '350', false],
	['experience', 'icon icon-check', 'Experiences', '500', '500', false],
];

var hidden = ['gallery', 'experience', 'activities', 'achievements', 'skills']

function blech() {
	document.body.classList.toggle("blech");
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
	if(document.body.classList.contains("blech")) {
		localStorage.setItem("blech", "true");
	} else {
		localStorage.setItem("blech", "false");
	}
}

const imageBlobs = new Map();
let currentAbortController = null;
let currentImage = null;

async function setPicture(image) {
	if (currentImage !== image) {
		var content = document.getElementById("gallerycontent");

		if (currentAbortController) {
			currentAbortController.abort('new instance');
		}

		currentImage = image;

		const controller = new AbortController();
		currentAbortController = controller;

		try {
			var blobURL = '', length = -1;
			if (imageBlobs.has(image)) {
				[blobURL, length] = imageBlobs.get(image);
			} else {
				const response = await fetch(image, {signal: controller.signal});
				if (!response.ok) throw Error();
				length = parseInt(response.headers.get('content-length'));
				const reader = response.body.getReader();
				let recv = 0;
				const chunks = [];
				content.classList.add("notransition");
				content.style.setProperty('--opacity', '1');

				while (true) {
					const {done, value} = await reader.read({signal: controller.signal});
					if (done) break;

					chunks.push(value);

					recv += value.length;
					content.style.setProperty('--right', (720 * (length-recv)/length - 10) + 'px');
				}

				content.style.setProperty('--opacity', '0');
				content.classList.remove("notransition");

				const imageBlob = new Blob(chunks, {type: response.headers.get("content-type")
});
				blobURL = URL.createObjectURL(imageBlob);
				imageBlobs.set(image, [blobURL, length]);

			}
			document.getElementById("photo-dimensions-label").innerHTML = '';
			document.getElementById("gallerypicture").style.backgroundImage="url('"+blobURL+"')";
			document.getElementById("gallerythumb").src=blobURL;
			document.getElementById("photo-size-label").innerHTML=length.toLocaleString() + ' bytes';
			document.getElementById("photo-label").innerHTML=image.split("/").pop();
			document.getElementById("galleryroll").style.setProperty("--floor", "var(--accent)");
			document.getElementById("gallery").style.setProperty("--bg-accent", "var(--accent)");
		} catch (error) {
			if (error === 'new instance' || error.name == 'AbortError') {
				content.style.setProperty('--opacity', '0');
				content.classList.remove("notransition");
			} else {
				document.getElementById("photo-dimensions-label").innerHTML = '';
				document.getElementById("gallerypicture").style.backgroundImage='';
				document.getElementById("gallerythumb").src='/icons/notfound.svg';
				document.getElementById("photo-size-label").innerHTML='';
				document.getElementById("photo-label").innerHTML='Error loading image';
				document.getElementById("galleryroll").style.setProperty("--floor", "var(--accent-error)");
				document.getElementById("gallery").style.setProperty("--bg-accent", "var(--accent-error)");
			}
		}
	}
	spin();
}

var waiting = null;

function spin() {
	var e=document.getElementById("gallerythumb").parentNode;
	if (waiting !== null) {
		clearTimeout(waiting);
		e.classList.add("notransition");
		e.style.transform='rotateX(-10deg) rotateY(-30deg)';
		e.parentNode.classList.add("notransition");
		e.parentNode.style.setProperty('--transform','');
	}
	e.offsetHeight; // why does this need to be here?
	e.classList.remove("notransition");
	e.style.transform='rotateX(-10deg) rotateY(690deg)';
	e.parentNode.classList.remove("notransition");
	e.parentNode.style.setProperty('--transform','rotateX(-10deg)rotateY(690deg)translateY(50%)rotateX(90deg)translateY(-50%)');
	waiting = setTimeout(()=>{
		e.classList.add("notransition");
		e.style.transform='rotateX(-10deg) rotateY(-30deg)';
		e.parentNode.classList.add("notransition");
		e.parentNode.style.setProperty('--transform','');
		waiting = null;
	}, 1000)
}

const originalDimensions = new Map();

function maximize(name) {
	var maxButton = document.querySelector("#galleryheader > ul > li:nth-child(3) > a > i");
	var restore = maxButton.classList.contains('icon-restore');
	var e2 = document.getElementById(name);
	var content = document.getElementById(name + "content");
	if (restore) {
		[content.style.width, content.style.height] = originalDimensions.get(name);
		drag(e2, false);
		e2.style.transform = '';
		maxButton.classList.remove('icon-restore');
		maxButton.classList.add('icon-maximize');
	} else {
		originalDimensions.set(name, [content.style.width, content.style.height]);
		e2.style.transform = 'translate('+(-parseInt(e2.style.left))+'px,'+(-parseInt(e2.style.top))+'px)';
		content.style.width = "100vw";
		content.style.height = "calc(100" + (CSS.supports('height','1dvh') ? 'd' : '') + "vh - 1.5em - 28px)";
		drag(e2, true);
		maxButton.classList.remove('icon-maximize');
		maxButton.classList.add('icon-restore');
	}
}

var moveInterval = null;

async function initGallery() {
	var e = document.getElementById("galleryroll");

	var resp = await fetch("/images");
	var text = await resp.text()
	var imageList = text.split('\n');
	for (i in imageList) {
		if (imageList[i] === '') continue;
		let tile = document.createElement("div");
		tile.classList.add("imagetile");
		tile.addEventListener("click", tileClick.bind(tile, imageList[i]));
		function tileClick(name, ev) {
			if (moveInterval !== null) clearTimeout(moveInterval);
			setPicture("/images/" + name);
			var l = document.getElementsByClassName("imageactive");
			[].forEach.call(l, (t) => {if (t !== this) t.classList.remove("imageactive")});
			this.classList.add("imageactive");
			tileMove();
			moveInterval = setTimeout(tileMove, 1000);
			function tileMove() { // converges within two calls
				x = document.querySelector("#galleryroll > div.imagetile.imageactive").getBoundingClientRect().x
				x2 = document.querySelector("#galleryroll").getBoundingClientRect().x
				w = document.querySelector("#galleryroll > div.imagetile.imageactive").getBoundingClientRect().width
				w2 = document.querySelector("#galleryroll").getBoundingClientRect().width
				changeXPos((w2-w)/2+x2-x);
			}
		}
		tile.innerHTML='<img src="/images/' + imageList[i] + '.thumb"/>';
		e.appendChild(tile);
	}

	e.onmousedown = galleryDrag;
	e.addEventListener("touchstart", galleryDrag, {passive: false});

	document.getElementById("gallerythumb").onload = function() {
		if (this.attributes.src.nodeValue !== "/icons/notfound.svg") {
			document.getElementById("photo-dimensions-label").innerHTML = this.naturalWidth+'x'+this.naturalHeight;
			// if not card, why card shaped?
			if (Math.round(this.naturalHeight / this.naturalWidth * 1000) == 1586) {
				this.style.borderRadius = "10px";
				this.style.border = "0px";
				this.parentNode.parentNode.style.setProperty("--radius", "10px");
			} else {
				this.style.borderRadius = "";
				this.style.border = "";
				this.parentNode.parentNode.style.setProperty("--radius", "");
			}
		}
	};

	var x, dx = 0, xpos = 0;
	function galleryDrag(ev) {
		x = (ev.clientX === undefined ? ev.touches[0].clientX : ev.clientX);
		dx = 0;
		e.classList.add("notransition");
		document.onmousemove = galleryMove;
		document.onmouseup = galleryStop;
		document.addEventListener("touchend", galleryStop, {passive: false});
		document.addEventListener("touchmove", galleryMove, {passive: false});
	}

	function galleryMove(ev) {
		dx = (ev.clientX === undefined ? ev.touches[0].clientX : ev.clientX) - x;
		e.style.setProperty("--translation", (xpos + dx) + "px");
	}

	function galleryStop(ev) {
		xpos += dx;
		e.classList.remove("notransition");
		document.onmousemove = null;
		document.onmouseup = null;
		document.removeEventListener("touchend", galleryStop);
		document.removeEventListener("touchmove", galleryMove);
	}
	function changeXPos(d) {
		xpos += d;
		e.style.setProperty("--translation", xpos + "px");
	}
}

async function init() {
	time();
	var zind = 1;
	for (var i in windowList) {
		await addWindow(windowList[i][0], windowList[i][1], windowList[i][2], windowList[i][3], windowList[i][4], windowList[i][5], zind);
		zind++;
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
	center('aboutme');

	await initGallery();

	if(localStorage.getItem("blech") == "true") blech();
	document.getElementById("loadingscreen").remove();
}

