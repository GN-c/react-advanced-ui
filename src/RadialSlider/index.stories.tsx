import React from "react";
import RadialSlider, { Props } from "./index";

export default {
  title: "React advanced ui/RadialSlider",
  component: RadialSlider,
  parameters: { actions: { argTypesRegex: "^on.*" } },
};

export const RadialSliderComponent = (args: Props) => (
  <RadialSlider {...args} />
);
