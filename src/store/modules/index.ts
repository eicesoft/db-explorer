const allModules: Record<string, any> = import.meta.glob('/*/index.ts', { eager: true });

const modules = {} as any;
Object.keys(allModules).forEach((path: string) => {
  const fileName = path.split('/')[1];
  modules[fileName] = allModules[path][fileName] || allModules[path].default || allModules[path];
});
