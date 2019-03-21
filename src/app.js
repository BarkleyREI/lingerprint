/* eslint-disable no-console */
import { Linger } from './linger';

const fingerprint = new Linger();

setTimeout(() => {
  console.table(fingerprint.Components);
  console.info(fingerprint.Fingerprint);
}, 10);
