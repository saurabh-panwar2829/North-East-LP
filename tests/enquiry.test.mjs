import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateEnquiry, createEnquiryEmail, createEnquiryWhatsApp } from '../src/lib/enquiry.ts';
import { CAMPAIGNS, OTHER_TOWN } from '../src/lib/campaigns.ts';

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
test('prepares a WhatsApp chat with admissions carrying the same enquiry text', () => {
  const url = new URL(createEnquiryWhatsApp({ ...valid, name: 'Parent & Guardian', drive: 'Kolkata' }));
  assert.equal(url.origin + url.pathname, 'https://wa.me/918650728951');
  const text = url.searchParams.get('text');
  assert.match(text, /Parent & Guardian/);
  assert.ok(text.includes('Mobile: +91 9876543210'));
  assert.match(text, /Admission drive: Kolkata/);
  assert.equal(text, new URL(createEnquiryEmail({ ...valid, name: 'Parent & Guardian', drive: 'Kolkata' })).searchParams.get('body'));
});

test('validates each campaign against its own drive and hometown options', () => {
  for (const campaign of Object.values(CAMPAIGNS)) {
    for (const stop of campaign.driveStops) {
      const result = validateEnquiry({ ...valid, campaign: campaign.id, region: stop.city, drive: stop.city });
      assert.equal(result.data?.campaign, campaign.id, `${campaign.id}/${stop.city}`);
    }
    for (const group of campaign.homeGroups) {
      for (const region of group.towns) assert.ok(validateEnquiry({ ...valid, campaign: campaign.id, region }).data, region);
    }
  }
  for (const input of [
    { campaign: 'uttarakhand', region: 'Siliguri', drive: 'Guwahati' },
    { campaign: 'north-east', region: 'Haldwani', drive: 'Almora' },
  ]) {
    const result = validateEnquiry({ ...valid, ...input });
    assert.ok(result.errors.region);
    assert.ok(result.errors.drive);
    assert.equal(result.data, undefined);
  }
});

test('rejects invalid campaign identifiers and keeps legacy North East clients working', () => {
  for (const campaign of ['unknown', '__proto__', 'toString', '', null, 42, {}]) {
    assert.ok(validateEnquiry({ ...valid, campaign }).errors.campaign);
  }
  assert.equal(validateEnquiry(valid).data.campaign, 'north-east');
});

test('custom Uttarakhand hometown requires bounded single-line text', () => {
  const enquiry = { ...valid, campaign: 'uttarakhand', region: OTHER_TOWN };
  for (const city of ['', 'A', 'x'.repeat(81), 'Town\nExtra field']) assert.ok(validateEnquiry({ ...enquiry, city }).errors.city);
  assert.equal(validateEnquiry({ ...enquiry, city: 'Lansdowne' }).data.city, 'Lansdowne');
  assert.ok(validateEnquiry({ ...enquiry, campaign: 'north-east', city: 'Lansdowne' }).errors.region);
  assert.equal(validateEnquiry({ ...valid, city: 'old custom town' }).data.city, '');
});

test('Uttarakhand messages identify the selected region and preserve encoded parent details', () => {
  const input = { ...valid, campaign: 'uttarakhand', region: 'Haldwani', drive: 'Almora', name: 'Parent & Guardian' };
  const email = new URL(createEnquiryEmail(input));
  const whatsapp = new URL(createEnquiryWhatsApp(input));
  assert.match(email.searchParams.get('subject'), /Uttarakhand admission drive · Almora/);
  assert.match(email.searchParams.get('body'), /Haldwani \(Kumaun\)/);
  assert.match(email.searchParams.get('body'), /Garhwal & Kumaun/);
  assert.match(email.searchParams.get('body'), /Parent & Guardian/);
  assert.match(email.searchParams.get('body'), /confirm the date and venue/);
  assert.doesNotMatch(email.searchParams.get('body'), /North East|Siliguri|Guwahati/);
  assert.equal(whatsapp.searchParams.get('text'), email.searchParams.get('body'));
  const custom = new URL(createEnquiryEmail({ ...input, region: OTHER_TOWN, city: 'Lansdowne' }));
  assert.match(custom.searchParams.get('body'), /Lansdowne, Uttarakhand/);
});
