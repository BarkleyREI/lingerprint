import { x64Add } from './murmor_hash';
import { x64Multiply } from './murmor_hash';
import { x64Rotl } from './murmor_hash';
import { x64LeftShift } from './murmor_hash';
import { x64Xor } from './murmor_hash';
import { x64Fmix } from './murmor_hash';
import { x64Hash128 } from './murmor_hash';

export function Linger() {
  const MODULE_VERSION = '1.0.0';
  const Fingerprinter = class Fingerprinter {

    constructor(options) {
      this.options = options;

      this.VERSION = MODULE_VERSION;
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

    deviceEnumerationSupported = () => (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices);

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
