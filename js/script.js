//
// Initializing viewport list
//
const viewportClass = ".viewport";
const viewportID = "viewport";
var viewportList = [];
var mostVisible = "undefined";
var mostVisiblePrec = "undefined";
var vid = document.getElementById("vid-original");

// Viewport procedural generation
$(viewportClass).each(function (i, obj) {
    var id = viewportID + i;
    viewportList.push(id);
    $(this).attr('id', id);

    $(this).css("height", $(window.top).height());

    if (i != 4) {
        $($(this).find("video")).each(function (j, obj) {
            var vidId = $(this).attr("id");
            $(this).attr("id", "vid-" + id);
        });
    }

    $($(this).find(".button")).each(function (j, obj) {
        var btnId = $(this).attr("id");
        $(this).attr("id", id + "-" + btnId);
    });

    $($(this).find(".tab")).each(function (j, obj) {
        var btnId = $(this).attr("id");
        $(this).attr("id", id + "-" + btnId);
    });

    // navbar generation
    if ((i > 1) && (i < 11 + 1)) {
        var mainNode = document.createElement("div");
        var pNode = document.createElement("p");
        var textNode = document.createTextNode(("0" + (i - 1)).slice(-2) + ".");

        mainNode.setAttribute("class", "left-navbar-element");
        mainNode.setAttribute("id", "left-navbar-element-" + id);
        mainNode.setAttribute("onClick", "goToVieweport(" + i + ");");

        pNode.appendChild(textNode);
        mainNode.appendChild(pNode);

        document.getElementById("left-navbar").appendChild(mainNode);
    }
});

// language bar generation

localizationLabels = [
    ["en_UK", "English"],
    ["it_IT", "Italiano"],
    ["es_ES", "Español"],
    ["fr_FR", "Français"],
    ["de_DE", "Deutsche"],
    ["sv_SV", "Svenska"],
    ["sl_SL", "Slovenian"],
    ["lt_LT", "Lithuanian"]
]

// current page language identification
var pageLanguage = 0;

for (i = 0; i < i < localizationLabels.length; i++) {
    if ($("html").attr("lang") === localizationLabels[i][0]) {
        pageLanguage = i;
        break;
    }
}
console.log("pageLanguage = " + localizationLabels[pageLanguage][1]);


// language selector
var languageBar = document.getElementById("language-bar");
var dropdownMenu = document.getElementById("custom-dropdown-menu");

for (currentLocalization = 0; currentLocalization < localizationLabels.length; currentLocalization++) {

    // language-bar generation
    var languageBarNode = document.createElement("div");
    var aNode = document.createElement("a");
    var textNode = document.createTextNode(localizationLabels[currentLocalization][1]);

    languageBarNode.setAttribute("class", "language-bar-node");
    languageBarNode.setAttribute("id", localizationLabels[currentLocalization][0]);
    if (pageLanguage != currentLocalization) {
        aNode.setAttribute("href", "index-" + localizationLabels[currentLocalization][0] + ".html");
    } else {
        languageBarNode.classList.add("language-selected");
    }

    aNode.appendChild(textNode);
    languageBarNode.appendChild(aNode);
    languageBar.append(languageBarNode);

    // dropdown-menu generation
    if (pageLanguage != currentLocalization) {
        var dropdownMenuNodeLink = document.createElement("a");
        var dropdownMenuNode = document.createElement("div");
        aNode = document.createElement("a");
        textNode = document.createTextNode(localizationLabels[currentLocalization][1]);

        
        dropdownMenuNode.setAttribute("class", "dropdown-menu-node");
        dropdownMenuNode.setAttribute("id", localizationLabels[currentLocalization][0]);
        if (currentLocalization != 0) {
            dropdownMenuNodeLink.setAttribute("href", "index-" + localizationLabels[currentLocalization][0] + ".html");
            aNode.setAttribute("href", "index-" + localizationLabels[currentLocalization][0] + ".html");
        } else {
            dropdownMenuNodeLink.setAttribute("href", "index.html");
            aNode.setAttribute("href", "index.html");
        }


        aNode.appendChild(textNode);
        dropdownMenuNode.appendChild(aNode);
        dropdownMenuNodeLink.append(dropdownMenuNode);
        dropdownMenu.appendChild(dropdownMenuNodeLink);

    } else {
        textNode = document.createTextNode("Language: " + localizationLabels[pageLanguage][1]);
        document.getElementById("current-language").appendChild(textNode);
    }
}

$(".current-language").click(function () {
    $(".custom-dropdown-menu").toggleClass("dropdown-menu-open");
    console.log("click");
});

