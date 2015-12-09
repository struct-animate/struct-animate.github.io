/*jslint indent: 4, nomen: true, browser: true, devel: true, vars: true */
/*globals jQuery, $*/

var LIB = (function () {
    "use strict";
    
    var LIB, Q, pfx;
    
    // assert
    // print errorMessage if test is false
    function assert(test, errorMessage) {
        if (!test) {
            console.error(errorMessage);
        }
    }
    
    // ajoute les proprietes de objet_source `src` à objet_distination `dest`
    function extend(dest, src) {
        Object.keys(src).forEach(function (prop) {
            dest[prop] = src[prop];
        });
    }
    
    // clone
    // create a new object similare to `o`
    function clone(o) {
        var newObject = {};
        extend(newObject, o);
        return newObject;
    }
    
    // deepClone
    function deepClone(o) {
        var that;
        if (o instanceof Array) {
            that = [];
            o.forEach(function (val, i) {
                that[i] = deepClone(val);
            });
            return that;
        }
        if (o instanceof Object) {
            that = {};
            Object.keys(o).forEach(function (key) {
                that[key] = deepClone(o[key]);
            });
            return that;
        }
        return o;
    }
    
    // `pfx` is a function that takes a standard CSS property name as a parameter
    // and returns it's prefixed version valid for current browser it runs in.
    // The code is heavily inspired by Modernizr http://www.modernizr.com/
    pfx = (function () {
        
        var style = document.createElement('dummy').style,
            prefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'],
            memory = {};
        
        return function (prop) {
            var i, ucProp, props;
            
            if (typeof memory[prop] === "undefined") {
                ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1);
                props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
                
                memory[prop] = null;
                for (i in props) {
                    if (props.hasOwnProperty(i)) {
                        if (style[props[i]] !== undefined) {
                            memory[prop] = props[i];
                            break;
                        }
                    }
                }
            }
            
            return memory[prop];
        };
    
    }());
    
    // `arraify` takes an array-like object and turns it into real Array
    // to make all the Array.prototype goodness available.
    function arrayify(a) {
        return [].slice.call(a);
    }
    
    // `jsToCSS`
    // jsToCSS("MozTransform") -> "-moz-transform"
    // jsToCSS("borderRadius") -> "border-radius"
    function jsToCSS(prop) {
        return prop.replace(/([A-Z])/g, function (all, match) {
            return "-" + match.toLowerCase();
        });
    }
    
    // `css` function applies the styles given in `props` object to the element
    // given as `el`. It runs all property names through `pfx` function to make
    // sure proper prefixed version of the property is used.
    function css(el, props) {
        var key, pkey;
        for (key in props) {
            if (props.hasOwnProperty(key)) {
                pkey = pfx(key);
                if (pkey !== null) {
                    el.style[pkey] = props[key];
                }
            }
        }
        return el;
    }
    
    // `toNumber` takes a value given as `numeric` parameter and tries to turn
    // it into a number. If it is not possible it returns 0 (or other value
    // given as `fallback`).
    function toNumber(numeric, fallback) {
        return isNaN(numeric) ? (fallback || 0) : Number(numeric);
    }
    
    function toInt(numeric, fallback) {
        return parseInt(toNumber(numeric, fallback), 10);
    }
    
    // Observable object
    // Observable = { bind, unbind, fire }
    //      bind:   function (eventName: string, eventListener: function) -> Observer
    //      unbind: function (eventName: string, eventListener: function) -> Observer
    //      fire:   function (eventName: string, data) -> Observer
    //
    function Observable() {
        var s = Object.create(null);
        return {
            bind: function bind(event, listener) {
                if (!s[event]) {
                    s[event] = [listener];
                } else {
                    s[event].push(listener);
                }
                return this;
            },
            unbind: function unbind(event, listener) {
                if (s[event]) {
                    s[event] = s[event].filter(function (boundListener) {
                        return listener !== boundListener;
                    });
                }
                return this;
            },
            fire: function fire(event, data) {
                if (s[event]) {
                    s[event].forEach(function (listener) {
                        try {
                            listener(data);
                        } catch (e) {}
                    });
                }
                return this;
            }
        };
    }
    
    
//  Queue
//  * implements Observable
//  * define these methods:
//      enQueue = function (f, waitTime: number) -> Queue
//          f: function (speed: number) -> undefined
//          
//      wait = function (waitTime: number) -> Queue
//      isEmpty = function () -> boolean
//      speed = function (number | undefined) -> number
//      
//      pause = function () -> Queue { this.fire("pause"); }
//      launch = function () -> Queue { this.fire("launch"); }
//    
    function Queue() {
        
        var loop,// loop function
            self = new Observable(),// the new queue
            waitQueue = [],
            paused = false,
            ready = true,
            currentSpeed = 1,
            newSpeed = null,
            timeout = null,// store the id returned from setTimeout so that we can cancel it
            nextIter =  Date.now(),
            timeToWait = 0;//ms
        
        // isEmpty = function () -> boolean
        function isEmpty() {
            return waitQueue.length === 0;
        }
        
        // enQueue = function (fn, wait = 0) -> Queue
        //      fn = function () -> undefined
        //      wait = number | undefined
        function enQueue(fn, wait) {
            if (wait === undefined) {
                wait = 0;
            }
            // push to waitQueue
            waitQueue.push({ exec: fn, wait: wait });
            
            // if the queue is ready --> loop
            if (ready && !paused) {
                ready = false;
                timeToWait = 0;
                nextIter = Date.now();
                timeout = setTimeout(loop, 0);
            }
            return self;
        }
        
        // function wait(time = 0)
        //  time = number
        function wait(time) {
            enQueue(function () {}, time);
            return self;
        }
        
        // pause = function () -> Boolean
        // returns true if the queue was not paused
        function pause() {
            self.fire("pause");
            return self;
        }
        
        // launch = function () -> Boolean
        // returns true if the queue was paused
        function launch() {
            self.fire("launch");
            return self;
        }
        
        // function speed(number | undefined) -> number;
        function speed(newSpeed) {
            if (isNaN(newSpeed)) {
                return currentSpeed;
            }
            newSpeed = (newSpeed < 0.1) ? 0.1 : (newSpeed > 10) ? 10 : newSpeed;
            
            if (newSpeed !== currentSpeed) {
                self.fire("speed", newSpeed);
                return;
            }
            
            return currentSpeed;
        }
        
        loop = function loop() {
            
            var first, wait;
            
            while (true) {
                // this if breaks the loop
                if (isEmpty()) {
                    ready = true;
                    console.info("The Queue is ready");
                    return;
                }
                ready = false;
                
                first = waitQueue.shift();
                // compute `wait` time
                wait = first.wait / currentSpeed;
                
                try {
                    first.exec(currentSpeed);
                } catch (e) {
                    console.warn("exception in an enQueued function", e);
                }
                
                timeToWait = wait;
                nextIter = Date.now() + wait;
                
                // this if breaks the loop
                if (wait > 0) {
                    timeout = setTimeout(loop, wait);
                    break;
                }
            }
        };
        
        // pause
        self.bind("pause", function () {
            if (!ready) {
                timeToWait = nextIter - Date.now();
                clearTimeout(timeout);
                paused = true;
            }
        });
        
        // launch
        self.bind("launch", function () {
            if (!ready) {
                // the queue is not ready --> wait
                nextIter = Date.now() + timeToWait;
                timeout = setTimeout(loop, timeToWait);
            } else {
                // the queue is ready --> loop
                nextIter = Date.now();
                timeout = setTimeout(loop, 0);
            }
            paused = false;
        });
        
        // speed
        self.bind("speed", function (newSpeed) {
            if (!paused) {
                // update nextIter
                var NOW = Date.now(),
                    wait = (nextIter - NOW) * currentSpeed / newSpeed;
                nextIter = NOW + wait;
                // update timeout
                clearTimeout(timeout);
                timeout = setTimeout(loop, wait);
                // update currentSpeed
                currentSpeed = newSpeed;
            } else {
                // update timeToWait
                timeToWait = timeToWait * currentSpeed / newSpeed;
                // update currentSpeed
                currentSpeed = newSpeed;
            }
        });
        
        self.isEmpty = isEmpty;
        self.enQueue = enQueue;
        self.wait = wait;
        self.pause = pause;
        self.launch = launch;
        self.speed = speed;
        
        return self;
    }
    
    // Rect constructor
    // Rect = function (conf, s) -> Rect
    //      conf = { output: domElem, queue: Queue }
    //      s = Object
    // after construction `s` will contain:
    //      e = domElem
    //      output = domElem
    //      queue = Queue
    //      props = {x, y, scaleX, ...}
    //
    // methods:
    //      animate(conf, animTime, waitTime)
    //      remove()
    //      tooltip(content, waitTime)
    function Rect(conf, s) {
        
        if (!conf.output) {
            throw new Error("Rect: the output please!");
        }
        
        s = s || {};// object to contain private properties of Rect
        var Props = {
            x: 0,
            y: 0,
            z: 0,
            scaleX: 1,
            scaleY: 1,
            rotate: 0,
            skewX: 0,
            skewY: 0,
            transition: "transform 0s"
        };
        extend(s, {
            e: document.createElement('div'),
            output: conf.output,
            props: Props
        });
        
        // appliquer le style par default
        css(s.e, {
            height: '50px',
            width: '50px',
            background: '#EEE',
            border: 'solid 1px #AAA',
            position: 'absolute',
            margin: '0',
            padding: '0',
            transition: Props.transition,
            transform: ''
        });
        
        function isTransform(prop) {
            return ['x', 'y', 'scaleX', 'scaleY', 'rotate', 'skewX', 'skewY'].indexOf(prop) !== -1;
        }
        
        function isCss(prop) {
            return document.body.style[pfx(prop)] !== undefined;
        }
        
        function animate(conf, animTime, waitTime) {
            if (isNaN(animTime)) {
                animTime = 0;
            }
            if (isNaN(waitTime)) {
                waitTime = animTime;
            }
            
            // for each prop in conf
            Object.keys(conf).forEach(function (prop) {
            
                if (isTransform(prop)) {
                    
                    Q.enQueue(function (startSpeed) {
                        
                        var time = animTime,
                            value = conf[prop],
                            timeout = null,
                            currentSpeed = 1,
                            dt = 30,//ms
                            remove;// function
                        
                        // initialize the speed
                        time = time * currentSpeed / startSpeed;
                        
                        // stop the current animation
                        if (typeof Props[prop + "stopAnimation"] === "function") {
                            Props[prop + "stopAnimation"]();
                        }
                        
                        // pause
                        function pause() {
                            clearTimeout(timeout);
                        }
                        
                        // speed
                        function speed(newSpeed) {
                            time = time * currentSpeed / newSpeed;
                            currentSpeed = newSpeed;
                        }
                        
                        // launch
                        function launch() {
                            function draw() {
                                css(s.e, {
                                    transform:  'translateX('   + parseInt(Props.x, 10)  + 'px) ' +
                                                'translateY('   + parseInt(Props.y, 10)  + 'px) ' +
                                                'scaleX('       + Props.scaleX + ') ' +
                                                'scaleY('       + Props.scaleY + ') ' +
                                                'rotate('       + Props.rotate + 'deg) ' +
                                                'skewX('        + Props.skewX  + 'deg) ' +
                                                'skewY('        + Props.skewY  + 'deg) '
                                });
                            }
                            if (time <= dt) {
                                // set prop to the final value
                                Props[prop] = value;
                                draw();
                                remove();
                                return;
                            }
                            
                            var dp = (value - Props[prop]) * dt / time;
                            Props[prop] = Props[prop] + dp;
                            
                            time -= dt;
                            
                            draw();
                            
                            timeout = setTimeout(launch, dt);
                        }
                        
                        // remove
                        remove = function remove() {
                            clearTimeout(timeout);
                            Q.unbind("speed", speed);
                            Q.unbind("pause", pause);
                            Q.unbind("launch", launch);
                        };
                        
                        Props[prop + "stopAnimation"] = remove;
                        
                        Q.bind("speed", speed);
                        Q.bind("pause", pause);
                        Q.bind("launch", launch);
                        
                        launch();
                    });
                    
                } else if (prop.search(/(transition|transform)/i) !== -1) {
                    
                    console.warn("Don't touch transition and transform!");
                    
                } else if (isCss(prop)) {
                
                    Q.enQueue(function (startSpeed) {
                        
                        var time = animTime,
                            currentSpeed = 1,
                            lastTime = null,
                            remove;// function
                        
                        // initialize speed
                        time = time * currentSpeed / startSpeed;
                        
                        // stop the current animation
                        if (typeof Props[prop + "stopAnimation"] === "function") {
                            Props[prop + "stopAnimation"]();
                        }
                        
                        // pause
                        function pause() {
                            var cssConf = {};
                            time = time - (Date.now() - lastTime);
                            if (time <= 0) {
                                remove();
                                return;
                            }
                            // transition
                            Props.transition = Props.transition.replace(new RegExp(",\\s*(" + jsToCSS(pfx(prop)) + "\\s+[^,]*)", "g"), "");
                            Props.transition = Props.transition + ", " + jsToCSS(pfx(prop)) + " 100000000s";
                            css(s.e, { transition: Props.transition });
                            // prop
                            cssConf[prop] = "";
                            css(s.e, cssConf);
                        }
                        
                        // speed
                        function speed(newSpeed) {
                            time = time * currentSpeed / newSpeed;
                            currentSpeed = newSpeed;
                        }
                        
                        // launch
                        function launch() {
                            var cssConf = {};
                            lastTime = Date.now();
                            
                            // transition
                            assert(time >= 0, "time < 0");
                            Props.transition = Props.transition.replace(new RegExp(",\\s*(" + jsToCSS(pfx(prop)) + "\\s+[^,]*)", "g"), "");
                            Props.transition = Props.transition + ", " + jsToCSS(pfx(prop)) + " " +  time + "ms";
                            css(s.e, { transition: Props.transition });
                            
                            // prop
                            cssConf[prop] = conf[prop];
                            css(s.e, cssConf);
                        }
                        
                        // remove
                        remove = function remove() {
                            Q.unbind("speed", speed);
                            Q.unbind("pause", pause);
                            Q.unbind("launch", launch);
                        };
                        Props[prop + "stopAnimation"] = remove;
                        
                        Q.bind("speed", speed);
                        Q.bind("pause", pause);
                        Q.bind("launch", launch);
                        
                        launch();
                    });
                }
            });
            
            Q.wait(waitTime);
        }
        
        function tooltip(content, waitTime) {
            waitTime = waitTime !== undefined ? waitTime : 0;
            content = (typeof content === "function") ? content : content.toString();
            Q.enQueue(function () {
                if (content === "") {
                    $(s.e).tooltip("destroy");
                } else {
                    $(s.e).attr("title", "dummy").tooltip({ content: content, track: true });
                }
            }, waitTime);
        }
        
        animate(conf);
        // attacher 'e' à 'output' dans le bon moment
        Q.enQueue(function () {
            s.output.appendChild(s.e);
        }, 0);
        
        return {
            animate: animate,
            tooltip: tooltip,
            remove: function remove() {
                Q.enQueue(function () {
                    $(s.e).tooltip().tooltip("destroy");
                    if (s.output.contains(s.e)) {
                        s.output.removeChild(s.e);
                    }
                });
            }
        };
    }
    
    // RectVal = function (conf, s) -> Rect
    //      conf = { output: domElem, queue: Queue, val: string }
    //      s = Object
    // after construction `s` will contain:
    //      e = domElem
    //      output = domElem
    //      queue = Queue
    //      props = {x, y, scaleX, ...}
    //      val = string
    //      div = domElem
    //
    // methods:
    //      animate(conf, animTime, waitTime)
    //      remove()
    //      val(newVal)
    function RectVal(conf, s) {
        s = s || {};
        
        var self, _animate;
        
        self = new Rect(conf, s);
        
        s.val = (conf.val !== undefined) ? conf.val : '';
        s.div = document.createElement('div');
        
        s.div.textContent = s.val;
        s.e.appendChild(s.div);
        
        css(s.div, {
            height: s.e.style.height,
            width: s.e.style.width,
            lineHeight: s.e.style.height,
            textAlign: 'center',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        });
        
        // redefinir les methodes style et animate
        _animate = self.animate;
        
        self.animate = function (conf, animTime, waitTime) {
            
            if (isNaN(animTime)) {
                animTime = 0;
            }
            if (isNaN(waitTime)) {
                waitTime = animTime;
            }
            if (conf.height !== undefined) {
                Q.enQueue(function () {
                    css(s.div, {height: conf.height, lineHeight: conf.height});
                });
            }
            if (conf.width !== undefined) {
                Q.enQueue(function () {
                    css(s.div, {width: conf.width});
                });
            }
            
            _animate(conf, animTime, waitTime);
        };
        
        self.val = function (v) {
            if (v !== undefined) {
                
                s.val = v;
                
                Q.enQueue(function () {
                    s.div.textContent = v;
                }, 0);
                
            } else {
                return s.val;
            }
        };
        
        self.animate(conf);
        
        return self;
    }
    
    function Circle(conf, s) {
        s = s || {};
        var self = new Rect(conf, s);
        self.animate({ borderRadius: '50%' });
        self.animate(conf);
        return self;
    }
    
    function CircleVal(conf, s) {
        s = s || {};
        var self = new RectVal(conf, s);
        self.animate({ borderRadius: '50%' });
        self.animate(conf);
        return self;
    }
    
    function Comment(conf, s) {
        s = s || {};
        var self = new Rect(conf, s);
        
        s.div = document.createElement('div');
        s.e.appendChild(s.div);
        s.div.innerHTML = s.html = (conf.html !== undefined) ? conf.html : '';
        
        css(s.e, { borderRadius: '5px' });
        css(s.div, { padding: '5px' });
        
        self.animate(conf);
        
        self.html = function (html) {
            if (html !== undefined) {
                
                s.html = html;
                Q.enQueue(function () {
                    s.div.innerHTML = html;
                }, 0);
                
            } else {
                return s.html;
            }
        };
        
        return self;
    }
    
    // Algo = function (conf, s) -> function (number);
    // returns a function witch select the element nth (`number`) line of the algo:
    //      conf = { domElement, defaultCSS, activeCSS, queue }
    //      s = contains the private members (can be used for to extend the Algo object -function-)
    function Algo(conf, s) {
        s = s || {};
        s.curr = -1;
        
        extend(s, conf);
        
        // apply default css to all the children of domElement
        arrayify(s.domElement.children).forEach(function (child) {
            css(child, s.defaultCSS);
        });
        
        return function select(i, wait) {
            Q.enQueue(function () {
                if (s.curr >= 0) {
                    css(s.domElement.children[s.curr], s.defaultCSS);
                }
                if (i >= 0 && i < s.domElement.children.length) {
                    s.curr = i;
                    css(s.domElement.children[s.curr], s.activeCSS);
                }
            }, wait);
        };
    }
    function Factory(conf) {
        
        var canvas = conf.canvas,
            startX = 10,
            startY = 10,
            endX = 60,
            endY = 80,
            UNITF = 10,
            ANGCST = Math.PI / 5,
            TSF = 180 / Math.PI,
            cxt = canvas.getContext("2d"),
            tabArrowOld = [],
            tabArrowNew = [],
            tabLineOld = [],
            tabLineNew = [];
        
        function getAlpha(p1, p2) {
            if (p2.x === p1.x) {
                if (p2.y > p1.y) {
                    return Math.PI / 2;
                } else {
                    return -Math.PI / 2;
                }
            }
            if (p2.x > p1.x) {
                return Math.atan((p2.y - p1.y) / (p2.x - p1.x));
            } else {
                return Math.PI +  Math.atan((p2.y - p1.y) / (p2.x - p1.x));
            }
        }
        function getBetta1(alpha) {
            return Math.PI - (alpha + ANGCST);
        }
        function getBetta2(alpha) {
            return alpha - ANGCST;
        }
        function getR1(p1, p2) {
            return {
                x : p2.x + Math.cos(getBetta1(getAlpha(p1, p2))) * UNITF,
                y : p2.y - Math.sin(getBetta1(getAlpha(p1, p2))) * UNITF
            };
        }
        function getR2(p1, p2) {
            return {
                x : p2.x - Math.cos(getBetta2(getAlpha(p1, p2))) * UNITF,
                y : p2.y - Math.sin(getBetta2(getAlpha(p1, p2))) * UNITF
            };
        }
        function getRm(p1, p2) {
            return {
                x : p2.x - Math.cos(getAlpha(p1, p2)) * Math.pow(0.7 * UNITF, 0.5),
                y : p2.y - Math.sin(getAlpha(p1, p2)) * Math.pow(0.7 * UNITF, 0.5)
            };
        }
        
        function drawLine(ps, pe) {
            
            cxt.beginPath();
            cxt.moveTo(ps.x, ps.y);
            cxt.lineTo(pe.x, pe.y);
            
            cxt.closePath();
            cxt.strokeStyle = "#6b83cb";
            cxt.lineWidth = 1;
            cxt.fill();
            cxt.stroke();
        }
        
        function drawArrow(ps, pe, conf) {
            
            cxt.beginPath();
            cxt.moveTo(ps.x, ps.y);
            cxt.lineTo(pe.x, pe.y);
            
            var r1 = getR1(ps, pe),
                r2 = getR2(ps, pe),
                rm = getRm(ps, pe);
        
            cxt.lineTo(r1.x, r1.y);
            cxt.lineTo(rm.x, rm.y);
            cxt.lineTo(r2.x, r2.y);
            cxt.lineTo(pe.x, pe.y);
            
            cxt.closePath();
            cxt.strokeStyle = (conf && conf.color) ? conf.color : "#6b83cb";
            cxt.lineWidth = (conf && conf.width) ? conf.width : 1;
            cxt.fill();
            cxt.stroke();
        }
        
        function animate(animTime, waitTime) {
            
            animTime = (animTime !== undefined) ? animTime : 0;
            waitTime = (waitTime !== undefined) ? waitTime : animTime;
            
            animTime *= 0.85;
            
           // clone the two tabs (arrows)
            var tao = LIB.deepClone(tabArrowOld),
                tan = LIB.deepClone(tabArrowNew);
            tabArrowNew = tabArrowNew.filter(function (that) {
                return !that.del;
            });
            tabArrowOld = LIB.deepClone(tabArrowNew);
            
            // clone the two tabs (lines)
            var tlo = LIB.deepClone(tabLineOld),
                tln = LIB.deepClone(tabLineNew);
            tabLineNew = tabLineNew.filter(function (that) {
                return !that.del;
            });
            tabLineOld = LIB.deepClone(tabLineNew);
            
            Q.enQueue(function (startSpeed) {
                
                var time = animTime,
                    timeout = null,
                    currentSpeed = 1,
                    dt = 30,//ms
                    remove;// function
                
                // initialize the speed
                time = time * currentSpeed / startSpeed;
                
                // pause
                function pause() {
                    clearTimeout(timeout);
                }
                
                // speed
                function speed(newSpeed) {
                    time = time * currentSpeed / newSpeed;
                    currentSpeed = newSpeed;
                }
                
                // launch
                function launch() {
                    if (time <= dt) {
                        // set prop to the final value
                        cxt.clearRect(0, 0, canvas.width, canvas.height);
                        
                        tan.forEach(function (val, i) {
                            if (!val.del) {
                                drawArrow(val.start, val.end);
                            }
                        });
                        tln.forEach(function (val, i) {
                            if (!val.del) {
                                drawLine(val.start, val.end);
                            }
                        });
                        
                        remove();
                        return;
                    }
                    
                    cxt.clearRect(0, 0, canvas.width, canvas.height);
                        
                    tao.forEach(function (val, i) {
                        tao[i].start.x += (tan[i].start.x - tao[i].start.x) * dt / time;
                        tao[i].start.y += (tan[i].start.y - tao[i].start.y) * dt / time;
                        tao[i].end.x += (tan[i].end.x - tao[i].end.x) * dt / time;
                        tao[i].end.y += (tan[i].end.y - tao[i].end.y) * dt / time;
                        
                        //draw
                        drawArrow(val.start, val.end);
                    });
                    
                    tlo.forEach(function (val, i) {
                        tlo[i].start.x += (tln[i].start.x - tlo[i].start.x) * dt / time;
                        tlo[i].start.y += (tln[i].start.y - tlo[i].start.y) * dt / time;
                        tlo[i].end.x += (tln[i].end.x - tlo[i].end.x) * dt / time;
                        tlo[i].end.y += (tln[i].end.y - tlo[i].end.y) * dt / time;
                        
                        //draw
                        drawLine(val.start, val.end);
                    });
                    
                    time -= dt;
                    
                    timeout = setTimeout(launch, dt);
                }
                
                // remove
                remove = function remove() {
                    clearTimeout(timeout);
                    Q.unbind("pause", pause);
                    Q.unbind("speed", speed);
                    Q.unbind("launch", launch);
                };
            
                Q.bind("pause", pause);
                Q.bind("speed", speed);
                Q.bind("launch", launch);
                
                launch();
                
            }, waitTime);
        }
        
        function Arrow(start, end) {
            var that = {
                start: start,
                end: end,
                del: false
            };
            tabArrowNew.push(that);
            return {
                remove: function () {
                    that.del = true;
                },
                update: function (start, end) {
                    that.start = start;
                    that.end = end;
                }
            };
        }
        
        function Line(start, end) {
            var that = {
                start: start,
                end: end,
                del: false
            };
            tabLineNew.push(that);
            return {
                remove: function () {
                    that.del = true;
                },
                update: function (start, end) {
                    that.start = start;
                    that.end = end;
                }
            };
        }
        
        return {
            animate: animate,
            Arrow: Arrow,
            Line: Line,
            drawArrow: drawArrow
        };
    }
    
    function getQueue() {
        return Q;
    }
    
    Q = new Queue();
    
    LIB = {
        $: function (q) {
            return document.querySelector(q);
        },
        $$: function (q) {
            return document.querySelectorAll(q);
        },
        toNumber: toNumber,
        toInt: toInt,
        assert: assert,
        extend: extend,
        clone: clone,
        deepClone: deepClone,
        Queue: Queue,
        arrayify: arrayify,
        css: css,
        Rect: Rect,
        RectVal: RectVal,
        Circle: Circle,
        CircleVal: CircleVal,
        Comment: Comment,
        Algo: Algo,
        Observable: Observable,
        Factory: Factory,
        getQueue: getQueue
    };
    
    return LIB;

}());
