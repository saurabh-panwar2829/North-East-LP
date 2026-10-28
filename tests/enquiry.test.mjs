import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateEnquiry, createEnquiryEmail } from '../src/lib/enquiry.ts';

const valid = { name: 'Test Parent', phone: '9876543210', grade: '6', region: 'Siliguri', city: '', interest: 'Boarding admissions', consent: true, website: '' };
test('normalizes Indian international and spaced phone numbers', () => {
  for (const phone of ['+91 98765 43210', '919876543210', '(98765) 43210']) {
    assert.equal(validateEnquiry({ ...valid, phone }).data.phone, '9876543210');
  }
});
test('rejects missing consent and ineligible class', () => {
  const result = validateEnquiry({ ...valid, grade: '2', consent: false });
  assert.ok(result.errors.grade);
  assert.ok(result.errors.consent);
  assert.equal(result.data, undefined);
});
test('rejects malformed phones, unknown regions and bot submissions', () => {
  assert.ok(validateEnquiry({ ...valid, phone: '1234567890' }).errors.phone);
  assert.ok(validateEnquiry({ ...valid, region: 'unknown' }).errors.region);
  assert.ok(validateEnquiry({ ...valid, website: 'bot' }).errors.form);
  assert.ok(validateEnquiry(null).errors.form);
});
test('requires a custom city only for Other', () => {
  assert.ok(validateEnquiry({ ...valid, region: 'Other' }).errors.city);
  assert.ok(validateEnquiry({ ...valid, region: 'Other', city: 'Kolkata' }).data);
  assert.ok(validateEnquiry(valid).data);
});
test('prepares an encoded draft addressed only to school admissions', () => {
  const url = new URL(createEnquiryEmail({ ...valid, name: 'Parent & Guardian' }));
  assert.equal(url.pathname, 'admissions@doonglobalschool.edu.in');
  assert.match(url.searchParams.get('body'), /Parent & Guardian/);
  assert.match(url.searchParams.get('body'), /Class|class/);
  assert.equal(url.searchParams.has('cc'), false);
});
