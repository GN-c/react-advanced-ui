import React, { useRef, useState } from "react";
import style from "./styles.scss";

import { map, clamp, DegToRad, RadToDeg, snapToClosest } from "../Math";
import { prefix } from "inline-style-prefixer";

export interface Props {
  /**
   * min value
   */
  min: number;
  /**
   * max value
   */
  max: number;
  /**
   * default value
   */
  defaultValue?: number;
  /**
   * number of steps, if provided slider will turn to stepped slider, default off , min - 2
   */
  stepCount?: number;
  /**
   * angle offset from bottom in degrees, default to 30 degrees min - 1 max - 360
   */
  angleOffset?: number;
  /**
   * fires on change start
   */
  onChangeStart?: (value: number) => void;
  /**
   * fires on change
   */
  onChange?: (value: number) => void;
  /**
   * fires on change end
   */
  onChangeEnd?: (value: number) => void;
  /**
   * resets slider to default value on end
   */
  resetOnEnd?: boolean;
  /**
   * display text, default to true
   */
  displayText?: boolean;
  /**
   * text suffix
   */
  suffix?: string;
  /**
   * text round precision
   */
  textRoundPrecision?: number;
  /**
   * disabled
   */
  disabled?: boolean;
}
/**
 *
 * Radial Slider numerical input.
 *
 * you can change this to stepped slider by specifying stepCount
 */
