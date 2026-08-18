import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getAssessmentMarkerStatus,
  getCompletedAssessmentBody,
  isCompletedAssessmentValue,
} from './assessmentMarker';

test('recognizes legacy and snapshot pending markers', () => {
  assert.equal(getAssessmentMarkerStatus('PENDING'), 'PENDING');
  assert.equal(getAssessmentMarkerStatus('PENDING:::{"templateId":"123"}'), 'PENDING');
});

test('recognizes legacy and snapshot completed markers', () => {
  assert.equal(getAssessmentMarkerStatus('COMPLETED==={"answers":[]}'), 'COMPLETED');
  assert.equal(getAssessmentMarkerStatus('COMPLETED:::{"questions":[]}'), 'COMPLETED');
  assert.equal(isCompletedAssessmentValue('COMPLETED:::{"questions":[]}'), true);
});

test('extracts completed result body from both formats and removes completion date', () => {
  assert.equal(
    getCompletedAssessmentBody('COMPLETED==={"answers":[1]}===DATE===2026-08-18T12:00:00.000Z'),
    '{"answers":[1]}',
  );
  assert.equal(
    getCompletedAssessmentBody('COMPLETED:::{"questions":[{"id":"q1"}]}===DATE===2026-08-18T12:00:00.000Z'),
    '{"questions":[{"id":"q1"}]}',
  );
});

test('ignores empty and unrelated candidate metadata', () => {
  assert.equal(getAssessmentMarkerStatus(undefined), 'NONE');
  assert.equal(getAssessmentMarkerStatus('phone number'), 'NONE');
  assert.equal(getAssessmentMarkerStatus('PENDING_REVIEW'), 'NONE');
});
