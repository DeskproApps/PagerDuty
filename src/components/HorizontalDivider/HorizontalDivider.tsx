import { HorizontalDivider as HorizontalDividerSDK } from "@deskpro/app-sdk";
type Props = {
  full?: boolean;
};
export const HorizontalDivider = ({ full }: Props) => {
  return (
    <HorizontalDividerSDK
      style={{
        width: "100vw",
        color: "#EFF0F0",
        marginBottom: "10px",
        marginLeft: full ? "-10px" : "0px",
      }}
    />
  );
};
