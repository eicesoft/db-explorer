import { createApp } from 'vue';
import './style.less';
import App from './App.vue';
import './node-ipc/node-api';
import { setupStore } from '~/store';
// import ArcoVue from '@arco-design/web-vue';
// import '@arco-design/web-vue/dist/arco.css';
import 'highlight.js/styles/github.css';
import 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import i18n from '~/locale/index';
import '@arco-design/web-vue/dist/arco.less';
import '@arco-design/web-vue/es/message/style/css.js';
import '@arco-design/web-vue/es/notification/style/css.js';

const app = createApp(App);
setupStore(app);
app.use(hljsVuePlugin);
app.use(i18n);
// document.body.setAttribute('arco-theme', 'dark');

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*');
});
