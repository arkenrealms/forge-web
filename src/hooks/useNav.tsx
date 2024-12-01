import React, { useState, createContext, useContext } from 'react';
import { notification } from 'antd';
import _ from 'lodash';

const NavContext = createContext<any>({
  items: {},
  addItem: () => {},
  removeItem: () => {},
});

function NavProvider({ children, value }: any) {
  const [items, setItems] = useState({});

  function addItem(name: any, item: any) {
    if (!items[name]) items[name] = [];

    if (items[name].find((i: any) => i.key === item.key)) return;

    items[name].push(item);

    setItems(items);
  }

  function removeItem(name: any, key: any) {
    if (!items[name]) items[name] = [];

    const itemIndex = items[name].findIndex((i: any) => i.key === key);
    if (itemIndex >= 0) {
      items[name].splice(itemIndex, 1);
      setItems(items);
    }
  }

  return (
    <NavContext.Provider
      value={{
        items,
        addItem,
        removeItem,
      }}
    >
      {children}
    </NavContext.Provider>
  );
}

function useNav(name: any) {
  const context = useContext(NavContext);

  return {
    items: context.items[name] || [],
    addItem: context.addItem.bind({}, name),
    removeItem: context.removeItem.bind({}, name),
  };
}

export { NavContext, NavProvider, useNav };
