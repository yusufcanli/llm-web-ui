import localforage from "localforage";

const getItem = async <T = unknown>(itemId: string): Promise<T> => {
  const result = await localforage.getItem<string>(itemId)
  return JSON.parse(result as string) as T;
};
const setItem = async <T = unknown>(itemId: string, item: T): Promise<T> => {
  await localforage.setItem(itemId, JSON.stringify(item));
  return await getItem<T>(itemId);
};
const removeItem = async (itemId: string) => {
  await localforage.removeItem(itemId);
}

const db = {
  getItem,
  setItem,
  removeItem,
};

export default db;