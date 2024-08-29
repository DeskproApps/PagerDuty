import styled from "styled-components";
import { H3, TSpan, AnchorButton as AnchorButtonUI } from "@deskpro/deskpro-ui";
import { Title } from "@deskpro/app-sdk";
import { Container } from "../common";
import type { FC } from "react";

export type Props = {
  authUrl: string|null,
  onLogin: () => void,
  isLoading: boolean,
  error?: null|string,
};

const Invalid = styled(TSpan)`
  color: ${({ theme }) => theme.colors.red100};
`;

export const AnchorButton = styled(AnchorButtonUI)`
  min-width: 72px;
  justify-content: center;
`;

const Login: FC<Props> = ({ authUrl, onLogin, isLoading, error }) => {
  return (
    <Container>
      <Title as={H3} title="Log into your PagerDuty Account" />
      <AnchorButton
        intent="secondary"
        text="Log In"
        target="_blank"
        href={authUrl || "#"}
        onClick={onLogin}
        loading={isLoading}
        disabled={!authUrl || isLoading}
      />
      {" "}
      {error && <Invalid type="p1">{error}</Invalid>}
    </Container>
  );
};

export { Login };
