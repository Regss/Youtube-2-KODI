
function getURLfromTab() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        var currentTabURL = tabs[0].url;
        if (currentTabURL.match("youtube.com")) parseYoutubeURL(currentTabURL);
        else notify("You must be on youtube site");
    });
}

function parseYoutubeURL(url) {

    var data = {  };
    data['order'] = 'default';
    data['play'] = '1';
    
    var matchVideo = url.match("v=([A-Za-z0-9_-]{11})");
    var matchList = url.match("list=([A-Za-z0-9_-]{34})");
    
    if (matchVideo && matchVideo.length > 1) {
        data['video_id'] = matchVideo[1];
    }
    if (matchList && matchList.length > 1) {
        data['playlist_id'] = matchList[1];
    }
    
    if (!matchList && !matchList) {
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
    xhr.open("GET", "http://" + hostData.user + ":" + hostData.pass + "@" + hostData.host + ":" + hostData.port + "/jsonrpc?request=" + JSON.stringify(get), true);
    xhr.timeout = 5000;
    xhr.onreadystatechange = function (aEvt) {
        if (xhr.readyState == 4) {
            if(xhr.status == 200) {
                var resp = xhr.responseText;
                parseJSON(resp);
            } else {
                console.log("Error Sending request to KODI");
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

chrome.browserAction.onClicked.addListener(getURLfromTab);
