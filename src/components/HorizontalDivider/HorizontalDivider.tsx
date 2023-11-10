import {
  HorizontalDivider as HorizontalDividerSDK,
  useDeskproAppTheme,
} from "@deskpro/app-sdk";
type Props = {
  full?: boolean;
};
export const HorizontalDivider = ({ full }: Props) => {
  const { theme } = useDeskproAppTheme();
  return (
    <HorizontalDividerSDK
      style={{
        width: "100vw",
        color: theme.colors?.grey10,
        marginLeft: full ? "-8px" : "0px",
      }}
    />
  );
};
