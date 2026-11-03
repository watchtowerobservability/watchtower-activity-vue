import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// The element is replaced by a stub: these tests cover the wrapper, activity-web tests the element.
const stub = fileURLToPath(new URL('./test/element.ts', import.meta.url));
export default defineConfig({ resolve: { alias: { '@watchtowerobservability/activity-web': stub } }, test: { environment: 'happy-dom', include: ['src/**/*.test.ts'] } });
