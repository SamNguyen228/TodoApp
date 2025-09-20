"use client";

import React from "react";
import { FaReact, FaAngular, FaNodeJs } from "react-icons/fa";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { SiSpringboot } from "react-icons/si";

const icons = [
  <FaReact key="react" className="mx-8 text-[80px] text-blue-500" />,
  <FaAngular key="angular" className="mx-8 text-[80px] text-red-500" />,
  <FaNodeJs key="node" className="mx-8 text-[80px] text-green-600" />,
  <RiTailwindCssFill key="tailwind" className="mx-8 text-[80px] text-cyan-300" />,
  <RiNextjsFill key="next" className="mx-8 text-[80px] text-black" />,
  <SiSpringboot key="spring" className="mx-8 text-[80px] text-green-800" />,
];

function Row({ top, reverse }: { top: string; reverse?: boolean }) {
  return (
    <div className={`absolute ${top} w-full rotate-[15deg] overflow-hidden`}>
      <div className={`flex ${reverse ? "marquee-reverse" : "animate-marquee"} whitespace-nowrap`}>
        {[...Array(4)].map((_, i) =>
          icons.map((icon) => React.cloneElement(icon, { key: `${icon.key}-${i}` }))
        )}
      </div>
    </div>
  );
}

export default function CarouselBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-35 pointer-events-none">
      <Row top="top-[0]" />
      <Row top="top-[20%]" reverse />
      <Row top="top-[40%]" />
      <Row top="top-[60%]" reverse />
      <Row top="top-[80%]" />
      <Row top="top-[100%]" reverse />
    </div>
  );
}
