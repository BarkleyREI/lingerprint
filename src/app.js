/* eslint-disable no-console */
import { Linger } from './linger';

const fingerprint = new Linger();

console.info(fingerprint);

fingerprint.enumerateDevices(c => console.table(c));
fingerprint.audioKey(c => console.log(c));
fingerprint.userAgent(c => console.log(c));
fingerprint.webDriver(c => console.log(c));
fingerprint.languageKey(c => console.log(c));
fingerprint.colorDepth(c => console.log(c));
fingerprint.deviceMemory(c => console.log(c));
fingerprint.pixelRatio(c => console.log(c));
fingerprint.screenResolution(c => console.log(c));
fingerprint.availableScreenResolution(c => console.log(c));
fingerprint.timeZone(c => console.log(c));
fingerprint.timeZoneOffset(c => console.log(c));
fingerprint.addBehavior(c => console.log(c));
fingerprint.openDatabase(c => console.log(c));
fingerprint.cpuClass(c => console.log(c));
fingerprint.hardwareConcurrency(c => console.log(c));
fingerprint.platform(c => console.log(c));
fingerprint.doNotTrack(c => console.log(c));
fingerprint.sessionStorage(c => console.log(c));
fingerprint.localStorage(c => console.log(c));
fingerprint.indexedDb(c => console.log(c));
fingerprint.touchSupport(c => console.table(c));
fingerprint.canvas(c => console.table(c));
fingerprint.webGl(c => console.table(c));
fingerprint.webGlVendor(c => console.table(c));
fingerprint.adBlocker(c => console.log(c));
fingerprint.liedLanguages(c => console.log(c));
fingerprint.liedResolution(c => console.log(c));
fingerprint.liedBrowser(c => console.log(c));
