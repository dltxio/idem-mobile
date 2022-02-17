import React from "react";
import { types, Instance } from "mobx-state-tree";
import { useLocalObservable } from "mobx-react-lite";
import { AssetStore } from "./assetStore";

const RootStore = types.model({
  Assets: AssetStore,
});

interface IRootStore extends Instance<typeof RootStore> {}

export const StoreContext = React.createContext<IRootStore | null>(null);

export const useRootStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
};

export const RootStoreProvider: React.FunctionComponent = ({
  children,
}: any) => {
  const store = useLocalObservable(() =>
    RootStore.create({ Assets: AssetStore.create() }),
  );
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
