import {
  LoadingSpinner,
  useDeskproElements,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useLoadingApp } from "./hooks";
import { ErrorBlock } from "../../components/common";

const LoadingAppPage = () => {
  const { error } = useLoadingApp();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("PagerDuty");
  }, []);

  useDeskproElements(({ registerElement }) => {
    registerElement("refreshButton", { type: "refresh_button" });
  });

  if (error) {
    return (
      <ErrorBlock text={error} />
    );
  }

  return (
    <LoadingSpinner/>
  );
};

export { LoadingAppPage };
