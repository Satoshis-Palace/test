// polyfills.ts
// eslint-disable-next-line import/no-extraneous-dependencies
import 'whatwg-fetch';
// import { webcrypto } from 'crypto';
import { Buffer } from 'buffer';


if (typeof window === 'undefined') {
	// @ts-ignore
	global.window = globalThis;

	const { webcrypto } = require('crypto');
	// @ts-ignore
	global.window.crypto = webcrypto;
} else { // Browser
	if (!window.Buffer) {
		window.Buffer = Buffer;
	}
}
