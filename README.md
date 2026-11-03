# @watchtowerobservability/activity-vue

Typed Vue 3 component for the Watchtower hosted activity log: a thin layer (under 2 KB gzipped, checked by `npm run size`) over the `<wt-activity>` web component of `@watchtowerobservability/activity-web`, which does the rendering, theming, export and verification.

```sh
npm i @watchtowerobservability/activity-vue @watchtowerobservability/activity-web
```

```vue
<script setup lang="ts">
import { ActivityLog, type ActivityEvent } from '@watchtowerobservability/activity-vue';
const token = await (await fetch('/api/activity-session', { method: 'POST' })).json().then((r) => r.token);
const onOpen = (e: ActivityEvent) => console.log('opened', e.action);
</script>

<template>
  <ActivityLog :session="token" base-url="https://YOUR_WATCHTOWER_HOST" theme="system" live verify @open="onOpen" @error="(d) => d.status === 401 && refresh()" />
</template>
```

Or register it globally with `app.use(WtActivity)`.

Your backend mints `token` with a server SDK (`createViewerSession`). It is sent only as `Authorization: Bearer`, never in a URL. Never put a secret key in the browser.

| Prop | Attribute | |
|---|---|---|
| `session` (required) | `session` | viewer session token; a new value reloads the feed |
| `baseUrl` | `base-url` | your Watchtower API URL (default: the page origin) |
| `theme` | `theme` | `light`, `dark` or `system` |
| `accent`, `density`, `locale` | same | `density`: `compact` or `comfortable` |
| `live`, `verify` | same | booleans |
| `pageSize`, `extrasUrl`, `sealKey` | `page-size`, `extras-url`, `seal-key` | |

Events: `open` (the `ActivityEvent` the viewer opened), `load` (`{count, hasMore}`) and `error` (`{message, status?}`), from the element's `wt-activity-open`, `wt-activity-load` and `wt-activity-error` DOM events. A template ref exposes `reload()`.

License: Apache-2.0
