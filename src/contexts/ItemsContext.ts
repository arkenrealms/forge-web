import React from 'react';
import { createContext } from 'react';
import { ItemType } from 'rune-backend-sdk/build/data/items.type';

type ContextProps = {
  setItemPreviewed: React.Dispatch<React.SetStateAction<string>>;
  setItemSelected: React.Dispatch<React.SetStateAction<string>>;
  setItemMultiSelected: React.Dispatch<React.SetStateAction<string>>;
  setIsModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
  itemMultiSelected: Record<string, unknown>;
  itemSelected: string;
  itemPreviewed: string;
  isModalOpened: boolean;
  closeModal: () => void;
  equipItem: () => void;
  dropItem: () => void;
  itemsEquipped: { [key: string]: ItemType };
};

const ItemsContext = createContext<Partial<ContextProps>>({});

export default ItemsContext;
