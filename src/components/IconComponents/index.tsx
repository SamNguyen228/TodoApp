import React from "react";
import { Button } from "antd";
import {
  CodeTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  SmileTwoTone,
  HeartTwoTone,
  StarTwoTone,
} from "@ant-design/icons";

export default function Icon() {
  return (
    <div className="effectIcon">
      <Button className="icon icon1" type="link" icon={<DeleteTwoTone twoToneColor="#ff0033" />} />
      <Button className="icon icon2" type="link" icon={<CodeTwoTone twoToneColor="#6611dd" />} />
      <Button className="icon icon3" type="link" icon={<EditTwoTone twoToneColor="#27f5eb"/>} />
      <Button className="icon icon4" type="link" icon={<SmileTwoTone twoToneColor="#0f0"/>} />
      <Button className="icon icon5" type="link" icon={<HeartTwoTone twoToneColor="#eb2f96" />} />
      <Button className="icon icon6" type="link" icon={<StarTwoTone twoToneColor="#f0ff03" />} />
    </div>
  );
}
