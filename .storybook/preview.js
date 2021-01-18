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
      <div
        style={{
          border: "1px solid #e1e1e1",
          borderRadius: "0.5em",
          background: "white",
        }}
      >
        <Story />
      </div>
    </div>
  ),
];
export const parameters = {
  controls: { expanded: true },
};
