function time() {
	date = new Date();
	h = date.getHours();
	m = date.getMinutes();
	s = date.getSeconds();
	document.getElementById("clock").innerHTML = '<i class="fa-regular fa-clock"></i> ' + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
	setTimeout(time, 1000);
}

function drag(e2) {
	var p1 = 0, p2 = 0, p3 = 0, p4 = 0;
	document.getElementById(e2.id + "header").onmousedown = dragMouseDown;
	e2.onmousedown = dragMouseDown;
	e2.style.zIndex = 0;
	function dragMouseDown(e) {
		e = e || window.event;
		p3 = e.clientX, p4 = e.clientY;
		var max = 0, min = 2147483647;
		l = document.getElementsByClassName("window");
		[].forEach.call(l, (t) => {max = parseInt(t.style.zIndex) > max ? parseInt(t.style.zIndex) : max});
		[].forEach.call(l, (t) => {min = parseInt(t.style.zIndex) < min ? parseInt(t.style.zIndex) : min});
		e2.style.zIndex = parseInt(max) + 1;
		[].forEach.call(l, (t) => {t.style.zIndex -= min});
		console.log(e2.style.zIndex);
		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
	}
	
	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		p1 = p3 - e.clientX;
		p2 = p4 - e.clientY;
		p3 = e.clientX;
		p4 = e.clientY;
		e2.style.top = (e2.offsetTop - p2) + "px";
		e2.style.left = (e2.offsetLeft - p1) + "px";
	}
	
	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

