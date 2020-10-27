<<<<<<< Updated upstream
/*!
 *
 * MediaElement.js
 * HTML5 <video> and <audio> shim and player
 * http://mediaelementjs.com/
 *
 * Creates a JavaScript object that mimics HTML5 MediaElement API
 * for browsers that don't understand HTML5 or can't play the provided codec
 * Can play MP4 (H.264), Ogg, WebM, FLV, WMV, WMA, ACC, and MP3
 *
 * Copyright 2010-2014, John Dyer (http://j.hn)
 * License: MIT
 *
 */
// Namespace
var mejs = mejs || {};

// version number
mejs.version = '2.16.4';
console.log('ME.js version', mejs.version);

// player number (for missing, same id attr)
mejs.meIndex = 0;

// media types accepted by plugins
mejs.plugins = {
  silverlight: [
    {version: [3, 0], types: ['video/mp4', 'video/m4v', 'video/mov', 'video/wmv', 'audio/wma', 'audio/m4a', 'audio/mp3', 'audio/wav', 'audio/mpeg']}
  ],
  flash: [
    {version: [9, 0, 124], types: ['video/mp4', 'video/m4v', 'video/mov', 'video/flv', 'video/rtmp', 'video/x-flv', 'audio/flv', 'audio/x-flv', 'audio/mp3', 'audio/m4a', 'audio/mpeg', 'video/youtube', 'video/x-youtube', 'application/x-mpegURL']}
    //,{version: [12,0], types: ['video/webm']} // for future reference (hopefully!)
  ],
  youtube: [
    {version: null, types: ['video/youtube', 'video/x-youtube', 'audio/youtube', 'audio/x-youtube']}
  ],
  vimeo: [
    {version: null, types: ['video/vimeo', 'video/x-vimeo']}
  ]
};
=======
(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(_dereq_,module,exports){
>>>>>>> Stashed changes

/*
 Utility methods
 */
mejs.Utility = {
  encodeUrl: function (url) {
    return encodeURIComponent(url); //.replace(/\?/gi,'%3F').replace(/=/gi,'%3D').replace(/&/gi,'%26');
  },
  escapeHTML: function (s) {
    return s.toString().split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
  },
  absolutizeUrl: function (url) {
    var el = document.createElement('div');
    el.innerHTML = '<a href="' + this.escapeHTML(url) + '">x</a>';
    return el.firstChild.href;
  },
  getScriptPath: function (scriptNames) {
    var
      i = 0,
      j,
      codePath = '',
      testname = '',
      slashPos,
      filenamePos,
      scriptUrl,
      scriptPath,
      scriptFilename,
      scripts = document.getElementsByTagName('script'),
      il = scripts.length,
      jl = scriptNames.length;

    // go through all <script> tags
    for (; i < il; i++) {
      scriptUrl = scripts[i].src;
      slashPos = scriptUrl.lastIndexOf('/');
      if (slashPos > -1) {
        scriptFilename = scriptUrl.substring(slashPos + 1);
        scriptPath = scriptUrl.substring(0, slashPos + 1);
      } else {
        scriptFilename = scriptUrl;
        scriptPath = '';
      }

      // see if any <script> tags have a file name that matches the
      for (j = 0; j < jl; j++) {
        testname = scriptNames[j];
        filenamePos = scriptFilename.indexOf(testname);
        if (filenamePos > -1) {
          codePath = scriptPath;
          break;
        }
      }

      // if we found a path, then break and return it
      if (codePath !== '') {
        break;
      }
    }

    // send the best path back
    return codePath;
  },
  secondsToTimeCode: function (time, forceHours, showFrameCount, fps) {
    //add framecount
    if (typeof showFrameCount == 'undefined') {
      showFrameCount = false;
    } else if (typeof fps == 'undefined') {
      fps = 25;
    }

    var hours = Math.floor(time / 3600) % 24,
      minutes = Math.floor(time / 60) % 60,
      seconds = Math.floor(time % 60),
      frames = Math.floor(((time % 1) * fps).toFixed(3)),
      result =
      ((forceHours || hours > 0) ? (hours < 10 ? '0' + hours : hours) + ':' : '')
      + (minutes < 10 ? '0' + minutes : minutes) + ':'
      + (seconds < 10 ? '0' + seconds : seconds)
      + ((showFrameCount) ? ':' + (frames < 10 ? '0' + frames : frames) : '');

    return result;
  },
  timeCodeToSeconds: function (hh_mm_ss_ff, forceHours, showFrameCount, fps) {
    if (typeof showFrameCount == 'undefined') {
      showFrameCount = false;
    } else if (typeof fps == 'undefined') {
      fps = 25;
    }

    var tc_array = hh_mm_ss_ff.split(":"),
      tc_hh = parseInt(tc_array[0], 10),
      tc_mm = parseInt(tc_array[1], 10),
      tc_ss = parseInt(tc_array[2], 10),
      tc_ff = 0,
      tc_in_seconds = 0;

    if (showFrameCount) {
      tc_ff = parseInt(tc_array[3]) / fps;
    }

    tc_in_seconds = (tc_hh * 3600) + (tc_mm * 60) + tc_ss + tc_ff;

    return tc_in_seconds;
  },
  convertSMPTEtoSeconds: function (SMPTE) {
    if (typeof SMPTE != 'string')
      return false;

    SMPTE = SMPTE.replace(',', '.');

    var secs = 0,
      decimalLen = (SMPTE.indexOf('.') != -1) ? SMPTE.split('.')[1].length : 0,
      multiplier = 1;

    SMPTE = SMPTE.split(':').reverse();

    for (var i = 0; i < SMPTE.length; i++) {
      multiplier = 1;
      if (i > 0) {
        multiplier = Math.pow(60, i);
      }
      secs += Number(SMPTE[i]) * multiplier;
    }
    return Number(secs.toFixed(decimalLen));
  },
  /* borrowed from SWFObject: http://code.google.com/p/swfobject/source/browse/trunk/swfobject/src/swfobject.js#474 */
  removeSwf: function (id) {
    var obj = document.getElementById(id);
    if (obj && /object|embed/i.test(obj.nodeName)) {
      if (mejs.MediaFeatures.isIE) {
        obj.style.display = "none";
        (function () {
          if (obj.readyState == 4) {
            mejs.Utility.removeObjectInIE(id);
          } else {
            setTimeout(arguments.callee, 10);
          }
        })();
      } else {
        obj.parentNode.removeChild(obj);
      }
    }
  },
  removeObjectInIE: function (id) {
    var obj = document.getElementById(id);
    if (obj) {
      for (var i in obj) {
        if (typeof obj[i] == "function") {
          obj[i] = null;
        }
      }
      obj.parentNode.removeChild(obj);
    }
  }
};


// Core detector, plugins are added below
mejs.PluginDetector = {
  // main public function to test a plug version number PluginDetector.hasPluginVersion('flash',[9,0,125]);
  hasPluginVersion: function (plugin, v) {
    var pv = this.plugins[plugin];
    v[1] = v[1] || 0;
    v[2] = v[2] || 0;
    return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
  },
  // cached values
  nav: window.navigator,
  ua: window.navigator.userAgent.toLowerCase(),
  // stored version numbers
  plugins: [],
  // runs detectPlugin() and stores the version number
  addPlugin: function (p, pluginName, mimeType, activeX, axDetect) {
    this.plugins[p] = this.detectPlugin(pluginName, mimeType, activeX, axDetect);
  },
  // get the version number from the mimetype (all but IE) or ActiveX (IE)
  detectPlugin: function (pluginName, mimeType, activeX, axDetect) {

    var version = [0, 0, 0],
      description,
      i,
      ax;

    // Firefox, Webkit, Opera
    if (typeof (this.nav.plugins) != 'undefined' && typeof this.nav.plugins[pluginName] == 'object') {
      description = this.nav.plugins[pluginName].description;
      if (description && !(typeof this.nav.mimeTypes != 'undefined' && this.nav.mimeTypes[mimeType] && !this.nav.mimeTypes[mimeType].enabledPlugin)) {
        version = description.replace(pluginName, '').replace(/^\s+/, '').replace(/\sr/gi, '.').split('.');
        for (i = 0; i < version.length; i++) {
          version[i] = parseInt(version[i].match(/\d+/), 10);
        }
      }
      // Internet Explorer / ActiveX
    } else if (typeof (window.ActiveXObject) != 'undefined') {
      try {
        ax = new ActiveXObject(activeX);
        if (ax) {
          version = axDetect(ax);
        }
      }
      catch (e) {
      }
    }
    return version;
  }
};

// Add Flash detection
mejs.PluginDetector.addPlugin('flash', 'Shockwave Flash', 'application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash', function (ax) {
  // adapted from SWFObject
  var version = [],
    d = ax.GetVariable("$version");
  if (d) {
    d = d.split(" ")[1].split(",");
    version = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
  }
  return version;
});

// Add Silverlight detection
mejs.PluginDetector.addPlugin('silverlight', 'Silverlight Plug-In', 'application/x-silverlight-2', 'AgControl.AgControl', function (ax) {
  // Silverlight cannot report its version number to IE
  // but it does have a isVersionSupported function, so we have to loop through it to get a version number.
  // adapted from http://www.silverlightversion.com/
  var v = [0, 0, 0, 0],
    loopMatch = function (ax, v, i, n) {
      while (ax.isVersionSupported(v[0] + "." + v[1] + "." + v[2] + "." + v[3])) {
        v[i] += n;
      }
      v[i] -= n;
    };
  loopMatch(ax, v, 0, 1);
  loopMatch(ax, v, 1, 1);
  loopMatch(ax, v, 2, 10000); // the third place in the version number is usually 5 digits (4.0.xxxxx)
  loopMatch(ax, v, 2, 1000);
  loopMatch(ax, v, 2, 100);
  loopMatch(ax, v, 2, 10);
  loopMatch(ax, v, 2, 1);
  loopMatch(ax, v, 3, 1);

  return v;
});
// add adobe acrobat
/*
 PluginDetector.addPlugin('acrobat','Adobe Acrobat','application/pdf','AcroPDF.PDF', function (ax) {
 var version = [],
 d = ax.GetVersions().split(',')[0].split('=')[1].split('.');

 if (d) {
 version = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
 }
 return version;
 });
 */
// necessary detection (fixes for <IE9)
mejs.MediaFeatures = {
  init: function () {
    var
      t = this,
      d = document,
      nav = mejs.PluginDetector.nav,
      ua = mejs.PluginDetector.ua.toLowerCase(),
      i,
      v,
      html5Elements = ['source', 'track', 'audio', 'video'];

    // detect browsers (only the ones that have some kind of quirk we need to work around)
    t.isiPad = (ua.match(/ipad/i) !== null);
    t.isiPhone = (ua.match(/iphone/i) !== null);
    t.isiOS = t.isiPhone || t.isiPad;
    t.isAndroid = (ua.match(/android/i) !== null);
    t.isBustedAndroid = (ua.match(/android 2\.[12]/) !== null);
    t.isBustedNativeHTTPS = (location.protocol === 'https:' && (ua.match(/android [12]\./) !== null || ua.match(/macintosh.* version.* safari/) !== null));
    t.isIE = (nav.appName.toLowerCase().indexOf("microsoft") != -1 || nav.appName.toLowerCase().match(/trident/gi) !== null);
    t.isChrome = (ua.match(/chrome/gi) !== null);
    t.isChromium = (ua.match(/chromium/gi) !== null);
    t.isFirefox = (ua.match(/firefox/gi) !== null);
    t.isWebkit = (ua.match(/webkit/gi) !== null);
    t.isGecko = (ua.match(/gecko/gi) !== null) && !t.isWebkit && !t.isIE;
    t.isOpera = (ua.match(/opera/gi) !== null);
    t.hasTouch = ('ontouchstart' in window); //  && window.ontouchstart != null); // this breaks iOS 7

    // borrowed from Modernizr
    t.svg = !!document.createElementNS &&
      !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

    // create HTML5 media elements for IE before 9, get a <video> element for fullscreen detection
    for (i = 0; i < html5Elements.length; i++) {
      v = document.createElement(html5Elements[i]);
    }

    t.supportsMediaTag = (typeof v.canPlayType !== 'undefined' || t.isBustedAndroid);

<<<<<<< Updated upstream
    // Fix for IE9 on Windows 7N / Windows 7KN (Media Player not installer)
    try {
      v.canPlayType("video/mp4");
    } catch (e) {
      t.supportsMediaTag = false;
    }

    // detect native JavaScript fullscreen (Safari/Firefox only, Chrome still fails)

    // iOS
    t.hasSemiNativeFullScreen = (typeof v.webkitEnterFullscreen !== 'undefined');

    // W3C
    t.hasNativeFullscreen = (typeof v.requestFullscreen !== 'undefined');

    // webkit/firefox/IE11+
    t.hasWebkitNativeFullScreen = (typeof v.webkitRequestFullScreen !== 'undefined');
    t.hasMozNativeFullScreen = (typeof v.mozRequestFullScreen !== 'undefined');
    t.hasMsNativeFullScreen = (typeof v.msRequestFullscreen !== 'undefined');

    t.hasTrueNativeFullScreen = (t.hasWebkitNativeFullScreen || t.hasMozNativeFullScreen || t.hasMsNativeFullScreen);
    t.nativeFullScreenEnabled = t.hasTrueNativeFullScreen;

    // Enabled?
    if (t.hasMozNativeFullScreen) {
      t.nativeFullScreenEnabled = document.mozFullScreenEnabled;
    } else if (t.hasMsNativeFullScreen) {
      t.nativeFullScreenEnabled = document.msFullscreenEnabled;
    }

    if (t.isChrome) {
      t.hasSemiNativeFullScreen = false;
    }

    if (t.hasTrueNativeFullScreen) {

      t.fullScreenEventName = '';
      if (t.hasWebkitNativeFullScreen) {
        t.fullScreenEventName = 'webkitfullscreenchange';

      } else if (t.hasMozNativeFullScreen) {
        t.fullScreenEventName = 'mozfullscreenchange';

      } else if (t.hasMsNativeFullScreen) {
        t.fullScreenEventName = 'MSFullscreenChange';
      }

      t.isFullScreen = function () {
        if (t.hasMozNativeFullScreen) {
          return d.mozFullScreen;

        } else if (t.hasWebkitNativeFullScreen) {
          return d.webkitIsFullScreen;

        } else if (t.hasMsNativeFullScreen) {
          return d.msFullscreenElement !== null;
        }
      }

      t.requestFullScreen = function (el) {

        if (t.hasWebkitNativeFullScreen) {
          el.webkitRequestFullScreen();

        } else if (t.hasMozNativeFullScreen) {
          el.mozRequestFullScreen();

        } else if (t.hasMsNativeFullScreen) {
          el.msRequestFullscreen();

        }
      }

      t.cancelFullScreen = function () {
        if (t.hasWebkitNativeFullScreen) {
          document.webkitCancelFullScreen();

        } else if (t.hasMozNativeFullScreen) {
          document.mozCancelFullScreen();

        } else if (t.hasMsNativeFullScreen) {
          document.msExitFullscreen();

        }
      }

    }


    // OS X 10.5 can't do this even if it says it can :(
    if (t.hasSemiNativeFullScreen && ua.match(/mac os x 10_5/i)) {
      t.hasNativeFullScreen = false;
      t.hasSemiNativeFullScreen = false;
    }

  }
};
mejs.MediaFeatures.init();

/*
 extension methods to <video> or <audio> object to bring it into parity with PluginMediaElement (see below)
 */
mejs.HtmlMediaElement = {
  pluginType: 'native',
  isFullScreen: false,
  setCurrentTime: function (time) {
    this.currentTime = time;
  },
  setMuted: function (muted) {
    this.muted = muted;
  },
  setVolume: function (volume) {
    this.volume = volume;
  },
  // for parity with the plugin versions
  stop: function () {
    this.pause();
  },
  // This can be a url string
  // or an array [{src:'file.mp4',type:'video/mp4'},{src:'file.webm',type:'video/webm'}]
  setSrc: function (url) {

    // Fix for IE9 which can't set .src when there are <source> elements. Awesome, right?
    var
      existingSources = this.getElementsByTagName('source');
    while (existingSources.length > 0) {
      this.removeChild(existingSources[0]);
    }

    if (typeof url == 'string') {
      this.src = url;
    } else {
      var i, media;

      for (i = 0; i < url.length; i++) {
        media = url[i];
        if (this.canPlayType(media.type)) {
          this.src = media.src;
          break;
        }
      }
    }
  },
  setVideoSize: function (width, height) {
    this.width = width;
    this.height = height;
  }
};

/*
 Mimics the <video/audio> element by calling Flash's External Interface or Silverlights [ScriptableMember]
 */
mejs.PluginMediaElement = function (pluginid, pluginType, mediaUrl) {
  this.id = pluginid;
  this.pluginType = pluginType;
  this.src = mediaUrl;
  this.events = {};
  this.attributes = {};
};

// JavaScript values and ExternalInterface methods that match HTML5 video properties methods
// http://www.adobe.com/livedocs/flash/9.0/ActionScriptLangRefV3/fl/video/FLVPlayback.html
// http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html
mejs.PluginMediaElement.prototype = {
  // special
  pluginElement: null,
  pluginType: '',
  isFullScreen: false,
  // not implemented :(
  playbackRate: -1,
  defaultPlaybackRate: -1,
  seekable: [],
  played: [],
  // HTML5 read-only properties
  paused: true,
  ended: false,
  seeking: false,
  duration: 0,
  error: null,
  tagName: '',
  // HTML5 get/set properties, but only set (updated by event handlers)
  muted: false,
  volume: 1,
  currentTime: 0,
  // HTML5 methods
  play: function () {
    if (this.pluginApi != null) {
      if (this.pluginType == 'youtube' || this.pluginType == 'vimeo') {
        this.pluginApi.playVideo();
      } else {
        this.pluginApi.playMedia();
      }
      this.paused = false;
    }
  },
  load: function () {
    if (this.pluginApi != null) {
      if (this.pluginType == 'youtube' || this.pluginType == 'vimeo') {
      } else {
        this.pluginApi.loadMedia();
      }

      this.paused = false;
    }
  },
  pause: function () {
    if (this.pluginApi != null) {
      if (this.pluginType == 'youtube' || this.pluginType == 'vimeo') {
        this.pluginApi.pauseVideo();
      } else {
        this.pluginApi.pauseMedia();
      }


      this.paused = true;
    }
  },
  stop: function () {
    if (this.pluginApi != null) {
      if (this.pluginType == 'youtube' || this.pluginType == 'vimeo') {
        this.pluginApi.stopVideo();
      } else {
        this.pluginApi.stopMedia();
      }
      this.paused = true;
    }
  },
  canPlayType: function (type) {
    var i,
      j,
      pluginInfo,
      pluginVersions = mejs.plugins[this.pluginType];

    for (i = 0; i < pluginVersions.length; i++) {
      pluginInfo = pluginVersions[i];

      // test if user has the correct plugin version
      if (mejs.PluginDetector.hasPluginVersion(this.pluginType, pluginInfo.version)) {

        // test for plugin playback types
        for (j = 0; j < pluginInfo.types.length; j++) {
          // find plugin that can play the type
          if (type == pluginInfo.types[j]) {
            return 'probably';
          }
        }
      }
    }

    return '';
  },
  positionFullscreenButton: function (x, y, visibleAndAbove) {
    if (this.pluginApi != null && this.pluginApi.positionFullscreenButton) {
      this.pluginApi.positionFullscreenButton(Math.floor(x), Math.floor(y), visibleAndAbove);
    }
  },
  hideFullscreenButton: function () {
    if (this.pluginApi != null && this.pluginApi.hideFullscreenButton) {
      this.pluginApi.hideFullscreenButton();
    }
  },
  // custom methods since not all JavaScript implementations support get/set

  // This can be a url string
  // or an array [{src:'file.mp4',type:'video/mp4'},{src:'file.webm',type:'video/webm'}]
  setSrc: function (url) {
    if (typeof url == 'string') {
      this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(url));
      this.src = mejs.Utility.absolutizeUrl(url);
    } else {
      var i, media;

      for (i = 0; i < url.length; i++) {
        media = url[i];
        if (this.canPlayType(media.type)) {
          this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(media.src));
          this.src = mejs.Utility.absolutizeUrl(url);
          break;
        }
      }
    }

  },
  setCurrentTime: function (time) {
    if (this.pluginApi != null) {
      if (this.pluginType == 'youtube' || this.pluginType == 'vimeo') {
        this.pluginApi.seekTo(time);
      } else {
        this.pluginApi.setCurrentTime(time);
      }



      this.currentTime = time;
    }
  },
  setVolume: function (volume) {
    if (this.pluginApi != null) {
      // same on YouTube and MEjs
      if (this.pluginType == 'youtube') {
        this.pluginApi.setVolume(volume * 100);
      } else {
        this.pluginApi.setVolume(volume);
      }
      this.volume = volume;
    }
  },
  setMuted: function (muted) {
    if (this.pluginApi != null) {
      if (this.pluginType == 'youtube') {
        if (muted) {
          this.pluginApi.mute();
        } else {
          this.pluginApi.unMute();
        }
        this.muted = muted;
        this.dispatchEvent('volumechange');
      } else {
        this.pluginApi.setMuted(muted);
      }
      this.muted = muted;
    }
  },
  // additional non-HTML5 methods
  setVideoSize: function (width, height) {

    //if (this.pluginType == 'flash' || this.pluginType == 'silverlight') {
    if (this.pluginElement && this.pluginElement.style) {
      this.pluginElement.style.width = width + 'px';
      this.pluginElement.style.height = height + 'px';
    }
    if (this.pluginApi != null && this.pluginApi.setVideoSize) {
      this.pluginApi.setVideoSize(width, height);
    }
    //}
  },
  setFullscreen: function (fullscreen) {
    if (this.pluginApi != null && this.pluginApi.setFullscreen) {
      this.pluginApi.setFullscreen(fullscreen);
    }
  },
  enterFullScreen: function () {
    if (this.pluginApi != null && this.pluginApi.setFullscreen) {
      this.setFullscreen(true);
    }

  },
  exitFullScreen: function () {
    if (this.pluginApi != null && this.pluginApi.setFullscreen) {
      this.setFullscreen(false);
    }
  },
  // start: fake events
  addEventListener: function (eventName, callback, bubble) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);
  },
  removeEventListener: function (eventName, callback) {
    if (!eventName) {
      this.events = {};
      return true;
    }
    var callbacks = this.events[eventName];
    if (!callbacks)
      return true;
    if (!callback) {
      this.events[eventName] = [];
      return true;
    }
    for (var i = 0; i < callbacks.length; i++) {
      if (callbacks[i] === callback) {
        this.events[eventName].splice(i, 1);
        return true;
      }
    }
    return false;
  },
  dispatchEvent: function (eventName) {
    var i,
      args,
      callbacks = this.events[eventName];

    if (callbacks) {
      args = Array.prototype.slice.call(arguments, 1);
      for (i = 0; i < callbacks.length; i++) {
        callbacks[i].apply(this, args);
      }
    }
  },
  // end: fake events

  // fake DOM attribute methods
  hasAttribute: function (name) {
    return (name in this.attributes);
  },
  removeAttribute: function (name) {
    delete this.attributes[name];
  },
  getAttribute: function (name) {
    if (this.hasAttribute(name)) {
      return this.attributes[name];
    }
    return '';
  },
  setAttribute: function (name, value) {
    this.attributes[name] = value;
  },
  remove: function () {
    mejs.Utility.removeSwf(this.pluginElement.id);
    mejs.MediaPluginBridge.unregisterPluginElement(this.pluginElement.id);
  }
};