for (i = 0; i < localizationLabels.length; i++) {
    if ($("html").attr("lang") === localizationLabels[i][0]) {
        // Applying style to current language
        $(".language-bar-element." + localizationLabels[i][0]).attr('id', 'langauge-selected');

        // qr-code href geneartion
        $(".qr-code").attr("src", "./res/img/qr-" + localizationLabels[i][0] + ".png");
    }
}

$(".scroll-down-arrow").attr("onClick", "goToVieweport(1);");

var currentViewportPos = 0;
var currentViewport = viewportList[0];

viewport = {
    targetInternal: viewportList[0],
    targetListener: function (val) { },
    set target(val) {
        this.targetInternal = val;
        this.targetListener(val);
    },
    get target() {
        return this.targetInternal;
    },
    registerListener: function (listener) {
        this.targetListener = listener;
    }
}

viewport.registerListener(function (val) {
    scroll_To(val);
    console.log("New target: " + val);
});

$(".left-navbar").css("left", "-50px")
goToVieweport(getCurrentViewportPos());
currentViewportPos = getCurrentViewportPos();
scroll_To("#" + viewportList[getCurrentViewportPos()]);

$(".home-button").on('click', function (event) {
    goToVieweport(0);

    $(".home-button-text").css("max-width", "500px");
    $(".home-button-text").css("padding-left", "24px");
    $(".home-button-text").css("padding-right", "48px");
    setTimeout(function () {
        $(".home-button-text").css("max-width", "0px");
        $(".home-button-text").css("padding-left", "0px");
        $(".home-button-text").css("padding-right", "0px");
        setTimeout(function () {
            $(".home-button").css("min-width", "0px");
            $(".home-button").css("height", "0px");
            $(".home-button").css("bottom", "24px");
            $(".home-button").css("right", "24px");
        }, 750);
    }, 750);
});


//
// On scroll update
//

$(window).scroll(function () {

    currentViewportPos = getCurrentViewportPos();
    updateViewportSize();

});

function getCurrentViewportPos() {
    var currentElement = 0;
    var currentElementPos = 0;

    $(viewportClass).each(function (i, obj) {
        var element = elementVisibility(viewportClass, "#" + viewportList[i]);

        if (currentElement < element) {
            currentElement = element;
            currentViewport = viewportList[i];
            //currentViewportPos = i;
            currentElementPos = i;
        }
    });

    console.log(currentViewport + " is visible!");

    mostVisiblePrec = currentViewport;
    return currentElementPos;
}

//
// Helpers
//
function elementVisibility(elementClass, elementId) {

    class Element {
        constructor(top, bottom) {
            this.top = top;
            this.bottom = bottom;
            this.height = bottom - top;
        }
    }

    var element = new Element($(elementClass + elementId).offset().top,
        $(elementClass + elementId).offset().top + $(elementClass + elementId).outerHeight());
    var screen = new Element($(window).scrollTop(), $(window).scrollTop() + $(window).innerHeight());


    if ((element.bottom < screen.top) || (element.top > screen.bottom)) {
        return 0;
    }

    if (element.top <= screen.top) {
        return (1 / screen.height) * (element.bottom - screen.top);
    }

    if (element.bottom <= screen.bottom) {
        return (screen.bottom - element.top)
    } else {
        return (1 / screen.height) * (screen.bottom - element.top);
    }

}

var page = $("html, body");

function scroll_To(id) {
    console.log("Scrolling to: " + id);

    var vid;

    for (var i = 0; i < viewportList.length; i++) {
        vid = document.getElementById("vid-" + viewportList[i]);
        if (vid != null)
            vid.muted = true;
    }

    //page.stop();
    $('html,body').animate({
        scrollTop: $(id).offset().top
    }, 400, function () {
        //page.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
    });

    for (var i = 0; i < viewportList.length; i++) {
        $(".left-navbar-element#left-navbar-element-" + viewportList[i]).removeClass("left-navbar-element-selected");
    }
    $(".left-navbar-element#left-navbar-element-" + viewport.target.substring(1, viewport.target.length)).addClass("left-navbar-element-selected");

    vid = document.getElementById("vid-" + id.substring(1, id.length));
    console.log("Unmuted video: " + id);
    if (vid != null) {
        vid.muted = false;
        vid.play();
    }

    if (currentViewportPos != 0) {
        $(".home-button").css("min-width", "48px");
        $(".home-button").css("height", "48px");
        $(".home-button").css("bottom", "0px");
        $(".home-button").css("right", "0px");
    } else {
        $(".home-button").css("min-width", "0px");
        $(".home-button").css("height", "0px");
        $(".home-button").css("bottom", "24px");
        $(".home-button").css("right", "24px");
    }
}

