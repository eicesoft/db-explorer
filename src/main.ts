import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import './samples/node-api';
import contentmenu from 'v-contextmenu';
import 'v-contextmenu/dist/themes/default.css';
import { setupStore } from '~/store';

const app = createApp(App);
setupStore(app);
app.use(contentmenu);
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*');
});
