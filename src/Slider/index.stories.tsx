import React from "react";
import Slider, { Props } from "./index";

export default {
  title: "React advanced ui/Components",
  component: Slider,
  argTypes: {},
  parameters: { actions: { argTypesRegex: "^on.*" } },
};

export const SliderComponent = (args: Props) => <Slider {...args} />;
