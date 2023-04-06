import { createApp } from 'vue';
import './style.less';
import App from './App.vue';
import './node-ipc/node-api';
import { setupStore } from '~/store';
import 'highlight.js/styles/github.css';
import 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import i18n from '~/locale/index';
// import '@arco-design/web-vue/dist/arco.less';
// import '@arco-design/web-vue/es/message/style/css.js';
// import '@arco-design/web-vue/es/notification/style/css.js';
import Notifications from '@kyvg/vue3-notification';
// import contextmenu from 'v-contextmenu';
// import 'v-contextmenu/dist/themes/default.css';

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import ContextMenu from '@imengyu/vue3-context-menu';

// import '@ysx-libs/vue-virtual-tree/style.css';
const app = createApp(App);
setupStore(app);
app.use(hljsVuePlugin);
app.use(i18n);
app.use(Notifications);
// app.use(contextmenu);
app.use(ContextMenu);

// app.directive('tooltip', tooltip);

// document.body.setAttribute('arco-theme', 'dark');

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*');
});