page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function () {
    //page.stop();
});

var isScrolling = false;
var scrollValuePrec = 0;
var scrollValue = 0;

window.addEventListener("wheel", event => {

    if (scrollValue == 0) {

        if (event.deltaY > 0) {
            // Increase current page
            if (currentViewportPos < viewportList.length - 1) {
                currentViewportPos++;
            }
        } else {
            // Decrease current page
            if (currentViewportPos > 0) {
                currentViewportPos--;
            }
        }
        goToVieweport(currentViewportPos);
        scrollValue = event.deltaY;
    }

    scrollValuePrec = event.deltaY;
    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);

    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function () {
        // Run the callback
        console.log(event.deltaY + ' Scrolling has stopped.');
        scrollValue = 0;
        scrollValuePrec = 0;

    }, 250);
}, false);


var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    document.addEventListener('wheel', preventDefault, { passive: false }); // Disable scrolling in Chrome
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    document.removeEventListener('wheel', preventDefault, { passive: false }); // Enable scrolling in Chrome
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

document.addEventListener('wheel', preventDefault, { passive: false });

$(".button").click(function () {
    //alert("click on " + $(this).attr("class") + " " + $(this).attr("id"));


    var currentViewport;
    for (var i = 0; i < viewportList.length; i++) {
        if ($(this).attr("id").includes(viewportList[i])) {
            currentViewport = viewportList[i];
        }
    }

    var type = ($(this).attr("id").substring(currentViewport.length, $(this).attr("id").length));

    console.log(currentViewport + "; " + type);

    var currentTime;

    $("#" + currentViewport).each(function (i, obj) {
        $($(this).find(".button")).each(function (j, obj) {
            $(this).removeClass("button-selected");

            $(".tab#" + $(this).attr("id")).hide();
        });

        $($(this).find("video")).each(function (j, obj) {
            console.log($(this).attr("id"));
            if ($(this).attr("id") != undefined) {

                if ($(this).attr("id").includes("vid-")) {

                    if (!($(this).attr("id").includes("vid-viewport"))) {

                        var type = $(this).attr("id").substring(3, $(this).attr("id").length);

                        console.log($("#vid-" + type.substring(1, type.length)).css("display"));
                        if ($("#vid-" + type.substring(1, type.length)).css('display').toLowerCase() !== 'none') {
                            $("#vid-" + type.substring(1, type.length)).hide();
                            console.log("----> hiding: " + type);
                            // console.log("#vid-" + type.substring(1, type.length) + " is now hidden");
                            currentTime = vid.currentTime;

                        }

                    }
                }
            }
        });
    });

    for (var i = 0; i < viewportList.length; i++) {
        if ($(this).attr("id") === viewportList[i] + type) {
            $(this).addClass("button-selected");
            $(".tab#" + viewportList[i] + type).show();
            //$("#vid-" + type.substring(1, type.length)).show();
            console.log("000000: showing: " + type);
            if ($(this).attr("class").includes("process")) {
                vid = document.getElementById("vid-" + type.substring(1, type.length));
                vid.currentTime = currentTime;
                console.log(currentTime);

                $("#vid-" + type.substring(1, type.length)).show();
            } else {
                console.log("vid not included");
            }



        }
    }


    // for (var i = 0; i < viewportList.length; i++) {
    //     if ($(this).attr("id") === viewportList[i] + "-tech") {
    //         $(this).addClass("button-selected");
    //         $(".button#" + viewportList[i] + "-visual").removeClass("button-selected");
    //         $(".tab#" + viewportList[i] + "-tech").show();
    //         $(".tab#" + viewportList[i] + "-visual").hide();
    //     } else if ($(this).attr("id") === viewportList[i] + "-visual"){
    //         $(this).addClass("button-selected");
    //         $(".button#" + viewportList[i] + "-tech").removeClass("button-selected");
    //         $(".tab#" + viewportList[i] + "-tech").hide();
    //         $(".tab#" + viewportList[i] + "-visual").show();
    //     }
    // }

})

// TOUCH HANDLER
document.addEventListener('touchstart', handleTouchStart, false); //bind & fire - evento di inizio tocco
document.addEventListener('touchmove', handleTouchMove, false); // bind & fire - evento di movimento durante il tocco
document.addEventListener('touchend', handleTouchEnd, false);

var xDown = null;
var yDown = null;
var scrollPos = 0;

var initialY = 0;
var currentY = 0;
var distance = 0;

var timeTouchStart = 0;
var timeTouchEnd = 0;

function handleTouchStart(event) {
    currentViewportPos = getCurrentViewportPos();
    timeTouchStart = Date.now();
    xDown = event.touches[0].clientX;
    yDown = event.touches[0].clientY;
    scrollPos = document.documentElement.scrollTop;
    initialY = 0;
    currentY = 0;
    distance = 0;
};



