import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import './samples/node-api';
import contentmenu from 'v-contextmenu';
import 'v-contextmenu/dist/themes/default.css';
import { setupStore } from '~/store';
// import ArcoVue from '@arco-design/web-vue';
// import '@arco-design/web-vue/dist/arco.css';
import 'highlight.js/styles/github.css';
import 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import i18n from '~/locale/index';
import '@arco-design/web-vue/es/message/style/css.js';

const app = createApp(App);
setupStore(app);
app.use(contentmenu);
// app.use(ArcoVue, {});
app.use(hljsVuePlugin);
app.use(i18n);

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*');
});