// Handles calls from Flash/Silverlight and reports them as native <video/audio> events and properties
mejs.MediaPluginBridge = {

	pluginMediaElements:{},
	htmlMediaElements:{},

	registerPluginElement: function (id, pluginMediaElement, htmlMediaElement) {
		this.pluginMediaElements[id] = pluginMediaElement;
		this.htmlMediaElements[id] = htmlMediaElement;
	},

	unregisterPluginElement: function (id) {
		delete this.pluginMediaElements[id];
		delete this.htmlMediaElements[id];
	},

	// when Flash/Silverlight is ready, it calls out to this method
	initPlugin: function (id) {

		var pluginMediaElement = this.pluginMediaElements[id],
			htmlMediaElement = this.htmlMediaElements[id];

		if (pluginMediaElement) {
			// find the javascript bridge
			switch (pluginMediaElement.pluginType) {
				case "flash":
					pluginMediaElement.pluginElement = pluginMediaElement.pluginApi = document.getElementById(id);
					break;
				case "silverlight":
					pluginMediaElement.pluginElement = document.getElementById(pluginMediaElement.id);
					pluginMediaElement.pluginApi = pluginMediaElement.pluginElement.Content.MediaElementJS;
					break;
			}
	
			if (pluginMediaElement.pluginApi != null && pluginMediaElement.success) {
				pluginMediaElement.success(pluginMediaElement, htmlMediaElement);
			}
		}
	},

	// receives events from Flash/Silverlight and sends them out as HTML5 media events
	// http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html
	fireEvent: function (id, eventName, values) {

		var
			e,
			i,
			bufferedTime,
			pluginMediaElement = this.pluginMediaElements[id];

		if(!pluginMediaElement){
            return;
        }
        
		// fake event object to mimic real HTML media event.
		e = {
			type: eventName,
			target: pluginMediaElement
		};

		// attach all values to element and event object
		for (i in values) {
			pluginMediaElement[i] = values[i];
			e[i] = values[i];
		}

		// fake the newer W3C buffered TimeRange (loaded and total have been removed)
		bufferedTime = values.bufferedTime || 0;

		e.target.buffered = e.buffered = {
			start: function(index) {
				return 0;
			},
			end: function (index) {
				return bufferedTime;
			},
			length: 1
		};

		pluginMediaElement.dispatchEvent(e.type, e);
	}
};

/*
Default options
*/
mejs.MediaElementDefaults = {
	// allows testing on HTML5, flash, silverlight
	// auto: attempts to detect what the browser can do
	// auto_plugin: prefer plugins and then attempt native HTML5
	// native: forces HTML5 playback
	// shim: disallows HTML5, will attempt either Flash or Silverlight
	// none: forces fallback view
	mode: 'auto',
	// remove or reorder to change plugin priority and availability
	plugins: ['flash','silverlight','youtube','vimeo'],
	// shows debug errors on screen
	enablePluginDebug: false,
	// use plugin for browsers that have trouble with Basic Authentication on HTTPS sites
	httpsBasicAuthSite: false,
	// overrides the type specified, useful for dynamic instantiation
	type: '',
	// path to Flash and Silverlight plugins
	pluginPath: mejs.Utility.getScriptPath(['mediaelement.base.js','mediaelement.base.min.js','mediaelement.js','mediaelement.min.js']),
	// name of flash file
	flashName: 'flashmediaelement.swf',
	// streamer for RTMP streaming
	flashStreamer: '',
	// turns on the smoothing filter in Flash
	enablePluginSmoothing: false,
	// enabled pseudo-streaming (seek) on .mp4 files
	enablePseudoStreaming: false,
	// start query parameter sent to server for pseudo-streaming
	pseudoStreamingStartQueryParam: 'start',
	// name of silverlight file
	silverlightName: 'silverlightmediaelement.xap',
	// default if the <video width> is not specified
	defaultVideoWidth: 480,
	// default if the <video height> is not specified
	defaultVideoHeight: 270,
	// overrides <video width>
	pluginWidth: -1,
	// overrides <video height>
	pluginHeight: -1,
	// additional plugin variables in 'key=value' form
	pluginVars: [],	
	// rate in milliseconds for Flash and Silverlight to fire the timeupdate event
	// larger number is less accurate, but less strain on plugin->JavaScript bridge
	timerRate: 250,
	// initial volume for player
	startVolume: 0.8,
	success: function () { },
	error: function () { }
};

/*
Determines if a browser supports the <video> or <audio> element
and returns either the native element or a Flash/Silverlight version that
mimics HTML5 MediaElement
*/
mejs.MediaElement = function (el, o) {
	return mejs.HtmlMediaElementShim.create(el,o);
};
=======
var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _general = _dereq_(18);

var _media2 = _dereq_(19);

var _renderer = _dereq_(7);

