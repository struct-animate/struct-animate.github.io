/*jslint browser: true, devel: true, vars: true*/
/*global jQuery, LIB*/

/*
UI = {customMenu, inputMenu, init}
    requires jQuery, jQuery UI, jQuery fullscreen and LIB
*/
var UI = (function ($) {
    "use strict";
    var UI = LIB.Observable(),
        Q = null,
        affComment = true;
/*
customMenu: function (conf, s) -> obj

    conf = {button, onshow, onhide, content}
        button = DOM Object | jQuery Object
        onshow = function | undefined
        onhide = function | undefined
        content = html String | DOM Object | jQuery Object | undefined
    
    obj = {hideAll, show, menu} | none
        hideAll = function
        show = function
        $menu = jQuery Object
        
    after constraction `s` will contain:
        $button = jQuery object
        $all = jQuery object
        $menu = jQuery object
        onhide = function | undefined
        onshow = function | undefined
        content = html String | jQuery Object
*/
    var hideCurrentMenu = function () {};
    
    function customMenu(conf, s) {
        s = s || {};
        if (!conf.button) {
            return;
        }
        
        s.$all = $('<div><div class="fix-position">' +
                        '<div class="custom-menu-menu">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="custom-menu-t">' +
                            '<polygon points="0,15 15,0 30,15" style="fill:white;stroke:rgba(126, 126, 126, 0.5);stroke-width:1"\/>' +
                            '<line x1="-1" y1="15" x2="31" y2="15" style="stroke:white;stroke-width:2"\/><\/svg>' +
                        '<\/div>' +
                    '<\/div><\/div>');
        
        s.$button = $(conf.button);
        s.$menu = s.$all.find(".custom-menu-menu");
        s.onhide = conf.onhide;
        s.onshow = conf.onshow;
        s.content = conf.content ? $(conf.content) : "";
        
        
        var $menu = s.$menu,
            $fixPosition = s.$all.find(".fix-position"),
            $triangle = s.$all.find(".custom-menu-t"),
            padding = 7,
            buttonHeight = 22;
        
// all
        s.$all.css({position: "relative"});
        
// triangle of height 15px and width 30px
        $triangle
            .css({
                width: "32px",
                height: "16px",
                position: "absolute",
                top: "-14px",
                left: padding + "px"// padding
            });
        
    // style menu
        $fixPosition.css({position: "absolute"});
        $menu
            .css({
                display: "none",
                position: "absolute",
                top: "15px",
                zIndex: "100",
                background: "#fff",
                borderRadius: "5px",
                border: "solid 1px rgba(126, 126, 126, 0.5)",
                padding: padding + "px"
            });
        
// link them all
        s.$all.appendTo(s.$button.parent());
        s.$button.prependTo(s.$all);
        s.$menu.append(s.content);
        
// callbacks
        
        function hide() {
            s.$menu.css({display: "none"});
            
            if (typeof s.onhide === "function") {
                s.onhide();
            }
            $(window).unbind("click", hideCurrentMenu);
            hideCurrentMenu = function () {};
        }
        
        function show(event) {
            hideCurrentMenu();
            
            hideCurrentMenu = hide;
            
            s.$menu.css({display: "block"});
            
            $(window).bind("click", hideCurrentMenu);
            
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            
            if (typeof s.onshow === "function") {
                s.onshow();
            }
        }
        
        /*s.show = show;
        s.hide = hide;*/
        
        s.$button.bind("click", show);
        s.$menu.bind("click", function (event) {
            event.stopPropagation();
        });
        
        return {
            show: show,
            hideAll: function () { hideCurrentMenu(); },
            $menu: s.$menu
        };
    }

/*
inputMenu: function (conf, s) -> obj

    conf = {button, onshow, onhide, onok, oncancel, content}
        button = DOM Object | jQuery Object
        content = html String | DOM Object | jQuery Object | undefined
        autoClear = boolean
        defaultValue = string
        
        onshow = function | undefined
        onhide = function | undefined
        onok = function | undefined
    
    obj = {hideAll, show, menu} | none
        hideAll = function
        show = function
        $menu = jQuery Object
        $input = jQuery Object
        
    after constraction `s` will contain:
        $button = jQuery object
        $all = jQuery object
        $menu = jQuery object
        onhide = function | undefined
        onshow = function | undefined
        onok = function | undefined
        content = html String | jQuery Object
        defaultValue = string
*/
    function inputMenu(conf, s) {
        s = s || {};
        var self,
            superOnshow,
            superOnhide,
            placeholder = (conf && conf.text !== undefined) ? conf.text : "",
            width = (conf && conf.width !== undefined) ? conf.width : "auto";
        
        self = customMenu(conf, s);
        if (!self) {
            return;
        }
        
        s.$menu.append('<table><tr>' +
                            '<td><input type="text" value="" placeholder="' + placeholder + '" ' +
                            'style="width: ' + width + '" \/><\/td>' +
                            '<td><button class="ok">Ok<\/button><\/td>' +
                            '<td><button class="cancel">Annuler<\/button><\/td>' +
                        '<\/tr><\/table>');
        
        s.onok = conf.onok;
        
    // redefine onshow to focus the input
        superOnshow = s.onshow;
        if (typeof superOnshow === "function") {
            s.onshow = function (event) {
                var input = s.$input[0];
                input.clear();
                input.focus();
                
                return superOnshow(event);
            };
        } else {
            s.onshow = function (event) {
                if (conf.autoClear) {
                    s.$input.val(s.defaultValue);
                }
                var input = s.$input[0];
                input.focus();
                input.select();
            };
        }
        
        s.$input =  s.$all.find("input");
        s.$ok =     s.$all.find(".ok").button();
        s.$cancel = s.$all.find(".cancel").button();
        
        function okClicked(event) {
            var onok = s.onok;
            if (typeof onok === "function") {
                onok(s.$input.val());
            }
            hideCurrentMenu();
        }
        
    // callbacks
        s.$ok.bind("click", okClicked);
        s.$input.bind("keyup", function (event) {
            if (event.which === 13) {// ENTER
                okClicked();
            }
            //console.log(event.which);
        });
        s.$cancel.bind("click", function () { hideCurrentMenu(); });
        
        self.input = s.$input;
        
        return self;
    }
    
//init: function ({queue}) -> boolean
//  Note:
//    ui is Observable
//  extend UI with these methods:
//    zoomIn = function ()
//    zoomOut = function ()
//    zoom = function (number)
//    zoomAuto = function ()
//    selectToolbar: function (number)
//    selectAlgo: function (number)
//    outputHeight: function (undefined | number) -> number
//    outputWidth: function (undefined | number) -> number
//    viewAlgo: function (boolean)
//    notify: function (string, time, waitTime)
    
    function init(conf) {
        
        if (!conf || !conf.queue) {
            throw new Error("a queue please!");
        }
        
        Q = conf.queue;
        
        var css = LIB.css,// css3 prefixing (transform...)
            
            $window = $(window),
            $ui = $("#ui"),
            
            $top = $("#top"),
            
            $titlebar = $("#titlebar"),
            $navMenu = $("#nav-menu"),
            
            $toolbar = $("#toolbar"),
            $toolbars = $toolbar.children().not("#ctrls"),
            
            $ctrls = $("#ctrls"),
            $fullscreen = $("#fullscreen"),
            $zoom = $("#zoom"),
            $zoomP = $("#zoom-p"),
            $zoomM = $("#zoom-m"),
            $zoomReset = $("#zoom-reset"),
            
            $affAide = $("#aff-aide"),
            $aide = $("#aide"),
            
            $affOptions = $("#aff-options"),
            $options = $("#options"),
            
            $animationCtrls = $("#animation-ctrls"),
            
            $affCtrls = $("#aff-ctrls"),
            $controls = $("#controls"),
            $affAlgo = $("#aff-algo"),
            $affComment = $("#aff-comment"),
            $pause = $("#pause"),
            $vitesse = $("#vitesse"),
            $valVitesse = $("#val-vitesse"),
            $ctrlsOk = $("#ctrls-ok"),
            
            $bottom = $("#bottom"),
            $bottomLeft = $("#bottom-left"),
            $output = $("#output"),
            $algos = $("#algos"),
            $algo = $("#algo"),
            $affCacherAlgo = $("#aff-cacher-algo"),
            
            toolbarHeight = 80,
            algoWidth = 300,
            defaultNotificationTime = 1000;
        
        var isPaused = false;
        
        // gestion de la pause
        $pause.bind("click", function buttonPausePressed(event) {
            if (isPaused) {
                Q.launch();
                isPaused = false;
                $(this).button({icons: { primary: "ui-icon-pause"}, label: "pause"});
            } else {
                Q.pause();
                isPaused = true;
                $(this).button({icons: { primary: "ui-icon-play"}, label: "play"});
            }
        });
        
        // gestion de la vitesse
        function sliderValueToSpeed(value) {
            value -= 50;
            if (value < 0) {
                value = 1 + value / 50 * 0.89;
            } else {
                value = 1 + value / 50 * 9;
            }
            return value;
        }
        
        function speedToSliderValue(speed) {
            var value = speed - 1;
            if (value < 0) {
                value = value * 50 / 0.89 + 50;
            } else {
                value = value * 50 / 9 + 50;
            }
            return value;
        }
        
        function outputPos() {
            var scale = $output.data("scale"),
                top = (($bottomLeft.height() - ($output.height() * scale)) / 2),
                left = (($bottomLeft.width() - ($output.width() * scale)) / 2);
            
            top = top > 0 ? top + "px" : "0";
            left = left > 0 ? left + "px" : "0";
            
            css($output[0], {
                transform: "translate(" + left + "," + top + ") scale(" + scale + ")",
                transition: "transform 1s",
                // prefixed
                WebkitTransition: "-webkit-transform 1s",
                MozTransition: "-moz-transform 1s",
                MsTransition: "-ms-transform 1s",
                OTransition: "-o-transform 1s"
            });
            
            if (typeof $output.data("resize-output") === "function") {
                $output.data("resize-output")();
            }
        }
        
        function zoomAutoEvent() {
            var bottomLeftHeight = $bottomLeft.height(),
                bottomLeftWidth = $bottomLeft.width(),
                outputHeight = $output.height(),
                outputWidth = $output.width(),
                scaleH = bottomLeftHeight / outputHeight,
                scaleW = bottomLeftWidth / outputWidth,
                scale = scaleH > scaleW ? scaleW : scaleH;
            
            if (scale !== $output.data("scale")) {
                $output.data("scale", scale);
                outputPos();
            }
        }
        
        function zoomAuto(activate) {
            if (activate) {
                zoomAutoEvent();
                $window.bind("resize", zoomAutoEvent);
                $output.data("resize-output", zoomAutoEvent);
            } else {
                $window.unbind("resize", zoomAutoEvent);
                $output.data("resize-output", "Nothing");
            }
        }
        
        function zoomIn() {
            var scale = $output.data("scale");
            if (scale <= 10) {
                $output.data("scale", scale + 0.1);
            }
            zoomAuto(false);
            outputPos();
        }
        
        function zoomOut() {
            var scale = $output.data("scale");
            if (scale > 0.1) {
                $output.data("scale", scale - 0.1);
            }
            zoomAuto(false);
            outputPos();
        }
        
        function zoom(scale) {
            if (typeof scale === "number" && !isNaN(scale)) {
                zoomAuto(false);
                $output.data("scale", scale);
                outputPos();
            } else {
                return $output.data("scale");
            }
        }
        
        function selectToolbar(n) {
            $($toolbars.hide()[n]).show();
        }
        
        function selectAlgo(n) {
            $algos.accordion({active: n});
        }
        
        function outputHeight(h) {
            if (h !== undefined) {
                $output.height(h);
                outputPos();
            }
            return $output.height();
        }
        
        function outputWidth(w) {
            if (w !== undefined) {
                $output.width(w);
                outputPos();
            }
            return $output.width(w);
        }
        
        function viewAlgo(b) {
            if (b) {
                UI.fire("aff-algo");
            } else {
                UI.fire("cacher-algo");
            }
        }
        
// notify 
        function notify(msg, notifTime, waitTime) {
            notifTime = notifTime !== undefined ? notifTime : defaultNotificationTime;
            waitTime = waitTime !== undefined ? waitTime : notifTime;
            
            var $div = $("<div />"),
                timeout = null,
                finishTime,
                timeToFinish,
                finish;
            
            function show() { $div.css({ display: "block" }); }
            function hide() { $div.css({ display: "none" }); }
            
            function pause() {
                clearTimeout(timeout);
                timeToFinish = finishTime - Date.now();
            }
            
            function launch() {
                timeout = setTimeout(finish, timeToFinish);
                finishTime = Date.now() + timeToFinish;
            }
            
            finish = function () {
                $div.hide({
                    direction: "down",
                    duration: 500
                }, function () {
                    $(this).remove();
                });
                
                Q.unbind("pause", pause);
                Q.unbind("launch", launch);
                
                UI.unbind("aff-comment", show);
                UI.unbind("cacher-comment", hide);
            };
            
            function start(vitesse) {
                $div.appendTo($("body"))
                    .text(msg)
                    .css({
                        width: "800px",
                        height: "50px",
                        border: "2px groove gray",
                        textAlign: "center",
                        lineHeight: "50px",
                        position: "fixed",
                        zIndex: "1000",
                        bottom: "0px",
                        left: (($("body").width() - 800) / 2) + "px"
                    })
                    .addClass("ui-state-default ui-corner-top")
                    .show({
                        effect: "blind"
                    });
                
                timeout = setTimeout(finish, notifTime);
                finishTime = Date.now() + notifTime;
                
                UI.bind("aff-comment", show);
                UI.bind("cacher-comment", hide);
                
                if (affComment) {
                    show();
                } else {
                    hide();
                }
            }
            
            Q.bind("pause", pause);
            Q.bind("launch", launch);
            
            Q.enQueue(start, waitTime);
        }
        
    //afficher l'interface
        $ui.css("display", "block");
        
    // body
        $("body").css("margin", "0", "background", "#FFF");
        
    // ui
        $ui.css({ position: "absolute", top: "0", left: "0" })
            .height(window.innerHeight)
            .width(window.innerWidth);
        
        $window.bind("resize", function () {
            var h, w;
            h = window.innerHeight;
            w = window.innerWidth;
            $ui.height(h).width(w);
        });
    // top
        $top.css({
            position: "relative",
            zIndex: "100",
            height: (toolbarHeight - 1) + "px",// 1 for borderButtom
            borderBottom: "solid 1px #c8c8c8",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
            background: "#FFF"
        });
        
    // title-bar
        $titlebar
            .height("2em")
            .css({ lineHeight: "2em", fontSize: "1.3em", textAlign: "center" });
        
        $navMenu
            .css({
                position: "absolute",
                right: "7px",
                top: "7px"
            });
    // toolbar
        $toolbar.css({
            padding: "0 7px",
            fontSize: "0.8em",
            position: "relative"
        });
        
        selectToolbar(1);// main toolbar
        
    // animation-ctrls
        $animationCtrls.css({display: "none"});
    // ctrls
        $ctrls.css({ position: "absolute", right: "7px" });
        
        $affAide.button({ text: false, icons: { primary: "ui-icon-help"} })
            .bind("click", function (event) {
			$aide.dialog({height:850,width:1040});
			
                $aide.dialog("open");
            });
        
        $fullscreen.button({ text: false, icons: { primary: "ui-icon-arrow-4-diag"} })
            .bind("click", function (event) {
                $(document).toggleFullScreen();
            });
        
        $zoom.buttonset().css({ display: "inline" });
        $zoomP
            .button({ text: false, icons: { primary: "ui-icon-zoomin"} })
            .bind("click", zoomIn);
        $zoomM
            .button({ text: false, icons: { primary: "ui-icon-zoomout"} })
            .bind("click", zoomOut);
        $zoomReset
            .button({icons: { primary: null, secondary: null }})
            .bind("click", function () { zoom(1); });
        $affOptions
            .button({ icons: { primary: "ui-icon-gear"} })
            .bind("click", function (event) {
                $options.dialog("open");
            });
        
    /*
    controls
    */
        
        $controls.find("table").css({ margin: "0", padding: "0", border: "none" });
        
        UI.bind("aff-algo", function () {
            $algo.animate({ width: algoWidth + "px", right: "0" });
            $bottomLeft.animate({ width: ($bottom.width() - algoWidth - 10) + "px" }, function () {
                outputPos();
            });
            $affAlgo.prop("checked", true).button("refresh");
        });
        
        UI.bind("cacher-algo", function () {
            $algo.animate({ width: "1px", right: "0" });
            $bottomLeft.animate({ width: ($bottom.width() - 10) + "px" }, function () {
                outputPos();
            });
            $affAlgo.prop("checked", false).button("refresh");
        });
        
        $affAlgo
            .attr({ checked: true })
            .button({ /*text: false,*/ icons: { primary: "ui-icon-script"} })
            .bind("click", function (event) {
                if (this.checked) {
                    UI.fire("aff-algo");
                } else {
                    UI.fire("cacher-algo");
                }
            });
        
//        UI.bind("cas-particulier", function () {
//            $affAlgo.attr({ checked: true }).button("refresh");
//        });
        
        $affComment
            .button({ /*text: false,*/ icons: { primary: "ui-icon-script"} })
            .bind("click", function (event) {
                if (this.checked) {
                    UI.fire("aff-comment");
                } else {
                    UI.fire("cacher-comment");
                }
            });
        
        UI.bind("aff-comment", function () {
            $affComment.prop("checked", true).button("refresh");
        });
        UI.bind("cacher-comment", function () {
            $affComment.prop("checked", false).button("refresh");
        });
        
        $pause.button({ text: false, icons: { primary: "ui-icon-pause"}, label: "pause" });
        
        $vitesse
            .css({ width: "150px", margin: "0 10px" })
            .slider({
                value: 50,
                change: function (event, ui) {
                    var speed = sliderValueToSpeed(ui.value);
                    $valVitesse.text("vitesse: " + speed.toString().substr(0, 4) + "x");
                    Q.speed(speed);
                }
            });
        
        Q.bind("speed", function (speed) {
            $vitesse.slider("value", speedToSliderValue(speed));
        });
        
        $valVitesse.css({ width: "100px" }).text("vitesse: 1x");
        
        $ctrlsOk
            .button()
            .bind("click", function (event) {
                $controls.hide();
            });
        
    /*
    bottom 
    */
        $bottom.css({
            background: "#f6f6f6",
            position: "relative"
        })
            .height(window.innerHeight - toolbarHeight)
            .width(window.innerWidth);
        
        $window.bind("resize", function () {
            var h = window.innerHeight,
                w = window.innerWidth;
            
            $bottom.height(h - toolbarHeight).width(w);
        });
    /*
    bottomLeft 
    */
        $bottomLeft.css({
            position: "absolute",
            top: "0",
            left: "0",
            overflow: "auto"
        })
            .width(window.innerWidth - algoWidth - 10)
            .height(window.innerHeight - toolbarHeight);
        
        $window.bind("resize", function () {
            var h = window.innerHeight,
                w = window.innerWidth;
            
            $bottomLeft
                .width(w - $algo.width() - 10)
                .height(h - toolbarHeight);
        });
        
    /*
    output
    */
        
        $output.data("scale", 1);
        (function (scale) {
            css($output[0], {
                position: "absolute",
                height: "300px",
                width: "400px",
                transform: "scale(1)",
                transformOrigin: "0 0"
            });
            outputPos();
        }($output.data("scale")));
        
        // on window resize
        $window.bind("resize", outputPos);
        
    /*
        algo
    */
        $algo.width(algoWidth)
            .height(window.innerHeight - toolbarHeight)
            .css({
                position: "absolute",
                top: "0",
                right: "0",
                zIndex: "100",
                overflow: "hidden",
                boxShadow: "0 5px 5px rgba(0, 0, 0, 0.5)",
                padding: "0 0 0 10px",
                background: "#eee"
            }).resizable({
                handles: "w",
                minWidth: 150,
                maxWidth: 500,
                resize: function (event, ui) {
                    algoWidth = ui.size.width;
                    $bottomLeft.width(window.innerWidth - algoWidth - 10);
                    $(this).css({
                        top: "0",
                        left: "",
                        right: "0"
                    });
                    outputPos();
                },
                start: function (event, ui) {
//                    
//                    if (ui.size.width === 1) {
//                        console.log("imad");
//                        UI.fire("cas-particulier");
//                    }
                    
                    $(this).css({
                        top: "0",
                        left: "",
                        right: "0"
                    });
                },
                stop: function () {
                    
                    UI.fire("aff-algo");
                    
                    $(this).css({
                        top: "0",
                        left: "",
                        right: "0"
                    });
                }
            });
        
        $affCacherAlgo.css({
            height: "100%",
            width: "9px",
            position: "absolute",
            top: "0",
            left: "1px",
            cursor: "pointer"
        }).mouseenter(function () {
            $(this).css({
                background: "#c7f6ff"
            });
        }).mouseleave(function () {
            $(this).css({
                background: ""
            });
        }).bind("click", function () {
            if ($algo.width() === 1) {
                UI.fire("aff-algo");
            } else {
                UI.fire("cacher-algo");
            }
        });
        
        $window.bind("resize", function () {
            var h = window.innerHeight;
            $algo.height(h - toolbarHeight);
        });
        
    //algos (accordion)
        $algos
            .find("> *").css({ margin: "0", borderRadius: "0" }).end()
            .find("> div").css({ padding: "10px" });
        
        $algos.accordion({
            heightStyle: "fill"
        });
        
        $window.bind("resize", function () {
            $algos.accordion("refresh");
        });
        
    //aide
        $aide.dialog({
            title: "Aide",
            height: 500,
            width: 800,
            autoOpen: false,
            modal: true
        });
    
    //options
        var $optionsZoomAuto = $("#options-zoom-auto"),
            $optionsAffAlgo = $("#options-aff-algo"),
            //$optionsCacherAlgo = $("options-cacher-algo"),
            $optionsAffComment = $("#options-aff-comment"),
            $optionsVitesse = $("#options-vitesse"),
            $optionsValVitesse = $("#options-val-vitesse"),
            $optionsVitesse1 = $("#options-vitesse-1"),
            currentOptions = null;
        
//        UI.bind("cas-particulier", function () {
//            $optionsAffAlgo.prop("checked", true);
//        });
        
        // aff-algo
        UI.bind("aff-algo", function () {
            $optionsAffAlgo.prop("checked", true);
        });
        UI.bind("cacher-algo", function () {
            $optionsAffAlgo.prop("checked", false);
        });
        // aff-comment
        UI.bind("aff-comment", function () {
            $optionsAffComment.prop("checked", true);
        });
        UI.bind("cacher-comment", function () {
            $optionsAffComment.prop("checked", false);
        });
        
        $optionsVitesse
            .css({ width: "250px", margin: "0 10px" })
            .slider({
                value: 50,
                change: function (event, ui) {
                    $optionsValVitesse.text(sliderValueToSpeed(ui.value).toString().substr(0, 4) + "x");
                }
            });
        
        Q.bind("speed", function (speed) {
            $optionsVitesse.slider("value", speedToSliderValue(speed));
        });
        
        function resetOptions() {
            $optionsZoomAuto.prop("checked", currentOptions.zoomAuto);
            $optionsAffAlgo.prop("checked", currentOptions.affAlgo);
            //$optionsCacherAlgo.prop("checked",  currentOptions.cacherAlgo);
            $optionsAffComment.prop("checked", currentOptions.affComment);
            $optionsVitesse1.prop("checked", currentOptions.vitesseReset);
            
            $optionsVitesse.slider("value", currentOptions.vitesseValue);
        }
        
        function saveCurrentOptions() {
            currentOptions = {
                zoomAuto: $optionsZoomAuto[0].checked,
                affAlgo: $optionsAffAlgo[0].checked,
                //cacherAlgo: $optionsCacherAlgo[0].checked,
                affComment: $optionsAffComment[0].checked,
                vitesseValue: $optionsVitesse.slider("value"),
                vitesseReset: $optionsVitesse1[0].checked
            };
        }
        
        function resetSpeed() {
            Q.speed(1);
        }
        
        function applyOptions() {
            saveCurrentOptions();
            // zoom-auto
            zoomAuto(currentOptions.zoomAuto);
            // aff-algo
            viewAlgo(currentOptions.affAlgo);
            // aff-comment
            if (currentOptions.affComment) {
                UI.fire("aff-comment");
            } else {
                UI.fire("cacher-comment");
            }
            // la vitesse
            Q.speed(sliderValueToSpeed(currentOptions.vitesseValue));
            // vitesse-1
            if (currentOptions.vitesseReset) {
                UI.bind("anim-end", resetSpeed);
            } else {
                UI.unbind("anim-end", resetSpeed);
            }
        }
        
        $options.dialog({
            title: "Options",
            height: 450,
            width: 600,
            autoOpen: false,
            modal: true,
            open: function (event, ui) {
                saveCurrentOptions();
            },
            buttons: [
                {
                    text: "Annuler",
                    click: function () {
                        resetOptions();
                        $(this).dialog("close");
                    }
                },
                {
                    text: "OK",
                    click: function () {
                        applyOptions();
                        $(this).dialog("close");
                    }
                }
            ]
        }).dialog({
            close: function () {
                resetOptions();
                $(this).dialog("close");
            }
        });
        
    // prepare to return
        LIB.extend(UI, {
            zoomIn: zoomIn,
            zoomOut: zoomOut,
            zoom: zoom,
            zoomAuto: zoomAuto,
            selectToolbar: selectToolbar,
            selectAlgo: selectAlgo,
            outputHeight: outputHeight,
            outputWidth: outputWidth,
            viewAlgo: viewAlgo,
            notify: notify
        });
        
    // support drag & drop
        var lastPosX, lastPosY;
        
        function handle_mousemove(event) {
            var dx = event.clientX - lastPosX,
                dy = event.clientY - lastPosY;
            
            lastPosX = event.clientX;
            lastPosY = event.clientY;
            
            $bottomLeft.scrollLeft($bottomLeft.scrollLeft() - dx);
            $bottomLeft.scrollTop($bottomLeft.scrollTop() - dy);
            event.preventDefault();
        }
        
        function handle_mousedown(event) {
            lastPosX = event.clientX;
            lastPosY = event.clientY;
            $bottomLeft.css("cursor", "move");
            $bottomLeft.bind("mousemove", handle_mousemove);
            event.preventDefault();
        }
        
        function handle_mouseup_mouseout(event) {
            $bottomLeft.css("cursor", "auto");
            $bottomLeft.unbind("mousemove", handle_mousemove);
            event.preventDefault();
        }
        
        $bottomLeft.bind("mousedown", handle_mousedown);
        $bottomLeft.bind("mouseup", handle_mouseup_mouseout);
        $bottomLeft.bind("mouseout", handle_mouseup_mouseout);
        
        // return of init
        return true;
    }
    
    function Comment(conf) {
        
        var s, self;
        
        function show() {
            s.output.appendChild(s.e);
        }
        
        function hide() {
            if (s.output.contains(s.e)) {
                s.output.removeChild(s.e);
            }
        }
        
        s = {};
        self = LIB.Comment(conf, s);
        
        Q.enQueue(function () {
            if (affComment) {
                show();
            } else {
                hide();
            }
        });
        
        UI.bind("aff-comment", show);
        UI.bind("cacher-comment", hide);
        
        var old_remove = self.remove;
        self.remove = function () {
            Q.enQueue(function () {
                UI.unbind("aff-comment", show);
                UI.unbind("cacher-comment", hide);
            });
            old_remove();
        };
        
        return self;
    }
    
    LIB.extend(UI, {
        init: init,
        customMenu: customMenu,
        inputMenu: inputMenu,
        Comment: Comment
    });
    
    UI.bind("aff-comment", function () {
        console.log("aff-comment");
        affComment = true;
    });
    UI.bind("cacher-comment", function () {
        console.log("cacher-comment");
        affComment = false;
    });
    
    return UI;

}(jQuery));
