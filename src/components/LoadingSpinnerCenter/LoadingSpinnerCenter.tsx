import { LoadingSpinner, Stack } from "@deskpro/app-sdk";

export const LoadingSpinnerCenter = () => {
  return (
    <Stack style={{ width: "100%" }} justify="center">
      <LoadingSpinner />
    </Stack>
  );
};