var _constants = _dereq_(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MediaElement = function MediaElement(idOrNode, options, sources) {
	var _this = this;

	_classCallCheck(this, MediaElement);

	var t = this;

	sources = Array.isArray(sources) ? sources : null;

	t.defaults = {
		renderers: [],

		fakeNodeName: 'mediaelementwrapper',

		pluginPath: 'build/',

		shimScriptAccess: 'sameDomain'
	};

	options = Object.assign(t.defaults, options);

	t.mediaElement = _document2.default.createElement(options.fakeNodeName);

	var id = idOrNode,
	    error = false;

	if (typeof idOrNode === 'string') {
		t.mediaElement.originalNode = _document2.default.getElementById(idOrNode);
	} else {
		t.mediaElement.originalNode = idOrNode;
		id = idOrNode.id;
	}

	if (t.mediaElement.originalNode === undefined || t.mediaElement.originalNode === null) {
		return null;
	}

	t.mediaElement.options = options;
	id = id || 'mejs_' + Math.random().toString().slice(2);

	t.mediaElement.originalNode.setAttribute('id', id + '_from_mejs');
>>>>>>> Stashed changes

mejs.HtmlMediaElementShim = {

	create: function(el, o) {
		var
			options = mejs.MediaElementDefaults,
			htmlMediaElement = (typeof(el) == 'string') ? document.getElementById(el) : el,
			tagName = htmlMediaElement.tagName.toLowerCase(),
			isMediaTag = (tagName === 'audio' || tagName === 'video'),
			src = (isMediaTag) ? htmlMediaElement.getAttribute('src') : htmlMediaElement.getAttribute('href'),
			poster = htmlMediaElement.getAttribute('poster'),
			autoplay =  htmlMediaElement.getAttribute('autoplay'),
			preload =  htmlMediaElement.getAttribute('preload'),
			controls =  htmlMediaElement.getAttribute('controls'),
			playback,
			prop;

		// extend options
		for (prop in o) {
			options[prop] = o[prop];
		}

		// clean up attributes
		src = 		(typeof src == 'undefined' 	|| src === null || src == '') ? null : src;		
		poster =	(typeof poster == 'undefined' 	|| poster === null) ? '' : poster;
		preload = 	(typeof preload == 'undefined' 	|| preload === null || preload === 'false') ? 'none' : preload;
		autoplay = 	!(typeof autoplay == 'undefined' || autoplay === null || autoplay === 'false');
		controls = 	!(typeof controls == 'undefined' || controls === null || controls === 'false');

		// test for HTML5 and plugin capabilities
		playback = this.determinePlayback(htmlMediaElement, options, mejs.MediaFeatures.supportsMediaTag, isMediaTag, src);
		playback.url = (playback.url !== null) ? mejs.Utility.absolutizeUrl(playback.url) : '';

		if (playback.method == 'native') {
			// second fix for android
			if (mejs.MediaFeatures.isBustedAndroid) {
				htmlMediaElement.src = playback.url;
				htmlMediaElement.addEventListener('click', function() {
					htmlMediaElement.play();
				}, false);
			}
		
			// add methods to native HTMLMediaElement
			return this.updateNative(playback, options, autoplay, preload);
		} else if (playback.method !== '') {
			// create plugin to mimic HTMLMediaElement
			
			return this.createPlugin( playback,  options, poster, autoplay, preload, controls);
		} else {
			// boo, no HTML5, no Flash, no Silverlight.
			this.createErrorMessage( playback, options, poster );
			
			return this;
		}
	},
	
	determinePlayback: function(htmlMediaElement, options, supportsMediaTag, isMediaTag, src) {
		var
			mediaFiles = [],
			i,
			j,
			k,
			l,
			n,
			type,
			result = { method: '', url: '', htmlMediaElement: htmlMediaElement, isVideo: (htmlMediaElement.tagName.toLowerCase() != 'audio')},
			pluginName,
			pluginVersions,
			pluginInfo,
			dummy,
			media;
			
		// STEP 1: Get URL and type from <video src> or <source src>

		// supplied type overrides <video type> and <source type>
		if (typeof options.type != 'undefined' && options.type !== '') {
			
			// accept either string or array of types
			if (typeof options.type == 'string') {
				mediaFiles.push({type:options.type, url:src});
			} else {
				
				for (i=0; i<options.type.length; i++) {
					mediaFiles.push({type:options.type[i], url:src});
				}
			}

		// test for src attribute first
		} else if (src !== null) {
			type = this.formatType(src, htmlMediaElement.getAttribute('type'));
			mediaFiles.push({type:type, url:src});

		// then test for <source> elements
		} else {
			// test <source> types to see if they are usable
			for (i = 0; i < htmlMediaElement.childNodes.length; i++) {
				n = htmlMediaElement.childNodes[i];
				if (n.nodeType == 1 && n.tagName.toLowerCase() == 'source') {
					src = n.getAttribute('src');
					type = this.formatType(src, n.getAttribute('type'));
					media = n.getAttribute('media');

					if (!media || !window.matchMedia || (window.matchMedia && window.matchMedia(media).matches)) {
						mediaFiles.push({type:type, url:src});
					}
				}
			}
		}
		
		// in the case of dynamicly created players
		// check for audio types
		if (!isMediaTag && mediaFiles.length > 0 && mediaFiles[0].url !== null && this.getTypeFromFile(mediaFiles[0].url).indexOf('audio') > -1) {
			result.isVideo = false;
		}
		

		// STEP 2: Test for playback method
		
		// special case for Android which sadly doesn't implement the canPlayType function (always returns '')
		if (mejs.MediaFeatures.isBustedAndroid) {
			htmlMediaElement.canPlayType = function(type) {
				return (type.match(/video\/(mp4|m4v)/gi) !== null) ? 'maybe' : '';
			};
		}		
		
		// special case for Chromium to specify natively supported video codecs (i.e. WebM and Theora) 
		if (mejs.MediaFeatures.isChromium) { 
			htmlMediaElement.canPlayType = function(type) { 
				return (type.match(/video\/(webm|ogv|ogg)/gi) !== null) ? 'maybe' : ''; 
			}; 
		}

		// test for native playback first
		if (supportsMediaTag && (options.mode === 'auto' || options.mode === 'auto_plugin' || options.mode === 'native')  && !(mejs.MediaFeatures.isBustedNativeHTTPS && options.httpsBasicAuthSite === true)) {
						
			if (!isMediaTag) {

				// create a real HTML5 Media Element 
				dummy = document.createElement( result.isVideo ? 'video' : 'audio');			
				htmlMediaElement.parentNode.insertBefore(dummy, htmlMediaElement);
				htmlMediaElement.style.display = 'none';
				
				// use this one from now on
				result.htmlMediaElement = htmlMediaElement = dummy;
			}
				
			for (i=0; i<mediaFiles.length; i++) {
				// normal check
				if (mediaFiles[i].type == "video/m3u8" || htmlMediaElement.canPlayType(mediaFiles[i].type).replace(/no/, '') !== ''
					// special case for Mac/Safari 5.0.3 which answers '' to canPlayType('audio/mp3') but 'maybe' to canPlayType('audio/mpeg')
					|| htmlMediaElement.canPlayType(mediaFiles[i].type.replace(/mp3/,'mpeg')).replace(/no/, '') !== ''
					// special case for m4a supported by detecting mp4 support
					|| htmlMediaElement.canPlayType(mediaFiles[i].type.replace(/m4a/,'mp4')).replace(/no/, '') !== '') {
					result.method = 'native';
					result.url = mediaFiles[i].url;
					break;
				}
			}			
			
			if (result.method === 'native') {
				if (result.url !== null) {
					htmlMediaElement.src = result.url;
				}
			
				// if `auto_plugin` mode, then cache the native result but try plugins.
				if (options.mode !== 'auto_plugin') {
					return result;
				}
			}
		}

		// if native playback didn't work, then test plugins
		if (options.mode === 'auto' || options.mode === 'auto_plugin' || options.mode === 'shim') {
			for (i=0; i<mediaFiles.length; i++) {
				type = mediaFiles[i].type;

				// test all plugins in order of preference [silverlight, flash]
				for (j=0; j<options.plugins.length; j++) {

					pluginName = options.plugins[j];
			
					// test version of plugin (for future features)
					pluginVersions = mejs.plugins[pluginName];				
					
					for (k=0; k<pluginVersions.length; k++) {
						pluginInfo = pluginVersions[k];
					
						// test if user has the correct plugin version
						
						// for youtube/vimeo
						if (pluginInfo.version == null || 
							
							mejs.PluginDetector.hasPluginVersion(pluginName, pluginInfo.version)) {

							// test for plugin playback types
							for (l=0; l<pluginInfo.types.length; l++) {
								// find plugin that can play the type
								if (type == pluginInfo.types[l]) {
									result.method = pluginName;
									result.url = mediaFiles[i].url;
									return result;
								}
							}
						}
					}
				}
			}
		}
		
		// at this point, being in 'auto_plugin' mode implies that we tried plugins but failed.
		// if we have native support then return that.
		if (options.mode === 'auto_plugin' && result.method === 'native') {
			return result;
		}

		// what if there's nothing to play? just grab the first available
		if (result.method === '' && mediaFiles.length > 0) {
			result.url = mediaFiles[0].url;
		}

		return result;
	},

	formatType: function(url, type) {
		var ext;

		// if no type is supplied, fake it with the extension
		if (url && !type) {		
			return this.getTypeFromFile(url);
		} else {
			// only return the mime part of the type in case the attribute contains the codec
			// see http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html#the-source-element
			// `video/mp4; codecs="avc1.42E01E, mp4a.40.2"` becomes `video/mp4`
			
			if (type && ~type.indexOf(';')) {
				return type.substr(0, type.indexOf(';')); 
			} else {
				return type;
			}
		}
	},
	
	getTypeFromFile: function(url) {
		url = url.split('?')[0];
		var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
		return (/(mp4|m4v|ogg|ogv|m3u8|webm|webmv|flv|wmv|mpeg|mov)/gi.test(ext) ? 'video' : 'audio') + '/' + this.getTypeFromExtension(ext);
	},
	
	getTypeFromExtension: function(ext) {
		
		switch (ext) {
			case 'mp4':
			case 'm4v':
			case 'm4a':
				return 'mp4';
			case 'webm':
			case 'webma':
			case 'webmv':	
				return 'webm';
			case 'ogg':
			case 'oga':
			case 'ogv':	
				return 'ogg';
			default:
				return ext;
		}
	},

	createErrorMessage: function(playback, options, poster) {
		var 
			htmlMediaElement = playback.htmlMediaElement,
			errorContainer = document.createElement('div');
			
		errorContainer.className = 'me-cannotplay';

		try {
			errorContainer.style.width = htmlMediaElement.width + 'px';
			errorContainer.style.height = htmlMediaElement.height + 'px';
		} catch (e) {}

    if (options.customError) {
      errorContainer.innerHTML = options.customError;
    } else {
      errorContainer.innerHTML = (poster !== '') ?
        '<a href="' + playback.url + '"><img src="' + poster + '" width="100%" height="100%" /></a>' :
        '<a href="' + playback.url + '"><span>Download File</span></a>';
    }

		htmlMediaElement.parentNode.insertBefore(errorContainer, htmlMediaElement);
		htmlMediaElement.style.display = 'none';

		options.error(htmlMediaElement);
	},

	createPlugin:function(playback, options, poster, autoplay, preload, controls) {
		var 
			htmlMediaElement = playback.htmlMediaElement,
			width = 1,
			height = 1,
			pluginid = 'me_' + playback.method + '_' + (mejs.meIndex++),
			pluginMediaElement = new mejs.PluginMediaElement(pluginid, playback.method, playback.url),
			container = document.createElement('div'),
			specialIEContainer,
			node,
			initVars;

		// copy tagName from html media element
		pluginMediaElement.tagName = htmlMediaElement.tagName

		// copy attributes from html media element to plugin media element
		for (var i = 0; i < htmlMediaElement.attributes.length; i++) {
			var attribute = htmlMediaElement.attributes[i];
			if (attribute.specified == true) {
				pluginMediaElement.setAttribute(attribute.name, attribute.value);
			}
		}

		// check for placement inside a <p> tag (sometimes WYSIWYG editors do this)
		node = htmlMediaElement.parentNode;
		while (node !== null && node.tagName.toLowerCase() !== 'body' && node.parentNode != null) {
			if (node.parentNode.tagName.toLowerCase() === 'p') {
				node.parentNode.parentNode.insertBefore(node, node.parentNode);
				break;
			}
			node = node.parentNode;
		}

		if (playback.isVideo) {
			width = (options.pluginWidth > 0) ? options.pluginWidth : (options.videoWidth > 0) ? options.videoWidth : (htmlMediaElement.getAttribute('width') !== null) ? htmlMediaElement.getAttribute('width') : options.defaultVideoWidth;
			height = (options.pluginHeight > 0) ? options.pluginHeight : (options.videoHeight > 0) ? options.videoHeight : (htmlMediaElement.getAttribute('height') !== null) ? htmlMediaElement.getAttribute('height') : options.defaultVideoHeight;
		
			// in case of '%' make sure it's encoded
			width = mejs.Utility.encodeUrl(width);
			height = mejs.Utility.encodeUrl(height);
		
		} else {
			if (options.enablePluginDebug) {
				width = 320;
				height = 240;
			}
		}

		// register plugin
		pluginMediaElement.success = options.success;
		mejs.MediaPluginBridge.registerPluginElement(pluginid, pluginMediaElement, htmlMediaElement);

		// add container (must be added to DOM before inserting HTML for IE)
		container.className = 'me-plugin';
		container.id = pluginid + '_container';
		
		if (playback.isVideo) {
				htmlMediaElement.parentNode.insertBefore(container, htmlMediaElement);
		} else {
				document.body.insertBefore(container, document.body.childNodes[0]);
		}

		// flash/silverlight vars
		initVars = [
			'id=' + pluginid,
			'jsinitfunction=' + "mejs.MediaPluginBridge.initPlugin",
			'jscallbackfunction=' + "mejs.MediaPluginBridge.fireEvent",
			'isvideo=' + ((playback.isVideo) ? "true" : "false"),
			'autoplay=' + ((autoplay) ? "true" : "false"),
			'preload=' + preload,
			'width=' + width,
			'startvolume=' + options.startVolume,
			'timerrate=' + options.timerRate,
			'flashstreamer=' + options.flashStreamer,
			'height=' + height,
			'pseudostreamstart=' + options.pseudoStreamingStartQueryParam];

		if (playback.url !== null) {
			if (playback.method == 'flash') {
				initVars.push('file=' + mejs.Utility.encodeUrl(playback.url));
			} else {
				initVars.push('file=' + playback.url);
			}
		}
		if (options.enablePluginDebug) {
			initVars.push('debug=true');
		}
		if (options.enablePluginSmoothing) {
			initVars.push('smoothing=true');
		}
    if (options.enablePseudoStreaming) {
      initVars.push('pseudostreaming=true');
    }
		if (controls) {
			initVars.push('controls=true'); // shows controls in the plugin if desired
		}
		if (options.pluginVars) {
			initVars = initVars.concat(options.pluginVars);
		}		

		switch (playback.method) {
			case 'silverlight':
				container.innerHTML =
'<object data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="' + pluginid + '" name="' + pluginid + '" width="' + width + '" height="' + height + '" class="mejs-shim">' +
'<param name="initParams" value="' + initVars.join(',') + '" />' +
'<param name="windowless" value="true" />' +
'<param name="background" value="black" />' +
'<param name="minRuntimeVersion" value="3.0.0.0" />' +
'<param name="autoUpgrade" value="true" />' +
'<param name="source" value="' + options.pluginPath + options.silverlightName + '" />' +
'</object>';
					break;

			case 'flash':

				if (mejs.MediaFeatures.isIE) {
					specialIEContainer = document.createElement('div');
					container.appendChild(specialIEContainer);
					specialIEContainer.outerHTML =
'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" ' +
'id="' + pluginid + '" width="' + width + '" height="' + height + '" class="mejs-shim">' +
'<param name="movie" value="' + options.pluginPath + options.flashName + '?x=' + (new Date()) + '" />' +
'<param name="flashvars" value="' + initVars.join('&amp;') + '" />' +
'<param name="quality" value="high" />' +
'<param name="bgcolor" value="#000000" />' +
'<param name="wmode" value="transparent" />' +
'<param name="allowScriptAccess" value="always" />' +
'<param name="allowFullScreen" value="true" />' +
'<param name="scale" value="default" />' + 
'</object>';

				} else {

					container.innerHTML =
'<embed id="' + pluginid + '" name="' + pluginid + '" ' +
'play="true" ' +
'loop="false" ' +
'quality="high" ' +
'bgcolor="#000000" ' +
'wmode="transparent" ' +
'allowScriptAccess="always" ' +
'allowFullScreen="true" ' +
'type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer" ' +
'src="' + options.pluginPath + options.flashName + '" ' +
'flashvars="' + initVars.join('&') + '" ' +
'width="' + width + '" ' +
'height="' + height + '" ' +
'scale="default"' + 
'class="mejs-shim"></embed>';
				}
				break;
			
			case 'youtube':
			
				
				var videoId;
				// youtu.be url from share button
				if (playback.url.lastIndexOf("youtu.be") != -1) {
					videoId = playback.url.substr(playback.url.lastIndexOf('/')+1);
					if (videoId.indexOf('?') != -1) {
						videoId = videoId.substr(0, videoId.indexOf('?'));
					}
				}
				else {
					videoId = playback.url.substr(playback.url.lastIndexOf('=')+1);
				}
				youtubeSettings = {
						container: container,
						containerId: container.id,
						pluginMediaElement: pluginMediaElement,
						pluginId: pluginid,
						videoId: videoId,
						height: height,
						width: width	
					};				
				
				if (mejs.PluginDetector.hasPluginVersion('flash', [10,0,0]) ) {
					mejs.YouTubeApi.createFlash(youtubeSettings);
				} else {
					mejs.YouTubeApi.enqueueIframe(youtubeSettings);		
				}
				
				break;
			
			// DEMO Code. Does NOT work.
			case 'vimeo':
				var player_id = pluginid + "_player";
				pluginMediaElement.vimeoid = playback.url.substr(playback.url.lastIndexOf('/')+1);
				
				container.innerHTML ='<iframe src="//player.vimeo.com/video/' + pluginMediaElement.vimeoid + '?api=1&portrait=0&byline=0&title=0&player_id=' + player_id + '" width="' + width +'" height="' + height +'" frameborder="0" class="mejs-shim" id="' + player_id + '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
				if (typeof($f) == 'function') { // froogaloop available
					var player = $f(container.childNodes[0]);
					
					player.addEvent('ready', function() {
						
						player.playVideo = function() {
							player.api( 'play' );
						} 
						player.stopVideo = function() {
							player.api( 'unload' );
						} 
						player.pauseVideo = function() {
							player.api( 'pause' );
						} 
						player.seekTo = function( seconds ) {
							player.api( 'seekTo', seconds );
						}
						player.setVolume = function( volume ) {
							player.api( 'setVolume', volume );
						}
						player.setMuted = function( muted ) {
							if( muted ) {
								player.lastVolume = player.api( 'getVolume' );
								player.api( 'setVolume', 0 );
							} else {
								player.api( 'setVolume', player.lastVolume );
								delete player.lastVolume;
							}
						}						

						function createEvent(player, pluginMediaElement, eventName, e) {
							var obj = {
								type: eventName,
								target: pluginMediaElement
							};
							if (eventName == 'timeupdate') {
								pluginMediaElement.currentTime = obj.currentTime = e.seconds;
								pluginMediaElement.duration = obj.duration = e.duration;
							}
							pluginMediaElement.dispatchEvent(obj.type, obj);
						}

						player.addEvent('play', function() {
							createEvent(player, pluginMediaElement, 'play');
							createEvent(player, pluginMediaElement, 'playing');
						});

						player.addEvent('pause', function() {
							createEvent(player, pluginMediaElement, 'pause');
						});

						player.addEvent('finish', function() {
							createEvent(player, pluginMediaElement, 'ended');
						});

						player.addEvent('playProgress', function(e) {
							createEvent(player, pluginMediaElement, 'timeupdate', e);
						});

						pluginMediaElement.pluginElement = container;
						pluginMediaElement.pluginApi = player;

						// init mejs
						mejs.MediaPluginBridge.initPlugin(pluginid);
					});
				}
				else {
					console.warn("You need to include froogaloop for vimeo to work");
				}
				break;			
		}
		// hide original element
		htmlMediaElement.style.display = 'none';
		// prevent browser from autoplaying when using a plugin
		htmlMediaElement.removeAttribute('autoplay');

		// FYI: options.success will be fired by the MediaPluginBridge
		
		return pluginMediaElement;
	},

	updateNative: function(playback, options, autoplay, preload) {
		
		var htmlMediaElement = playback.htmlMediaElement,
			m;
		
		
		// add methods to video object to bring it into parity with Flash Object
		for (m in mejs.HtmlMediaElement) {
			htmlMediaElement[m] = mejs.HtmlMediaElement[m];
		}

		/*
		Chrome now supports preload="none"
		if (mejs.MediaFeatures.isChrome) {
		
			// special case to enforce preload attribute (Chrome doesn't respect this)
			if (preload === 'none' && !autoplay) {
			
				// forces the browser to stop loading (note: fails in IE9)
				htmlMediaElement.src = '';
				htmlMediaElement.load();
				htmlMediaElement.canceledPreload = true;

				htmlMediaElement.addEventListener('play',function() {
					if (htmlMediaElement.canceledPreload) {
						htmlMediaElement.src = playback.url;
						htmlMediaElement.load();
						htmlMediaElement.play();
						htmlMediaElement.canceledPreload = false;
					}
				}, false);
			// for some reason Chrome forgets how to autoplay sometimes.
			} else if (autoplay) {
				htmlMediaElement.load();
				htmlMediaElement.play();
			}
		}
		*/

		// fire success code
		options.success(htmlMediaElement, htmlMediaElement);
		
		return htmlMediaElement;
	}
};

/*
 - test on IE (object vs. embed)
 - determine when to use iframe (Firefox, Safari, Mobile) vs. Flash (Chrome, IE)
 - fullscreen?
*/

// YouTube Flash and Iframe API
mejs.YouTubeApi = {
	isIframeStarted: false,
	isIframeLoaded: false,
	loadIframeApi: function() {
		if (!this.isIframeStarted) {
			var tag = document.createElement('script');
			tag.src = "//www.youtube.com/player_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			this.isIframeStarted = true;
		}
	},
	iframeQueue: [],
	enqueueIframe: function(yt) {
		
		if (this.isLoaded) {
			this.createIframe(yt);
		} else {
			this.loadIframeApi();
			this.iframeQueue.push(yt);
		}
	},
	createIframe: function(settings) {
		
		var
		pluginMediaElement = settings.pluginMediaElement,	
		player = new YT.Player(settings.containerId, {
			height: settings.height,
			width: settings.width,
			videoId: settings.videoId,
			playerVars: {controls:0},
			events: {
				'onReady': function() {
					
					// hook up iframe object to MEjs
					settings.pluginMediaElement.pluginApi = player;
					
					// init mejs
					mejs.MediaPluginBridge.initPlugin(settings.pluginId);
					
					// create timer
					setInterval(function() {
						mejs.YouTubeApi.createEvent(player, pluginMediaElement, 'timeupdate');
					}, 250);					
				},
				'onStateChange': function(e) {
					
					mejs.YouTubeApi.handleStateChange(e.data, player, pluginMediaElement);
					
				}
			}
		});
	},
	
	createEvent: function (player, pluginMediaElement, eventName) {
		var obj = {
			type: eventName,
			target: pluginMediaElement
		};

		if (player && player.getDuration) {
			
			// time 
			pluginMediaElement.currentTime = obj.currentTime = player.getCurrentTime();
			pluginMediaElement.duration = obj.duration = player.getDuration();
			
			// state
			obj.paused = pluginMediaElement.paused;
			obj.ended = pluginMediaElement.ended;			
			
			// sound
			obj.muted = player.isMuted();
			obj.volume = player.getVolume() / 100;
			
			// progress
			obj.bytesTotal = player.getVideoBytesTotal();
			obj.bufferedBytes = player.getVideoBytesLoaded();
			
			// fake the W3C buffered TimeRange
			var bufferedTime = obj.bufferedBytes / obj.bytesTotal * obj.duration;
			
			obj.target.buffered = obj.buffered = {
				start: function(index) {
					return 0;
				},
				end: function (index) {
					return bufferedTime;
				},
				length: 1
			};

		}
		
		// send event up the chain
		pluginMediaElement.dispatchEvent(obj.type, obj);
	},	
	
	iFrameReady: function() {
		
		this.isLoaded = true;
		this.isIframeLoaded = true;
		
		while (this.iframeQueue.length > 0) {
			var settings = this.iframeQueue.pop();
			this.createIframe(settings);
		}	
	},
	
	// FLASH!
	flashPlayers: {},
	createFlash: function(settings) {
		
		this.flashPlayers[settings.pluginId] = settings;
		
		/*
		settings.container.innerHTML =
			'<object type="application/x-shockwave-flash" id="' + settings.pluginId + '" data="//www.youtube.com/apiplayer?enablejsapi=1&amp;playerapiid=' + settings.pluginId  + '&amp;version=3&amp;autoplay=0&amp;controls=0&amp;modestbranding=1&loop=0" ' +
				'width="' + settings.width + '" height="' + settings.height + '" style="visibility: visible; " class="mejs-shim">' +
				'<param name="allowScriptAccess" value="always">' +
				'<param name="wmode" value="transparent">' +
			'</object>';
		*/

		var specialIEContainer,
			youtubeUrl = '//www.youtube.com/apiplayer?enablejsapi=1&amp;playerapiid=' + settings.pluginId  + '&amp;version=3&amp;autoplay=0&amp;controls=0&amp;modestbranding=1&loop=0';
			
		if (mejs.MediaFeatures.isIE) {
			
			specialIEContainer = document.createElement('div');
			settings.container.appendChild(specialIEContainer);
			specialIEContainer.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" ' +
'id="' + settings.pluginId + '" width="' + settings.width + '" height="' + settings.height + '" class="mejs-shim">' +
	'<param name="movie" value="' + youtubeUrl + '" />' +
	'<param name="wmode" value="transparent" />' +
	'<param name="allowScriptAccess" value="always" />' +
	'<param name="allowFullScreen" value="true" />' +
'</object>';
		} else {
		settings.container.innerHTML =
			'<object type="application/x-shockwave-flash" id="' + settings.pluginId + '" data="' + youtubeUrl + '" ' +
				'width="' + settings.width + '" height="' + settings.height + '" style="visibility: visible; " class="mejs-shim">' +
				'<param name="allowScriptAccess" value="always">' +
				'<param name="wmode" value="transparent">' +
			'</object>';
		}		
		
	},
	
	flashReady: function(id) {
		var
			settings = this.flashPlayers[id],
			player = document.getElementById(id),
			pluginMediaElement = settings.pluginMediaElement;
		
		// hook up and return to MediaELementPlayer.success	
		pluginMediaElement.pluginApi = 
		pluginMediaElement.pluginElement = player;
		mejs.MediaPluginBridge.initPlugin(id);
		
		// load the youtube video
		player.cueVideoById(settings.videoId);
		
		var callbackName = settings.containerId + '_callback';
		
		window[callbackName] = function(e) {
			mejs.YouTubeApi.handleStateChange(e, player, pluginMediaElement);
		}
		
		player.addEventListener('onStateChange', callbackName);
		
		setInterval(function() {
			mejs.YouTubeApi.createEvent(player, pluginMediaElement, 'timeupdate');
		}, 250);
		
		mejs.YouTubeApi.createEvent(player, pluginMediaElement, 'canplay');
	},
	
	handleStateChange: function(youTubeState, player, pluginMediaElement) {
		switch (youTubeState) {
			case -1: // not started
				pluginMediaElement.paused = true;
				pluginMediaElement.ended = true;
				mejs.YouTubeApi.createEvent(player, pluginMediaElement, 'loadedmetadata');
				//createYouTubeEvent(player, pluginMediaElement, 'loadeddata');
				break;
			case 0:
				pluginMediaElement.paused = false;
				pluginMediaElement.ended = true;
				mejs.YouTubeApi.createEvent(player, pluginMediaElement, 'ended');
				break;
			case 1:
				pluginMediaElement.paused = false;
				pluginMediaElement.ended = false;				
				mejs.YouTubeApi.createEvent(player, pluginMediaElement, 'play');
				mejs.YouTubeApi.createEvent(player, pluginMediaElement, 'playing');
				break;
			case 2:
				pluginMediaElement.paused = true;
				pluginMediaElement.ended = false;				
				mejs.YouTubeApi.createEvent(player, pluginMediaElement, 'pause');
				break;
			case 3: // buffering
				mejs.YouTubeApi.createEvent(player, pluginMediaElement, 'progress');
				break;
			case 5:
				// cued?
				break;						
			
		}			
		
	}
}
// IFRAME
function onYouTubePlayerAPIReady() {
	mejs.YouTubeApi.iFrameReady();
}
// FLASH
function onYouTubePlayerReady(id) {
	mejs.YouTubeApi.flashReady(id);
}

window.mejs = mejs;
window.MediaElement = mejs.MediaElement;

if (typeof jQuery != 'undefined') {
  mejs.$ = jQuery;
} else if (typeof ender != 'undefined') {
  mejs.$ = ender;
}
(function ($) {

  // default player values
  mejs.MepDefaults = {
    // url to poster (to fix iOS 3.x)
    poster: '',
    // When the video is ended, we can show the poster.
    showPosterWhenEnded: false,
    // default if the <video width> is not specified
    defaultVideoWidth: 480,
    // default if the <video height> is not specified
    defaultVideoHeight: 270,
    // if set, overrides <video width>
    videoWidth: -1,
    // if set, overrides <video height>
    videoHeight: -1,
    // default if the user doesn't specify
    defaultAudioWidth: 400,
    // default if the user doesn't specify
    defaultAudioHeight: 30,
    // default amount to move back when back key is pressed
    defaultSeekBackwardInterval: function (media) {
      return (media.duration * 0.05);
    },
    // default amount to move forward when forward key is pressed
    defaultSeekForwardInterval: function (media) {
      return (media.duration * 0.05);
    },
    // set dimensions via JS instead of CSS
    setDimensions: true,
    // width of audio player
    audioWidth: -1,
    // height of audio player
    audioHeight: -1,
    // initial volume when the player starts (overrided by user cookie)
    startVolume: 0.8,
    // useful for <audio> player loops
    loop: false,
    // rewind to beginning when media ends
    autoRewind: true,
    // resize to media dimensions
    enableAutosize: true,
    // forces the hour marker (##:00:00)
    alwaysShowHours: false,
    // show framecount in timecode (##:00:00:00)
    showTimecodeFrameCount: false,
    // used when showTimecodeFrameCount is set to true
    framesPerSecond: 25,
    // automatically calculate the width of the progress bar based on the sizes of other elements
    autosizeProgress: true,
    // Hide controls when playing and mouse is not over the video
    alwaysShowControls: false,
    // Display the video control
    hideVideoControlsOnLoad: false,
    // Enable click video element to toggle play/pause
    clickToPlayPause: true,
    // force iPad's native controls
    iPadUseNativeControls: false,
    // force iPhone's native controls
    iPhoneUseNativeControls: false,
    // force Android's native controls
    AndroidUseNativeControls: false,
    // features to show
    features: ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen'],
    // only for dynamic
    isVideo: true,
    // turns keyboard support on and off for this instance
    enableKeyboard: true,
    // whenthis player starts, it will pause other players
    pauseOtherPlayers: true,
    // array of keyboard actions such as play pause
    keyActions: [
      {
        keys: [
          32, // SPACE
          179 // GOOGLE play/pause button
        ],
        action: function (player, media) {
          if (media.paused || media.ended) {
            player.play();
          } else {
            player.pause();
          }
        }
      },
      {
        keys: [38], // UP
        action: function (player, media) {
          player.container.find('.mejs-volume-slider').css('display', 'block');
          if (player.isVideo) {
            player.showControls();
            player.startControlsTimer();
          }

          var newVolume = Math.min(media.volume + 0.1, 1);
          media.setVolume(newVolume);
        }
      },
      {
        keys: [40], // DOWN
        action: function (player, media) {
          player.container.find('.mejs-volume-slider').css('display', 'block');
          if (player.isVideo) {
            player.showControls();
            player.startControlsTimer();
          }

<<<<<<< Updated upstream
          var newVolume = Math.max(media.volume - 0.1, 0);
          media.setVolume(newVolume);
        }
      },
      {
        keys: [
          37, // LEFT
          227 // Google TV rewind
        ],
        action: function (player, media) {
          if (!isNaN(media.duration) && media.duration > 0) {
            if (player.isVideo) {
              player.showControls();
              player.startControlsTimer();
            }
=======
},{"16":16,"18":18,"19":19,"2":2,"3":3,"6":6,"7":7}],6:[function(_dereq_,module,exports){
'use strict';
>>>>>>> Stashed changes

            // 5%
            var newTime = Math.max(media.currentTime - player.options.defaultSeekBackwardInterval(media), 0);
            media.setCurrentTime(newTime);
          }
        }
      },
      {
        keys: [
          39, // RIGHT
          228 // Google TV forward
        ],
        action: function (player, media) {
          if (!isNaN(media.duration) && media.duration > 0) {
            if (player.isVideo) {
              player.showControls();
              player.startControlsTimer();
            }

            // 5%
            var newTime = Math.min(media.currentTime + player.options.defaultSeekForwardInterval(media), media.duration);
            media.setCurrentTime(newTime);
          }
        }
      },
      {
        keys: [70], // F
        action: function (player, media) {
          if (typeof player.enterFullScreen != 'undefined') {
            if (player.isFullScreen) {
              player.exitFullScreen();
            } else {
              player.enterFullScreen();
            }
          }
        }
      },
      {
        keys: [77], // M
        action: function (player, media) {
          player.container.find('.mejs-volume-slider').css('display', 'block');
          if (player.isVideo) {
            player.showControls();
            player.startControlsTimer();
          }
          if (player.media.muted) {
            player.setMuted(false);
          } else {
            player.setMuted(true);
          }
        }
      }
    ]
  };

  mejs.mepIndex = 0;

  mejs.players = {};

  // wraps a MediaElement object in player controls
  mejs.MediaElementPlayer = function (node, o) {
    // enforce object, even without "new" (via John Resig)
    if (!(this instanceof mejs.MediaElementPlayer)) {
      return new mejs.MediaElementPlayer(node, o);
    }

    var t = this;

    // these will be reset after the MediaElement.success fires
    t.$media = t.$node = $(node);
    t.node = t.media = t.$media[0];

    // check for existing player
    if (typeof t.node.player != 'undefined') {
      return t.node.player;
    } else {
      // attach player to DOM node for reference
      t.node.player = t;
    }


    // try to get options from data-mejsoptions
    if (typeof o == 'undefined') {
      o = t.$node.data('mejsoptions');
    }

    // extend default options
    t.options = $.extend({}, mejs.MepDefaults, o);

    // unique ID
    t.id = 'mep_' + mejs.mepIndex++;

<<<<<<< Updated upstream
    // add to player array (for focus events)
    mejs.players[t.id] = t;
=======
},{"3":3}],7:[function(_dereq_,module,exports){
'use strict';
>>>>>>> Stashed changes

    // start up
    t.init();

    return t;
  };

  // actual player
  mejs.MediaElementPlayer.prototype = {
    hasFocus: false,
    controlsAreVisible: true,
    init: function () {

      var
        t = this,
        mf = mejs.MediaFeatures,
        // options for MediaElement (shim)
        meOptions = $.extend(true, {}, t.options, {
          success: function (media, domNode) {
            t.meReady(media, domNode);
          },
          error: function (e) {
            t.handleError(e);
          }
        }),
        tagName = t.media.tagName.toLowerCase();

<<<<<<< Updated upstream
      t.isDynamic = (tagName !== 'audio' && tagName !== 'video');
=======
var _mejs = _dereq_(6);
>>>>>>> Stashed changes

      if (t.isDynamic) {
        // get video from src or href?
        t.isVideo = t.options.isVideo;
      } else {
        t.isVideo = (tagName !== 'audio' && t.options.isVideo);
      }

      // use native controls in iPad, iPhone, and Android
      if ((mf.isiPad && t.options.iPadUseNativeControls) || (mf.isiPhone && t.options.iPhoneUseNativeControls)) {

        // add controls and stop
        t.$media.attr('controls', 'controls');

        // attempt to fix iOS 3 bug
        //t.$media.removeAttr('poster');
        // no Issue found on iOS3 -ttroxell

        // override Apple's autoplay override for iPads
        if (mf.isiPad && t.media.getAttribute('autoplay') !== null) {
          t.play();
        }

      } else if (mf.isAndroid && t.options.AndroidUseNativeControls) {

        // leave default player

      } else {

        // DESKTOP: use MediaElementPlayer controls

        // remove native controls
        t.$media.removeAttr('controls');
        var videoPlayerTitle = t.isVideo ?
          'Video Player' : 'Audio Player';
        // insert description for screen readers
        $('<span class="mejs-offscreen">' + videoPlayerTitle + '</span>').insertBefore(t.$media);
        // build container
        t.container =
          $('<div id="' + t.id + '" class="mejs-container ' + (mejs.MediaFeatures.svg ? 'svg' : 'no-svg') +
            '" tabindex="0" role="application" aria-label="' + videoPlayerTitle + '">' +
            '<div class="mejs-inner">' +
            '<div class="mejs-mediaelement"></div>' +
            '<div class="mejs-layers"></div>' +
            '<div class="mejs-controls"></div>' +
            '<div class="mejs-clear"></div>' +
            '</div>' +
            '</div>')
          .addClass(t.$media[0].className)
          .insertBefore(t.$media)
          .focus(function (e) {
            if (!t.controlsAreVisible) {
              t.showControls(true);
              var playButton = t.container.find('.mejs-playpause-button > button');
              playButton.focus();
            }
          });

        // add classes for user and content
        t.container.addClass(
          (mf.isAndroid ? 'mejs-android ' : '') +
          (mf.isiOS ? 'mejs-ios ' : '') +
          (mf.isiPad ? 'mejs-ipad ' : '') +
          (mf.isiPhone ? 'mejs-iphone ' : '') +
          (t.isVideo ? 'mejs-video ' : 'mejs-audio ')
          );


        // move the <video/video> tag into the right spot
        if (mf.isiOS) {

          // sadly, you can't move nodes in iOS, so we have to destroy and recreate it!
          var $newMedia = t.$media.clone();

          t.container.find('.mejs-mediaelement').append($newMedia);

          t.$media.remove();
          t.$node = t.$media = $newMedia;
          t.node = t.media = $newMedia[0];

        } else {

          // normal way of moving it into place (doesn't work on iOS)
          t.container.find('.mejs-mediaelement').append(t.$media);
        }

        // find parts
        t.controls = t.container.find('.mejs-controls');
        t.layers = t.container.find('.mejs-layers');

        // determine the size

        /* size priority:
         (1) videoWidth (forced),
         (2) style="width;height;"
         (3) width attribute,
         (4) defaultVideoWidth (for unspecified cases)
         */

        var tagType = (t.isVideo ? 'video' : 'audio'),
          capsTagName = tagType.substring(0, 1).toUpperCase() + tagType.substring(1);


<<<<<<< Updated upstream
=======
},{"6":6}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _en = _dereq_(9);

var _general = _dereq_(18);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var i18n = { lang: 'en', en: _en.EN };

i18n.language = function () {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	if (args !== null && args !== undefined && args.length) {

		if (typeof args[0] !== 'string') {
			throw new TypeError('Language code must be a string value');
		}

		if (!/^[a-z]{2,3}((\-|_)[a-z]{2})?$/i.test(args[0])) {
			throw new TypeError('Language code must have format 2-3 letters and. optionally, hyphen, underscore followed by 2 more letters');
		}

		i18n.lang = args[0];

		if (i18n[args[0]] === undefined) {
			args[1] = args[1] !== null && args[1] !== undefined && _typeof(args[1]) === 'object' ? args[1] : {};
			i18n[args[0]] = !(0, _general.isObjectEmpty)(args[1]) ? args[1] : _en.EN;
		} else if (args[1] !== null && args[1] !== undefined && _typeof(args[1]) === 'object') {
			i18n[args[0]] = args[1];
		}
	}

	return i18n.lang;
};

i18n.t = function (message) {
	var pluralParam = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


	if (typeof message === 'string' && message.length) {

		var str = void 0,
		    pluralForm = void 0;

		var language = i18n.language();

		var _plural = function _plural(input, number, form) {

			if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) !== 'object' || typeof number !== 'number' || typeof form !== 'number') {
				return input;
			}

			var _pluralForms = function () {
				return [function () {
					return arguments.length <= 1 ? undefined : arguments[1];
				}, function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) === 1 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				}, function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) === 0 || (arguments.length <= 0 ? undefined : arguments[0]) === 1 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 !== 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) !== 0) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1 || (arguments.length <= 0 ? undefined : arguments[0]) === 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2 || (arguments.length <= 0 ? undefined : arguments[0]) === 12) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) > 2 && (arguments.length <= 0 ? undefined : arguments[0]) < 20) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 0 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 > 0 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 < 20) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 !== 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return [3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 !== 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 <= 4 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) <= 4) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 <= 4 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 === 1) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 === 2) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 === 3 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 === 4) {
						return arguments.length <= 4 ? undefined : arguments[4];
					} else {
						return arguments.length <= 1 ? undefined : arguments[1];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) > 2 && (arguments.length <= 0 ? undefined : arguments[0]) < 7) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) > 6 && (arguments.length <= 0 ? undefined : arguments[0]) < 11) {
						return arguments.length <= 4 ? undefined : arguments[4];
					} else {
						return arguments.length <= 5 ? undefined : arguments[5];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 0) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 3 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 <= 10) {
						return arguments.length <= 4 ? undefined : arguments[4];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 11) {
						return arguments.length <= 5 ? undefined : arguments[5];
					} else {
						return arguments.length <= 6 ? undefined : arguments[6];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 0 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 > 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 < 11) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 > 10 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 < 20) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) !== 11 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 <= 4 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) !== 8 && (arguments.length <= 0 ? undefined : arguments[0]) !== 11) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				}, function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) === 0 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 3) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 0) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}];
			}();

			return _pluralForms[form].apply(null, [number].concat(input));
		};

		if (i18n[language] !== undefined) {
			str = i18n[language][message];
			if (pluralParam !== null && typeof pluralParam === 'number') {
				pluralForm = i18n[language]['mejs.plural-form'];
				str = _plural.apply(null, [str, pluralParam, pluralForm]);
			}
		}

		if (!str && i18n.en) {
			str = i18n.en[message];
			if (pluralParam !== null && typeof pluralParam === 'number') {
				pluralForm = i18n.en['mejs.plural-form'];
				str = _plural.apply(null, [str, pluralParam, pluralForm]);
			}
		}

		str = str || message;

		if (pluralParam !== null && typeof pluralParam === 'number') {
			str = str.replace('%1', pluralParam);
		}

		return (0, _general.escapeHTML)(str);
	}

	return message;
};

