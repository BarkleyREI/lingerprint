/* eslint-disable no-console */
import { Lingerprint } from './lingerprint';

const lingerprint = new Lingerprint();

setTimeout(() => {
  // eslint-disable-next-line no-undef
  window.Lingerprint = lingerprint;
}, 10);
