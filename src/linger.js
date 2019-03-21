import * as murmor3 from './murmor_hash';
import { each, spelunkObject } from './utils';

export function Linger() {
  const MODULE_VERSION = '1.0.0';
  const Fingerprinter = class Fingerprinter {

    constructor(options) {
      this.options = options;

      this.VERSION = MODULE_VERSION;
      this.HASH = murmor3;

      this.HashedComponents = [];
      this.Components = [
        { key: 'addBehavior', value: null },
        { key: 'audio', value: null },
        { key: 'availableScreenResolution', value: null },
        { key: 'canvas', value: null },
        { key: 'colorDepth', value: null },
        { key: 'cpuClass', value: null },
        { key: 'deviceMemory', value: null },
        { key: 'doNotTrack', value: null },
        { key: 'enumeratedDevices', value: null },
        { key: 'hardwareConcurrency', value: null },
        { key: 'indexedDb', value: null },
        { key: 'language', value: null },
        { key: 'liedBrowser', value: null },
        { key: 'liedLanguages', value: null },
        { key: 'liedOs', value: null },
        { key: 'liedResolution', value: null },
        { key: 'localStorage', value: null },
        { key: 'navigator', value: null },
        { key: 'network', value: null },
        { key: 'openDatabase', value: null },
        { key: 'pixelRatio', value: null },
        { key: 'platform', value: null },
        { key: 'screenResolution', value: null },
        { key: 'sessionStorage', value: null },
        { key: 'timeZone', value: null },
        { key: 'timeZoneOffset', value: null },
        { key: 'touchSupport', value: null },
        { key: 'userAgent', value: null },
        { key: 'webdriver', value: null },
        { key: 'webgl', value: null },
        { key: 'webglVendor', value: null },
      ];

      this.addBehavior(v => this.updateComponent('addBehavior', v));
      this.audio(v => this.updateComponent('audio', v));
      this.availableScreenResolution(v => this.updateComponent('availableScreenResolution', v));
      this.canvas(v => this.updateComponent('canvas', v));
      this.colorDepth(v => this.updateComponent('colorDepth', v));
      this.cpuClass(v => this.updateComponent('cpuClass', v));
      this.deviceMemory(v => this.updateComponent('deviceMemory', v));
      this.doNotTrack(v => this.updateComponent('doNotTrack', v));
      this.enumerateDevices(v => this.updateComponent('enumeratedDevices', v));
      this.hardwareConcurrency(v => this.updateComponent('hardwareConcurrency', v));
      this.indexedDb(v => this.updateComponent('indexedDb', v));
      this.language(v => this.updateComponent('language', v));
      this.liedBrowser(v => this.updateComponent('liedBrowser', v));
      this.liedLanguages(v => this.updateComponent('liedLanguages', v));
      this.liedOs(v => this.updateComponent('liedOs', v));
      this.liedResolution(v => this.updateComponent('liedResolution', v));
      this.localStorage(v => this.updateComponent('localStorage', v));
      this.navigator(v => this.updateComponent('navigator', v));
      this.network(v => this.updateComponent('network', v));
      this.openDatabase(v => this.updateComponent('openDatabase', v));
      this.pixelRatio(v => this.updateComponent('pixelRatio', v));
      this.platform(v => this.updateComponent('platform', v));
      this.screenResolution(v => this.updateComponent('screenResolution', v));
      this.sessionStorage(v => this.updateComponent('sessionStorage', v));
      this.timeZone(v => this.updateComponent('timeZone', v));
      this.timeZoneOffset(v => this.updateComponent('timeZoneOffset', v));
      this.touchSupport(v => this.updateComponent('touchSupport', v));
      this.userAgent(v => this.updateComponent('userAgent', v));
      this.webDriver(v => this.updateComponent('webdriver', v));
      this.webGl(v => this.updateComponent('webgl', v));
      this.webGlVendor(v => this.updateComponent('webglVendor', v));

      setTimeout(() => {
        this.Components.map(c => this.HashedComponents.push(this.hashComponent(c)));
        this.Fingerprint = this.HashedComponents.join('✨');
      }, 1);
    }

    hashComponent = function (c) {
      const value = JSON.stringify(c.value);
      const key = c.key + '~' + value;
      return murmor3.x64Hash128(key, 31);
    }

    updateComponent = function (k, v) {
      const keyComps = x => Object.keys(x).map(xk => x[xk]);
      const filter = this.Components.filter(x => keyComps(x).indexOf(k) > -1);
      if (filter !== undefined) {
        let fk = filter[0];
        fk.value = v;
      }
    }

    // get enumerated devices from browser
    enumerateDevices = function (processValue, options) {
      options = options || this.options;
      if (!this.deviceEnumerationSupported()) {
        return processValue(option.MSG_NOT_AVAILABLE);
      }
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        processValue(devices.map(function (device) {
          //return 'id=' + device.deviceId + ';gid=' + device.groupId + ';' + device.kind + ';' + device.label;
          return {
            id: device.deviceId,
            group: device.groupId,
            kind: device.kind,
            label: device.label
          };
        }));
      }).catch(function (err) {
        processValue(err);
      });
    }

    deviceEnumerationSupported = () => (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices);

    //build audio device fingerprint
    audio = function (processValue, options) {
      options = options || this.options;
      var opts = options.audio;
      if (opts.exludeIOS11 && navigator.userAgent.match(/OS 11.+Version\/11.+Safari/)) {
        return processValue(options.MSG_EXCLUDED);
      }

      const audioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (audioContext == null) {
        return processValue(options.MSG_NOT_AVAILABLE);
      }

      const context = new audioContext(1, 44100, 44100);
      let oscillator = context.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(10000, context.currentTime);

      let compressor = context.createDynamicsCompressor();
      ([
        ['threshold', -50],
        ['knee', 40],
        ['ratio', 12],
        ['reduction', -20],
        ['attack', 0],
        ['release', 0.25]
      ]).forEach(item => {
        if (compressor[item[0]] !== undefined && typeof compressor[item[0]].setValueAtTime === 'function') {
          compressor[item[0]].setValueAtTime(item[1], context.currentTime);
        }
      });

      oscillator.connect(compressor);
      compressor.connect(context.destination);
      oscillator.start(0);
      context.startRendering();

      let timeoutId = setTimeout(function () {
        context.oncomplete = function () {

        };
        context = null;
        return processValue('audioTimeout')
      }, opts.timeout);

      context.oncomplete = function (event) {
        var fingerprint;
        try {
          clearTimeout(timeoutId);
          fingerprint = event.renderedBuffer
            .getChannelData(0)
            .slice(4500, 5000)
            .reduce(function (acc, val) {
              return acc + Math.abs(val)
            }, 0).toString();
          oscillator.disconnect();
          compressor.disconnect();
        } catch (error) {
          processValue(error);
          return;
        }
        processValue(fingerprint);
      }
    }

    userAgent = (processValue) => processValue(navigator.userAgent);

    navigator = (processValue) => processValue(spelunkObject(navigator, [
      // these properties should be explicitly ignored, so as to not prompt for user interaction, 
      // or because they provide useless information (battery state is too fluxible for identity )
      // or because they are explicitly tracked elsewhere
      'battery',
      'browserLanguage',
      'clipboard',
      'cpuClass',
      'credentials',
      'deviceMemory',
      'doNotTrack',
      'geolocation',
      'getBattery',
      'getGamePads',
      'getUserMedia',
      'hardwareConcurrency',
      'language',
      'languages',
      'locks',
      'maxTouchPoints',
      'msDoNotTrack',
      'onLine',
      'permissions',
      'platform',
      'registerProtocolHandler',
      'requestMIDIAccess',
      'requestMediaKeySystemAccess',
      'serviceWorker',
      'storage',
      'systemLanguage',
      'unregisterProtocolHandler',
      'userAgent',
      'userLanguage',
      'webdriver',
      'webkitGetUserMedia',
    ]));

    webDriver = (processValue, options) => {
      options = options || this.options;
      return processValue(navigator.webdriver == null ? options.MSG_NOT_AVAILABLE : navigator.webdriver);
    };

    language = (processValue, options) => {
      options = options || this.options;
      return processValue(navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || options.MSG_NOT_AVAILABLE);
    }

    colorDepth = (processValue, options) => {
      options = options || this.options;
      return processValue(window.screen.colorDepth || options.MSG_NOT_AVAILABLE);
    }

    deviceMemory = (processValue, options) => {
      options = options || this.options;
      return processValue(navigator.deviceMemory || options.MSG_NOT_AVAILABLE);
    }

    pixelRatio = (processValue, options) => {
      options = options || this.options;
      return processValue(window.devicePixelRatio || options.MSG_NOT_AVAILABLE);
    }

    screenResolution = (processValue, options) => {
      options = options || this.options;
      return processValue(this.getScreenResolution(options));
    }

    availableScreenResolution = (processValue, options) => {
      options = options || this.options;
      return processValue(this.getAllAvailableScreenResolutions(options));
    }

    hardwareConcurrency = (processValue, options) => {
      options = options || this.options;
      return processValue(this.getHardwareConcurrency(options));
    }

    getHardwareConcurrency = function (options) {
      if (navigator.hardwareConcurrency) {
        return navigator.hardwareConcurrency;
      }
      return options.MSG_NOT_AVAILABLE;
    }

    getScreenResolution = function (options) {
      var res = [window.screen.width, window.screen.height];
      if (options.screen.detectScreenOrientation) {
        res.sort().reverse();
      }
      return res;
    }

    getAllAvailableScreenResolutions = function (options) {
      if (window.screen.availWidth && window.screen.availHeight) {
        var available = [window.screen.width, window.screen.height];
        if (options.screen.detectScreenOrientation) {
          available.sort().reverse();
        }
        return available;
      }
      return options.MSG_NOT_AVAILABLE;
    }

    timeZoneOffset = (processValue) => processValue(new Date().getTimezoneOffset());

    timeZone = (processValue, options) => {
      options = options || this.options;
      if (window.Intl && window.Intl.DateTimeFormat) {
        processValue(new window.Intl.DateTimeFormat().resolvedOptions().timeZone);
        return;
      }
      processValue(options.MSG_NOT_AVAILABLE);
    }



    sessionStorage = (processValue, options) => {
      options = options || this.options;
      return processValue(this.hasSessionStorage(options));
    }

    hasSessionStorage = function (options) {
      try {
        return !!window.sessionStorage;
      } catch (e) {
        return options.MSG_ERROR; // SecurityError when referencing it means it exists
      }
    }

    localStorage = (processValue, options) => {
      options = options || this.options;
      return processValue(this.hasLocalStorage(options));
    }

    hasLocalStorage = function (options) {
      try {
        return !!window.localStorage;
      } catch (e) {
        return options.MSG_ERROR; // SecurityError when referencing it means it exists
      }
    }

    indexedDb = (processValue, options) => {
      options = options || this.options;
      return processValue(this.hasIndexedDb(options));
    }

    hasIndexedDb = function (options) {
      try {
        return !!window.indexedDB;
      } catch (e) {
        return options.MSG_ERROR; // SecurityError when referencing it means it exists
      }
    }

    cpuClass = (processValue, options) => {
      options = options || this.options;
      return processValue(this.getNavigatorCpuClass(options));
    }

    getNavigatorCpuClass = (options) => { return navigator.cpuClass || options.MSG_NOT_AVAILABLE }

    platform = (processValue, options) => {
      options = options || this.options;
      return processValue(this.getNavigatorPlatform(options));
    }

    getNavigatorPlatform = function (options) {
      if (navigator.platform) {
        return navigator.platform;
      }
      return options.MSG_NOT_AVAILABLE;
    }

    doNotTrack = (processValue, options) => {
      options = options || this.options;
      return processValue(this.getDoNotTrack(options));
    }

    network = (processValue, options) => {
      options = options || this.options;
      return processValue(this.getNetworkInfo(processValue, options));
    }

    getNetworkInfo = function (processValue, options) {
      const info = navigator.connection;
      if (info !== undefined) {
        return ({
          downlink: info.downlink || "unknown",
          downlinkMax: info.downlinkMax || info.downlink || "unknown",
          effectiveType: info.effectiveType || "unknown",
          rtt: info.rtt || "unknown",
          type: info.type || "unknown"
        });
      }
      return processValue(options.MSG_NOT_AVAILABLE);
    }

    getDoNotTrack = function (options) {
      if (navigator.doNotTrack) {
        return navigator.doNotTrack;
      }
      if (navigator.msDoNotTrack) {
        return navigator.msDoNotTrack;
      }
      if (window.doNotTrack) {
        return window.doNotTrack;
      }
      return options.MSG_NOT_AVAILABLE;
    }

    canvas = (processValue, options) => {
      options = options || this.options;
      if (this.isCanvasSupported()) {
        return processValue(getCanvas(options));
      }
      processValue(options.MSG_NOT_AVAILABLE);
    }

    isCanvasSupported = function () {
      var elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    }

    webGl = (processValue, options) => {
      options = options || this.options;
      if (this.isWebGlSupported()) {
        return processValue(getWebGl(options));
      }
      processValue(options.MSG_NOT_AVAILABLE);
    }

    isWebGlSupported = function () {
      if (!this.isCanvasSupported()) {
        return false;
      }

      var glContext = getWebglCanvas();
      return !!window.WebGLRenderingContext && !!glContext;
    }

    webGlVendor = (processValue, options) => {
      options = options || this.options;
      if (this.isWebGlSupported()) {
        return processValue(getWebGlVendor(options));
      }
      processValue(options.MSG_NOT_AVAILABLE);
    }

    addBehavior = (processValue) => processValue(!!(document.body && document.body.addBehavior));
    openDatabase = (processValue) => processValue(!!(window.openDatabase));
    liedLanguages = (processValue) => processValue(getHasLiedLanguages());
    liedResolution = (processValue) => processValue(getHasLiedResolution());
    liedOs = (processValue) => processValue(getHasLiedOs());
    liedBrowser = (processValue) => processValue(getHasLiedBrowser());
    touchSupport = (processValue) => processValue(getTouchSupport());
  };


  var getCanvas = function (options) {
    var result = [];
    var canvas = document.createElement('canvas');
    canvas.width = 2000;
    canvas.height = 200;
    canvas.style.display = 'inline';
    var ctx = canvas.getContext('2d');
    ctx.rect(0, 0, 10, 10);
    ctx.rect(2, 2, 6, 6);
    result.push(((ctx.isPointInPath(5, 5, 'evenodd') === false) ? true : false));

    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    if (options.dontUseFakeFontInCanvas) {
      ctx.font = '11pt Arial';
    } else {
      ctx.font = '11pt no-real-font-123';
    }
    ctx.fillText('skdjfhskdjhfskdjfh, \ud83d\ude03', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.2)';
    ctx.font = '18pt Arial';
    ctx.fillText('woeirldkjv, \ud83d\ude03', 4, 45);

    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgb(255,0,255)';
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(0,255,255)';
    ctx.beginPath();
    ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(255,255,0)';
    ctx.beginPath();
    ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(255,0,255)';

    ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
    ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
    ctx.fill('evenodd');

    if (canvas.toDataURL) { result.push(canvas.toDataURL()); }
    else { result.push(null); }
    return {
      winding: result[0],
      fingerprint: result[1]
    };
  }

  var getTouchSupport = function () {
    var maxTouchPoints = 0;
    var touchEvent;
    if (typeof navigator.maxTouchPoints !== 'undefined') {
      maxTouchPoints = navigator.maxTouchPoints;
    } else if (typeof navigator.msMaxTouchPoints !== 'undefined') {
      maxTouchPoints = navigator.msMaxTouchPoints;
    }
    try {
      document.createEvent('TouchEvent');
      touchEvent = true;
    } catch (_) {
      touchEvent = false;
    }
    var touchStart = 'ontouchstart' in window;
    return {
      maxTouchPoints: maxTouchPoints,
      canCreateTouchEvent: touchEvent,
      touchStarted: touchStart
    };
  }

  var getWebglCanvas = function () {
    var canvas = document.createElement('canvas');
    var gl = null;
    try {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) { ; }
    if (!gl) { gl = null; }
    return gl;
  }

  var getWebGl = function () {
    var gl;
    var fa2s = function (fa) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      return '[' + fa[0] + ', ' + fa[1] + ']';
    }
    var maxAnisotropy = function (gl) {
      var ext = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
      if (ext) {
        var anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        if (anisotropy === 0) {
          anisotropy = 2;
        }
        return anisotropy;
      } else {
        return null;
      }
    }

    gl = getWebglCanvas();
    if (!gl) { return null; }
    // WebGL fingerprinting is a combination of techniques, found in MaxMind antifraud script & Augur fingerprinting.
    // First it draws a gradient object with shaders and convers the image to the Base64 string.
    // Then it enumerates all WebGL extensions & capabilities and appends them to the Base64 string, resulting in a huge WebGL string, potentially very unique on each device
    // Since iOS supports webgl starting from version 8.1 and 8.1 runs on several graphics chips, the results may be different across ios devices, but we need to verify it.
    var result = [];
    var vShaderTemplate = 'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}';
    var fShaderTemplate = 'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}';
    var vertexPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
    var vertices = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    vertexPosBuffer.itemSize = 3;
    vertexPosBuffer.numItems = 3;
    var program = gl.createProgram();
    var vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, vShaderTemplate);
    gl.compileShader(vshader);
    var fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, fShaderTemplate);
    gl.compileShader(fshader);
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);
    program.vertexPosAttrib = gl.getAttribLocation(program, 'attrVertex');
    program.offsetUniform = gl.getUniformLocation(program, 'uniformOffset');
    gl.enableVertexAttribArray(program.vertexPosArray);
    gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
    gl.uniform2f(program.offsetUniform, 1, 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
    try {
      result.push({ key: 'render', value: gl.canvas.toDataURL() });
    } catch (e) {
      ;/* .toDataURL may be absent or broken (blocked by extension) */
    }
    result.push({ key: 'extensions:', value: (gl.getSupportedExtensions() || []) });
    result.push({ key: 'aliased line width range', value: fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)) });
    result.push({ key: 'aliased point size range:', value: fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)) });
    result.push({ key: 'alpha bits:', value: gl.getParameter(gl.ALPHA_BITS) });
    result.push({ key: 'antialiasing:', value: (gl.getContextAttributes().antialias ? 'yes' : 'no') });
    result.push({ key: 'blue bits:', value: gl.getParameter(gl.BLUE_BITS) });
    result.push({ key: 'depth bits:', value: gl.getParameter(gl.DEPTH_BITS) });
    result.push({ key: 'green bits:', value: gl.getParameter(gl.GREEN_BITS) });
    result.push({ key: 'max anisotropy:', value: maxAnisotropy(gl) });
    result.push({ key: 'max combined texture image units:', value: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) });
    result.push({ key: 'max cube map texture size:', value: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE) });
    result.push({ key: 'max fragment uniform vectors:', value: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) });
    result.push({ key: 'max render buffer size:', value: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) });
    result.push({ key: 'max texture image units:', value: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) });
    result.push({ key: 'max texture size:', value: gl.getParameter(gl.MAX_TEXTURE_SIZE) });
    result.push({ key: 'max varying vectors:', value: gl.getParameter(gl.MAX_VARYING_VECTORS) });
    result.push({ key: 'max vertex attribs:', value: gl.getParameter(gl.MAX_VERTEX_ATTRIBS) });
    result.push({ key: 'max vertex texture image units:', value: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) });
    result.push({ key: 'max vertex uniform vectors:', value: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) });
    result.push({ key: 'max viewport dims:', value: fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS)) });
    result.push({ key: 'red bits:', value: gl.getParameter(gl.RED_BITS) });
    result.push({ key: 'renderer:', value: gl.getParameter(gl.RENDERER) });
    result.push({ key: 'shading language version:', value: gl.getParameter(gl.SHADING_LANGUAGE_VERSION) });
    result.push({ key: 'stencil bits:', value: gl.getParameter(gl.STENCIL_BITS) });
    result.push({ key: 'vendor:', value: gl.getParameter(gl.VENDOR) });
    result.push({ key: 'version:', value: gl.getParameter(gl.VERSION) });

    try {
      // Add the unmasked vendor and unmasked renderer if the debug_renderer_info extension is available
      var extensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (extensionDebugRendererInfo) {
        result.push({ key: 'unmasked vendor:', value: gl.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL) });
        result.push({ key: 'unmasked renderer:', value: gl.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL) });
      }
    } catch (e) { ; }

    if (!gl.getShaderPrecisionFormat) {
      return result;
    }

    each(['FLOAT', 'INT'], function (numType) {
      each(['VERTEX', 'FRAGMENT'], function (shader) {
        each(['HIGH', 'MEDIUM', 'LOW'], function (numSize) {
          each(['precision', 'rangeMin', 'rangeMax'], function (key) {
            var format = gl.getShaderPrecisionFormat(gl[shader + '_SHADER'], gl[numSize + '_' + numType])[key];
            if (key !== 'precision') {
              key = 'precision ' + key;
            }
            var line = [shader.toLowerCase(), ' shader ', numSize.toLowerCase(), ' ', numType.toLowerCase(), ' ', key].join('');
            result.push({ key: line, value: format });
          })
        })
      })
    })
    return result;
  }

  var getWebGlVendor = function () {
    /* This a subset of the WebGL fingerprint with a lot of entropy, while being reasonably browser-independent */
    try {
      var glContext = getWebglCanvas();
      var extensionDebugRendererInfo = glContext.getExtension('WEBGL_debug_renderer_info');
      return glContext.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL) + '~' + glContext.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL);
    } catch (e) {
      return null;
    }
  }

  var getHasLiedLanguages = function () {
    // We check if navigator.language is equal to the first language of navigator.languages
    if (typeof navigator.languages !== 'undefined') {
      try {
        var firstLanguages = navigator.languages[0].substr(0, 2);
        if (firstLanguages !== navigator.language.substr(0, 2)) {
          return true;
        }
      } catch (err) {
        return true;
      }
    }
    return false;
  }

  var getHasLiedResolution = function () {
    return window.screen.width < window.screen.availWidth || window.screen.height < window.screen.availHeight;
  }

  var getHasLiedOs = function () {
    var userAgent = navigator.userAgent.toLowerCase();
    var oscpu = navigator.oscpu;
    var platform = navigator.platform.toLowerCase();
    var os;
    // We extract the OS from the user agent (respect the order of the if else if statement)
    if (userAgent.indexOf('windows phone') >= 0) {
      os = 'Windows Phone';
    } else if (userAgent.indexOf('win') >= 0) {
      os = 'Windows';
    } else if (userAgent.indexOf('android') >= 0) {
      os = 'Android';
    } else if (userAgent.indexOf('linux') >= 0 || userAgent.indexOf('cros') >= 0) {
      os = 'Linux';
    } else if (userAgent.indexOf('iphone') >= 0 || userAgent.indexOf('ipad') >= 0) {
      os = 'iOS';
    } else if (userAgent.indexOf('mac') >= 0) {
      os = 'Mac';
    } else {
      os = 'Other';
    }
    // We detect if the person uses a mobile device
    var mobileDevice = (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0))

    if (mobileDevice && os !== 'Windows Phone' && os !== 'Android' && os !== 'iOS' && os !== 'Other') {
      return true;
    }

    // We compare oscpu with the OS extracted from the UA
    if (typeof oscpu !== 'undefined') {
      oscpu = oscpu.toLowerCase();
      if (oscpu.indexOf('win') >= 0 && os !== 'Windows' && os !== 'Windows Phone') {
        return true;
      } else if (oscpu.indexOf('linux') >= 0 && os !== 'Linux' && os !== 'Android') {
        return true;
      } else if (oscpu.indexOf('mac') >= 0 && os !== 'Mac' && os !== 'iOS') {
        return true;
      } else if ((oscpu.indexOf('win') === -1 && oscpu.indexOf('linux') === -1 && oscpu.indexOf('mac') === -1) !== (os === 'Other')) {
        return true;
      }
    }

    // We compare platform with the OS extracted from the UA
    if (platform.indexOf('win') >= 0 && os !== 'Windows' && os !== 'Windows Phone') {
      return true;
    } else if ((platform.indexOf('linux') >= 0 || platform.indexOf('android') >= 0 || platform.indexOf('pike') >= 0) && os !== 'Linux' && os !== 'Android') {
      return true;
    } else if ((platform.indexOf('mac') >= 0 || platform.indexOf('ipad') >= 0 || platform.indexOf('ipod') >= 0 || platform.indexOf('iphone') >= 0) && os !== 'Mac' && os !== 'iOS') {
      return true;
    } else if ((platform.indexOf('win') === -1 && platform.indexOf('linux') === -1 && platform.indexOf('mac') === -1) !== (os === 'Other')) {
      return true;
    }

    return typeof navigator.plugins === 'undefined' && os !== 'Windows' && os !== 'Windows Phone';
  }

  var getHasLiedBrowser = function () {
    var userAgent = navigator.userAgent.toLowerCase();
    var productSub = navigator.productSub;

    // we extract the browser from the user agent (respect the order of the tests)
    var browser;
    if (userAgent.indexOf('firefox') >= 0) {
      browser = 'Firefox';
    } else if (userAgent.indexOf('opera') >= 0 || userAgent.indexOf('opr') >= 0) {
      browser = 'Opera';
    } else if (userAgent.indexOf('chrome') >= 0) {
      browser = 'Chrome';
    } else if (userAgent.indexOf('safari') >= 0) {
      browser = 'Safari';
    } else if (userAgent.indexOf('trident') >= 0) {
      browser = 'Internet Explorer';
    } else {
      browser = 'Other';
    }

    if ((browser === 'Chrome' || browser === 'Safari' || browser === 'Opera') && productSub !== '20030107') {
      return true;
    }

    // eslint-disable-next-line no-eval
    var tempRes = eval.toString().length;
    if (tempRes === 37 && browser !== 'Safari' && browser !== 'Firefox' && browser !== 'Other') {
      return true;
    } else if (tempRes === 39 && browser !== 'Internet Explorer' && browser !== 'Other') {
      return true;
    } else if (tempRes === 33 && browser !== 'Chrome' && browser !== 'Opera' && browser !== 'Other') {
      return true;
    }

    // We create an error to see how it is handled
    var errFirefox;
    try {
      // eslint-disable-next-line no-throw-literal
      throw 'a';
    } catch (err) {
      try {
        err.toSource();
        errFirefox = true;
      } catch (errOfErr) {
        errFirefox = false;
      }
    }
    return errFirefox && browser !== 'Firefox' && browser !== 'Other';
  }

  /***********************************************************************************************/
  // prepare the options set
  /***********************************************************************************************/

  const defaultOptions = {
    audio: {
      timeout: 1000,
      // On iOS 11, audio context can only be used in response to user interaction.
      exludeIOS11: true, // See https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
    },
    fonts: {
      extendedJsFonts: false,
      userDefinedFonts: [],
    },
    screen: {
      detectScreenOrientation: true,
    },
    MSG_NOT_AVAILABLE: 'not available',
    MSG_ERROR: 'error',
    MSG_EXCLUDED: 'excluded'
  };

  /***********************************************************************************************/
  // Build the module object
  /***********************************************************************************************/

  return new Fingerprinter(defaultOptions);
}