_mejs2.default.i18n = i18n;

if (typeof mejsL10n !== 'undefined') {
	_mejs2.default.i18n.language(mejsL10n.language, mejsL10n.strings);
}

exports.default = i18n;

},{"18":18,"6":6,"9":9}],9:[function(_dereq_,module,exports){
'use strict';
>>>>>>> Stashed changes

        if (t.options[tagType + 'Width'] > 0 || t.options[tagType + 'Width'].toString().indexOf('%') > -1) {
          t.width = t.options[tagType + 'Width'];
        } else if (t.media.style.width !== '' && t.media.style.width !== null) {
          t.width = t.media.style.width;
        } else if (t.media.getAttribute('width') !== null) {
          t.width = t.$media.attr('width');
        } else {
          t.width = t.options['default' + capsTagName + 'Width'];
        }

        if (t.options[tagType + 'Height'] > 0 || t.options[tagType + 'Height'].toString().indexOf('%') > -1) {
          t.height = t.options[tagType + 'Height'];
        } else if (t.media.style.height !== '' && t.media.style.height !== null) {
          t.height = t.media.style.height;
        } else if (t.$media[0].getAttribute('height') !== null) {
          t.height = t.$media.attr('height');
        } else {
          t.height = t.options['default' + capsTagName + 'Height'];
        }

        // set the size, while we wait for the plugins to load below
        t.setPlayerSize(t.width, t.height);

        // create MediaElementShim
        meOptions.pluginWidth = t.width;
        meOptions.pluginHeight = t.height;
      }

      // create MediaElement shim
      mejs.MediaElement(t.$media[0], meOptions);

<<<<<<< Updated upstream
      if (typeof (t.container) != 'undefined' && t.controlsAreVisible) {
        // controls are shown when loaded
        t.container.trigger('controlsshown');
      }
    },
    showControls: function (doAnimation) {
      var t = this;
=======
var _mejs = _dereq_(6);
>>>>>>> Stashed changes

      doAnimation = typeof doAnimation == 'undefined' || doAnimation;

<<<<<<< Updated upstream
      if (t.controlsAreVisible)
        return;
=======
var _renderer = _dereq_(7);
>>>>>>> Stashed changes

      if (doAnimation) {
        t.controls
          .css('visibility', 'visible')
          .stop(true, true).fadeIn(200, function () {
          t.controlsAreVisible = true;
          t.container.trigger('controlsshown');
        });

        // any additional controls people might add and want to hide
        t.container.find('.mejs-control')
          .css('visibility', 'visible')
          .stop(true, true).fadeIn(200, function () {
          t.controlsAreVisible = true;
        });

      } else {
        t.controls
          .css('visibility', 'visible')
          .css('display', 'block');

        // any additional controls people might add and want to hide
        t.container.find('.mejs-control')
          .css('visibility', 'visible')
          .css('display', 'block');

        t.controlsAreVisible = true;
        t.container.trigger('controlsshown');
      }

      t.setControlsSize();

    },
    hideControls: function (doAnimation) {
      var t = this;

      doAnimation = typeof doAnimation == 'undefined' || doAnimation;

      if (!t.controlsAreVisible || t.options.alwaysShowControls || t.keyboardAction)
        return;

      if (doAnimation) {
        // fade out main controls
        t.controls.stop(true, true).fadeOut(200, function () {
          $(this)
            .css('visibility', 'hidden')
            .css('display', 'block');

          t.controlsAreVisible = false;
          t.container.trigger('controlshidden');
        });

        // any additional controls people might add and want to hide
        t.container.find('.mejs-control').stop(true, true).fadeOut(200, function () {
          $(this)
            .css('visibility', 'hidden')
            .css('display', 'block');
        });
      } else {

        // hide main controls
        t.controls
          .css('visibility', 'hidden')
          .css('display', 'block');

        // hide others
        t.container.find('.mejs-control')
          .css('visibility', 'hidden')
          .css('display', 'block');

        t.controlsAreVisible = false;
        t.container.trigger('controlshidden');
      }
    },
    controlsTimer: null,
    startControlsTimer: function (timeout) {

      var t = this;

      timeout = typeof timeout != 'undefined' ? timeout : 1500;

      t.killControlsTimer('start');

      t.controlsTimer = setTimeout(function () {
        //console.log('timer fired');
        t.hideControls();
        t.killControlsTimer('hide');
      }, timeout);
    },
    killControlsTimer: function (src) {

      var t = this;

      if (t.controlsTimer !== null) {
        clearTimeout(t.controlsTimer);
        delete t.controlsTimer;
        t.controlsTimer = null;
      }
    },
    controlsEnabled: true,
    disableControls: function () {
      var t = this;

      t.killControlsTimer();
      t.hideControls(false);
      this.controlsEnabled = false;
    },
    enableControls: function () {
      var t = this;

      t.showControls(false);

      t.controlsEnabled = true;
    },
    // Sets up all controls and events
    meReady: function (media, domNode) {


      var t = this,
        mf = mejs.MediaFeatures,
        autoplayAttr = domNode.getAttribute('autoplay'),
        autoplay = !(typeof autoplayAttr == 'undefined' || autoplayAttr === null || autoplayAttr === 'false'),
        featureIndex,
        feature;

      // make sure it can't create itself again if a plugin reloads
      if (t.created) {
        return;
      } else {
        t.created = true;
      }

      t.media = media;
      t.domNode = domNode;

      if (!(mf.isAndroid && t.options.AndroidUseNativeControls) && !(mf.isiPad && t.options.iPadUseNativeControls) && !(mf.isiPhone && t.options.iPhoneUseNativeControls)) {

        // two built in features
        t.buildposter(t, t.controls, t.layers, t.media);
        t.buildkeyboard(t, t.controls, t.layers, t.media);
        t.buildoverlays(t, t.controls, t.layers, t.media);

        // grab for use by features
        t.findTracks();

        // add user-defined features/controls
        for (featureIndex in t.options.features) {
          feature = t.options.features[featureIndex];
          if (t['build' + feature]) {
            try {
              t['build' + feature](t, t.controls, t.layers, t.media);
            } catch (e) {
              // TODO: report control error
              //throw e;
              console.log('error building ' + feature);
              console.log(e);
            }
          }
        }

        t.container.trigger('controlsready');

        // reset all layers and controls
        t.setPlayerSize(t.width, t.height);
        t.setControlsSize();


        // controls fade
        if (t.isVideo) {

          if (mejs.MediaFeatures.hasTouch) {

            // for touch devices (iOS, Android)
            // show/hide without animation on touch

            t.$media.bind('touchstart', function () {


              // toggle controls
              if (t.controlsAreVisible) {
                t.hideControls(false);
              } else {
                if (t.controlsEnabled) {
                  t.showControls(false);
                }
              }
            });

          } else {

            // create callback here since it needs access to current
            // MediaElement object
            t.clickToPlayPauseCallback = function () {
              //console.log('media clicked', t.media, t.media.paused);

              if (t.options.clickToPlayPause) {
                if (t.media.paused) {
                  t.play();
                } else {
                  t.pause();
                }
              }
            };

            // click to play/pause
            t.media.addEventListener('click', t.clickToPlayPauseCallback, false);

            // show/hide controls
            t.container
              .bind('mouseenter mouseover', function () {
                if (t.controlsEnabled) {
                  if (!t.options.alwaysShowControls) {
                    t.killControlsTimer('enter');
                    t.showControls();
                    t.startControlsTimer(2500);
                  }
                }
              })
              .bind('mousemove', function () {
                if (t.controlsEnabled) {
                  if (!t.controlsAreVisible) {
                    t.showControls();
                  }
                  if (!t.options.alwaysShowControls) {
                    t.startControlsTimer(2500);
                  }
                }
              })
              .bind('mouseleave', function () {
                if (t.controlsEnabled) {
                  if (!t.media.paused && !t.options.alwaysShowControls) {
                    t.startControlsTimer(1000);
                  }
                }
              });
          }

          if (t.options.hideVideoControlsOnLoad) {
            t.hideControls(false);
          }

          // check for autoplay
          if (autoplay && !t.options.alwaysShowControls) {
            t.hideControls();
          }

          // resizer
          if (t.options.enableAutosize) {
            t.media.addEventListener('loadedmetadata', function (e) {
              // if the <video height> was not set and the options.videoHeight was not set
              // then resize to the real dimensions
              if (t.options.videoHeight <= 0 && t.domNode.getAttribute('height') === null && !isNaN(e.target.videoHeight)) {
                t.setPlayerSize(e.target.videoWidth, e.target.videoHeight);
                t.setControlsSize();
                t.media.setVideoSize(e.target.videoWidth, e.target.videoHeight);
              }
            }, false);
          }
        }

        // EVENTS

        // FOCUS: when a video starts playing, it takes focus from other players (possibily pausing them)
        media.addEventListener('play', function () {
          var playerIndex;

          // go through all other players
          for (playerIndex in mejs.players) {
            var p = mejs.players[playerIndex];
            if (p.id != t.id && t.options.pauseOtherPlayers && !p.paused && !p.ended) {
              p.pause();
            }
            p.hasFocus = false;
          }

          t.hasFocus = true;
        }, false);


        // ended for all
        t.media.addEventListener('ended', function (e) {
          if (t.options.autoRewind) {
            try {
              t.media.setCurrentTime(0);
              // Fixing an Android stock browser bug, where "seeked" isn't fired correctly after ending the video and jumping to the beginning
              window.setTimeout(function () {
                $(t.container).find('.mejs-overlay-loading').parent().hide();
              }, 20);
            } catch (exp) {

            }
          }
          t.media.pause();

          if (t.setProgressRail) {
            t.setProgressRail();
          }
          if (t.setCurrentRail) {
            t.setCurrentRail();
          }

          if (t.options.loop) {
            t.play();
          } else if (!t.options.alwaysShowControls && t.controlsEnabled) {
            t.showControls();
          }
        }, false);

        // resize on the first play
        t.media.addEventListener('loadedmetadata', function (e) {
          if (t.updateDuration) {
            t.updateDuration();
          }
          if (t.updateCurrent) {
            t.updateCurrent();
          }

          if (!t.isFullScreen) {
            t.setPlayerSize(t.width, t.height);
            t.setControlsSize();
          }
        }, false);

        t.container.focusout(function (e) {
          if (e.relatedTarget) { //FF is working on supporting focusout https://bugzilla.mozilla.org/show_bug.cgi?id=687787
            var $target = $(e.relatedTarget);
            if (t.keyboardAction && $target.parents('.mejs-container').length === 0) {
              t.keyboardAction = false;
              t.hideControls(true);
            }
          }
        });

        // webkit has trouble doing this without a delay
        setTimeout(function () {
          t.setPlayerSize(t.width, t.height);
          t.setControlsSize();
        }, 50);

        // adjust controls whenever window sizes (used to be in fullscreen only)
        t.globalBind('resize', function () {

          // don't resize for fullscreen mode
          if (!(t.isFullScreen || (mejs.MediaFeatures.hasTrueNativeFullScreen && document.webkitIsFullScreen))) {
            t.setPlayerSize(t.width, t.height);
          }

          // always adjust controls
          t.setControlsSize();
        });

        // This is a work-around for a bug in the YouTube iFrame player, which means
        //  we can't use the play() API for the initial playback on iOS or Android;
        //  user has to start playback directly by tapping on the iFrame.
        if (t.media.pluginType == 'youtube' && (mf.isiOS || mf.isAndroid)) {
          t.container.find('.mejs-overlay-play').hide();
        }
      }

      // force autoplay for HTML5
      if (autoplay && media.pluginType == 'native') {
        t.play();
      }


      if (t.options.success) {

        if (typeof t.options.success == 'string') {
          window[t.options.success](t.media, t.domNode, t);
        } else {
          t.options.success(t.media, t.domNode, t);
        }
      }
    },
    handleError: function (e) {
      var t = this;

      t.controls.hide();

      // Tell user that the file cannot be played
      if (t.options.error) {
        t.options.error(e);
      }
    },
    setPlayerSize: function (width, height) {
      var t = this;

      if (!t.options.setDimensions) {
        return false;
      }

<<<<<<< Updated upstream
      if (typeof width != 'undefined') {
        t.width = width;
      }
=======
},{"16":16,"17":17,"18":18,"19":19,"3":3,"6":6,"7":7}],11:[function(_dereq_,module,exports){
'use strict';
>>>>>>> Stashed changes

      if (typeof height != 'undefined') {
        t.height = height;
      }

      // detect 100% mode - use currentStyle for IE since css() doesn't return percentages
      if (t.height.toString().indexOf('%') > 0 || t.$node.css('max-width') === '100%' || (t.$node[0].currentStyle && t.$node[0].currentStyle.maxWidth === '100%')) {

        // do we have the native dimensions yet?
        var nativeWidth = (function () {
          if (t.isVideo) {
            if (t.media.videoWidth && t.media.videoWidth > 0) {
              return t.media.videoWidth;
            } else if (t.media.getAttribute('width') !== null) {
              return t.media.getAttribute('width');
            } else {
              return t.options.defaultVideoWidth;
            }
          } else {
            return t.options.defaultAudioWidth;
          }
        })();

        var nativeHeight = (function () {
          if (t.isVideo) {
            if (t.media.videoHeight && t.media.videoHeight > 0) {
              return t.media.videoHeight;
            } else if (t.media.getAttribute('height') !== null) {
              return t.media.getAttribute('height');
            } else {
              return t.options.defaultVideoHeight;
            }
          } else {
            return t.options.defaultAudioHeight;
          }
        })();

        var
          parentWidth = t.container.parent().closest(':visible').width(),
          parentHeight = t.container.parent().closest(':visible').height(),
          newHeight = t.isVideo || !t.options.autosizeProgress ? parseInt(parentWidth * nativeHeight / nativeWidth, 10) : nativeHeight;

        // When we use percent, the newHeight can't be calculated so we get the container height
        if (isNaN(newHeight)) {
          newHeight = parentHeight;
        }

        if (t.container.parent()[0].tagName.toLowerCase() === 'body') { // && t.container.siblings().count == 0) {
          parentWidth = $(window).width();
          newHeight = $(window).height();
        }

        if (newHeight && parentWidth) {

<<<<<<< Updated upstream
          // set outer container size
          t.container
            .width(parentWidth)
            .height(newHeight);
=======
var _mejs = _dereq_(6);
>>>>>>> Stashed changes

          // set native <video> or <audio> and shims
          t.$media.add(t.container.find('.mejs-shim'))
            .width('100%')
            .height('100%');

<<<<<<< Updated upstream
          // if shim is ready, send the size to the embeded plugin
          if (t.isVideo) {
            if (t.media.setVideoSize) {
              t.media.setVideoSize(parentWidth, newHeight);
            }
          }
=======
var _i18n = _dereq_(8);
>>>>>>> Stashed changes

          // set the layers
          t.layers.children('.mejs-layer')
            .width('100%')
            .height('100%');
        }

<<<<<<< Updated upstream
=======
var _renderer = _dereq_(7);
>>>>>>> Stashed changes

      } else {

        t.container
          .width(t.width)
          .height(t.height);

        t.layers.children('.mejs-layer')
          .width(t.width)
          .height(t.height);

      }

      // special case for big play button so it doesn't go over the controls area
      var playLayer = t.layers.find('.mejs-overlay-play'),
        playButton = playLayer.find('.mejs-overlay-button');

      playLayer.height(t.container.height() - t.controls.height());
      playButton.css('margin-top', '-' + (playButton.height() / 2 - t.controls.height() / 2).toString() + 'px');

    },
    setControlsSize: function () {
      var t = this,
        usedWidth = 0,
        railWidth = 0,
        rail = t.controls.find('.mejs-time-rail'),
        total = t.controls.find('.mejs-time-total'),
        current = t.controls.find('.mejs-time-current'),
        loaded = t.controls.find('.mejs-time-loaded'),
        others = rail.siblings(),
        lastControl = others.last(),
        lastControlPosition = null;

      // skip calculation if hidden
      if (!t.container.is(':visible') || !rail.length || !rail.is(':visible')) {
        return;
      }


      // allow the size to come from custom CSS
      if (t.options && !t.options.autosizeProgress) {
        // Also, frontends devs can be more flexible
        // due the opportunity of absolute positioning.
        railWidth = parseInt(rail.css('width'), 10);
      }

      // attempt to autosize
      if (railWidth === 0 || !railWidth) {

<<<<<<< Updated upstream
        // find the size of all the other controls besides the rail
        others.each(function () {
          var $this = $(this);
          if ($this.css('position') != 'absolute' && $this.is(':visible')) {
            usedWidth += $(this).outerWidth(true);
          }
        });
=======
		var version = [0, 0, 0],
		    description = void 0,
		    ax = void 0;

		if (_constants.NAV.plugins !== null && _constants.NAV.plugins !== undefined && _typeof(_constants.NAV.plugins[pluginName]) === 'object') {
			description = _constants.NAV.plugins[pluginName].description;
			if (description && !(typeof _constants.NAV.mimeTypes !== 'undefined' && _constants.NAV.mimeTypes[mimeType] && !_constants.NAV.mimeTypes[mimeType].enabledPlugin)) {
				version = description.replace(pluginName, '').replace(/^\s+/, '').replace(/\sr/gi, '.').split('.');
				for (var i = 0, total = version.length; i < total; i++) {
					version[i] = parseInt(version[i].match(/\d+/), 10);
				}
			}
		} else if (_window2.default.ActiveXObject !== undefined) {
			try {
				ax = new ActiveXObject(activeX);
				if (ax) {
					version = axDetect(ax);
				}
			} catch (e) {
				console.log(e);
			}
		}
		return version;
	}
};

PluginDetector.addPlugin('flash', 'Shockwave Flash', 'application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash', function (ax) {
	var version = [],
	    d = ax.GetVariable("$version");

	if (d) {
		d = d.split(" ")[1].split(",");
		version = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
	}
	return version;
});

var FlashMediaElementRenderer = {
	create: function create(mediaElement, options, mediaFiles) {

		var flash = {};
		var isActive = false;

		flash.options = options;
		flash.id = mediaElement.id + '_' + flash.options.prefix;
		flash.mediaElement = mediaElement;
		flash.flashState = {};
		flash.flashApi = null;
		flash.flashApiStack = [];

		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {
			flash.flashState[propName] = null;

			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			flash['get' + capName] = function () {
				if (flash.flashApi !== null) {
					if (typeof flash.flashApi['get_' + propName] === 'function') {
						var value = flash.flashApi['get_' + propName]();

						if (propName === 'buffered') {
							return {
								start: function start() {
									return 0;
								},
								end: function end() {
									return value;
								},
								length: 1
							};
						}
						return value;
					} else {
						return null;
					}
				} else {
					return null;
				}
			};

			flash['set' + capName] = function (value) {
				if (propName === 'src') {
					value = (0, _media.absolutizeUrl)(value);
				}

				if (flash.flashApi !== null && flash.flashApi['set_' + propName] !== undefined) {
					try {
						flash.flashApi['set_' + propName](value);
					} catch (e) {
						console.log(e);
					}
				} else {
					flash.flashApiStack.push({
						type: 'set',
						propName: propName,
						value: value
					});
				}
			};
		};

		for (var i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		var methods = _mejs2.default.html5media.methods,
		    assignMethods = function assignMethods(methodName) {
			flash[methodName] = function () {
				if (isActive) {
					if (flash.flashApi !== null) {
						if (flash.flashApi['fire_' + methodName]) {
							try {
								flash.flashApi['fire_' + methodName]();
							} catch (e) {
								console.log(e);
							}
						} else {
							console.log('flash', 'missing method', methodName);
						}
					} else {
						flash.flashApiStack.push({
							type: 'call',
							methodName: methodName
						});
					}
				}
			};
		};
		methods.push('stop');
		for (var _i = 0, _total = methods.length; _i < _total; _i++) {
			assignMethods(methods[_i]);
		}

		var initEvents = ['rendererready'];

		for (var _i2 = 0, _total2 = initEvents.length; _i2 < _total2; _i2++) {
			var event = (0, _general.createEvent)(initEvents[_i2], flash);
			mediaElement.dispatchEvent(event);
		}

		_window2.default['__ready__' + flash.id] = function () {

			flash.flashReady = true;
			flash.flashApi = _document2.default.getElementById('__' + flash.id);

			if (flash.flashApiStack.length) {
				for (var _i3 = 0, _total3 = flash.flashApiStack.length; _i3 < _total3; _i3++) {
					var stackItem = flash.flashApiStack[_i3];

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
						    capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

						flash['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						flash[stackItem.methodName]();
					}
				}
			}
		};

		_window2.default['__event__' + flash.id] = function (eventName, message) {
			var event = (0, _general.createEvent)(eventName, flash);
			if (message) {
				try {
					event.data = JSON.parse(message);
					event.details.data = JSON.parse(message);
				} catch (e) {
					event.message = message;
				}
			}

			flash.mediaElement.dispatchEvent(event);
		};

		flash.flashWrapper = _document2.default.createElement('div');

		if (['always', 'sameDomain'].indexOf(flash.options.shimScriptAccess) === -1) {
			flash.options.shimScriptAccess = 'sameDomain';
		}

		var autoplay = mediaElement.originalNode.autoplay,
		    flashVars = ['uid=' + flash.id, 'autoplay=' + autoplay, 'allowScriptAccess=' + flash.options.shimScriptAccess, 'preload=' + (mediaElement.originalNode.getAttribute('preload') || '')],
		    isVideo = mediaElement.originalNode !== null && mediaElement.originalNode.tagName.toLowerCase() === 'video',
		    flashHeight = isVideo ? mediaElement.originalNode.height : 1,
		    flashWidth = isVideo ? mediaElement.originalNode.width : 1;

		if (mediaElement.originalNode.getAttribute('src')) {
			flashVars.push('src=' + mediaElement.originalNode.getAttribute('src'));
		}

		if (flash.options.enablePseudoStreaming === true) {
			flashVars.push('pseudostreamstart=' + flash.options.pseudoStreamingStartQueryParam);
			flashVars.push('pseudostreamtype=' + flash.options.pseudoStreamingType);
		}

		if (flash.options.streamDelimiter) {
			flashVars.push('streamdelimiter=' + encodeURIComponent(flash.options.streamDelimiter));
		}

		if (flash.options.proxyType) {
			flashVars.push('proxytype=' + flash.options.proxyType);
		}

		mediaElement.appendChild(flash.flashWrapper);
		mediaElement.originalNode.style.display = 'none';

		var settings = [];

		if (_constants.IS_IE || _constants.IS_EDGE) {
			var specialIEContainer = _document2.default.createElement('div');
			flash.flashWrapper.appendChild(specialIEContainer);

			if (_constants.IS_EDGE) {
				settings = ['type="application/x-shockwave-flash"', 'data="' + flash.options.pluginPath + flash.options.filename + '"', 'id="__' + flash.id + '"', 'width="' + flashWidth + '"', 'height="' + flashHeight + '\'"'];
			} else {
				settings = ['classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"', 'codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"', 'id="__' + flash.id + '"', 'width="' + flashWidth + '"', 'height="' + flashHeight + '"'];
			}

			if (!isVideo) {
				settings.push('style="clip: rect(0 0 0 0); position: absolute;"');
			}

			specialIEContainer.outerHTML = '<object ' + settings.join(' ') + '>' + ('<param name="movie" value="' + flash.options.pluginPath + flash.options.filename + '?x=' + new Date() + '" />') + ('<param name="flashvars" value="' + flashVars.join('&amp;') + '" />') + '<param name="quality" value="high" />' + '<param name="bgcolor" value="#000000" />' + '<param name="wmode" value="transparent" />' + ('<param name="allowScriptAccess" value="' + flash.options.shimScriptAccess + '" />') + '<param name="allowFullScreen" value="true" />' + ('<div>' + _i18n2.default.t('mejs.install-flash') + '</div>') + '</object>';
		} else {

			settings = ['id="__' + flash.id + '"', 'name="__' + flash.id + '"', 'play="true"', 'loop="false"', 'quality="high"', 'bgcolor="#000000"', 'wmode="transparent"', 'allowScriptAccess="' + flash.options.shimScriptAccess + '"', 'allowFullScreen="true"', 'type="application/x-shockwave-flash"', 'pluginspage="//www.macromedia.com/go/getflashplayer"', 'src="' + flash.options.pluginPath + flash.options.filename + '"', 'flashvars="' + flashVars.join('&') + '"'];

			if (isVideo) {
				settings.push('width="' + flashWidth + '"');
				settings.push('height="' + flashHeight + '"');
			} else {
				settings.push('style="position: fixed; left: -9999em; top: -9999em;"');
			}

			flash.flashWrapper.innerHTML = '<embed ' + settings.join(' ') + '>';
		}

		flash.flashNode = flash.flashWrapper.lastChild;

		flash.hide = function () {
			isActive = false;
			if (isVideo) {
				flash.flashNode.style.display = 'none';
			}
		};
		flash.show = function () {
			isActive = true;
			if (isVideo) {
				flash.flashNode.style.display = '';
			}
		};
		flash.setSize = function (width, height) {
			flash.flashNode.style.width = width + 'px';
			flash.flashNode.style.height = height + 'px';

			if (flash.flashApi !== null && typeof flash.flashApi.fire_setSize === 'function') {
				flash.flashApi.fire_setSize(width, height);
			}
		};

		flash.destroy = function () {
			flash.flashNode.remove();
		};

		if (mediaFiles && mediaFiles.length > 0) {
			for (var _i4 = 0, _total4 = mediaFiles.length; _i4 < _total4; _i4++) {
				if (_renderer.renderer.renderers[options.prefix].canPlayType(mediaFiles[_i4].type)) {
					flash.setSrc(mediaFiles[_i4].src);
					break;
				}
			}
		}

		return flash;
	}
};

var hasFlash = PluginDetector.hasPluginVersion('flash', [10, 0, 0]);

if (hasFlash) {
	_media.typeChecks.push(function (url) {
		url = url.toLowerCase();

		if (url.startsWith('rtmp')) {
			if (~url.indexOf('.mp3')) {
				return 'audio/rtmp';
			} else {
				return 'video/rtmp';
			}
		} else if (/\.og(a|g)/i.test(url)) {
			return 'audio/ogg';
		} else if (~url.indexOf('.m3u8')) {
			return 'application/x-mpegURL';
		} else if (~url.indexOf('.mpd')) {
			return 'application/dash+xml';
		} else if (~url.indexOf('.flv')) {
			return 'video/flv';
		} else {
			return null;
		}
	});

	var FlashMediaElementVideoRenderer = {
		name: 'flash_video',
		options: {
			prefix: 'flash_video',
			filename: 'mediaelement-flash-video.swf',
			enablePseudoStreaming: false,

			pseudoStreamingStartQueryParam: 'start',

			pseudoStreamingType: 'byte',

			proxyType: '',

			streamDelimiter: ''
		},

		canPlayType: function canPlayType(type) {
			return ~['video/mp4', 'video/rtmp', 'audio/rtmp', 'rtmp/mp4', 'audio/mp4', 'video/flv', 'video/x-flv'].indexOf(type.toLowerCase());
		},

		create: FlashMediaElementRenderer.create

	};
	_renderer.renderer.add(FlashMediaElementVideoRenderer);

	var FlashMediaElementHlsVideoRenderer = {
		name: 'flash_hls',
		options: {
			prefix: 'flash_hls',
			filename: 'mediaelement-flash-video-hls.swf'
		},

		canPlayType: function canPlayType(type) {
			return ~['application/x-mpegurl', 'application/vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls', 'video/hls'].indexOf(type.toLowerCase());
		},

		create: FlashMediaElementRenderer.create
	};
	_renderer.renderer.add(FlashMediaElementHlsVideoRenderer);

	var FlashMediaElementMdashVideoRenderer = {
		name: 'flash_dash',
		options: {
			prefix: 'flash_dash',
			filename: 'mediaelement-flash-video-mdash.swf'
		},

		canPlayType: function canPlayType(type) {
			return ~['application/dash+xml'].indexOf(type.toLowerCase());
		},

		create: FlashMediaElementRenderer.create
	};
	_renderer.renderer.add(FlashMediaElementMdashVideoRenderer);

	var FlashMediaElementAudioRenderer = {
		name: 'flash_audio',
		options: {
			prefix: 'flash_audio',
			filename: 'mediaelement-flash-audio.swf'
		},

		canPlayType: function canPlayType(type) {
			return ~['audio/mp3'].indexOf(type.toLowerCase());
		},

		create: FlashMediaElementRenderer.create
	};
	_renderer.renderer.add(FlashMediaElementAudioRenderer);

	var FlashMediaElementAudioOggRenderer = {
		name: 'flash_audio_ogg',
		options: {
			prefix: 'flash_audio_ogg',
			filename: 'mediaelement-flash-audio-ogg.swf'
		},

		canPlayType: function canPlayType(type) {
			return ~['audio/ogg', 'audio/oga', 'audio/ogv'].indexOf(type.toLowerCase());
		},

		create: FlashMediaElementRenderer.create
	};
	_renderer.renderer.add(FlashMediaElementAudioOggRenderer);
}

},{"16":16,"18":18,"19":19,"2":2,"3":3,"6":6,"7":7,"8":8}],12:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _general = _dereq_(18);

