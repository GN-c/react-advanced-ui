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
   * default value
   */
  defaultValue?: number;
  /**
   * css width, default to 12em
   */
  width?: string;
  /**
   * fires on change star t
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
 * slider for numerical input
 */
export default function Slider({
  min = 0,
  max = 1,
  onChange,
  onChangeEnd,
  onChangeStart,
  defaultValue = 0,
  resetOnEnd = false,
}: Props) {
  if (min > max) throw "Slider : incorrect Min Max values";
  const track = useRef(null);
  const thumbRef = useRef(null);
  let thumb: any;
  const trackHighlighted = useRef(null);
  let value = defaultValue || min;
  useEffect(() => {
    if (defaultValue) {
      let x =
        (track.current.getBoundingClientRect().width * (defaultValue - min)) /
        (max - min);
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
      let x = Math.max(0, Math.min(bounds.width, e.clientX - bounds.left));
      trackHighlighted.current.style.width = x + "px";
      thumb.style.left = x + "px";
      value = (x / bounds.width) * (max - min) + min;
      onChange && onChange(value);
    }
  }

  function onMouseUp() {
    if (!thumb) return;
    onChangeEnd && onChangeEnd(value);
    if (resetOnEnd) {
      let x =
        (track.current.getBoundingClientRect().width * (defaultValue - min)) /
        (max - min);
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
