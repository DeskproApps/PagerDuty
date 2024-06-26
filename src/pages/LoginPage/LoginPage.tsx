import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { Login } from "../../components/Login";
import { useLogin } from "./hooks";
import type { FC } from "react";

const LoginPage: FC = () => {
  const { poll, authUrl, isLoading, error } = useLogin();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("PagerDuty");

    client.deregisterElement("homeButton");
    client.deregisterElement("menuButton");
    client.deregisterElement("editButton");

    client.registerElement("refreshButton", { type: "refresh_button" });
  }, []);

  return (
    <Login
      error={error}
      onLogin={poll}
      authUrl={authUrl}
      isLoading={isLoading}
    />
  );
};

export { LoginPage };