var _constants = _dereq_(16);

var _media = _dereq_(19);

var _dom = _dereq_(17);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NativeFlv = {

	promise: null,

	load: function load(settings) {
		if (typeof flvjs !== 'undefined') {
			NativeFlv.promise = new Promise(function (resolve) {
				resolve();
			}).then(function () {
				NativeFlv._createPlayer(settings);
			});
		} else {
			settings.options.path = typeof settings.options.path === 'string' ? settings.options.path : 'https://cdn.jsdelivr.net/npm/flv.js@latest';

			NativeFlv.promise = NativeFlv.promise || (0, _dom.loadScript)(settings.options.path);
			NativeFlv.promise.then(function () {
				NativeFlv._createPlayer(settings);
			});
		}

		return NativeFlv.promise;
	},

	_createPlayer: function _createPlayer(settings) {
		flvjs.LoggingControl.enableDebug = settings.options.debug;
		flvjs.LoggingControl.enableVerbose = settings.options.debug;
		var player = flvjs.createPlayer(settings.options, settings.configs);
		_window2.default['__ready__' + settings.id](player);
		return player;
	}
};

var FlvNativeRenderer = {
	name: 'native_flv',
	options: {
		prefix: 'native_flv',
		flv: {
			path: 'https://cdn.jsdelivr.net/npm/flv.js@latest',

			cors: true,
			debug: false
		}
	},

	canPlayType: function canPlayType(type) {
		return _constants.HAS_MSE && ['video/x-flv', 'video/flv'].indexOf(type.toLowerCase()) > -1;
	},

	create: function create(mediaElement, options, mediaFiles) {

		var originalNode = mediaElement.originalNode,
		    id = mediaElement.id + '_' + options.prefix;

		var node = null,
		    flvPlayer = null;

		node = originalNode.cloneNode(true);
		options = Object.assign(options, mediaElement.options);

		var props = _mejs2.default.html5media.properties,
		    events = _mejs2.default.html5media.events.concat(['click', 'mouseover', 'mouseout']).filter(function (e) {
			return e !== 'error';
		}),
		    attachNativeEvents = function attachNativeEvents(e) {
			var event = (0, _general.createEvent)(e.type, mediaElement);
			mediaElement.dispatchEvent(event);
		},
		    assignGettersSetters = function assignGettersSetters(propName) {
			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			node['get' + capName] = function () {
				return flvPlayer !== null ? node[propName] : null;
			};

			node['set' + capName] = function (value) {
				if (_mejs2.default.html5media.readOnlyProperties.indexOf(propName) === -1) {
					if (propName === 'src') {
						node[propName] = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.src ? value.src : value;
						if (flvPlayer !== null) {
							var _flvOptions = {};
							_flvOptions.type = 'flv';
							_flvOptions.url = value;
							_flvOptions.cors = options.flv.cors;
							_flvOptions.debug = options.flv.debug;
							_flvOptions.path = options.flv.path;
							var _flvConfigs = options.flv.configs;

							flvPlayer.destroy();
							for (var i = 0, total = events.length; i < total; i++) {
								node.removeEventListener(events[i], attachNativeEvents);
							}
							flvPlayer = NativeFlv._createPlayer({
								options: _flvOptions,
								configs: _flvConfigs,
								id: id
							});
							flvPlayer.attachMediaElement(node);
							flvPlayer.load();
						}
					} else {
						node[propName] = value;
					}
				}
			};
		};

		for (var i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		_window2.default['__ready__' + id] = function (_flvPlayer) {
			mediaElement.flvPlayer = flvPlayer = _flvPlayer;

			var flvEvents = flvjs.Events,
			    assignEvents = function assignEvents(eventName) {
				if (eventName === 'loadedmetadata') {
					flvPlayer.unload();
					flvPlayer.detachMediaElement();
					flvPlayer.attachMediaElement(node);
					flvPlayer.load();
				}

				node.addEventListener(eventName, attachNativeEvents);
			};

			for (var _i = 0, _total = events.length; _i < _total; _i++) {
				assignEvents(events[_i]);
			}

			var assignFlvEvents = function assignFlvEvents(name, data) {
				if (name === 'error') {
					var message = data[0] + ': ' + data[1] + ' ' + data[2].msg;
					mediaElement.generateError(message, node.src);
				} else {
					var _event = (0, _general.createEvent)(name, mediaElement);
					_event.data = data;
					mediaElement.dispatchEvent(_event);
				}
			};

			var _loop = function _loop(eventType) {
				if (flvEvents.hasOwnProperty(eventType)) {
					flvPlayer.on(flvEvents[eventType], function () {
						for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
							args[_key] = arguments[_key];
						}

						return assignFlvEvents(flvEvents[eventType], args);
					});
				}
			};

			for (var eventType in flvEvents) {
				_loop(eventType);
			}
		};

		if (mediaFiles && mediaFiles.length > 0) {
			for (var _i2 = 0, _total2 = mediaFiles.length; _i2 < _total2; _i2++) {
				if (_renderer.renderer.renderers[options.prefix].canPlayType(mediaFiles[_i2].type)) {
					node.setAttribute('src', mediaFiles[_i2].src);
					break;
				}
			}
		}

		node.setAttribute('id', id);

		originalNode.parentNode.insertBefore(node, originalNode);
		originalNode.autoplay = false;
		originalNode.style.display = 'none';

		var flvOptions = {};
		flvOptions.type = 'flv';
		flvOptions.url = node.src;
		flvOptions.cors = options.flv.cors;
		flvOptions.debug = options.flv.debug;
		flvOptions.path = options.flv.path;
		var flvConfigs = options.flv.configs;

		node.setSize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';
			return node;
		};

		node.hide = function () {
			if (flvPlayer !== null) {
				flvPlayer.pause();
			}
			node.style.display = 'none';
			return node;
		};

		node.show = function () {
			node.style.display = '';
			return node;
		};

		node.destroy = function () {
			if (flvPlayer !== null) {
				flvPlayer.destroy();
			}
		};

		var event = (0, _general.createEvent)('rendererready', node);
		mediaElement.dispatchEvent(event);

		mediaElement.promises.push(NativeFlv.load({
			options: flvOptions,
			configs: flvConfigs,
			id: id
		}));

		return node;
	}
};

_media.typeChecks.push(function (url) {
	return ~url.toLowerCase().indexOf('.flv') ? 'video/flv' : null;
});

_renderer.renderer.add(FlvNativeRenderer);

},{"16":16,"17":17,"18":18,"19":19,"3":3,"6":6,"7":7}],13:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _general = _dereq_(18);

var _constants = _dereq_(16);

var _media = _dereq_(19);

var _dom = _dereq_(17);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NativeHls = {

	promise: null,

	load: function load(settings) {
		if (typeof Hls !== 'undefined') {
			NativeHls.promise = new Promise(function (resolve) {
				resolve();
			}).then(function () {
				NativeHls._createPlayer(settings);
			});
		} else {
			settings.options.path = typeof settings.options.path === 'string' ? settings.options.path : 'https://cdn.jsdelivr.net/npm/hls.js@latest';

			NativeHls.promise = NativeHls.promise || (0, _dom.loadScript)(settings.options.path);
			NativeHls.promise.then(function () {
				NativeHls._createPlayer(settings);
			});
		}

		return NativeHls.promise;
	},

	_createPlayer: function _createPlayer(settings) {
		var player = new Hls(settings.options);
		_window2.default['__ready__' + settings.id](player);
		return player;
	}
};

var HlsNativeRenderer = {
	name: 'native_hls',
	options: {
		prefix: 'native_hls',
		hls: {
			path: 'https://cdn.jsdelivr.net/npm/hls.js@latest',

			autoStartLoad: false,
			debug: false
		}
	},

	canPlayType: function canPlayType(type) {
		return _constants.HAS_MSE && ['application/x-mpegurl', 'application/vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls', 'video/hls'].indexOf(type.toLowerCase()) > -1;
	},

	create: function create(mediaElement, options, mediaFiles) {

		var originalNode = mediaElement.originalNode,
		    id = mediaElement.id + '_' + options.prefix,
		    preload = originalNode.getAttribute('preload'),
		    autoplay = originalNode.autoplay;

		var hlsPlayer = null,
		    node = null,
		    index = 0,
		    total = mediaFiles.length;

		node = originalNode.cloneNode(true);
		options = Object.assign(options, mediaElement.options);
		options.hls.autoStartLoad = preload && preload !== 'none' || autoplay;

		var props = _mejs2.default.html5media.properties,
		    events = _mejs2.default.html5media.events.concat(['click', 'mouseover', 'mouseout']).filter(function (e) {
			return e !== 'error';
		}),
		    attachNativeEvents = function attachNativeEvents(e) {
			var event = (0, _general.createEvent)(e.type, mediaElement);
			mediaElement.dispatchEvent(event);
		},
		    assignGettersSetters = function assignGettersSetters(propName) {
			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			node['get' + capName] = function () {
				return hlsPlayer !== null ? node[propName] : null;
			};

			node['set' + capName] = function (value) {
				if (_mejs2.default.html5media.readOnlyProperties.indexOf(propName) === -1) {
					if (propName === 'src') {
						node[propName] = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.src ? value.src : value;
						if (hlsPlayer !== null) {
							hlsPlayer.destroy();
							for (var i = 0, _total = events.length; i < _total; i++) {
								node.removeEventListener(events[i], attachNativeEvents);
							}
							hlsPlayer = NativeHls._createPlayer({
								options: options.hls,
								id: id
							});
							hlsPlayer.loadSource(value);
							hlsPlayer.attachMedia(node);
						}
					} else {
						node[propName] = value;
					}
				}
			};
		};

		for (var i = 0, _total2 = props.length; i < _total2; i++) {
			assignGettersSetters(props[i]);
		}

		_window2.default['__ready__' + id] = function (_hlsPlayer) {
			mediaElement.hlsPlayer = hlsPlayer = _hlsPlayer;
			var hlsEvents = Hls.Events,
			    assignEvents = function assignEvents(eventName) {
				if (eventName === 'loadedmetadata') {
					var url = mediaElement.originalNode.src;
					hlsPlayer.detachMedia();
					hlsPlayer.loadSource(url);
					hlsPlayer.attachMedia(node);
				}

				node.addEventListener(eventName, attachNativeEvents);
			};

			for (var _i = 0, _total3 = events.length; _i < _total3; _i++) {
				assignEvents(events[_i]);
			}

			var recoverDecodingErrorDate = void 0,
			    recoverSwapAudioCodecDate = void 0;
			var assignHlsEvents = function assignHlsEvents(name, data) {
				if (name === 'hlsError') {
					console.warn(data);
					data = data[1];

					if (data.fatal) {
						switch (data.type) {
							case 'mediaError':
								var now = new Date().getTime();
								if (!recoverDecodingErrorDate || now - recoverDecodingErrorDate > 3000) {
									recoverDecodingErrorDate = new Date().getTime();
									hlsPlayer.recoverMediaError();
								} else if (!recoverSwapAudioCodecDate || now - recoverSwapAudioCodecDate > 3000) {
									recoverSwapAudioCodecDate = new Date().getTime();
									console.warn('Attempting to swap Audio Codec and recover from media error');
									hlsPlayer.swapAudioCodec();
									hlsPlayer.recoverMediaError();
								} else {
									var message = 'Cannot recover, last media error recovery failed';
									mediaElement.generateError(message, node.src);
									console.error(message);
								}
								break;
							case 'networkError':
								if (data.details === 'manifestLoadError') {
									if (index < total && mediaFiles[index + 1] !== undefined) {
										node.setSrc(mediaFiles[index++].src);
										node.load();
										node.play();
									} else {
										var _message = 'Network error';
										mediaElement.generateError(_message, mediaFiles);
										console.error(_message);
									}
								} else {
									var _message2 = 'Network error';
									mediaElement.generateError(_message2, mediaFiles);
									console.error(_message2);
								}
								break;
							default:
								hlsPlayer.destroy();
								break;
						}
						return;
					}
				}
				var event = (0, _general.createEvent)(name, mediaElement);
				event.data = data;
				mediaElement.dispatchEvent(event);
			};

			var _loop = function _loop(eventType) {
				if (hlsEvents.hasOwnProperty(eventType)) {
					hlsPlayer.on(hlsEvents[eventType], function () {
						for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
							args[_key] = arguments[_key];
						}

						return assignHlsEvents(hlsEvents[eventType], args);
					});
				}
			};

			for (var eventType in hlsEvents) {
				_loop(eventType);
			}
		};

		if (total > 0) {
			for (; index < total; index++) {
				if (_renderer.renderer.renderers[options.prefix].canPlayType(mediaFiles[index].type)) {
					node.setAttribute('src', mediaFiles[index].src);
					break;
				}
			}
		}

		if (preload !== 'auto' && !autoplay) {
			node.addEventListener('play', function () {
				if (hlsPlayer !== null) {
					hlsPlayer.startLoad();
				}
			});

			node.addEventListener('pause', function () {
				if (hlsPlayer !== null) {
					hlsPlayer.stopLoad();
				}
			});
		}

		node.setAttribute('id', id);

		originalNode.parentNode.insertBefore(node, originalNode);
		originalNode.autoplay = false;
		originalNode.style.display = 'none';

		node.setSize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';
			return node;
		};

		node.hide = function () {
			node.pause();
			node.style.display = 'none';
			return node;
		};

		node.show = function () {
			node.style.display = '';
			return node;
		};

		node.destroy = function () {
			if (hlsPlayer !== null) {
				hlsPlayer.stopLoad();
				hlsPlayer.destroy();
			}
		};

		var event = (0, _general.createEvent)('rendererready', node);
		mediaElement.dispatchEvent(event);

		mediaElement.promises.push(NativeHls.load({
			options: options.hls,
			id: id
		}));

		return node;
	}
};

