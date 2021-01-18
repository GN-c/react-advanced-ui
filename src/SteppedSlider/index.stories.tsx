import React from "react";
import SteppedSlider, { Props } from "./index";

export default {
  title: "SteppedSlider",
  component: SteppedSlider,
  parameters: { actions: { argTypesRegex: "^on.*" } },
};

export const SteppedSliderComponent = (args: Props) => (
  <SteppedSlider {...args} />
);
