// .storybook/preview.js

import React from "react";

export const decorators = [
  (Story) => (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: "0",
        left: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Story />
    </div>
  ),
];
export const parameters = {
  controls: { expanded: true },
};