_media.typeChecks.push(function (url) {
	return ~url.toLowerCase().indexOf('.m3u8') ? 'application/x-mpegURL' : null;
});

_renderer.renderer.add(HlsNativeRenderer);

},{"16":16,"17":17,"18":18,"19":19,"3":3,"6":6,"7":7}],14:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _general = _dereq_(18);

var _constants = _dereq_(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HtmlMediaElement = {
	name: 'html5',
	options: {
		prefix: 'html5'
	},

	canPlayType: function canPlayType(type) {

		var mediaElement = _document2.default.createElement('video');

		if (_constants.IS_ANDROID && /\/mp(3|4)$/i.test(type) || ~['application/x-mpegurl', 'vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls', 'video/hls'].indexOf(type.toLowerCase()) && _constants.SUPPORTS_NATIVE_HLS) {
			return 'yes';
		} else if (mediaElement.canPlayType) {
			return mediaElement.canPlayType(type.toLowerCase()).replace(/no/, '');
		} else {
			return '';
		}
	},

	create: function create(mediaElement, options, mediaFiles) {

		var id = mediaElement.id + '_' + options.prefix;
		var isActive = false;

		var node = null;

		if (mediaElement.originalNode === undefined || mediaElement.originalNode === null) {
			node = _document2.default.createElement('audio');
			mediaElement.appendChild(node);
		} else {
			node = mediaElement.originalNode;
		}

		node.setAttribute('id', id);

		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {
			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			node['get' + capName] = function () {
				return node[propName];
			};

			node['set' + capName] = function (value) {
				if (_mejs2.default.html5media.readOnlyProperties.indexOf(propName) === -1) {
					node[propName] = value;
				}
			};
		};

		for (var i = 0, _total = props.length; i < _total; i++) {
			assignGettersSetters(props[i]);
		}

		var events = _mejs2.default.html5media.events.concat(['click', 'mouseover', 'mouseout']).filter(function (e) {
			return e !== 'error';
		}),
		    assignEvents = function assignEvents(eventName) {
			node.addEventListener(eventName, function (e) {
				if (isActive) {
					var _event = (0, _general.createEvent)(e.type, e.target);
					mediaElement.dispatchEvent(_event);
				}
			});
		};

		for (var _i = 0, _total2 = events.length; _i < _total2; _i++) {
			assignEvents(events[_i]);
		}

		node.setSize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';
			return node;
		};

		node.hide = function () {
			isActive = false;
			node.style.display = 'none';

			return node;
		};

		node.show = function () {
			isActive = true;
			node.style.display = '';

			return node;
		};

		var index = 0,
		    total = mediaFiles.length;
		if (total > 0) {
			for (; index < total; index++) {
				if (_renderer.renderer.renderers[options.prefix].canPlayType(mediaFiles[index].type)) {
					node.setAttribute('src', mediaFiles[index].src);
					break;
				}
			}
		}

		node.addEventListener('error', function (e) {
			if (e && e.target && e.target.error && e.target.error.code === 4 && isActive) {
				if (index < total && mediaFiles[index + 1] !== undefined) {
					node.src = mediaFiles[index++].src;
					node.load();
					node.play();
				} else {
					mediaElement.generateError('Media error: Format(s) not supported or source(s) not found', mediaFiles);
				}
			}
		});

		var event = (0, _general.createEvent)('rendererready', node);
		mediaElement.dispatchEvent(event);

		return node;
	}
};

_window2.default.HtmlMediaElement = _mejs2.default.HtmlMediaElement = HtmlMediaElement;

_renderer.renderer.add(HtmlMediaElement);

},{"16":16,"18":18,"2":2,"3":3,"6":6,"7":7}],15:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _general = _dereq_(18);

var _media = _dereq_(19);

var _dom = _dereq_(17);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var YouTubeApi = {
	isIframeStarted: false,

	isIframeLoaded: false,

	iframeQueue: [],

	enqueueIframe: function enqueueIframe(settings) {
		YouTubeApi.isLoaded = typeof YT !== 'undefined' && YT.loaded;

		if (YouTubeApi.isLoaded) {
			YouTubeApi.createIframe(settings);
		} else {
			YouTubeApi.loadIframeApi();
			YouTubeApi.iframeQueue.push(settings);
		}
	},

	loadIframeApi: function loadIframeApi() {
		if (!YouTubeApi.isIframeStarted) {
			(0, _dom.loadScript)('https://www.youtube.com/player_api');
			YouTubeApi.isIframeStarted = true;
		}
	},

	iFrameReady: function iFrameReady() {

		YouTubeApi.isLoaded = true;
		YouTubeApi.isIframeLoaded = true;

		while (YouTubeApi.iframeQueue.length > 0) {
			var settings = YouTubeApi.iframeQueue.pop();
			YouTubeApi.createIframe(settings);
		}
	},

	createIframe: function createIframe(settings) {
		return new YT.Player(settings.containerId, settings);
	},

	getYouTubeId: function getYouTubeId(url) {

		var youTubeId = '';

		if (url.indexOf('?') > 0) {
			youTubeId = YouTubeApi.getYouTubeIdFromParam(url);

			if (youTubeId === '') {
				youTubeId = YouTubeApi.getYouTubeIdFromUrl(url);
			}
		} else {
			youTubeId = YouTubeApi.getYouTubeIdFromUrl(url);
		}

		var id = youTubeId.substring(youTubeId.lastIndexOf('/') + 1);
		youTubeId = id.split('?');
		return youTubeId[0];
	},

	getYouTubeIdFromParam: function getYouTubeIdFromParam(url) {

		if (url === undefined || url === null || !url.trim().length) {
			return null;
		}

		var parts = url.split('?'),
		    parameters = parts[1].split('&');

		var youTubeId = '';

		for (var i = 0, total = parameters.length; i < total; i++) {
			var paramParts = parameters[i].split('=');
			if (paramParts[0] === 'v') {
				youTubeId = paramParts[1];
				break;
			}
		}

		return youTubeId;
	},

	getYouTubeIdFromUrl: function getYouTubeIdFromUrl(url) {

		if (url === undefined || url === null || !url.trim().length) {
			return null;
		}

		var parts = url.split('?');
		url = parts[0];
		return url.substring(url.lastIndexOf('/') + 1);
	},

	getYouTubeNoCookieUrl: function getYouTubeNoCookieUrl(url) {
		if (url === undefined || url === null || !url.trim().length || url.indexOf('//www.youtube') === -1) {
			return url;
		}

		var parts = url.split('/');
		parts[2] = parts[2].replace('.com', '-nocookie.com');
		return parts.join('/');
	}
};

var YouTubeIframeRenderer = {
	name: 'youtube_iframe',

	options: {
		prefix: 'youtube_iframe',

		youtube: {
			autoplay: 0,
			controls: 0,
			disablekb: 1,
			end: 0,
			loop: 0,
			modestbranding: 0,
			playsinline: 0,
			rel: 0,
			showinfo: 0,
			start: 0,
			iv_load_policy: 3,

			nocookie: false,

			imageQuality: null
		}
	},

	canPlayType: function canPlayType(type) {
		return ~['video/youtube', 'video/x-youtube'].indexOf(type.toLowerCase());
	},

	create: function create(mediaElement, options, mediaFiles) {

		var youtube = {},
		    apiStack = [],
		    readyState = 4;

		var youTubeApi = null,
		    paused = true,
		    ended = false,
		    youTubeIframe = null,
		    volume = 1;

		youtube.options = options;
		youtube.id = mediaElement.id + '_' + options.prefix;
		youtube.mediaElement = mediaElement;

		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {

			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			youtube['get' + capName] = function () {
				if (youTubeApi !== null) {
					var value = null;

					switch (propName) {
						case 'currentTime':
							return youTubeApi.getCurrentTime();
						case 'duration':
							return youTubeApi.getDuration();
						case 'volume':
							volume = youTubeApi.getVolume() / 100;
							return volume;
						case 'playbackRate':
							return youTubeApi.getPlaybackRate();
						case 'paused':
							return paused;
						case 'ended':
							return ended;
						case 'muted':
							return youTubeApi.isMuted();
						case 'buffered':
							var percentLoaded = youTubeApi.getVideoLoadedFraction(),
							    duration = youTubeApi.getDuration();
							return {
								start: function start() {
									return 0;
								},
								end: function end() {
									return percentLoaded * duration;
								},
								length: 1
							};
						case 'src':
							return youTubeApi.getVideoUrl();
						case 'readyState':
							return readyState;
					}

					return value;
				} else {
					return null;
				}
			};

			youtube['set' + capName] = function (value) {
				if (youTubeApi !== null) {
					switch (propName) {
						case 'src':
							var url = typeof value === 'string' ? value : value[0].src,
							    _videoId = YouTubeApi.getYouTubeId(url);

							if (mediaElement.originalNode.autoplay) {
								youTubeApi.loadVideoById(_videoId);
							} else {
								youTubeApi.cueVideoById(_videoId);
							}
							break;
						case 'currentTime':
							youTubeApi.seekTo(value);
							break;
						case 'muted':
							if (value) {
								youTubeApi.mute();
							} else {
								youTubeApi.unMute();
							}
							setTimeout(function () {
								var event = (0, _general.createEvent)('volumechange', youtube);
								mediaElement.dispatchEvent(event);
							}, 50);
							break;
						case 'volume':
							volume = value;
							youTubeApi.setVolume(value * 100);
							setTimeout(function () {
								var event = (0, _general.createEvent)('volumechange', youtube);
								mediaElement.dispatchEvent(event);
							}, 50);
							break;
						case 'playbackRate':
							youTubeApi.setPlaybackRate(value);
							setTimeout(function () {
								var event = (0, _general.createEvent)('ratechange', youtube);
								mediaElement.dispatchEvent(event);
							}, 50);
							break;
						case 'readyState':
							var event = (0, _general.createEvent)('canplay', youtube);
							mediaElement.dispatchEvent(event);
							break;
						default:
							console.log('youtube ' + youtube.id, propName, 'UNSUPPORTED property');
							break;
					}
				} else {
					apiStack.push({ type: 'set', propName: propName, value: value });
				}
			};
		};

		for (var i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		var methods = _mejs2.default.html5media.methods,
		    assignMethods = function assignMethods(methodName) {
			youtube[methodName] = function () {
				if (youTubeApi !== null) {
					switch (methodName) {
						case 'play':
							paused = false;
							return youTubeApi.playVideo();
						case 'pause':
							paused = true;
							return youTubeApi.pauseVideo();
						case 'load':
							return null;
					}
				} else {
					apiStack.push({ type: 'call', methodName: methodName });
				}
			};
		};

		for (var _i = 0, _total = methods.length; _i < _total; _i++) {
			assignMethods(methods[_i]);
		}
>>>>>>> Stashed changes

        // fit the rail into the remaining space
        railWidth = t.controls.width() - usedWidth - (rail.outerWidth(true) - rail.width());
      }

      // resize the rail,
      // but then check if the last control (say, the fullscreen button) got pushed down
      // this often happens when zoomed
      do {
        // outer area
        rail.width(railWidth);
        // dark space
        total.width(railWidth - (total.outerWidth(true) - total.width()));

        if (lastControl.css('position') != 'absolute') {
          lastControlPosition = lastControl.position();
          railWidth--;
        }
      } while (lastControlPosition !== null && lastControlPosition.top > 0 && railWidth > 0);

      if (t.setProgressRail)
        t.setProgressRail();
      if (t.setCurrentRail)
        t.setCurrentRail();
    },
    buildposter: function (player, controls, layers, media) {
      var t = this,
        poster =
        $('<div class="mejs-poster mejs-layer">' +
          '</div>')
        .appendTo(layers),
        posterUrl = player.$media.attr('poster');

      // prioriy goes to option (this is useful if you need to support iOS 3.x (iOS completely fails with poster)
      if (player.options.poster !== '') {
        posterUrl = player.options.poster;
      }

      // second, try the real poster
      if (posterUrl) {
        t.setPoster(posterUrl);
      } else {
        poster.hide();
      }

<<<<<<< Updated upstream
      media.addEventListener('play', function () {
        poster.hide();
      }, false);
=======
		mediaElement.originalNode.parentNode.insertBefore(youtubeContainer, mediaElement.originalNode);
		mediaElement.originalNode.style.display = 'none';

		var isAudio = mediaElement.originalNode.tagName.toLowerCase() === 'audio',
		    height = isAudio ? '1' : mediaElement.originalNode.height,
		    width = isAudio ? '1' : mediaElement.originalNode.width,
		    videoId = YouTubeApi.getYouTubeId(mediaFiles[0].src),
		    youtubeSettings = {
			id: youtube.id,
			containerId: youtubeContainer.id,
			videoId: videoId,
			height: height,
			width: width,
			host: youtube.options.youtube && youtube.options.youtube.nocookie ? 'https://www.youtube-nocookie.com' : undefined,
			playerVars: Object.assign({
				controls: 0,
				rel: 0,
				disablekb: 1,
				showinfo: 0,
				modestbranding: 0,
				html5: 1,
				iv_load_policy: 3
			}, youtube.options.youtube),
			origin: _window2.default.location.host,
			events: {
				onReady: function onReady(e) {
					mediaElement.youTubeApi = youTubeApi = e.target;
					mediaElement.youTubeState = {
						paused: true,
						ended: false
					};
>>>>>>> Stashed changes

      if (player.options.showPosterWhenEnded && player.options.autoRewind) {
        media.addEventListener('ended', function () {
          poster.show();
        }, false);
      }
    },
    setPoster: function (url) {
      var t = this,
        posterDiv = t.container.find('.mejs-poster'),
        posterImg = posterDiv.find('img');

      if (posterImg.length === 0) {
        posterImg = $('<img width="100%" height="100%" />').appendTo(posterDiv);
      }

      posterImg.attr('src', url);
      posterDiv.css({'background-image': 'url(' + url + ')'});
    },
    buildoverlays: function (player, controls, layers, media) {
      var t = this;
      if (!player.isVideo)
        return;

      var
        loading =
        $('<div class="mejs-overlay mejs-layer">' +
          '<div class="mejs-overlay-loading"><span></span></div>' +
          '</div>')
        .hide() // start out hidden
        .appendTo(layers),
        error =
        $('<div class="mejs-overlay mejs-layer">' +
          '<div class="mejs-overlay-error"></div>' +
          '</div>')
        .hide() // start out hidden
        .appendTo(layers),
        // this needs to come last so it's on top
        bigPlay =
        $('<div class="mejs-overlay mejs-layer mejs-overlay-play">' +
          '<div class="mejs-overlay-button"></div>' +
          '</div>')
        .appendTo(layers)
        .bind('click', function () {  // Removed 'touchstart' due issues on Samsung Android devices where a tap on bigPlay started and immediately stopped the video
          if (t.options.clickToPlayPause) {
            if (media.paused) {
              media.play();
            }
          }
        });

      /*
       if (mejs.MediaFeatures.isiOS || mejs.MediaFeatures.isAndroid) {
       bigPlay.remove();
       loading.remove();
       }
       */


      // show/hide big play button
      media.addEventListener('play', function () {
        bigPlay.hide();
        loading.hide();
        controls.find('.mejs-time-buffering').hide();
        error.hide();
      }, false);

      media.addEventListener('playing', function () {
        bigPlay.hide();
        loading.hide();
        controls.find('.mejs-time-buffering').hide();
        error.hide();
      }, false);

      media.addEventListener('seeking', function () {
        loading.show();
        controls.find('.mejs-time-buffering').show();
      }, false);

      media.addEventListener('seeked', function () {
        loading.hide();
        controls.find('.mejs-time-buffering').hide();
      }, false);

      media.addEventListener('pause', function () {
        if (!mejs.MediaFeatures.isiPhone) {
          bigPlay.show();
        }
      }, false);

      media.addEventListener('waiting', function () {
        loading.show();
        controls.find('.mejs-time-buffering').show();
      }, false);


      // show/hide loading
      media.addEventListener('loadeddata', function () {
        // for some reason Chrome is firing this event
        //if (mejs.MediaFeatures.isChrome && media.getAttribute && media.getAttribute('preload') === 'none')
        //	return;

        loading.show();
        controls.find('.mejs-time-buffering').show();
        // Firing the 'canplay' event after a timeout which isn't getting fired on some Android 4.1 devices (https://github.com/johndyer/mediaelement/issues/1305)
        if (mejs.MediaFeatures.isAndroid) {
          media.canplayTimeout = window.setTimeout(
            function () {
              if (document.createEvent) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('canplay', true, true);
                return media.dispatchEvent(evt);
              }
            }, 300
            );
        }
      }, false);
      media.addEventListener('canplay', function () {
        loading.hide();
        controls.find('.mejs-time-buffering').hide();
        clearTimeout(media.canplayTimeout); // Clear timeout inside 'loadeddata' to prevent 'canplay' to fire twice
      }, false);

      // error handling
      media.addEventListener('error', function () {
        loading.hide();
        controls.find('.mejs-time-buffering').hide();
        error.show();
        error.find('mejs-overlay-error').html("Error loading this resource");
      }, false);

      media.addEventListener('keydown', function (e) {
        t.onkeydown(player, media, e);
      }, false);
    },
    buildkeyboard: function (player, controls, layers, media) {

      var t = this;

      t.container.keydown(function () {
        t.keyboardAction = true;
      });

      // listen for key presses
      t.globalBind('keydown', function (e) {
        return t.onkeydown(player, media, e);
      });


      // check if someone clicked outside a player region, then kill its focus
      t.globalBind('click', function (event) {
        player.hasFocus = $(event.target).closest('.mejs-container').length !== 0;
      });

    },
    onkeydown: function (player, media, e) {
      if (player.hasFocus && player.options.enableKeyboard) {
        // find a matching key
        for (var i = 0, il = player.options.keyActions.length; i < il; i++) {
          var keyAction = player.options.keyActions[i];

          for (var j = 0, jl = keyAction.keys.length; j < jl; j++) {
            if (e.keyCode == keyAction.keys[j]) {
              if (typeof (e.preventDefault) == "function")
                e.preventDefault();
              keyAction.action(player, media, e.keyCode);
              return false;
            }
          }
        }
      }

      return true;
    },
    findTracks: function () {
      var t = this,
        tracktags = t.$media.find('track');

      // store for use by plugins
      t.tracks = [];
      tracktags.each(function (index, track) {

        track = $(track);

        t.tracks.push({
          srclang: (track.attr('srclang')) ? track.attr('srclang').toLowerCase() : '',
          src: track.attr('src'),
          kind: track.attr('kind'),
          label: track.attr('label') || '',
          entries: [],
          isLoaded: false
        });
      });
    },
    changeSkin: function (className) {
      this.container[0].className = 'mejs-container ' + className;
      this.setPlayerSize(this.width, this.height);
      this.setControlsSize();
    },
    play: function () {
      this.load();
      this.media.play();
    },
    pause: function () {
      try {
        this.media.pause();
      } catch (e) {
      }
    },
    load: function () {
      if (!this.isLoaded) {
        this.media.load();
      }

      this.isLoaded = true;
    },
    setMuted: function (muted) {
      this.media.setMuted(muted);
    },
    setCurrentTime: function (time) {
      this.media.setCurrentTime(time);
    },
    getCurrentTime: function () {
      return this.media.currentTime;
    },
    setVolume: function (volume) {
      this.media.setVolume(volume);
    },
    getVolume: function () {
      return this.media.volume;
    },
    setSrc: function (src) {
      this.media.setSrc(src);
    },
    remove: function () {
      var t = this, featureIndex, feature;

      // invoke features cleanup
      for (featureIndex in t.options.features) {
        feature = t.options.features[featureIndex];
        if (t['clean' + feature]) {
          try {
            t['clean' + feature](t);
          } catch (e) {
            // TODO: report control error
            //throw e;
            //console.log('error building ' + feature);
            //console.log(e);
          }
        }
      }

      // grab video and put it back in place
      if (!t.isDynamic) {
        t.$media.prop('controls', true);
        // detach events from the video
        // TODO: detach event listeners better than this;
        //       also detach ONLY the events attached by this plugin!
        t.$node.clone().insertBefore(t.container).show();
        t.$node.remove();
      } else {
        t.$node.insertBefore(t.container);
      }

      if (t.media.pluginType !== 'native') {
        t.media.remove();
      }

      // Remove the player from the mejs.players object so that pauseOtherPlayers doesn't blow up when trying to pause a non existance flash api.
      delete mejs.players[t.id];

      if (typeof t.container == 'object') {
        t.container.remove();
      }
      t.globalUnbind();
      delete t.node.player;
    },
    rebuildtracks: function () {
      var t = this;
      t.findTracks();
      t.buildtracks(t, t.controls, t.layers, t.media);
    }
  };

  (function () {
    var rwindow = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;

    function splitEvents(events, id) {
      // add player ID as an event namespace so it's easier to unbind them all later
      var ret = {d: [], w: []};
      $.each((events || '').split(' '), function (k, v) {
        var eventname = v + '.' + id;
        if (eventname.indexOf('.') === 0) {
          ret.d.push(eventname);
          ret.w.push(eventname);
        }
        else {
          ret[rwindow.test(v) ? 'w' : 'd'].push(eventname);
        }
      });
      ret.d = ret.d.join(' ');
      ret.w = ret.w.join(' ');
      return ret;
    }

    mejs.MediaElementPlayer.prototype.globalBind = function (events, data, callback) {
      var t = this;
      events = splitEvents(events, t.id);
      if (events.d)
        $(document).bind(events.d, data, callback);
      if (events.w)
        $(window).bind(events.w, data, callback);
    };

    mejs.MediaElementPlayer.prototype.globalUnbind = function (events, callback) {
      var t = this;
      events = splitEvents(events, t.id);
      if (events.d)
        $(document).unbind(events.d, callback);
      if (events.w)
        $(window).unbind(events.w, callback);
    };
  })();

  // turn into jQuery plugin
  if (typeof $ != 'undefined') {
    $.fn.mediaelementplayer = function (options) {
      if (options === false) {
        this.each(function () {
          var player = $(this).data('mediaelementplayer');
          if (player) {
            player.remove();
          }
          $(this).removeData('mediaelementplayer');
        });
      }
      else {
        this.each(function () {
          $(this).data('mediaelementplayer', new mejs.MediaElementPlayer(this, options));
        });
      }
      return this;
    };


    $(document).ready(function () {
      // auto enable using JSON attribute
      $('.mejs-player').mediaelementplayer();
    });
  }

  // push out to window
  window.MediaElementPlayer = mejs.MediaElementPlayer;

})(mejs.$);

