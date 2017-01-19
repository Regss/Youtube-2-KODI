function saveOptions(e) {
    browser.storage.local.set({
        host: document.querySelector("#host").value.replace("http://", ""),
        port: document.querySelector("#port").value,
        user: document.querySelector("#user").value,
        pass: document.querySelector("#pass").value
    });
}

function restoreOptions() {
    var getting = browser.storage.local.get(null, function(result){
        document.querySelector("#host").value = result.host || '';
        document.querySelector("#port").value = result.port || '';
        document.querySelector("#user").value = result.user || '';
        document.querySelector("#pass").value = result.pass || '';
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);