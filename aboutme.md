## About Me
I created Minecraft on Discord
scroll to bottom for sth funy

### Hobbies
- Programming
- Biking
- Building
- Boating

### Ongoing Projects
- Building a Linux From Scratch system
- Making a Game

### Interests
- Computer Software and Hardware
- Linux
- Games
- History
- Geography
- Mathematics
- Sciences
- Microcontrollers

### Work Experiences
- Teaching Programming

### Programming Languages I Know
- C/C++
- Python
- Bash
- GDScript (Godot)
- Javascript
- PHP
- (some) x86 assembly
- J*va
- ~~HTML~~
- ~~CSS~~

### Languages I Know
- English
- Mandarin
- (some) French

# i use arch btw

## Youtube troll generator thingy
#### Works with Discord, can use the hide text trick to hide actual url
<input type="text" class="forminput" placeholder="Video ID" id="vidorig"></input>
<input type="text" class="forminput" placeholder="Redirect Video ID (none for dQw4w9WgXcQ" id="vidtrol"></input>
<button class="button" onclick="document.getElementById('vidout').value='https://youtube.com.mrman314.tech/watch?v='+document.getElementById('vidorig').value + (document.getElementById('vidtrol').value == '' ? '' : '&list=' + document.getElementById('vidtrol').value)">Generate</button>
<input type="text" class="forminput" disabled placeholder="Output URL" id="vidout"></input>
<button class="button" onclick="
	var txt = document.getElementById('vidout');
	txt.select();
	txt.setSelectionRange(0,99999);
	navigator.clipboard.writeText(txt.value);
	document.getElementById('copybutt').innerHTML='Copied!';
	setTimeout(()=>{
		document.getElementById('copybutt').innerHTML='Copy';
	}, 500);
" id="copybutt">Copy</button>
