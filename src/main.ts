import { createApp } from 'vue';
import './style.less';
import App from './App.vue';
import './node-ipc/node-api';
import { setupStore } from '~/store';
import 'highlight.js/styles/github.css';
import 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import i18n from '~/locale/index';
import Notifications from '@kyvg/vue3-notification';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import ContextMenu from '@imengyu/vue3-context-menu';
const app = createApp(App);
setupStore(app);
app.use(hljsVuePlugin);
app.use(i18n);
app.use(Notifications);
app.use(ContextMenu);

// app.directive('tooltip', tooltip);

// document.body.setAttribute('arco-theme', 'dark');

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*');
});
