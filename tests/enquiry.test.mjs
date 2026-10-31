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
test('accepts only the seven admission cities for enquiries and drive registrations', () => {
  for (const city of ['Guwahati', 'Aizawl', 'Itanagar', 'Jorhat', 'Dimapur', 'Siliguri', 'Kolkata']) {
    assert.ok(validateEnquiry({ ...valid, region: city, drive: city }).data, city);
  }
  for (const city of ['Other', 'Gangtok', 'Shillong', 'Imphal', 'Assam', 'Sikkim']) {
    const result = validateEnquiry({ ...valid, region: city, drive: city, city: 'Kolkata' });
    assert.ok(result.errors.region, city);
    assert.ok(result.errors.drive, city);
  }
});
test('prepares an encoded draft addressed only to school admissions', () => {
  const url = new URL(createEnquiryEmail({ ...valid, name: 'Parent & Guardian' }));
  assert.equal(url.pathname, 'admissions@doonglobalschool.edu.in');
  assert.match(url.searchParams.get('body'), /Parent & Guardian/);
  assert.match(url.searchParams.get('body'), /Class|class/);
  assert.equal(url.searchParams.has('cc'), false);
});
test('accepts an optional admission drive city and rejects unknown ones', () => {
  assert.equal(validateEnquiry(valid).data.drive, '');
  assert.equal(validateEnquiry({ ...valid, drive: 'Guwahati' }).data.drive, 'Guwahati');
  assert.ok(validateEnquiry({ ...valid, drive: 'Shillong' }).errors.drive);
});
test('names the admission drive city in the email draft', () => {
  const url = new URL(createEnquiryEmail({ ...valid, drive: 'Kolkata' }));
  assert.match(url.searchParams.get('subject'), /admission drive · Kolkata/);
  assert.match(url.searchParams.get('body'), /Admission drive: Kolkata/);
  assert.doesNotMatch(new URL(createEnquiryEmail({ ...valid, drive: '' })).searchParams.get('body'), /Admission drive/);
});
