import { describe, expect, it } from 'vitest';
import { createApp, h, nextTick, reactive, ref } from 'vue';
import { ActivityLog, EVENTS, applyProps, type ActivityEvent } from './index';

function mount(props: Record<string, unknown>) {
  const root = document.createElement('div');
  document.body.append(root);
  const comp = ref<{ reload(): Promise<void> } | null>(null);
  const app = createApp({ render: () => h(ActivityLog, { ...props, ref: comp } as never) });
  app.mount(root);
  return { root, app, comp, el: () => root.querySelector('wt-activity') as HTMLElement & { reloads: number } };
}

describe('ActivityLog (vue)', () => {
  it('maps props to attributes and follows changes', async () => {
    const props = reactive<Record<string, unknown>>({ session: 'tok1', baseUrl: 'https://api.example', live: true, pageSize: 50 });
    const root = document.createElement('div');
    createApp({ render: () => h(ActivityLog, props as never) }).mount(root);
    await nextTick();
    const el = root.querySelector('wt-activity')!;
    expect(el.getAttribute('session')).toBe('tok1');
    expect(el.getAttribute('base-url')).toBe('https://api.example');
    expect(el.getAttribute('live')).toBe('');
    expect(el.getAttribute('page-size')).toBe('50');
    expect(el.hasAttribute('verify')).toBe(false);
    props.session = 'tok2';
    props.live = false;
    await nextTick();
    expect(el.getAttribute('session')).toBe('tok2');
    expect(el.hasAttribute('live')).toBe(false);
  });

  it('emits typed events and exposes reload', async () => {
    const opened: ActivityEvent[] = [];
    const errors: string[] = [];
    const m = mount({ session: 't', onOpen: (e: ActivityEvent) => opened.push(e), onError: (d: { message: string }) => errors.push(d.message) });
    await nextTick();
    const ev = { id: 'e1', account_id: 'acme', action: 'invoice.paid', occurred_at: '2026-10-31T00:00:00Z' };
    m.el().dispatchEvent(new CustomEvent(EVENTS.open, { detail: { event: ev }, bubbles: true, composed: true }));
    m.el().dispatchEvent(new CustomEvent(EVENTS.error, { detail: { message: '401', status: 401 } }));
    expect(opened).toEqual([ev]);
    expect(errors).toEqual(['401']);
    await m.comp.value!.reload();
    expect(m.el().reloads).toBe(1);
    m.app.unmount();
  });

  it('applyProps drops empty values', () => {
    const el = document.createElement('div');
    applyProps(el, { session: 's', accent: '', verify: true });
    expect(el.getAttribute('verify')).toBe('');
    expect(el.hasAttribute('accent')).toBe(false);
  });
});
