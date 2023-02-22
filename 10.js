window.addEventListener('beforeunload', function(event) {
    event.returnValue = "Do you want to leave this site?";
});

chrome.storage.sync.get({
	cclDefImg : 0
	},function(items){
		var css = '#wrapper {background-image: url(\'images/cclDefault'+items.cclDefImg+'.jpg\');}',
		head = document.head || document.getElementsByTagName('head')[0],
		style = document.createElement('style');
		style.type = 'text/css';
		style.appendChild(document.createTextNode(css));
		head.appendChild(style);
});

var cclMiddle = document.getElementById('cclMiddle');
var bob = document.getElementById('cclInput');
var cclIframe = document.getElementById('cclIframe');
var cclFavIcon = document.getElementById('cclFavIcon');
var cclWrapper = document.getElementById('wrapper');

cclInput.addEventListener('input',cclInputChange);

cclMiddle.onclick = function(){
	cclWrapper.classList.remove('wrapperBlur');
	cclMiddle.style.display = 'none';
	cclInput.style.display = 'none';
	clearInterval(iconTimer);
	cclFavIcon.setAttribute('href', 'images/lock-icon16.png');
	checkImage('http://intellibyte.net/images/Intellibyte.jpg', goodImage, function(){});
};

function cclInputChange(){
	cclWrapper.classList.remove('wrapperBlur');
	cclMiddle.style.display = 'none';
	cclInput.style.display = 'none';
	clearInterval(iconTimer);
	cclFavIcon.setAttribute('href', 'images/lock-icon16.png');
	checkImage('http://intellibyte.net/images/Intellibyte.jpg', goodImage, function(){});
};

function goodImage(){
	chrome.storage.sync.get({
		cclTheme: ''
	},function(items){
		cclIframe.src = 'http://intellibyte.net/ccl?thm='+items.cclTheme;
		cclIframe.onload = function(){
			this.style.display = 'block';
		};
	});
}

function checkImage (src,good,bad) {
    var img = new Image();
    img.onload = good; 
    img.onerror = bad;
    img.src = src;
}

var warnIcon = 'red';

iconTimer = setInterval(function () {

var canvas = document.createElement('canvas'),
    ctx,
    img = document.createElement('img');

if (canvas.getContext) {
  canvas.height = canvas.width = 16; // set the size
  ctx = canvas.getContext('2d');
  img.onload = function () { // once the image has loaded
    ctx.drawImage(this, 0, 0);
	cclFavIcon.setAttribute('href', canvas.toDataURL('image/png'));
  };
  if(warnIcon == 'red'){
	  img.src = 'images/warnRed.png';
	  warnIcon = 'wht';
  }else if(warnIcon == 'wht'){
	  img.src = 'images/warnWht.png';
	  warnIcon = 'blu';
  }else if(warnIcon == 'blu'){
	  img.src = 'images/warnBlu.png';
	  warnIcon = 'blk';
  }else{
	  img.src = 'images/warnBlk.png';
	  warnIcon = 'red';
  }
}

}, 500);