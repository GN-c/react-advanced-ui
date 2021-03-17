import React, { useEffect, useRef, useState } from "react";
import style from "./styles.scss";

import { prefix } from "inline-style-prefixer";
import { map } from "../Math";

export interface Props {
  /**
   * scrollDirection, "vertical" | "horizontal" | "both", default to "vertical"
   */
  scrollDirection?: "vertical" | "horizontal" | "both";
  /**
   * vertical scrollbar position, "right" | "left", default to "right"
   */
  verticalScrollBarPos?: "right" | "left";
  /**
   * horizontal scrollbar position, "top" | "bottom", default to "bottom"
   */
  horizontalScrollBarPos?: "top" | "bottom";
  /**
   * minHeight
   */
  minHeight?: string;
  /**
   * maxHeight
   */
  maxHeight?: string;
  /**
   * minWidth
   */
  minWidth?: string;
  /**
   * maxWidth
   */
  maxWidth?: string;
  /**
   * onScroll Event, returning scrollX and scrollY
   */
  onScroll?: (scrollX: number, scrollY: number) => void;
  /**
   * show only on Hover? default to false
   */
  hiding?: boolean;
  /**
   * scrollbar thickness, default to 0.375em
   */
  thickness?: string;
  /**
   * disable Scrolling? default to false
   */
  disabled?: boolean;
  /**
   * add padding equal to thickness around children? default to true
   */
  padding?: boolean;
  /**
   * children
   */
  children: JSX.Element;
}
/**
 * custom ScrollBar
 *
 * automatically adds Scrollbars to children
 */
