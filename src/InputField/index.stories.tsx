import React from "react";
import InputField, { Props } from "./index";

export default {
  title: "React advanced ui/InputField",
  component: InputField,
  parameters: { actions: { argTypesRegex: "^on.*" } },
};

export const InputFieldComponent = (args: Props) => <InputField {...args} />;