function handleTouchMove(event) {

    distance = initialY - currentY;
    currentY = event.touches[0].clientY;
    window.scrollTo(0, scrollPos + distance);

    if (!xDown || !yDown) {
        return;
    } //nessun movimento


    initialY = event.touches[0].clientY;
    //scrollPos = document.documentElement.scrollTop;

    var xUp = event.touches[0].clientX;
    var yUp = event.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    //window.scrollTo(top, left);


    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*Trovo quello più significativo sulle assi X e Y*/
        if (xDiff > 0) {
            /* swipe sinistra */
            console.log("Swipe sx");
        } else {
            /* swipe destra */
            console.log("Swipe dx");
        }//right
    } else {
        if (distance > 0 || distance < 0) {
            if (yDiff > 0) {
                /* swipe alto */
                console.log("Swipe up");
                if (currentViewportPos < viewportList.length - 1) {
                    currentViewportPos++;
                }
            } else {
                /* swipe basso */
                console.log("Swipe down");
                if (currentViewportPos > 0) {
                    currentViewportPos--;
                }
            }
        }
    }

    /* reset values */
    xDown = null;
    yDown = null;
};

function handleTouchEnd(event) {

    timeTouchEnd = Date.now();

    var scrollThreshold = .25;
    var velocityThreshold = 0.2;
    var velocity = distance / (timeTouchEnd - timeTouchStart);

    //console.log("Touch scroll speed: " + velocity);

    var normalizedDist = distance / window.innerHeight;

    if ((normalizedDist > scrollThreshold) || (velocity > velocityThreshold)) {
        if (currentViewportPos < viewportList.length - 1) {
            currentViewportPos++;
        }
    }

    if ((normalizedDist < -(scrollThreshold)) || (velocity < -velocityThreshold)) {
        if (currentViewportPos > 0) {
            currentViewportPos--;
        }
    }

    goToVieweport(currentViewportPos);
}

function goToVieweport(index) {
    viewport.target = "#" + viewportList[index];

    if ((index < 2) || (index == viewportList.length - 1)) {
        setTimeout(function () {
            $(".left-navbar").css("left", "-50px");
        }, 500);
    } else {
        setTimeout(function () {
            $(".left-navbar").css("left", "0px");
        }, 250);
    }

}

var keys = {};
window.addEventListener("keydown",
    function (e) {
        var currentViewport = getCurrentViewportPos();

        keys[e.keyCode] = true;
        switch (e.keyCode) {
            case 37: case 39: case 38: case 40: // Arrow keys
                {
                    if (e.keyCode == 38) {
                        if (currentViewport > 0) {
                            currentViewport--;
                        } else {
                            currentViewport == 0;
                        }
                        goToVieweport(currentViewport)
                    }
                    if (e.keyCode == 40) {
                        console.log("LOL");
                        if (currentViewport < viewportList.length - 1) {
                            currentViewport++;
                        } else {
                            currentViewport == viewportList.length - 1;
                        }
                        goToVieweport(currentViewport)
                    }
                    break;
                }
            case 32: e.preventDefault(); break; // Space
            default: break; // do not block other keys
        }
    },
    false);
window.addEventListener('keyup',
    function (e) {
        keys[e.keyCode] = false;
    },
    false);

var idleTime = 0;

var inactivityTime = function () {
    var time;
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onmousemove = resetTimer;
    document.onmousedown = resetTimer; // touchscreen presses
    document.ontouchstart = resetTimer;
    document.onclick = resetTimer;     // touchpad clicks
    document.onkeypress = resetTimer;
    document.addEventListener('scroll', resetTimer, true); // improved; see comments 

    function runHome() {
        if (currentViewportPos != 0) {
            $(".home-button").click();
            resetTimer;
        }

        // alert("You are now logged out.")

    }

    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(runHome, 600000)
    }
};

window.onload = function () {
    inactivityTime();
}

// resolution debug on screen log
var div = document.getElementById('res-log');
if (div != null) {
    div.innerHTML = window.innerWidth + " x " + window.innerHeight;
}

// real viewport size change detector
function updateViewportSize(){
  
    if (div != null)
        div.innerHTML = window.innerWidth + " x " + window.innerHeight;

    $(viewportClass).each(function (i, obj) {
        $(this).css("height", $(window.top).height());
    });
    $('html, body').animate({
        scrollTop: $('#viewport' + currentViewportPos).offset().top
    }, 0)
    console.log("resized");
}
window.addEventListener("resize", updateViewportSize);
updateViewportSize();