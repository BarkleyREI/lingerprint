/* eslint-disable no-console */
import { Lingerprint } from './lingerprint';

const lingerprint = new Lingerprint();

setTimeout(() => {
  console.table(lingerprint.Components);
  console.info(lingerprint.Fingerprint);
}, 10);
