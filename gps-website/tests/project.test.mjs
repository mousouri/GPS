import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

test('package.json exposes typecheck and test scripts', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(typeof pkg.scripts.typecheck, 'string');
  assert.equal(typeof pkg.scripts.test, 'string');
});

test('.env.example documents frontend and backend variables', () => {
  const envFile = read('.env.example');
  assert.match(envFile, /VITE_API_BASE_URL=/);
  assert.match(envFile, /GPS_DB_HOST=/);
  assert.match(envFile, /GPS_FRONTEND_ORIGIN=/);
});

test('auth context stores a backend session token', () => {
  const authContext = read('src/context/AuthContext.tsx');
  assert.match(authContext, /crestech_session_token/);
  assert.match(authContext, /loginRequest/);
});

test('backend api exposes the upgraded actions', () => {
  const apiFile = read('backend/api.php');
  for (const action of ['forgot_password', 'reset_password', 'admin_dashboard', 'admin_billing', 'admin_audit_log']) {
    assert.match(apiFile, new RegExp(`case '${action}'`));
  }
});

test('app routes include the reset password page', () => {
  const appFile = read('src/App.tsx');
  assert.match(appFile, /path="\/reset-password"/);
});
