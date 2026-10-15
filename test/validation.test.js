import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSriLankanMobile, validateMessage, validateSenderId } from '../src/validation.js';

test('normalizes accepted Sri Lankan mobile formats', () => {
  assert.equal(normalizeSriLankanMobile('077 123 4567'), '+94771234567');
  assert.equal(normalizeSriLankanMobile('+94771234567'), '+94771234567');
  assert.equal(normalizeSriLankanMobile('0094771234567'), '+94771234567');
  assert.equal(normalizeSriLankanMobile('771234567'), '+94771234567');
});

test('rejects non-Sri Lankan, landline, and malformed numbers', () => {
  assert.equal(normalizeSriLankanMobile('+14155552671'), null);
  assert.equal(normalizeSriLankanMobile('0112345678'), null);
  assert.equal(normalizeSriLankanMobile('+9477123456'), null);
  assert.equal(normalizeSriLankanMobile('+94811234567'), null);
});

test('validates message length', () => {
  assert.equal(validateMessage('Hello'), null);
  assert.equal(validateMessage(''), 'Message is required.');
  assert.equal(validateMessage('x'.repeat(1601)), 'Message must be 1600 characters or fewer.');
});

test('requires the configured approved sender ID', () => {
  assert.equal(validateSenderId('ACME', 'ACME'), null);
  assert.match(validateSenderId('OTHER', 'ACME'), /exactly match/);
  assert.match(validateSenderId('ACME', ''), /not configured/);
});
