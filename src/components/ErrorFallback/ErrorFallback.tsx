import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Container } from "../common";
import { AnyIcon, Button, H1, H2, Stack } from "@deskpro/deskpro-ui";

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
  return (
    <Container>
      <Stack vertical gap={10} role="alert">
        <H1>Something went wrong:</H1>
        <H2>{errorMessage}</H2>
        <Button
          text="Reload"
          onClick={resetErrorBoundary}
          icon={faRefresh as AnyIcon}
          intent="secondary"
        />
      </Stack>
    </Container>
  );
};
