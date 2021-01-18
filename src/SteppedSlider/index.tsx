import React, { useRef, useEffect } from "react";
import style from "./styles.scss";

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
   * number of steps
   */
  stepCount: number;
  /**
   * default value
   */
  defaultValue?: number;
  /**
   * css width, default to 12em
   */
  width?: string;
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
}
/**
 * discrete slider for stepped numerical input
 */
export default function SteppedSlider({
  min = 0,
  max = 1,
  stepCount = 4,
  onChange,
  onChangeEnd,
  onChangeStart,
  defaultValue = 0.5,
  resetOnEnd = false,
}: Props) {
  if (min > max) throw "Slider : incorrect Min Max values";
  const track = useRef(null);
  const thumbRef = useRef(null);
  let thumb: any;
  const trackHighlighted = useRef(null);
  let value = defaultValue || min;
  let lastValue = value;

  useEffect(() => {
    if (defaultValue) {
      let x =
        (Math.round((defaultValue - min) / ((max - min) / (stepCount - 1))) /
          (stepCount - 1)) *
        track.current.getBoundingClientRect().width;
      thumbRef.current.style.left = x + "px";
      trackHighlighted.current.style.width = x + "px";
    }
  }, []);
  function onMouseDown(e: any) {
    thumb = e.target;
    thumb.classList.add(style.activeThumb);
    onChangeStart && onChangeStart(value);
  }
  function onMouseMove(e: any) {
    if (thumb) {
      let bounds = track.current.getBoundingClientRect();
      lastValue = value;
      let fraction =
        Math.round(
          Math.max(0, Math.min(bounds.width, e.clientX - bounds.left)) /
            (bounds.width / (stepCount - 1))
        ) /
        (stepCount - 1);
      value = (max - min) * fraction + min;
      if (lastValue !== value) {
        trackHighlighted.current.style.width = fraction * bounds.width + "px";
        thumb.style.left = fraction * bounds.width + "px";
        onChange && lastValue !== value && onChange(value);
      }
    }
  }

  function onMouseUp() {
    if (!thumb) return;
    onChangeEnd && onChangeEnd(value);
    if (resetOnEnd) {
      let x =
        (Math.round((defaultValue - min) / ((max - min) / (stepCount - 1))) /
          (stepCount - 1)) *
        track.current.getBoundingClientRect().width;
      thumb.style.left = x + "px";
      trackHighlighted.current.style.width = x + "px";
      value = defaultValue;
    }
    thumb.classList.remove(style.activeThumb);
    thumb = undefined;
  }

  return (
    <div
      className={style.container}
      onMouseMove={onMouseMove}
      onTouchMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div ref={track} className={style.track}>
        <div ref={trackHighlighted} className={style.trackHighlighted}></div>
        {[...Array(stepCount - 2)].map((_: any, i: number) => (
          <div
            className={style.step}
            key={i}
            style={{ left: ((i + 1) / (stepCount - 1)) * 100 + "%" }}
          ></div>
        ))}
        <div
          ref={thumbRef}
          className={style.thumb}
          onMouseDown={onMouseDown}
          onTouchStart={onMouseDown}
        ></div>
      </div>
    </div>
  );
}
