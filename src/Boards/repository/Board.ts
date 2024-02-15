export const BoardKey = "@board";

export function LocalStorageRepository<T extends { id: string }>(key: string) {
  const storageKey = key;

  const stored = (): Array<T> => {
    const storedList = localStorage.getItem(storageKey);
    if (storedList != null) {
      return JSON.parse(storedList);
    }

    return [];
  };

  const save = (item: T) => {
    const current = stored();
    const updatedList = current.concat(item);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));
  };

  const get = (item: T) => {
    const current = stored();
    const filtered = current.filter((todo) => todo.id === item.id);
    return filtered[0] || null;
  };

  const update = (item: T) => {
    const current = stored();
    const updatedList = current.map((todo) => {
      if (todo.id === item.id) {
        return {
          ...todo,
          ...item,
        };
      }

      return todo;
    });

    localStorage.setItem(storageKey, JSON.stringify(updatedList));
  };

  const remove = (item: T) => {
    const current = stored();
    const updatedList = current.filter((todo) => todo.id !== item.id);

    localStorage.setItem(storageKey, JSON.stringify(updatedList));
  };

  return {
    stored,
    save,
    get,
    update,
    remove,
  };
}
