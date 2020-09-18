import { createState, createHook } from "@zoontek/react-global-state";

const users = createState([]);

const { getValue, setValue, resetValue } = users;

export const useUsers = createHook(users);

export const setUsers = (users) => setValue(() => users);
export const addUser = (user) => setValue((prevState) => [...prevState, user]);
export const removeUser = (userId) =>
  setValue((prevState) => prevState.filter(({ id }) => id !== userId));
