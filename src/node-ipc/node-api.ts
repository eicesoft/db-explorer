import { lstat } from 'node:fs/promises';
import { cwd } from 'node:process';
import { ipcRenderer } from 'electron';
import { useTabStore } from '~/store/modules/tab';
import { Tab, TabType } from '~/components/Tabber/index';
import { uuid } from '~/utils';

ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args);
});

ipcRenderer.on('load-file', (_event, ...args) => {
  console.log('[Receive load-file message]:', args);
  const tabStore = useTabStore();

  let queryTabs = tabStore.tabs.filter((i: any) => {
    return i.type == TabType.Query;
  });
  let newTab: Tab = {
    id: 'Query' + uuid(),
    title: 'Query ' + (queryTabs.length + 1),
    type: TabType.Query,
    meta: {
      node: tabStore.activeTab?.meta.node,
      editor: {
        context: args[0],
        model: null,
        state: null,
      },
    },
  };

  tabStore.active(newTab);
  tabStore.add(newTab);
});

lstat(cwd())
  .then((stats) => {
    console.log('[fs.lstat]', stats);
  })
  .catch((err) => {
    console.error(err);
  });
