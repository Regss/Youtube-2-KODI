var videoPattern = /^https?:\/\/www\.youtube\.com\/.*[?&]v=([A-Za-z0-9_-]{11})/;
var playlistPattern = /^https?:\/\/www\.youtube\.com\/.*[?&]list=([A-Za-z0-9_-]{34})/;

function getURLfromTab(tabURL) {
    console.log("tabURL: " + tabURL);
    var id = /^https?:\/\/www\.youtube\.com\/.*/.exec(tabURL);
    if (id) parseYoutubeURL(tabURL);
    else notify("You must be on youtube site");
}

function checkIcon(tabURL) {
    console.log("url: " + tabURL);
    var videoid = videoPattern.exec(tabURL);
    var playlistid = playlistPattern.exec(tabURL);
    if (videoid || playlistid) setIconColor();
    else setIconGrey();
}

function parseYoutubeURL(url) {

    var data = {  };
    data['order'] = 'default';
    data['play'] = '1';
    
    var matchVideo = videoPattern.exec(url);
    var matchList = playlistPattern.exec(url);
    
    if (matchVideo && matchVideo.length > 1) {
        data['video_id'] = matchVideo[1];
    }
    if (matchList && matchList.length > 1) {
        data['playlist_id'] = matchList[1];
    }
    
    if (!matchVideo && !matchList) {
        notify("This is not youtube URL");
    } else {
        getHostData(data);
    }
}

function getHostData(data) {
    var getting = browser.storage.local.get(null, function(result){
        var hostData = result;
        sendRequestToKODI(data, hostData);
    });
}

function sendRequestToKODI(data, hostData) {
    
    var xhr = new XMLHttpRequest();
    
    var get = {
    "jsonrpc":"2.0",
    "method":"Player.Open",
    "params": {
        "item":{
        "file": "plugin%3A%2F%2Fplugin.video.youtube%2Fplay%2F%3F" + encodeQueryData(data)
        }
    },
    "id": 1
    };
    console.log(hostData);
    console.log(JSON.stringify(get));
    xhr.open("GET", "http://" + encodeURIComponent(hostData.user) + ":" + encodeURIComponent(hostData.pass) + "@" + encodeURIComponent(hostData.host) + ":" + encodeURIComponent(hostData.port) + "/jsonrpc?request=" + JSON.stringify(get), true);
    xhr.timeout = 5000;
    xhr.onreadystatechange = function (aEvt) {
        if (xhr.readyState == 4) {
            if(xhr.status == 200) {
                var resp = xhr.responseText;
                parseJSON(resp);
            } else {
                notify("Error Sending request to KODI");
            }
        }
    };
    xhr.send();
}

function parseJSON(resp) {
    console.log(resp);
    var json = JSON.parse(resp);
    
    if (json["result"] && json["result"] == "OK") notify("Sent to KODI");
    else notify("Error Sending request to KODI");
}

function notify(message) {
    chrome.notifications.create({
        "type": "basic",
        "iconUrl": chrome.extension.getURL("icons/youtube2kodi-48.png"),
        "title": "Youtube 2 KODI",
        "message": message
    });
}

function encodeQueryData(data) {
    var k;
    var ret = [];
    for (k in data) {
        if (data[k] != '') {
            ret.push((k) + '=' + data[k]);
        }
    }
    return escape(ret.join('&'));
}

function setIconColor() {
    browser.browserAction.setIcon({
        path:  {
            96: "icons/youtube2kodi-96.png",
            48: "icons/youtube2kodi-48.png"
        }
    });
}

function setIconGrey() {
    browser.browserAction.setIcon({
        path:  {
            96: "icons/youtube2kodi_nk-96.png",
            48: "icons/youtube2kodi_nk-48.png"
        }
    });
}

chrome.browserAction.onClicked.addListener(function(tab) {
    getURLfromTab(tab.url);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    checkIcon(tab.url)
});

chrome.tabs.onActivated.addListener(function(tab){
    chrome.tabs.get(tab.tabId, function(url){
        checkIcon(url.url)
    });
});

chrome.tabs.onCreated.addListener(function(tab){
    checkIcon(tab.url)
});

setIconGrey()
