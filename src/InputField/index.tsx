import React from "react";
import * as style from "./styles.scss";

export interface Props {
  /**
   * placeholder text
   */
  placeholder?: string;
}
/**
 *
 * Default Component numerical input.
 *
 *
 */
export default function InputField({ placeholder }: Props) {
  return (
    <div className={style.container}>
      <input placeholder={placeholder} className={style.input} />
    </div>
  );
}
