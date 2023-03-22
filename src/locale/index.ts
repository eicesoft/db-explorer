import { createI18n } from 'vue-i18n';
import zh from './lang/zh';
import en from './lang/en';
let lang = localStorage.getItem('sql-locale');

if (!lang) {
  lang = 'zh';
}

const i18n = createI18n({
  legacy: false, // 没有该参数可能会报错
  locale: lang,
  messages: {
    zh,
    en,
  },
});

export default i18n;
