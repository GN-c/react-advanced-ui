import React from "react";
import ScrollBar, { Props } from "./index";

export default {
  title: "React advanced ui/ScrollBar",
  component: ScrollBar,
  parameters: { actions: { argTypesRegex: "^on.*" } },
};

export const ScrollBarComponent = (args: Props) => (
  <ScrollBar {...args}>
    <div
      contentEditable
      style={{
        width: "500px",
        height: "500px",
        background: "rgba(0,0,0,0.05)",
      }}
    >
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat aliquam
      modi ratione ad, libero nisi voluptate ex ipsam consectetur optio facilis
      illum doloremque a nulla eveniet ullam maiores. Iure, iste! Lorem ipsum
      dolor sit, amet consectetur adipisicing elit. Fugiat aliquam modi ratione
      ad, libero nisi voluptate ex ipsam consectetur optio facilis illum
      doloremque a nulla eveniet ullam maiores. Iure, iste! Lorem ipsum dolor
      sit, amet consectetur adipisicing elit. Fugiat aliquam modi ratione ad,
      libero nisi voluptate ex ipsam consectetur optio facilis illum doloremque
      a nulla eveniet ullam maiores. Iure, iste! Lorem ipsum dolor sit, amet
      consectetur adipisicing elit. Fugiat aliquam modi ratione ad, libero nisi
      voluptate ex ipsam consectetur optio facilis illum doloremque a nulla
      eveniet ullam maiores. Iure, iste! Lorem ipsum dolor sit, amet consectetur
      adipisicing elit. Fugiat aliquam modi ratione ad, libero nisi voluptate ex
      ipsam consectetur optio facilis illum doloremque a nulla eveniet ullam
      maiores. Iure, iste! Lorem ipsum dolor sit, amet consectetur adipisicing
      elit. Fugiat aliquam modi ratione ad, libero nisi voluptate ex ipsam
      consectetur optio facilis illum doloremque a nulla eveniet ullam maiores.
      Iure, iste! Lorem ipsum dolor sit, amet consectetur adipisicing elit.
      Fugiat aliquam modi ratione ad, libero nisi voluptate ex ipsam consectetur
      optio facilis illum doloremque a nulla eveniet ullam maiores. Iure, iste!
    </div>
  </ScrollBar>
);
