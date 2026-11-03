// Stand-in for @watchtowerobservability/activity-web in tests: the wrapper only sets attributes and listens.
class Stub extends HTMLElement { reloads = 0; async reload() { this.reloads++; } }
if (!customElements.get('wt-activity')) customElements.define('wt-activity', Stub);
