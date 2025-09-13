import React from "react";
import {
  CodeTwoTone,
  EditTwoTone,
  SmileTwoTone,
  HeartTwoTone,
  StarTwoTone,
} from "@ant-design/icons";
import { LuTrash } from "react-icons/lu";

export default function Icon() {
  return (
    <div className="effectIcon">
      <LuTrash className="icon icon1 text-red-500" />
      <CodeTwoTone twoToneColor="#6611dd" className="icon icon2" />
      <EditTwoTone twoToneColor="#27f5eb" className="icon icon3" />
      <SmileTwoTone twoToneColor="#0f0" className="icon icon4" />
      <HeartTwoTone twoToneColor="#eb2f96" className="icon icon5" />
      <StarTwoTone twoToneColor="#f0ff03" className="icon icon6" />
    </div>
  );
}
