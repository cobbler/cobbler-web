import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: './projects/typescript-xmlrpc/src/test-globals.ts',
  },
});
