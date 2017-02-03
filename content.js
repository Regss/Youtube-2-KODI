if (!document.getElementById("kodi")) {
    var inject = document.getElementById("watch7-subscription-container");
    var queueURL = browser.runtime.getURL("icons/content_queue_icon.png");
    var playURL = browser.runtime.getURL("icons/content_play_icon.png");
    inject.innerHTML += "<span id=\"kodi\"><img id=\"b_play\" class=\"kodi_button\" src=\"" + playURL + "\" alt=\"Play\" title=\"Play\"><img id=\"b_queue\" class=\"kodi_button\" src=\"" + queueURL + "\" alt=\"Queue\" title=\"Queue\"></span>";
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("kodi_button")) {
        browser.runtime.sendMessage({"selectedId": e.target.id});
    }
});