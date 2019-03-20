export default function Linger() {
  const MODULE_VERSION = '1.0.0';
  const Fingerprinter = class Fingerprinter {
    
    constructor(options) {
      this.options = options;

      this.VERSION = MODULE_VERSION;
      this.x64Add = this.x64Add.bind(this);
      this.x64Multiply = this.x64Multiply.bind(this);
      this.x64Rotl = this.x64Rotl.bind(this);
      this.x64LeftShift = this.x64LeftShift.bind(this);
      this.x64Xor = this.x64Xor.bind(this);
      this.x64Fmix = this.x64Fmix.bind(this);
      this.x64Hash128 = this.x64Hash128.bind(this);
    }

    /***********************************************************************************************/
    //Create hashing helper functions (MurmurHash3)
    /***********************************************************************************************/

    /**
     * Given two 64bit integers (passed as an array of 32 bit integers): Returns the two values added as a 64 bit (array of 2 32 bit integer values) value
     */
    x64Add = (m, n) => {
      m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff]
      n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff]
      var o = [0, 0, 0, 0]
      o[3] += m[3] + n[3]
      o[2] += o[3] >>> 16
      o[3] &= 0xffff
      o[2] += m[2] + n[2]
      o[1] += o[2] >>> 16
      o[2] &= 0xffff
      o[1] += m[1] + n[1]
      o[0] += o[1] >>> 16
      o[1] &= 0xffff
      o[0] += m[0] + n[0]
      o[0] &= 0xffff
      return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    }

    /**
     * Given two 64 bit integers, returns the two values multiplied and returned as a 64 bit (array of 2 32 bit integer values) value
     */
    x64Multiply = (m, n) => {
      m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff]
      n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff]
      var o = [0, 0, 0, 0]
      o[3] += m[3] * n[3]
      o[2] += o[3] >>> 16
      o[3] &= 0xffff
      o[2] += m[2] * n[3]
      o[1] += o[2] >>> 16
      o[2] &= 0xffff
      o[2] += m[3] * n[2]
      o[1] += o[2] >>> 16
      o[2] &= 0xffff
      o[1] += m[1] * n[3]
      o[0] += o[1] >>> 16
      o[1] &= 0xffff
      o[1] += m[2] * n[2]
      o[0] += o[1] >>> 16
      o[1] &= 0xffff
      o[1] += m[3] * n[1]
      o[0] += o[1] >>> 16
      o[1] &= 0xffff
      o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0])
      o[0] &= 0xffff
      return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    }

    /**
     * Given a 64bit int (as an array of two 32bit ints) and an int representing a number of bit positions, returns the 64bit int (as an array of two 32bit ints) rotated left by that number of positions.
     */
    x64Rotl = (m, n) => {
      n %= 64
      if (n === 32) {
        return [m[1], m[0]]
      } else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
      } else {
        n -= 32
        return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
      }
    }

    /**
     * Given a 64bit int (as an array of two 32bit ints) and an int representing a number of bit positions, returns the 64bit int (as an array of two 32bit ints) shifted left by that number of positions.
     */
    x64LeftShift = (m, n) => {
      n %= 64
      if (n === 0) {
        return m
      } else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
      } else {
        return [m[1] << (n - 32), 0];
      }
    }

    /**
     * Given two 64bit ints (as an array of two 32bit ints) returns the two xored together as a 64bit int (as an array of two 32bit ints).
     */
    x64Xor = (m, n) => {
      return [m[0] ^ n[0], m[1] ^ n[1]];
    }

    /**
     *  Given a block, returns murmurHash3's final x64 mix of that block. (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the only place where we need to right shift 64bit ints.)
     */
    x64Fmix = (m, n) => {
      h = x64Xor(h, [0, h[0] >>> 1])
      h = x64Multiply(h, [0xff51afd7, 0xed558ccd])
      h = x64Xor(h, [0, h[0] >>> 1])
      h = x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53])
      h = x64Xor(h, [0, h[0] >>> 1])
      return h;
    }

    /**
     * Given a string and an optional seed as an int, returns a 128 bit hash using the x64 flavor of MurmurHash3, as an unsigned hex.
     */
    x64Hash128 = (key, seed) => {
      key = key || ''
      seed = seed || 0
      var remainder = key.length % 16
      var bytes = key.length - remainder
      var h1 = [0, seed]
      var h2 = [0, seed]
      var k1 = [0, 0]
      var k2 = [0, 0]
      var c1 = [0x87c37b91, 0x114253d5]
      var c2 = [0x4cf5ad43, 0x2745937f]
      for (var i = 0; i < bytes; i = i + 16) {
        k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)]
        k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)]
        k1 = x64Multiply(k1, c1)
        k1 = x64Rotl(k1, 31)
        k1 = x64Multiply(k1, c2)
        h1 = x64Xor(h1, k1)
        h1 = x64Rotl(h1, 27)
        h1 = x64Add(h1, h2)
        h1 = x64Add(x64Multiply(h1, [0, 5]), [0, 0x52dce729])
        k2 = x64Multiply(k2, c2)
        k2 = x64Rotl(k2, 33)
        k2 = x64Multiply(k2, c1)
        h2 = x64Xor(h2, k2)
        h2 = x64Rotl(h2, 31)
        h2 = x64Add(h2, h1)
        h2 = x64Add(x64Multiply(h2, [0, 5]), [0, 0x38495ab5])
      }
      k1 = [0, 0]
      k2 = [0, 0]
      switch (remainder) {
        case 15:
          k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 14)], 48))
        case 14:
          k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 13)], 40))
        case 13:
          k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 12)], 32))
        case 12:
          k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 11)], 24))
        case 11:
          k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 10)], 16))
        case 10:
          k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 9)], 8))
        case 9:
          k2 = x64Xor(k2, [0, key.charCodeAt(i + 8)])
          k2 = x64Multiply(k2, c2)
          k2 = x64Rotl(k2, 33)
          k2 = x64Multiply(k2, c1)
          h2 = x64Xor(h2, k2)
        case 8:
          k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 7)], 56))
        case 7:
          k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 6)], 48))
        case 6:
          k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 5)], 40))
        case 5:
          k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 4)], 32))
        case 4:
          k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 3)], 24))
        case 3:
          k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 2)], 16))
        case 2:
          k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 1)], 8))
        case 1:
          k1 = x64Xor(k1, [0, key.charCodeAt(i)])
          k1 = x64Multiply(k1, c1)
          k1 = x64Rotl(k1, 31)
          k1 = x64Multiply(k1, c2)
          h1 = x64Xor(h1, k1)
      }
      h1 = x64Xor(h1, [0, key.length])
      h2 = x64Xor(h2, [0, key.length])
      h1 = x64Add(h1, h2)
      h2 = x64Add(h2, h1)
      h1 = x64Fmix(h1)
      h2 = x64Fmix(h2)
      h1 = x64Add(h1, h2)
      h2 = x64Add(h2, h1)
      return ('00000000' + (h1[0] >>> 0)
        .toString(16)).slice(-8) + ('00000000' + (h1[1] >>> 0)
          .toString(16)).slice(-8) + ('00000000' + (h2[0] >>> 0)
            .toString(16)).slice(-8) + ('00000000' + (h2[1] >>> 0)
              .toString(16)).slice(-8);
    }


    // get enumerated devices from browser
    enumerateDevices = function (done, options) {
      options = options || this.options;
      if (!this.deviceEnumerationSupported()) {
        return done(option.NOT_AVAILABLE);
      }
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        done(devices.map(function (device) {
          //return 'id=' + device.deviceId + ';gid=' + device.groupId + ';' + device.kind + ';' + device.label;
          return {
            id: device.deviceId,
            group: device.groupId,
            kind: device.kind,
            label: device.label
          };
        }));
      }).catch(function (err) {
        done(err);
      });
    }

    deviceEnumerationSupported = () => {
      return (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices);
    }

    //build audio device fingerprint
    audioKey = function (done, options) {
      options = options || this.options;
      var opts = options.audio;
      if (opts.exludeIOS11 && navigator.userAgent.match(/OS 11.+Version\/11.+Safari/)) {
        return done(options.EXCLUDED);
      }

      const audioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (audioContext == null) {
        return done(options.NOT_AVAILABLE);
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
        return done('audioTimeout')
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
          done(error);
          return;
        }
        done(fingerprint);
      }
    }



  };

  /***********************************************************************************************/
  // prepare the options set
  /***********************************************************************************************/

  const defaultOptions = {
    prepocessor: null,
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
    plugins: {
      sortPluginsFor: [/palemoon/i],
      excludeIE: false,
    },
    extraComponents: [],
    exludes: {
      'enumerateDevices': true, //unreliable on windows
      'pixelRatio': true, // depends on browser zoom which is not possible to detect
      'doNotTrack': true, // depends on incognito mode, which is not possible to detect
      'fontsFlash': true, // use js, not SWF for fonts
    },
    NOT_AVAILABLE: 'not available',
    ERROR: 'error',
    EXCLUDED: 'excluded'
  };

  /***********************************************************************************************/
  // Build the module object
  /***********************************************************************************************/

  return new Fingerprinter(defaultOptions);
}
