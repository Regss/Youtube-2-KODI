var show = 0;

document.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("button")) {
        buttonPressed(e);
    }
    
    if (e.target.classList.contains("button")) {
        browser.runtime.sendMessage({"selectedId": e.target.id});
    }
});

document.addEventListener("mousemove", (e) => {
    if (e.target.classList.contains("button")) {
        tooltipShow(e);
    }
});

document.addEventListener("mouseup", (e) => {
    if (e.target.classList.contains("button")) {
        buttonRelase(e);
    }
});

document.addEventListener("mouseout", (e) => {
    if (e.target.classList.contains("button")) {
        buttonRelase(e);
        tooltipHide();
    }
});

function buttonPressed(e) {
    e.target.style.width = "22px";
    e.target.style.height = "22px";
    e.target.style.margin = "1px";
}

function buttonRelase(e) {
    e.target.style.width = "24px";
    e.target.style.height = "24px";
    e.target.style.margin = "0px";
}

function tooltipShow (e) {
    var x = e.clientX;
    var y = e.clientY;
    var tooltip = document.getElementById("tooltip");
    tooltip.innerHTML = e.target.title;
    tooltip.style.top = (y + 20) + 'px';
    tooltip.style.left = (x - 10) + 'px';
    show = 1;
    setTimeout(function(){
        if (show == 1) {
            tooltip.style.display = "block";
        }
    }, 2000);
}

function tooltipHide() {
    show = 0;
    var tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
    tooltip.innerHTML = "";
}