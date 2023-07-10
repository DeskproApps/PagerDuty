/* eslint-disable @typescript-eslint/no-explicit-any */
import { H1, Stack, TextArea, useDeskproAppTheme } from "@deskpro/app-sdk";
import { forwardRef } from "react";
import { FieldErrorsImpl } from "react-hook-form";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form/dist/types";
import { InputWithTitleRegister } from "../InputWithTitle/InputWithTitleRegister";
import { DropdownSelect } from "../DropdownSelect/DropdownSelect";

type Props = {
  errors: Partial<FieldErrorsImpl<any>>;
  field: {
    name: string;
    label: string;
    type: string;
    required?: boolean;
  };
  dropdownData: { [key: string]: string[] };
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
};

export const FieldMappingInput = forwardRef(
  ({
    field,
    errors,
    watch,
    setValue,
    register,
    dropdownData,
    ...attributes
  }: Props) => {
    const { theme } = useDeskproAppTheme();

    if (field.label === "Type") return null;
    switch (field.type) {
      case "text":
      case "number":
      case "email":
        return (
          <InputWithTitleRegister
            register={register(field.name, {
              setValueAs: (value) => {
                if (value === "") return undefined;

                if (field.type === "number") return Number(value);

                return value;
              },
            })}
            title={field.label}
            error={!!errors[field.name]}
            type={field.type}
            required={field.required}
            data-testid={`input-${field.name}`}
            {...attributes}
          ></InputWithTitleRegister>
        );
      case "dropdown": {
        return (
          <DropdownSelect
            title={field.label}
            error={!!errors[field.name]}
            required={field.required}
            data={dropdownData[field.name]}
            onChange={(e) => setValue(field.name, e)}
            value={watch(field.name)}
            valueName={field.name}
            keyName={field.name}
          />
        );
      }
      case "textarea":
        return (
          <Stack
            vertical
            gap={4}
            style={{ width: "100%", color: theme.colors.grey80 }}
          >
            <H1>{field.label}</H1>
            <TextArea
              variant="inline"
              value={watch(field.name)}
              error={!!errors[field.name]}
              onChange={(e) => setValue(field.name, e.target.value)}
              placeholder="Enter text here..."
              required={field.required}
              title={field.label}
              {...attributes}
              style={{
                resize: "none",
                minHeight: "5em",
                maxHeight: "100%",
                height: "auto",
                width: "100%",
                overflow: "hidden",
              }}
            />
          </Stack>
        );
    }
    return null;
  }
);
