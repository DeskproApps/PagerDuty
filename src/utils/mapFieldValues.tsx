import { ReactElement } from "react";
import { IJson } from "../types/json";
import { getObjectValue, makeFirstLetterUppercase } from "./utils";
import { Incident } from "../types/Incident";

export const mapFieldValues = (
  metadataFields: IJson["list"][0] | IJson["view"][0],
  field: Incident
): {
  key: string | number;
  value: string | number | ReactElement;
}[] => {
  return metadataFields.map((metadataField) => {
    let value;
    switch (metadataField.type) {
      case "date":
        value = new Date(
          field[metadataField.name as keyof Incident] as string
        ).toLocaleDateString("en-GB");
        break;

        break;
      case "key": {
        value = getObjectValue(field, metadataField.name);

        break;
      }

      // case "url": {
      //   value = field[metadataField.name as keyof APIArrayReturnTypes] ? (
      //     <StyledLink
      //       to={
      //         field[metadataField.name as keyof APIArrayReturnTypes] as string
      //       }
      //     >
      //       {field[metadataField.name as keyof APIArrayReturnTypes] as string}
      //     </StyledLink>
      //   ) : (
      //     ""
      //   );

      //   break;
      // }

      case "assignees": {
        value = field.assignments.reduce(
          (acc, assignment) => acc + `${assignment.assignee.summary}`,
          ""
        );

        break;
      }

      case "summary": {
        value = (
          field[metadataField.name as keyof Incident] as { summary: string }
        )?.summary;

        break;
      }

      case "text":
      default:
        value = makeFirstLetterUppercase(
          field[metadataField.name as keyof Incident]?.toString() as string
        );
    }

    return {
      key: metadataField.label,
      value: value as string | number | ReactElement,
    };
  });
};
