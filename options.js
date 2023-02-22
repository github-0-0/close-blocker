var defImg;
var cclStatus;
cclButton = document.getElementById('cclEnable');

chrome.runtime.sendMessage({
		cclStatusReq: 'req'
	},function(response){
		cclStatus = response.cclEnabled;
		buttonChanger();
	});

	/*
chrome.storage.sync.get({
	cclEnabled: true
},function(items){
	cclButton = document.getElementById('cclEnable');
	if(items.cclEnabled){
		cclButton.classList.remove('cclDisabled');
		cclButton.classList.add('cclEnabled');
		cclButton.innerHTML = 'ENABLED';
		cclStatus = true;
	}else{
		cclButton.classList.add('cclDisabled');
		cclButton.classList.remove('cclEnabled');
		cclButton.innerHTML = 'DISABLED';
		cclStatus = false;
	}
});
*/

function buttonChanger(){
	if(cclStatus){
		cclButton.classList.remove('cclDisabled');
		cclButton.classList.add('cclEnabled');
		cclButton.innerHTML = 'ENABLED';
	}else{
		cclButton.classList.add('cclDisabled');
		cclButton.classList.remove('cclEnabled');
		cclButton.innerHTML = 'DISABLED';
	}
}

function saveOptions(){
	var theme = document.getElementById('thm').value;
	defImgs = document.getElementsByName('defImg');
  
	for (i = 0; i < defImgs.length; i++){
		if (defImgs[i].checked){
			defImg = i;
			break;
		}
	}
  
	chrome.storage.sync.set({
		cclTheme: theme,
		cclDefImg: defImg
	},function(){
		var status = document.getElementById('status');
		status.textContent = 'Preferences saved.';
		setTimeout(function(){
			status.textContent = '';
		}, 2000);
	});
	
	chrome.runtime.sendMessage({
		cclThemeUpdate: 'Updated'
	},function(){});

}

function enableToggle(){
	chrome.runtime.sendMessage({
		cclEnableButton: 'Clicked'
	},function(response){
		if(response.cclEnabled){
			cclStatus = false;
		}else{
			cclStatus = true;
		}
		
		buttonChanger();
	});
	/*
	if(!cclStatus){
		cclButton.classList.remove('cclDisabled');
		cclButton.classList.add('cclEnabled');
		cclButton.innerHTML = 'ENABLED';
		cclStatus = true;
	}else{
		cclButton.classList.add('cclDisabled');
		cclButton.classList.remove('cclEnabled');
		cclButton.innerHTML = 'DISABLED';
		cclStatus = false;
	}
	
	chrome.storage.sync.set({
		cclEnabled: cclStatus
	},function(){});
	*/
}

function fetchWithTimeout(fetchLimit,fetchUrl){
	const FETCH_TIMEOUT = fetchLimit;
	let didTimeOut = false;

	new Promise(function(resolve, reject) {
		const timeout = setTimeout(function() {
			didTimeOut = true;
			reject(new Error('Request timed out'));
		}, FETCH_TIMEOUT);
		
		fetch(fetchUrl)
		.then(function(response) {
			clearTimeout(timeout);
			if(!didTimeOut){
				//console.log('fetch good! ', response);
				resolve(response);
			}
		})
		.catch(function(err) {
			//console.log('fetch failed! ', err);
			if(didTimeOut) return;
			reject(err);
		});
	})
	.then((resp) => resp.json())
	.then(function(data){
		selData = data.select;
		return selData.map(function(selData){
			selOpt = document.createElement('option');
			selOpt.value = selData.selValue;
			selOpt.text = selData.selText;
			document.getElementById('thm').appendChild(selOpt);
		})
	})
	.then(function(){
		chrome.storage.sync.get({
			cclTheme: '',
			cclDefImg: 0
		},function(items){
			document.getElementById('thm').value = items.cclTheme;
			defImgs = document.getElementsByName('defImg');
			defImgs[items.cclDefImg].checked = true;
		});
	})
	.then(function(){		
		document.getElementById('overlay').style.display = 'none';
		document.getElementById('specialBox').style.display = 'none';
	})
	.catch(function(err) {
		// Error: response error, request timeout or runtime error
		//console.log('promise error! ', err);
		document.getElementById('specialBox').innerHTML = 'Unable to load settings. Try again later.';
	});
}

document.addEventListener('DOMContentLoaded',fetchWithTimeout(5000,'http://intellibyte.net/ccl/theme.php'));
document.getElementById('save').addEventListener('click',saveOptions);
document.getElementById('cclEnable').addEventListener('click',enableToggle);