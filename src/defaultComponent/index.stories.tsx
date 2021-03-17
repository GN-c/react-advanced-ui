import React from "react";
import DefaultComponent, { Props } from "./index";

export default {
  title: "React advanced ui/DefaultComponent",
  component: DefaultComponent,
  parameters: { actions: { argTypesRegex: "^on.*" } },
};

export const DefaultComponentComponent = (args: Props) => (
  <DefaultComponent {...args} />
);
