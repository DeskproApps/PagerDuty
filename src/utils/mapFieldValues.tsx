import { ReactElement } from "react";
import { APIArrayReturnTypes } from "../api/types";
import { StyledLink } from "../styles";
import { IJson } from "../types/json";
import { getObjectValue, makeFirstLetterUppercase } from "./utils";

export const mapFieldValues = (
  metadataFields: IJson["list"][0] | IJson["view"][0],
  field: APIArrayReturnTypes
): {
  key: string | number;
  value: string | number | ReactElement;
}[] => {
  return metadataFields.map((metadataField) => {
    let value;
    switch (metadataField.type) {
      case "date":
        if (metadataField.name === "close_date") {
          value = new Date(
            field[metadataField.name as keyof APIArrayReturnTypes] as string
          ).toLocaleDateString("en-GB");
          break;
        }

        value = new Date(
          (field[metadataField.name as keyof APIArrayReturnTypes] as number) *
            1000
        ).toLocaleDateString("en-UK", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        break;
      case "key": {
        value = getObjectValue(field, metadataField.name);

        break;
      }

      case "currency": {
        value = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: field.monetary_unit,
        }).format(
          field[metadataField.name as keyof APIArrayReturnTypes] as number
        );

        break;
      }

      case "address": {
        value = field[metadataField.name as keyof APIArrayReturnTypes] as {
          street: string;
          city: string;
          state: string;
          postal_code: string;
        };

        value =
          value?.street +
          ", " +
          value?.city +
          ", " +
          value?.state +
          ", " +
          value?.postal_code;

        break;
      }

      case "url": {
        value = field[metadataField.name as keyof APIArrayReturnTypes] ? (
          <StyledLink
            to={
              field[metadataField.name as keyof APIArrayReturnTypes] as string
            }
          >
            {field[metadataField.name as keyof APIArrayReturnTypes] as string}
          </StyledLink>
        ) : (
          ""
        );

        break;
      }

      case "percentage": {
        value = `${field[metadataField.name as keyof APIArrayReturnTypes]}%`;

        break;
      }

      case "array": {
        value = (
          field[metadataField.name as keyof APIArrayReturnTypes] as [
            { email: string; number: string; category: string }
          ]
        ).find((e) => e.category === "work");

        value = value?.email ? value.email : value?.number;

        break;
      }

      case "lineitem": {
        value = "lineitem";

        break;
      }

      default:
        value = makeFirstLetterUppercase(
          field[
            metadataField.name as keyof APIArrayReturnTypes
          ]?.toString() as string
        );
    }

    return {
      key: metadataField.label,
      value: value as string | number | ReactElement,
    };
  });
};
