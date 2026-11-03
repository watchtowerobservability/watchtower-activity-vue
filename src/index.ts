// Vue 3 wrapper of <wt-activity>. Vue is a peer: nothing of it is bundled.
import '@watchtowerobservability/activity-web';
import { defineComponent, h, onBeforeUnmount, onMounted, ref, watchEffect, type App, type PropType } from 'vue';
import {
  applyProps, EVENTS, type ActivityErrorDetail, type ActivityEvent, type ActivityLoadDetail, type ActivityLogProps, type WtActivityElement,
} from './props';

export * from './props';

/**
 * `<ActivityLog :session="token" @open="onOpen" />`: the <wt-activity> element with typed props and events.
 * Emits `open` (the event the viewer opened), `load` and `error`; `ref.reload()` refetches.
 */
export const ActivityLog = defineComponent({
  name: 'ActivityLog',
  props: {
    session: { type: String, required: true },
    baseUrl: String,
    theme: String as PropType<ActivityLogProps['theme']>,
    accent: String,
    density: String as PropType<ActivityLogProps['density']>,
    locale: String,
    live: Boolean,
    verify: Boolean,
    pageSize: Number,
    extrasUrl: String,
    sealKey: String,
  },
  emits: {
    open: (_e: ActivityEvent) => true,
    load: (_d: ActivityLoadDetail) => true,
    error: (_d: ActivityErrorDetail) => true,
  },
  setup(props, { emit, expose }) {
    const el = ref<WtActivityElement | null>(null);
    // attributes are set imperatively so booleans and a new session behave the same as in the other wrappers
    watchEffect(() => { if (el.value) applyProps(el.value, props); });
    const listeners: [string, (e: Event) => void][] = [
      [EVENTS.open, (e) => emit('open', (e as CustomEvent<{ event: ActivityEvent }>).detail.event)],
      [EVENTS.load, (e) => emit('load', (e as CustomEvent<ActivityLoadDetail>).detail)],
      [EVENTS.error, (e) => emit('error', (e as CustomEvent<ActivityErrorDetail>).detail)],
    ];
    onMounted(() => { for (const [n, f] of listeners) el.value?.addEventListener(n, f); });
    onBeforeUnmount(() => { for (const [n, f] of listeners) el.value?.removeEventListener(n, f); });
    expose({ reload: () => el.value?.reload() });
    return () => h('wt-activity', { ref: el });
  },
});

/** `app.use(WtActivity)` registers `<ActivityLog>` globally. */
export const WtActivity = { install(app: App) { app.component('ActivityLog', ActivityLog); } };

declare module 'vue' {
  export interface GlobalComponents { ActivityLog: typeof ActivityLog }
}