(function ($) {

  $.extend(mejs.MepDefaults, {
    playText: 'Play',
    pauseText: 'Pause'
  });

  // PLAY/pause BUTTON
  $.extend(MediaElementPlayer.prototype, {
    buildplaypause: function (player, controls, layers, media) {
      var
        t = this,
        op = t.options,
        play =
        $('<div class="mejs-button mejs-playpause-button mejs-play" >' +
          '<button type="button" aria-controls="' + t.id + '" title="' + op.playText + '" aria-label="' + op.playText + '"></button>' +
          '</div>')
        .appendTo(controls)
        .click(function (e) {
          e.preventDefault();

          if (media.paused) {
            media.play();
          } else {
            media.pause();
          }

          return false;
        }),
        play_btn = play.find('button');


      function togglePlayPause(which) {
        if ('play' === which) {
          play.removeClass('mejs-play').addClass('mejs-pause');
          play_btn.attr({
            'title': op.pauseText,
            'aria-label': op.pauseText
          });
        } else {
          play.removeClass('mejs-pause').addClass('mejs-play');
          play_btn.attr({
            'title': op.playText,
            'aria-label': op.playText
          });
        }
      }
      ;
      togglePlayPause('pse');


      media.addEventListener('play', function () {
        togglePlayPause('play');
      }, false);
      media.addEventListener('playing', function () {
        togglePlayPause('play');
      }, false);

<<<<<<< Updated upstream
=======
},{"17":17,"18":18,"19":19,"2":2,"3":3,"6":6,"7":7}],16:[function(_dereq_,module,exports){
'use strict';
>>>>>>> Stashed changes

      media.addEventListener('pause', function () {
        togglePlayPause('pse');
      }, false);
      media.addEventListener('paused', function () {
        togglePlayPause('pse');
      }, false);
    }
  });

})(mejs.$);

(function ($) {

  $.extend(mejs.MepDefaults, {
    progessHelpText: 'Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.'
  });

  // progress/loaded bar
  $.extend(MediaElementPlayer.prototype, {
    buildprogress: function (player, controls, layers, media) {

      $('<div class="mejs-time-rail">' +
        '<span  class="mejs-time-total mejs-time-slider">' +
        //'<span class="mejs-offscreen">' + this.options.progessHelpText + '</span>' +
        '<span class="mejs-time-buffering"></span>' +
        '<span class="mejs-time-loaded"></span>' +
        '<span class="mejs-time-current"></span>' +
        '<span class="mejs-time-handle"></span>' +
        '<span class="mejs-time-float">' +
        '<span class="mejs-time-float-current">00:00</span>' +
        '<span class="mejs-time-float-corner"></span>' +
        '</span>' +
        '</div>')
        .appendTo(controls);
      controls.find('.mejs-time-buffering').hide();

      var
        t = this,
        total = controls.find('.mejs-time-total'),
        loaded = controls.find('.mejs-time-loaded'),
        current = controls.find('.mejs-time-current'),
        handle = controls.find('.mejs-time-handle'),
        timefloat = controls.find('.mejs-time-float'),
        timefloatcurrent = controls.find('.mejs-time-float-current'),
        slider = controls.find('.mejs-time-slider'),
        handleMouseMove = function (e) {

          var offset = total.offset(),
            width = total.outerWidth(true),
            percentage = 0,
            newTime = 0,
            pos = 0,
            x;

          // mouse or touch position relative to the object
          if (e.originalEvent.changedTouches) {
            x = e.originalEvent.changedTouches[0].pageX;
          } else {
            x = e.pageX;
          }

          if (media.duration) {
            if (x < offset.left) {
              x = offset.left;
            } else if (x > width + offset.left) {
              x = width + offset.left;
            }

            pos = x - offset.left;
            percentage = (pos / width);
            newTime = (percentage <= 0.02) ? 0 : percentage * media.duration;

            // seek to where the mouse is
            if (mouseIsDown && newTime !== media.currentTime) {
              media.setCurrentTime(newTime);
            }

            // position floating time box
            if (!mejs.MediaFeatures.hasTouch) {
              timefloat.css('left', pos);
              timefloatcurrent.html(mejs.Utility.secondsToTimeCode(newTime));
              timefloat.show();
            }
          }
        },
        mouseIsDown = false,
        mouseIsOver = false,
        lastKeyPressTime = 0,
        startedPaused = false,
        autoRewindInitial = player.options.autoRewind;
      // Accessibility for slider
      var updateSlider = function (e) {

        var seconds = media.currentTime,
          timeSliderText = 'Time Slider',
          time = mejs.Utility.secondsToTimeCode(seconds),
          duration = media.duration;

        slider.attr({
          'aria-label': timeSliderText,
          'aria-valuemin': 0,
          'aria-valuemax': duration,
          'aria-valuenow': seconds,
          'aria-valuetext': time,
          'role': 'slider',
          'tabindex': 0
        });

      };

      var restartPlayer = function () {
        var now = new Date();
        if (now - lastKeyPressTime >= 1000) {
          media.play();
        }
      };

<<<<<<< Updated upstream
      slider.bind('focus', function (e) {
        player.options.autoRewind = false;
      });
=======
var _mejs = _dereq_(6);
>>>>>>> Stashed changes

      slider.bind('blur', function (e) {
        player.options.autoRewind = autoRewindInitial;
      });

      slider.bind('keydown', function (e) {

        if ((new Date() - lastKeyPressTime) >= 1000) {
          startedPaused = media.paused;
        }

        var keyCode = e.keyCode,
          duration = media.duration,
          seekTime = media.currentTime;

        switch (keyCode) {
          case 37: // left
            seekTime -= 1;
            break;
          case 39: // Right
            seekTime += 1;
            break;
          case 38: // Up
            seekTime += Math.floor(duration * 0.1);
            break;
          case 40: // Down
            seekTime -= Math.floor(duration * 0.1);
            break;
          case 36: // Home
            seekTime = 0;
            break;
          case 35: // end
            seekTime = duration;
            break;
          case 10: // enter
            media.paused ? media.play() : media.pause();
            return;
          case 13: // space
            media.paused ? media.play() : media.pause();
            return;
          default:
            return;
        }

        seekTime = seekTime < 0 ? 0 : (seekTime >= duration ? duration : Math.floor(seekTime));
        lastKeyPressTime = new Date();
        if (!startedPaused) {
          media.pause();
        }

        if (seekTime < media.duration && !startedPaused) {
          setTimeout(restartPlayer, 1100);
        }

        media.setCurrentTime(seekTime);

        e.preventDefault();
        e.stopPropagation();
        return false;
      });


      // handle clicks
      //controls.find('.mejs-time-rail').delegate('span', 'click', handleMouseMove);
      total
        .bind('mousedown touchstart', function (e) {
          // only handle left clicks or touch
          if (e.which === 1 || e.which === 0) {
            mouseIsDown = true;
            handleMouseMove(e);
            t.globalBind('mousemove.dur touchmove.dur', function (e) {
              handleMouseMove(e);
            });
            t.globalBind('mouseup.dur touchend.dur', function (e) {
              mouseIsDown = false;
              timefloat.hide();
              t.globalUnbind('.dur');
            });
          }
        })
        .bind('mouseenter', function (e) {
          mouseIsOver = true;
          t.globalBind('mousemove.dur', function (e) {
            handleMouseMove(e);
          });
          if (!mejs.MediaFeatures.hasTouch) {
            timefloat.show();
          }
        })
        .bind('mouseleave', function (e) {
          mouseIsOver = false;
          if (!mouseIsDown) {
            t.globalUnbind('.dur');
            timefloat.hide();
          }
        });

      // loading
      media.addEventListener('progress', function (e) {
        player.setProgressRail(e);
        player.setCurrentRail(e);
      }, false);

      // current time
      media.addEventListener('timeupdate', function (e) {
        player.setProgressRail(e);
        player.setCurrentRail(e);
        updateSlider(e);
      }, false);


      // store for later use
      t.loaded = loaded;
      t.total = total;
      t.current = current;
      t.handle = handle;
    },
    setProgressRail: function (e) {

      var
        t = this,
        target = (e !== undefined) ? e.target : t.media,
        percent = null;

      // newest HTML5 spec has buffered array (FF4, Webkit)
      if (target && target.buffered && target.buffered.length > 0 && target.buffered.end && target.duration) {
        // TODO: account for a real array with multiple values (only Firefox 4 has this so far)
        percent = target.buffered.end(0) / target.duration;
      }
      // Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
      // to be anything other than 0. If the byte count is available we use this instead.
      // Browsers that support the else if do not seem to have the bufferedBytes value and
      // should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
      else if (target && target.bytesTotal !== undefined && target.bytesTotal > 0 && target.bufferedBytes !== undefined) {
        percent = target.bufferedBytes / target.bytesTotal;
      }
      // Firefox 3 with an Ogg file seems to go this way
      else if (e && e.lengthComputable && e.total !== 0) {
        percent = e.loaded / e.total;
      }

      // finally update the progress bar
      if (percent !== null) {
        percent = Math.min(1, Math.max(0, percent));
        // update loaded bar
        if (t.loaded && t.total) {
          t.loaded.width(t.total.width() * percent);
        }
      }
    },
    setCurrentRail: function () {

      var t = this;

      if (t.media.currentTime !== undefined && t.media.duration) {

        // update bar and handle
        if (t.total && t.handle) {
          var
            newWidth = Math.round(t.total.width() * t.media.currentTime / t.media.duration),
            handlePos = newWidth - Math.round(t.handle.outerWidth(true) / 2);

          t.current.width(newWidth);
          t.handle.css('left', handlePos);
        }
      }

    }
  });
})(mejs.$);
(function ($) {

  // options
  $.extend(mejs.MepDefaults, {
    duration: -1,
    timeAndDurationSeparator: '<span> | </span>'
  });


  // current and duration 00:00 / 00:00
  $.extend(MediaElementPlayer.prototype, {
    buildcurrent: function (player, controls, layers, media) {
      var t = this;

      $('<div class="mejs-time" role="timer" aria-live="off">' +
        '<span class="mejs-currenttime">' +
        (player.options.alwaysShowHours ? '00:' : '') +
        (player.options.showTimecodeFrameCount ? '00:00:00' : '00:00') +
        '</span>' +
        '</div>')
        .appendTo(controls);

      t.currenttime = t.controls.find('.mejs-currenttime');

      media.addEventListener('timeupdate', function () {
        player.updateCurrent();
      }, false);
    },
    buildduration: function (player, controls, layers, media) {
      var t = this;

      if (controls.children().last().find('.mejs-currenttime').length > 0) {
        $(t.options.timeAndDurationSeparator +
          '<span class="mejs-duration">' +
          (t.options.duration > 0 ?
            mejs.Utility.secondsToTimeCode(t.options.duration, t.options.alwaysShowHours || t.media.duration > 3600, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25) :
            ((player.options.alwaysShowHours ? '00:' : '') + (player.options.showTimecodeFrameCount ? '00:00:00' : '00:00'))
            ) +
          '</span>')
          .appendTo(controls.find('.mejs-time'));
      } else {

        // add class to current time
        controls.find('.mejs-currenttime').parent().addClass('mejs-currenttime-container');

        $('<div class="mejs-time mejs-duration-container">' +
          '<span class="mejs-duration">' +
          (t.options.duration > 0 ?
            mejs.Utility.secondsToTimeCode(t.options.duration, t.options.alwaysShowHours || t.media.duration > 3600, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25) :
            ((player.options.alwaysShowHours ? '00:' : '') + (player.options.showTimecodeFrameCount ? '00:00:00' : '00:00'))
            ) +
          '</span>' +
          '</div>')
          .appendTo(controls);
      }

<<<<<<< Updated upstream
      t.durationD = t.controls.find('.mejs-duration');
=======
var HAS_NATIVE_FULLSCREEN = exports.HAS_NATIVE_FULLSCREEN = hasNativeFullscreen;
var HAS_WEBKIT_NATIVE_FULLSCREEN = exports.HAS_WEBKIT_NATIVE_FULLSCREEN = hasWebkitNativeFullScreen;
var HAS_MOZ_NATIVE_FULLSCREEN = exports.HAS_MOZ_NATIVE_FULLSCREEN = hasMozNativeFullScreen;
var HAS_MS_NATIVE_FULLSCREEN = exports.HAS_MS_NATIVE_FULLSCREEN = hasMsNativeFullScreen;
var HAS_IOS_FULLSCREEN = exports.HAS_IOS_FULLSCREEN = hasiOSFullScreen;
var HAS_TRUE_NATIVE_FULLSCREEN = exports.HAS_TRUE_NATIVE_FULLSCREEN = hasTrueNativeFullScreen;
var HAS_NATIVE_FULLSCREEN_ENABLED = exports.HAS_NATIVE_FULLSCREEN_ENABLED = nativeFullScreenEnabled;
var FULLSCREEN_EVENT_NAME = exports.FULLSCREEN_EVENT_NAME = fullScreenEventName;
exports.isFullScreen = isFullScreen;
exports.requestFullScreen = requestFullScreen;
exports.cancelFullScreen = cancelFullScreen;


_mejs2.default.Features = _mejs2.default.Features || {};
_mejs2.default.Features.isiPad = IS_IPAD;
_mejs2.default.Features.isiPod = IS_IPOD;
_mejs2.default.Features.isiPhone = IS_IPHONE;
_mejs2.default.Features.isiOS = _mejs2.default.Features.isiPhone || _mejs2.default.Features.isiPad;
_mejs2.default.Features.isAndroid = IS_ANDROID;
_mejs2.default.Features.isIE = IS_IE;
_mejs2.default.Features.isEdge = IS_EDGE;
_mejs2.default.Features.isChrome = IS_CHROME;
_mejs2.default.Features.isFirefox = IS_FIREFOX;
_mejs2.default.Features.isSafari = IS_SAFARI;
_mejs2.default.Features.isStockAndroid = IS_STOCK_ANDROID;
_mejs2.default.Features.hasMSE = HAS_MSE;
_mejs2.default.Features.supportsNativeHLS = SUPPORTS_NATIVE_HLS;
_mejs2.default.Features.supportsPointerEvents = SUPPORT_POINTER_EVENTS;
_mejs2.default.Features.supportsPassiveEvent = SUPPORT_PASSIVE_EVENT;
_mejs2.default.Features.hasiOSFullScreen = HAS_IOS_FULLSCREEN;
_mejs2.default.Features.hasNativeFullscreen = HAS_NATIVE_FULLSCREEN;
_mejs2.default.Features.hasWebkitNativeFullScreen = HAS_WEBKIT_NATIVE_FULLSCREEN;
_mejs2.default.Features.hasMozNativeFullScreen = HAS_MOZ_NATIVE_FULLSCREEN;
_mejs2.default.Features.hasMsNativeFullScreen = HAS_MS_NATIVE_FULLSCREEN;
_mejs2.default.Features.hasTrueNativeFullScreen = HAS_TRUE_NATIVE_FULLSCREEN;
_mejs2.default.Features.nativeFullScreenEnabled = HAS_NATIVE_FULLSCREEN_ENABLED;
_mejs2.default.Features.fullScreenEventName = FULLSCREEN_EVENT_NAME;
_mejs2.default.Features.isFullScreen = isFullScreen;
_mejs2.default.Features.requestFullScreen = requestFullScreen;
_mejs2.default.Features.cancelFullScreen = cancelFullScreen;

},{"2":2,"3":3,"6":6}],17:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.removeClass = exports.addClass = exports.hasClass = undefined;
exports.loadScript = loadScript;
exports.offset = offset;
exports.toggleClass = toggleClass;
exports.fadeOut = fadeOut;
exports.fadeIn = fadeIn;
exports.siblings = siblings;
exports.visible = visible;
exports.ajax = ajax;
>>>>>>> Stashed changes

      media.addEventListener('timeupdate', function () {
        player.updateDuration();
      }, false);
    },
    updateCurrent: function () {
      var t = this;

      if (t.currenttime) {
        t.currenttime.html(mejs.Utility.secondsToTimeCode(t.media.currentTime, t.options.alwaysShowHours || t.media.duration > 3600, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25));
      }
    },
    updateDuration: function () {
      var t = this;

      //Toggle the long video class if the video is longer than an hour.
      t.container.toggleClass("mejs-long-video", t.media.duration > 3600);

      if (t.durationD && (t.options.duration > 0 || t.media.duration)) {
        t.durationD.html(mejs.Utility.secondsToTimeCode(t.options.duration > 0 ? t.options.duration : t.media.duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25));
      }
    }
  });

<<<<<<< Updated upstream
})(mejs.$);
=======
var _mejs = _dereq_(6);
>>>>>>> Stashed changes

