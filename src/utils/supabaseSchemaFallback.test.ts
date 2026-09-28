import assert from 'node:assert/strict';
import test from 'node:test';
import { getMissingPayloadColumn } from './supabaseSchemaFallback';

const payload = {
  title: 'Analista',
  bonus_type: 'Comissao',
};

test('identifica coluna ausente informada pelo cache de schema do Supabase', () => {
  assert.equal(getMissingPayloadColumn({
    code: 'PGRST204',
    message: "Could not find the 'bonus_type' column of 'jobs' in the schema cache",
  }, payload), 'bonus_type');
});

test('ignora erros e colunas que nao pertencem ao payload', () => {
  assert.equal(getMissingPayloadColumn({ code: '42501', message: 'permission denied' }, payload), null);
  assert.equal(getMissingPayloadColumn({
    code: 'PGRST204',
    message: "Could not find the 'unknown_column' column of 'jobs' in the schema cache",
  }, payload), null);
});
