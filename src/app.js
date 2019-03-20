/* eslint-disable no-console */
import Linger from './linger';

const fingerprint = new Linger();

console.info(fingerprint);
fingerprint.enumerateDevices(c => console.table(c))
