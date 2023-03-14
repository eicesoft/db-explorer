export const getImageRes = (url: string) => {
  return new URL(`../assets/${url}`, import.meta.url).href;
};

export const getIconRes = (url: string) => {
  return getImageRes(`icons/${url}`);
};
