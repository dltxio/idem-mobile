import { useState } from "react";

type Hooks = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const useClaimScreen = (): Hooks => {
  const [loading, setLoading] = useState<boolean>(false);

  return {
    loading,
    setLoading
  };
};

export default useClaimScreen;
