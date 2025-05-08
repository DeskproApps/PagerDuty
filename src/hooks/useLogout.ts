import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { ACCESS_TOKEN_PATH } from "../constants";

export type Result = {
  isLoading: boolean,
  logout: () => void,
};

const useLogout = (): Result => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const logout = useCallback(() => {
    if (!client) {
      return Promise.resolve();
    }

    setIsLoading(true);

    client.setBadgeCount(0)
    client.deleteUserState(ACCESS_TOKEN_PATH)
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
        navigate("/login");
      });
  }, [client, navigate]);

  return { logout, isLoading };
};

export { useLogout };
