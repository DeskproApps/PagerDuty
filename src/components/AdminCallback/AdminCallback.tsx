import styled from "styled-components";
import { TSpan } from "@deskpro/deskpro-ui";
import { CopyToClipboardInput, LoadingSpinner } from "@deskpro/app-sdk";
import type { FC } from "react";

export type Props = {
  callbackUrl?: null|string;
};

const Secondary = styled(TSpan)`
  color: ${({ theme }) => theme.colors.grey80};
`;

const AdminCallback: FC<Props> = ({ callbackUrl }) => {
  if (!callbackUrl) {
    return (<LoadingSpinner/>);
  }

  return (
    <>
      <CopyToClipboardInput value={callbackUrl} />
      <Secondary type="p1">
        The callback URL will be required during PagerDuty app setup
      </Secondary>
    </>
  );
};

export { AdminCallback };