export default function ScrollBar({
  scrollDirection = "vertical",
  verticalScrollBarPos = "right",
  horizontalScrollBarPos = "bottom",
  children,
  minWidth = "12em",
  maxWidth = "24em",
  minHeight = "8em",
  maxHeight = "16em",
  thickness = "0.375em",
  hiding = false,
  padding = true,
  disabled = false,
  onScroll,
}: Props) {
  const [state, setState] = useState({
    scrollingX: false,
    scrollingY: false,
    scrollX: 0,
    scrollY: 0,
    scrollXFraction: 0,
    scrollYFraction: 0,
  });
  const [negativeMargins, setNegativeMargins] = useState({ x: 0, y: 0 });
  const container = useRef(null);

  useEffect(() => {
    setNegativeMargins({
      x: container.current.offsetWidth - container.current.clientWidth,
      y: container.current.offsetHeight - container.current.clientHeight,
    });
  }, [scrollDirection, disabled]);

  useEffect(() => {
    handleOnScroll();
  }, [children]);

  function handleOnScroll() {
    onScroll &&
      onScroll(container.current.scrollLeft, container.current.scrollTop);
    setState({
      ...state,
      scrollY:
        scrollDirection !== "horizontal"
          ? container.current.scrollTop / container.current.scrollHeight
          : 0,
      scrollYFraction:
        container.current.clientHeight / container.current.scrollHeight,
      scrollX:
        scrollDirection !== "vertical"
          ? container.current.scrollLeft / container.current.scrollWidth
          : 0,
      scrollXFraction:
        container.current.clientWidth / container.current.scrollWidth,
    });
  }

  const verticalBar = useRef(null);
  const horizontalBar = useRef(null);

  function handleMouseDown(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    scrollDir: string
  ) {
    e.stopPropagation();
    if (disabled) return;
    setState({ ...state, ["scrolling" + scrollDir]: true });
  }
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (state.scrollingY) {
      container.current.scrollBy(
        0,
        map(
          e.movementY,
          0,
          verticalBar.current.offsetHeight,
          0,
          container.current.scrollHeight
        )
      );
    }
    if (state.scrollingX) {
      container.current.scrollBy(
        map(
          e.movementX,
          0,
          horizontalBar.current.offsetWidth,
          0,
          container.current.scrollWidth
        ),
        0
      );
    }
  }
  function handleScrollBarClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    scrollDir: "X" | "Y"
  ) {
    if (disabled) return;
    if (scrollDir == "Y") {
      let bounds = verticalBar.current.getBoundingClientRect();
      container.current.scrollTo(
        container.current.scrollLeft,
        map(
          e.clientY - bounds.top,
          0,
          bounds.height,
          0,
          container.current.scrollHeight,
          true
        ) -
          container.current.clientHeight / 2
      );
    }

    if (scrollDir == "X") {
      let bounds = horizontalBar.current.getBoundingClientRect();
      container.current.scrollTo(
        map(
          e.clientX - bounds.left,
          0,
          bounds.width,
          0,
          container.current.scrollWidth,
          true
        ) -
          container.current.clientWidth / 2,
        container.current.scrollTop
      );
    }
  }
  function handleMouseUp() {
    setState({ ...state, scrollingX: false, scrollingY: false });
  }
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={style.container}
      style={{
        paddingRight:
          scrollDirection !== "horizontal" &&
          verticalScrollBarPos === "right" &&
          !hiding
            ? `calc(3 * ${thickness})`
            : padding
            ? thickness
            : "0",
        paddingLeft:
          scrollDirection !== "horizontal" &&
          verticalScrollBarPos === "left" &&
          !hiding
            ? `calc(3 * ${thickness})`
            : padding
            ? thickness
            : "0",
        paddingTop:
          scrollDirection !== "vertical" &&
          horizontalScrollBarPos === "top" &&
          !hiding
            ? `calc(3 * ${thickness})`
            : padding
            ? thickness
            : "0",
        paddingBottom:
          scrollDirection !== "vertical" &&
          horizontalScrollBarPos === "bottom" &&
          !hiding
            ? `calc(3 * ${thickness})`
            : padding
            ? thickness
            : "0",
      }}
    >
      {scrollDirection !== "horizontal" && (
        <div
          className={
            style.verticalBar +
            " " +
            (hiding ? style.hiding : "") +
            " " +
            (disabled ? style.disabled : "")
          }
          ref={verticalBar}
          style={{
            ...Object.fromEntries([[verticalScrollBarPos, thickness]]),
            height:
              scrollDirection == "both"
                ? `calc(100% - 4 * ${thickness})`
                : `calc(100% - 2 * ${thickness})`,
            top:
              horizontalScrollBarPos == "top"
                ? `calc(3 * ${thickness})`
                : thickness,
            width: thickness,
            borderRadius: thickness,
          }}
          onMouseDown={(event) => handleScrollBarClick(event, "Y")}
        >
          <div
            style={{
              borderRadius: thickness,
              height: 100 * state.scrollYFraction + "%",
              top: 100 * state.scrollY + "%",
            }}
            onMouseDown={(e) => {
              handleMouseDown(e, "Y");
            }}
          ></div>
        </div>
      )}
      {scrollDirection !== "vertical" && (
        <div
          className={
            style.horizontalBar +
            " " +
            (hiding ? style.hiding : "") +
            " " +
            (disabled ? style.disabled : "")
          }
          ref={horizontalBar}
          style={{
            ...Object.fromEntries([[horizontalScrollBarPos, thickness]]),
            width:
              scrollDirection == "both"
                ? `calc(100% - 4 * ${thickness})`
                : `calc(100% - 2 * ${thickness})`,
            left:
              verticalScrollBarPos == "left"
                ? `calc(3 * ${thickness})`
                : thickness,
            height: thickness,
            borderRadius: thickness,
          }}
          onMouseDown={(event) => handleScrollBarClick(event, "X")}
        >
          <div
            style={{
              borderRadius: thickness,
              width: 100 * state.scrollXFraction + "%",
              left: 100 * state.scrollX + "%",
            }}
            onMouseDown={(e) => {
              handleMouseDown(e, "X");
            }}
          ></div>
        </div>
      )}
      <div>
        <div
          ref={container}
          onScroll={handleOnScroll}
          style={prefix({
            minHeight: `calc(${minHeight} ${
              scrollDirection !== "vertical" && !hiding
                ? `- ${padding ? "4" : "3"} * ${thickness}`
                : padding
                ? "- 2 * " + thickness
                : ""
            } ${"+ " + negativeMargins.y + "px"})`,
            maxHeight: `calc(${maxHeight} ${
              scrollDirection !== "vertical" && !hiding
                ? `- ${padding ? "4" : "3"} * ${thickness}`
                : padding
                ? "- 2 * " + thickness
                : ""
            } ${"+ " + negativeMargins.y + "px"})`,
            minWidth: `calc(${minWidth} ${
              scrollDirection !== "horizontal" && !hiding
                ? `- ${padding ? "4" : "3"} * ${thickness}`
                : padding
                ? "- 2 * " + thickness
                : ""
            } ${"+ " + negativeMargins.x + "px"})`,
            maxWidth: `calc(${maxWidth} ${
              scrollDirection !== "horizontal" && !hiding
                ? `- ${padding ? "4" : "3"} * ${thickness}`
                : padding
                ? "- 2 * " + thickness
                : ""
            } ${"+ " + negativeMargins.x + "px"})`,
            overflowX:
              !disabled &&
              (scrollDirection == "both" || scrollDirection == "horizontal")
                ? "scroll"
                : "hidden",
            overflowY:
              !disabled &&
              (scrollDirection == "both" || scrollDirection == "vertical")
                ? "scroll"
                : "hidden",

            marginRight: -negativeMargins.x + "px",
            marginBottom: -negativeMargins.y + "px",
            scrollBehavior:
              state.scrollingX || state.scrollingY ? "unset" : "smooth",
          })}
        >
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