(function ($) {

  $.extend(mejs.MepDefaults, {
    muteText: 'Mute Toggle',
    allyVolumeControlText: 'Use Up/Down Arrow keys to increase or decrease volume.',
    hideVolumeOnTouchDevices: true,
    audioVolume: 'horizontal',
    videoVolume: 'vertical'
  });

  $.extend(MediaElementPlayer.prototype, {
    buildvolume: function (player, controls, layers, media) {

      // Android and iOS don't support volume controls
      if ((mejs.MediaFeatures.isAndroid || mejs.MediaFeatures.isiOS) && this.options.hideVolumeOnTouchDevices)
        return;

      var t = this,
        mode = (t.isVideo) ? t.options.videoVolume : t.options.audioVolume,
        mute = (mode == 'horizontal') ?
        // horizontal version
        $('<div class="mejs-button mejs-volume-button mejs-mute">' +
          '<button type="button" aria-controls="' + t.id +
          '" title="' + t.options.muteText +
          '" aria-label="' + t.options.muteText +
          '"></button>' +
          '</div>' +
          '<a href="javascript:void(0);" class="mejs-horizontal-volume-slider">' + // outer background
          '<span class="mejs-offscreen">' + t.options.allyVolumeControlText + '</span>' +
          '<div class="mejs-horizontal-volume-total"></div>' + // line background
          '<div class="mejs-horizontal-volume-current"></div>' + // current volume
          '<div class="mejs-horizontal-volume-handle"></div>' + // handle
          '</a>'
          )
        .appendTo(controls) :
        // vertical version
        $('<div class="mejs-button mejs-volume-button mejs-mute">' +
          '<button type="button" aria-controls="' + t.id +
          '" title="' + t.options.muteText +
          '" aria-label="' + t.options.muteText +
          '"></button>' +
          '<a href="javascript:void(0);" class="mejs-volume-slider">' + // outer background
          '<span class="mejs-offscreen">' + t.options.allyVolumeControlText + '</span>' +
          '<div class="mejs-volume-total"></div>' + // line background
          '<div class="mejs-volume-current"></div>' + // current volume
          '<div class="mejs-volume-handle"></div>' + // handle
          '</a>' +
          '</div>')
        .appendTo(controls),
        volumeSlider = t.container.find('.mejs-volume-slider, .mejs-horizontal-volume-slider'),
        volumeTotal = t.container.find('.mejs-volume-total, .mejs-horizontal-volume-total'),
        volumeCurrent = t.container.find('.mejs-volume-current, .mejs-horizontal-volume-current'),
        volumeHandle = t.container.find('.mejs-volume-handle, .mejs-horizontal-volume-handle'),
        positionVolumeHandle = function (volume, secondTry) {

          if (!volumeSlider.is(':visible') && typeof secondTry == 'undefined') {
            volumeSlider.show();
            positionVolumeHandle(volume, true);
            volumeSlider.hide();
            return;
          }

          // correct to 0-1
          volume = Math.max(0, volume);
          volume = Math.min(volume, 1);

          // ajust mute button style
          if (volume === 0) {
            mute.removeClass('mejs-mute').addClass('mejs-unmute');
          } else {
            mute.removeClass('mejs-unmute').addClass('mejs-mute');
          }

          // top/left of full size volume slider background
          var totalPosition = volumeTotal.position();
          // position slider
          if (mode == 'vertical') {
            var
              // height of the full size volume slider background
              totalHeight = volumeTotal.height(),
              // the new top position based on the current volume
              // 70% volume on 100px height == top:30px
              newTop = totalHeight - (totalHeight * volume);

            // handle
            volumeHandle.css('top', Math.round(totalPosition.top + newTop - (volumeHandle.height() / 2)));

            // show the current visibility
            volumeCurrent.height(totalHeight - newTop);
            volumeCurrent.css('top', totalPosition.top + newTop);
          } else {
            var
              // height of the full size volume slider background
              totalWidth = volumeTotal.width(),
              // the new left position based on the current volume
              newLeft = totalWidth * volume;

            // handle
            volumeHandle.css('left', Math.round(totalPosition.left + newLeft - (volumeHandle.width() / 2)));

            // rezize the current part of the volume bar
            volumeCurrent.width(Math.round(newLeft));
          }
        },
        handleVolumeMove = function (e) {

          var volume = null,
            totalOffset = volumeTotal.offset();

          // calculate the new volume based on the moust position
          if (mode === 'vertical') {

            var
              railHeight = volumeTotal.height(),
              totalTop = parseInt(volumeTotal.css('top').replace(/px/, ''), 10),
              newY = e.pageY - totalOffset.top;

            volume = (railHeight - newY) / railHeight;

            // the controls just hide themselves (usually when mouse moves too far up)
            if (totalOffset.top === 0 || totalOffset.left === 0) {
              return;
            }

          } else {
            var
              railWidth = volumeTotal.width(),
              newX = e.pageX - totalOffset.left;

            volume = newX / railWidth;
          }

          // ensure the volume isn't outside 0-1
          volume = Math.max(0, volume);
          volume = Math.min(volume, 1);

          // position the slider and handle
          positionVolumeHandle(volume);

          // set the media object (this will trigger the volumechanged event)
          if (volume === 0) {
            media.setMuted(true);
          } else {
            media.setMuted(false);
          }
          media.setVolume(volume);
        },
        mouseIsDown = false,
        mouseIsOver = false;

      // SLIDER

      mute
        .hover(function () {
          volumeSlider.show();
          mouseIsOver = true;
        }, function () {
          mouseIsOver = false;

          if (!mouseIsDown && mode == 'vertical') {
            volumeSlider.hide();
          }
        });

      var updateVolumeSlider = function (e) {

        var volume = Math.floor(media.volume * 100);

        volumeSlider.attr({
          'aria-label': 'volumeSlider',
          'aria-valuemin': 0,
          'aria-valuemax': 100,
          'aria-valuenow': volume,
          'aria-valuetext': volume + '%',
          'role': 'slider',
          'tabindex': 0
        });

      };

      volumeSlider
        .bind('mouseover', function () {
          mouseIsOver = true;
        })
        .bind('mousedown', function (e) {
          handleVolumeMove(e);
          t.globalBind('mousemove.vol', function (e) {
            handleVolumeMove(e);
          });
          t.globalBind('mouseup.vol', function () {
            mouseIsDown = false;
            t.globalUnbind('.vol');

            if (!mouseIsOver && mode == 'vertical') {
              volumeSlider.hide();
            }
          });
          mouseIsDown = true;

          return false;
        })
        .bind('keydown', function (e) {
          var keyCode = e.keyCode;
          var volume = media.volume;
          switch (keyCode) {
            case 38: // Up
              volume += 0.1;
              break;
            case 40: // Down
              volume = volume - 0.1;
              break;
            default:
              return true;
          }

          mouseIsDown = false;
          positionVolumeHandle(volume);
          media.setVolume(volume);
          return false;
        })
        .bind('blur', function () {
          volumeSlider.hide();
        });

      // MUTE button
      mute.find('button').click(function () {
        media.setMuted(!media.muted);
      });

      //Keyboard input
      mute.find('button').bind('focus', function () {
        volumeSlider.show();
      });

<<<<<<< Updated upstream
      // listen for volume change events from other sources
      media.addEventListener('volumechange', function (e) {
        if (!mouseIsDown) {
          if (media.muted) {
            positionVolumeHandle(0);
            mute.removeClass('mejs-mute').addClass('mejs-unmute');
          } else {
            positionVolumeHandle(media.volume);
            mute.removeClass('mejs-unmute').addClass('mejs-mute');
          }
        }
        updateVolumeSlider(e);
      }, false);

      if (t.container.is(':visible')) {
        // set initial volume
        positionVolumeHandle(player.options.startVolume);
=======
_mejs2.default.Utils = _mejs2.default.Utils || {};
_mejs2.default.Utils.offset = offset;
_mejs2.default.Utils.hasClass = hasClass;
_mejs2.default.Utils.addClass = addClass;
_mejs2.default.Utils.removeClass = removeClass;
_mejs2.default.Utils.toggleClass = toggleClass;
_mejs2.default.Utils.fadeIn = fadeIn;
_mejs2.default.Utils.fadeOut = fadeOut;
_mejs2.default.Utils.siblings = siblings;
_mejs2.default.Utils.visible = visible;
_mejs2.default.Utils.ajax = ajax;
_mejs2.default.Utils.loadScript = loadScript;

},{"2":2,"3":3,"6":6}],18:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.escapeHTML = escapeHTML;
exports.debounce = debounce;
exports.isObjectEmpty = isObjectEmpty;
exports.splitEvents = splitEvents;
exports.createEvent = createEvent;
exports.isNodeAfter = isNodeAfter;
exports.isString = isString;

var _mejs = _dereq_(6);
>>>>>>> Stashed changes

        // mutes the media and sets the volume icon muted if the initial volume is set to 0
        if (player.options.startVolume === 0) {
          media.setMuted(true);
        }

        // shim gets the startvolume as a parameter, but we have to set it on the native <video> and <audio> elements
        if (media.pluginType === 'native') {
          media.setVolume(player.options.startVolume);
        }
      }
    }
  });

})(mejs.$);
(function ($) {

  $.extend(mejs.MepDefaults, {
    usePluginFullScreen: true,
    newWindowCallback: function () {
      return '';
    },
    fullscreenText: 'Fullscreen'
  });

  $.extend(MediaElementPlayer.prototype, {
    isFullScreen: false,
    isNativeFullScreen: false,
    isInIframe: false,
    buildfullscreen: function (player, controls, layers, media) {

      if (!player.isVideo)
        return;

      player.isInIframe = (window.location != window.parent.location);

      // native events
      if (mejs.MediaFeatures.hasTrueNativeFullScreen) {

        // chrome doesn't alays fire this in an iframe
        var func = function (e) {
          if (player.isFullScreen) {
            if (mejs.MediaFeatures.isFullScreen()) {
              player.isNativeFullScreen = true;
              // reset the controls once we are fully in full screen
              player.setControlsSize();
            } else {
              player.isNativeFullScreen = false;
              // when a user presses ESC
              // make sure to put the player back into place
              player.exitFullScreen();
            }
          }
        };

        player.globalBind(mejs.MediaFeatures.fullScreenEventName, func);
      }

      var t = this,
        normalHeight = 0,
        normalWidth = 0,
        container = player.container,
        fullscreenBtn =
        $('<div class="mejs-button mejs-fullscreen-button">' +
          '<button type="button" aria-controls="' + t.id + '" title="' + t.options.fullscreenText + '" aria-label="' + t.options.fullscreenText + '"></button>' +
          '</div>')
        .appendTo(controls);

      if (t.media.pluginType === 'native' || (!t.options.usePluginFullScreen && !mejs.MediaFeatures.isFirefox)) {

        fullscreenBtn.click(function () {
          var isFullScreen = (mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen()) || player.isFullScreen;

          if (isFullScreen) {
            player.exitFullScreen();
          } else {
            player.enterFullScreen();
          }
        });

      } else {

        var hideTimeout = null,
          supportsPointerEvents = (function () {
            // TAKEN FROM MODERNIZR
            var element = document.createElement('x'),
              documentElement = document.documentElement,
              getComputedStyle = window.getComputedStyle,
              supports;
            if (!('pointerEvents' in element.style)) {
              return false;
            }
            element.style.pointerEvents = 'auto';
            element.style.pointerEvents = 'x';
            documentElement.appendChild(element);
            supports = getComputedStyle &&
              getComputedStyle(element, '').pointerEvents === 'auto';
            documentElement.removeChild(element);
            return !!supports;
          })();

        //console.log('supportsPointerEvents', supportsPointerEvents);

        if (supportsPointerEvents && !mejs.MediaFeatures.isOpera) { // opera doesn't allow this :(

          // allows clicking through the fullscreen button and controls down directly to Flash

          /*
           When a user puts his mouse over the fullscreen button, the controls are disabled
           So we put a div over the video and another one on iether side of the fullscreen button
           that caputre mouse movement
           and restore the controls once the mouse moves outside of the fullscreen button
           */

          var fullscreenIsDisabled = false,
            restoreControls = function () {
              if (fullscreenIsDisabled) {
                // hide the hovers
                for (var i in hoverDivs) {
                  hoverDivs[i].hide();
                }

                // restore the control bar
                fullscreenBtn.css('pointer-events', '');
                t.controls.css('pointer-events', '');

                // prevent clicks from pausing video
                t.media.removeEventListener('click', t.clickToPlayPauseCallback);

                // store for later
                fullscreenIsDisabled = false;
              }
            },
            hoverDivs = {},
            hoverDivNames = ['top', 'left', 'right', 'bottom'],
            i, len,
            positionHoverDivs = function () {
              var fullScreenBtnOffsetLeft = fullscreenBtn.offset().left - t.container.offset().left,
                fullScreenBtnOffsetTop = fullscreenBtn.offset().top - t.container.offset().top,
                fullScreenBtnWidth = fullscreenBtn.outerWidth(true),
                fullScreenBtnHeight = fullscreenBtn.outerHeight(true),
                containerWidth = t.container.width(),
                containerHeight = t.container.height();

              for (i in hoverDivs) {
                hoverDivs[i].css({position: 'absolute', top: 0, left: 0}); //, backgroundColor: '#f00'});
              }

              // over video, but not controls
              hoverDivs['top']
                .width(containerWidth)
                .height(fullScreenBtnOffsetTop);

              // over controls, but not the fullscreen button
              hoverDivs['left']
                .width(fullScreenBtnOffsetLeft)
                .height(fullScreenBtnHeight)
                .css({top: fullScreenBtnOffsetTop});

              // after the fullscreen button
              hoverDivs['right']
                .width(containerWidth - fullScreenBtnOffsetLeft - fullScreenBtnWidth)
                .height(fullScreenBtnHeight)
                .css({top: fullScreenBtnOffsetTop,
                  left: fullScreenBtnOffsetLeft + fullScreenBtnWidth});

              // under the fullscreen button
              hoverDivs['bottom']
                .width(containerWidth)
                .height(containerHeight - fullScreenBtnHeight - fullScreenBtnOffsetTop)
                .css({top: fullScreenBtnOffsetTop + fullScreenBtnHeight});
            };

          t.globalBind('resize', function () {
            positionHoverDivs();
          });

          for (i = 0, len = hoverDivNames.length; i < len; i++) {
            hoverDivs[hoverDivNames[i]] = $('<div class="mejs-fullscreen-hover" />').appendTo(t.container).mouseover(restoreControls).hide();
          }

          // on hover, kill the fullscreen button's HTML handling, allowing clicks down to Flash
          fullscreenBtn.on('mouseover', function () {

            if (!t.isFullScreen) {

              var buttonPos = fullscreenBtn.offset(),
                containerPos = player.container.offset();

              // move the button in Flash into place
              media.positionFullscreenButton(buttonPos.left - containerPos.left, buttonPos.top - containerPos.top, false);

              // allows click through
              fullscreenBtn.css('pointer-events', 'none');
              t.controls.css('pointer-events', 'none');

              // restore click-to-play
              t.media.addEventListener('click', t.clickToPlayPauseCallback);

              // show the divs that will restore things
              for (i in hoverDivs) {
                hoverDivs[i].show();
              }

              positionHoverDivs();

              fullscreenIsDisabled = true;
            }

          });

          // restore controls anytime the user enters or leaves fullscreen
          media.addEventListener('fullscreenchange', function (e) {
            t.isFullScreen = !t.isFullScreen;
            // don't allow plugin click to pause video - messes with
            // plugin's controls
            if (t.isFullScreen) {
              t.media.removeEventListener('click', t.clickToPlayPauseCallback);
            } else {
              t.media.addEventListener('click', t.clickToPlayPauseCallback);
            }
            restoreControls();
          });


          // the mouseout event doesn't work on the fullscren button, because we already killed the pointer-events
          // so we use the document.mousemove event to restore controls when the mouse moves outside the fullscreen button

          t.globalBind('mousemove', function (e) {

            // if the mouse is anywhere but the fullsceen button, then restore it all
            if (fullscreenIsDisabled) {

              var fullscreenBtnPos = fullscreenBtn.offset();


              if (e.pageY < fullscreenBtnPos.top || e.pageY > fullscreenBtnPos.top + fullscreenBtn.outerHeight(true) ||
                e.pageX < fullscreenBtnPos.left || e.pageX > fullscreenBtnPos.left + fullscreenBtn.outerWidth(true)
                ) {

                fullscreenBtn.css('pointer-events', '');
                t.controls.css('pointer-events', '');

                fullscreenIsDisabled = false;
              }
            }
          });



        } else {

<<<<<<< Updated upstream
          // the hover state will show the fullscreen button in Flash to hover up and click
=======
},{"6":6}],19:[function(_dereq_,module,exports){
'use strict';
>>>>>>> Stashed changes

          fullscreenBtn
            .on('mouseover', function () {

<<<<<<< Updated upstream
              if (hideTimeout !== null) {
                clearTimeout(hideTimeout);
                delete hideTimeout;
              }
=======
var _mejs = _dereq_(6);
>>>>>>> Stashed changes

              var buttonPos = fullscreenBtn.offset(),
                containerPos = player.container.offset();

              media.positionFullscreenButton(buttonPos.left - containerPos.left, buttonPos.top - containerPos.top, true);

            })
            .on('mouseout', function () {

              if (hideTimeout !== null) {
                clearTimeout(hideTimeout);
                delete hideTimeout;
              }

              hideTimeout = setTimeout(function () {
                media.hideFullscreenButton();
              }, 1500);


            });
        }
      }

      player.fullscreenBtn = fullscreenBtn;

      t.globalBind('keydown', function (e) {
        if (((mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen()) || t.isFullScreen) && e.keyCode == 27) {
          player.exitFullScreen();
        }
      });

    },
    cleanfullscreen: function (player) {
      player.exitFullScreen();
    },
    containerSizeTimeout: null,
    enterFullScreen: function () {

      var t = this;

      // firefox+flash can't adjust plugin sizes without resetting :(
      if (t.media.pluginType !== 'native' && (mejs.MediaFeatures.isFirefox || t.options.usePluginFullScreen)) {
        //t.media.setFullscreen(true);
        //player.isFullScreen = true;
        return;
      }

      // set it to not show scroll bars so 100% will work
      $(document.documentElement).addClass('mejs-fullscreen');

      // store sizing
      normalHeight = t.container.height();
      normalWidth = t.container.width();

      // attempt to do true fullscreen (Safari 5.1 and Firefox Nightly only for now)
      if (t.media.pluginType === 'native') {
        if (mejs.MediaFeatures.hasTrueNativeFullScreen) {

          mejs.MediaFeatures.requestFullScreen(t.container[0]);
          //return;

          if (t.isInIframe) {
            // sometimes exiting from fullscreen doesn't work
            // notably in Chrome <iframe>. Fixed in version 17
            setTimeout(function checkFullscreen() {

              if (t.isNativeFullScreen) {
                var zoomMultiplier = window["devicePixelRatio"] || 1;
                // Use a percent error margin since devicePixelRatio is a float and not exact.
                var percentErrorMargin = 0.002; // 0.2%
                var windowWidth = zoomMultiplier * $(window).width();
                var screenWidth = screen.width;
                var absDiff = Math.abs(screenWidth - windowWidth);
                var marginError = screenWidth * percentErrorMargin;

                // check if the video is suddenly not really fullscreen
                if (absDiff > marginError) {
                  // manually exit
                  t.exitFullScreen();
                } else {
                  // test again
                  setTimeout(checkFullscreen, 500);
                }
              }


            }, 500);
          }

        } else if (mejs.MediaFeatures.hasSemiNativeFullScreen) {
          t.media.webkitEnterFullscreen();
          return;
        }
      }

      // check for iframe launch
      if (t.isInIframe) {
        var url = t.options.newWindowCallback(this);


        if (url !== '') {

          // launch immediately
          if (!mejs.MediaFeatures.hasTrueNativeFullScreen) {
            t.pause();
            window.open(url, t.id, 'top=0,left=0,width=' + screen.availWidth + ',height=' + screen.availHeight + ',resizable=yes,scrollbars=no,status=no,toolbar=no');
            return;
          } else {
            setTimeout(function () {
              if (!t.isNativeFullScreen) {
                t.pause();
                window.open(url, t.id, 'top=0,left=0,width=' + screen.availWidth + ',height=' + screen.availHeight + ',resizable=yes,scrollbars=no,status=no,toolbar=no');
              }
            }, 250);
          }
        }

      }

      // full window code



      // make full size
      t.container
        .addClass('mejs-container-fullscreen')
        .width('100%')
        .height('100%');
      //.css({position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', width: '100%', height: '100%', 'z-index': 1000});

      // Only needed for safari 5.1 native full screen, can cause display issues elsewhere
      // Actually, it seems to be needed for IE8, too
      //if (mejs.MediaFeatures.hasTrueNativeFullScreen) {
      t.containerSizeTimeout = setTimeout(function () {
        t.container.css({width: '100%', height: '100%'});
        t.setControlsSize();
      }, 500);
      //}

      if (t.media.pluginType === 'native') {
        t.$media
          .width('100%')
          .height('100%');
      } else {
        t.container.find('.mejs-shim')
          .width('100%')
          .height('100%');

        //if (!mejs.MediaFeatures.hasTrueNativeFullScreen) {
        t.media.setVideoSize($(window).width(), $(window).height());
        //}
      }

      t.layers.children('div')
        .width('100%')
        .height('100%');

<<<<<<< Updated upstream
      if (t.fullscreenBtn) {
        t.fullscreenBtn
          .removeClass('mejs-fullscreen')
          .addClass('mejs-unfullscreen');
      }
=======
	if (normalizedExt) {
		if (~['mp4', 'm4v', 'ogg', 'ogv', 'webm', 'flv', 'mpeg'].indexOf(normalizedExt)) {
			mime = 'video/' + normalizedExt;
		} else if ('mov' === normalizedExt) {
			mime = 'video/quicktime';
		} else if (~['mp3', 'oga', 'wav', 'mid', 'midi'].indexOf(normalizedExt)) {
			mime = 'audio/' + normalizedExt;
		}
	}
>>>>>>> Stashed changes

      t.setControlsSize();
      t.isFullScreen = true;

      t.container.find('.mejs-captions-text').css('font-size', screen.width / t.width * 1.00 * 100 + '%');
      t.container.find('.mejs-captions-position').css('bottom', '45px');
    },
    exitFullScreen: function () {

      var t = this;

      // Prevent container from attempting to stretch a second time
      clearTimeout(t.containerSizeTimeout);

      // firefox can't adjust plugins
      if (t.media.pluginType !== 'native' && mejs.MediaFeatures.isFirefox) {
        t.media.setFullscreen(false);
        //player.isFullScreen = false;
        return;
      }

      // come outo of native fullscreen
      if (mejs.MediaFeatures.hasTrueNativeFullScreen && (mejs.MediaFeatures.isFullScreen() || t.isFullScreen)) {
        mejs.MediaFeatures.cancelFullScreen();
      }

      // restore scroll bars to document
      $(document.documentElement).removeClass('mejs-fullscreen');

      t.container
        .removeClass('mejs-container-fullscreen')
        .width(normalWidth)
        .height(normalHeight);
      //.css({position: '', left: '', top: '', right: '', bottom: '', overflow: 'inherit', width: normalWidth + 'px', height: normalHeight + 'px', 'z-index': 1});

      if (t.media.pluginType === 'native') {
        t.$media
          .width(normalWidth)
          .height(normalHeight);
      } else {
        t.container.find('.mejs-shim')
          .width(normalWidth)
          .height(normalHeight);

        t.media.setVideoSize(normalWidth, normalHeight);
      }

      t.layers.children('div')
        .width(normalWidth)
        .height(normalHeight);

<<<<<<< Updated upstream
      t.fullscreenBtn
        .removeClass('mejs-unfullscreen')
        .addClass('mejs-fullscreen');
=======
},{"18":18,"6":6}],20:[function(_dereq_,module,exports){
'use strict';
>>>>>>> Stashed changes

      t.setControlsSize();
      t.isFullScreen = false;

      t.container.find('.mejs-captions-text').css('font-size', '');
      t.container.find('.mejs-captions-position').css('bottom', '');
    }
  });

})(mejs.$);

/*
 * ContextMenu Plugin
 *
 *
 */

(function ($) {

  $.extend(mejs.MepDefaults,
    {'contextMenuItems': [
        // demo of a fullscreen option
        {
          render: function (player) {

            // check for fullscreen plugin
            if (typeof player.enterFullScreen == 'undefined')
              return null;

            if (player.isFullScreen) {
              return 'Turn off Fullscreen';
            } else {
              return 'Go Fullscreen';
            }
          },
          click: function (player) {
            if (player.isFullScreen) {
              player.exitFullScreen();
            } else {
              player.enterFullScreen();
            }
          }
        }
        ,
        // demo of a mute/unmute button
        {
          render: function (player) {
            if (player.media.muted) {
              return 'Unmute';
            } else {
              return 'Mute';
            }
          },
          click: function (player) {
            if (player.media.muted) {
              player.setMuted(false);
            } else {
              player.setMuted(true);
            }
          }
        },
        // separator
        {
          isSeparator: true
        }
        ,
        // demo of simple download video
        {
          render: function (player) {
            return 'Download Video';
          },
          click: function (player) {
            window.location.href = player.media.currentSrc;
          }
        }
      ]}
  );


  $.extend(MediaElementPlayer.prototype, {
    buildcontextmenu: function (player, controls, layers, media) {

      // create context menu
      player.contextMenu = $('<div class="mejs-contextmenu"></div>')
        .appendTo($('body'))
        .hide();

      // create events for showing context menu
      player.container.bind('contextmenu', function (e) {
        if (player.isContextMenuEnabled) {
          e.preventDefault();
          player.renderContextMenu(e.clientX - 1, e.clientY - 1);
          return false;
        }
      });
      player.container.bind('click', function () {
        player.contextMenu.hide();
      });
      player.contextMenu.bind('mouseleave', function () {

        //console.log('context hover out');
        player.startContextMenuTimer();

      });
    },
    cleancontextmenu: function (player) {
      player.contextMenu.remove();
    },
    isContextMenuEnabled: true,
    enableContextMenu: function () {
      this.isContextMenuEnabled = true;
    },
    disableContextMenu: function () {
      this.isContextMenuEnabled = false;
    },
    contextMenuTimeout: null,
    startContextMenuTimer: function () {
      //console.log('startContextMenuTimer');

      var t = this;

      t.killContextMenuTimer();

      t.contextMenuTimer = setTimeout(function () {
        t.hideContextMenu();
        t.killContextMenuTimer();
      }, 750);
    },
    killContextMenuTimer: function () {
      var timer = this.contextMenuTimer;

      //console.log('killContextMenuTimer', timer);

      if (timer != null) {
        clearTimeout(timer);
        delete timer;
        timer = null;
      }
    },
    hideContextMenu: function () {
      this.contextMenu.hide();
    },
    renderContextMenu: function (x, y) {

      // alway re-render the items so that things like "turn fullscreen on" and "turn fullscreen off" are always written correctly
      var t = this,
        html = '',
        items = t.options.contextMenuItems;

      for (var i = 0, il = items.length; i < il; i++) {

        if (items[i].isSeparator) {
          html += '<div class="mejs-contextmenu-separator"></div>';
        } else {

          var rendered = items[i].render(t);

          // render can return null if the item doesn't need to be used at the moment
          if (rendered != null) {
            html += '<div class="mejs-contextmenu-item" data-itemindex="' + i + '" id="element-' + (Math.random() * 1000000) + '">' + rendered + '</div>';
          }
        }
      }

      // position and show the context menu
      t.contextMenu
        .empty()
        .append($(html))
        .css({top: y, left: x})
        .show();

      // bind events
      t.contextMenu.find('.mejs-contextmenu-item').each(function () {

        // which one is this?
        var $dom = $(this),
          itemIndex = parseInt($dom.data('itemindex'), 10),
          item = t.options.contextMenuItems[itemIndex];

        // bind extra functionality?
        if (typeof item.show != 'undefined')
          item.show($dom, t);

        // bind click action
        $dom.click(function () {
          // perform click action
          if (typeof item.click != 'undefined')
            item.click(t);

          // close
          t.contextMenu.hide();
        });
      });

      // stop the controls from hiding
      setTimeout(function () {
        t.killControlsTimer('rev3');
      }, 100);

    }
  });

<<<<<<< Updated upstream
})(mejs.$);
=======
},{"2":2,"4":4}]},{},[20,5,14,11,10,12,13,15]);
>>>>>>> Stashed changes
