import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { RoundedLabelTag } from "@deskpro/deskpro-ui";
import { makeFirstLetterUppercase } from "../../utils/utils";

type Props = {
  title: string | number;
};

export const CustomTag = ({ title }: Props) => {
  let color;
  title = makeFirstLetterUppercase(title as string);
  const { theme } = useDeskproAppTheme();

  switch (title) {
    case "Processing": {
      color = theme?.colors?.cyan100;

      break;
    }
    case "Pending":
    case "On hold": {
      color = theme?.colors?.orange80;

      break;
    }
    case "Trash":
    case "Failed":
    case "Refunded":
    case "Cancelled": {
      color = theme?.colors?.red100;

      break;
    }

    case "Completed": {
      color = theme?.colors?.green100;

      break;
    }

    default:
      color = theme?.colors?.grey100;
  }

  return (
    <RoundedLabelTag
      label={title as string}
      backgroundColor={color}
      textColor="white"
    />
  );
};