export default function RadialSlider({
  min = 100,
  max = 200,
  angleOffset = 30,
  defaultValue = min,
  stepCount,
  onChange,
  onChangeEnd,
  onChangeStart,
  resetOnEnd = false,
  displayText = true,
  suffix = "",
  textRoundPrecision = 0,
  disabled,
}: Props) {
  if (min > max) throw "RadialSlider : incorrect Min Max values";
  if (defaultValue > max || defaultValue < min)
    throw new RangeError(
      "RadialSlider: default value must be between min and max"
    );
  if (stepCount && stepCount < 2)
    throw new RangeError(
      "RadialSlider: stepCount must be greater or equal to 2"
    );
  ////
  const [state, setState] = useState({
    active: false,
    value: stepCount
      ? snapToClosest(map(defaultValue, min, max, 0, 1), 1 / (stepCount - 1), 0)
      : map(defaultValue, min, max, 0, 1),
  });
  const innerDiv = useRef(null);

  function handleMouseDown() {
    if (disabled) return;
    setState({ ...state, active: true });
    onChangeStart && onChangeStart(map(state.value, 0, 1, min, max));
  }

  function handleMouseMove(e: any) {
    if (!state.active) return;
    let bounds = innerDiv.current.getBoundingClientRect();
    let x = clamp(e.clientX - bounds.left, 0, bounds.width) - bounds.width / 2;
    let y =
      -clamp(e.clientY - bounds.top, 0, bounds.height) +
      bounds.height / (1 + Math.max(0, Math.cos(angleOffset)));
    let value = map(
      clamp(Math.atan2(x, y) + Math.PI, angleOffset, 2 * Math.PI - angleOffset),
      angleOffset,
      2 * Math.PI - angleOffset,
      0,
      1
    );
    if (stepCount) value = snapToClosest(value, 1 / (stepCount - 1), 0);
    if (stepCount && value === state.value) return;
    setState({
      ...state,
      value,
    });
    onChange && onChange(map(value, 0, 1, min, max));
  }

  function handleMouseUp() {
    if (!state.active) return;

    setState({ value: resetOnEnd ? 0 : state.value, active: false });
    onChangeEnd && onChangeEnd(map(state.value, 0, 1, min, max));
  }

  angleOffset = angleOffset * DegToRad;
  let widthFraction = 2 * Math.sin(clamp(angleOffset, Math.PI / 2, Math.PI)); // 0 - 2
  let heightFraction = 1 + Math.max(0, Math.cos(angleOffset)); // 0 - 2
  let strokeHalfWidth = 100 / 32 / clamp(heightFraction, 0, 1);
  let radius = 50 - strokeHalfWidth;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={
        disabled ? style.container + " " + style.disabled : style.container
      }
    >
      <div
        ref={innerDiv}
        style={prefix({
          width: 5.625 * widthFraction + 0.75 + "em",
          height: 5.625 * Math.max(1, heightFraction) + 0.75 + "em",
        })}
      >
        {displayText && (
          <span
            className={style.text}
            style={prefix({
              top:
                100 *
                  ((radius + strokeHalfWidth) /
                    (heightFraction * radius + 2 * strokeHalfWidth)) +
                "%",
            })}
          >
            {map(state.value, 0, 1, min, max).toFixed(textRoundPrecision) +
              suffix}
          </span>
        )}
        <svg
          viewBox={`${0} 0 ${widthFraction * radius + strokeHalfWidth * 2} ${
            Math.max(1, heightFraction) * radius + strokeHalfWidth * 2
          }`}
          preserveAspectRatio="xMidYMin"
          className={style.svgContainer}
        >
          <path
            strokeWidth={2 * strokeHalfWidth}
            d={`M ${
              strokeHalfWidth +
              (1 - Math.sin(clamp(angleOffset, 0, Math.PI / 2))) * radius
            } ${
              strokeHalfWidth + (1 + Math.cos(angleOffset)) * radius
            } a ${radius} ${radius} 0 ${angleOffset > Math.PI / 2 ? 0 : 1} 1 ${
              2 * Math.sin(angleOffset) * radius
            } 0
            `}
          />
          <path
            strokeWidth={2 * strokeHalfWidth}
            d={`M ${
              strokeHalfWidth +
              (1 - Math.sin(clamp(angleOffset, 0, Math.PI / 2))) * radius
            } ${
              strokeHalfWidth + (1 + Math.cos(angleOffset)) * radius
            } a ${radius} ${radius} 0 ${angleOffset > Math.PI / 2 ? 0 : 1} 1 ${
              2 * Math.sin(angleOffset) * radius
            } 0
            `}
            style={prefix({
              transition: stepCount ? "all 0.3s" : "none",
              strokeDasharray:
                state.value * 2 * (Math.PI - angleOffset) * radius +
                " " +
                2 * (Math.PI - angleOffset) * radius,
            })}
          />
        </svg>

        {stepCount &&
          [...Array(stepCount - 2)].map((_, index) => {
            return (
              <div
                className={style.step}
                style={prefix({
                  left:
                    100 *
                      ((radius * (widthFraction / 2) + strokeHalfWidth / 2) /
                        (widthFraction * radius + 2 * strokeHalfWidth)) +
                    "%",
                  top:
                    100 *
                      ((radius + strokeHalfWidth / 2) /
                        (heightFraction * radius + 2 * strokeHalfWidth)) +
                    "%",
                  transform: `rotate(${map(
                    index + 1,
                    0,
                    stepCount - 1,
                    -(Math.PI / 2 - angleOffset) * RadToDeg,
                    (Math.PI + Math.PI / 2 - angleOffset) * RadToDeg
                  )}deg) translateX(-5.625em) `,
                })}
              ></div>
            );
          })}
        <div
          onMouseDown={handleMouseDown}
          className={
            style.thumb + (state.active ? " " + style.activeThumb : "")
          }
          style={prefix({
            left:
              100 *
                ((radius * (widthFraction / 2) - strokeHalfWidth) /
                  (widthFraction * radius + 2 * strokeHalfWidth)) +
              "%",
            top:
              100 *
                ((radius - strokeHalfWidth) /
                  (heightFraction * radius + 2 * strokeHalfWidth)) +
              "%",
            transform: `rotate(${map(
              state.value,
              0,
              1,
              -(Math.PI / 2 - angleOffset) * RadToDeg,
              (Math.PI + Math.PI / 2 - angleOffset) * RadToDeg
            )}deg) translateX(-5.625em) `,
            transition: stepCount ? "all 0.3s" : "none",
          })}
        ></div>
      </div>
    </div>
  );
}
