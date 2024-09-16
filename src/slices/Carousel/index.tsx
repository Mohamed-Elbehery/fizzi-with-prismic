"use client";

import FloatingCan from "@/components/FloatingCan";
import * as THREE from "three";
import clsx from "clsx";
import gsap from "gsap";

import { Bounded } from "@/components/Bounded";
import { FLAVORS } from "@/constants/flavors";
import { Content } from "@prismicio/client";
import { PrismicText, SliceComponentProps } from "@prismicio/react";
import { Center, Environment, View } from "@react-three/drei";
import { useRef, useState } from "react";
import { ArrowIcon } from "./ArrowIcon";
import { WavyCircles } from "./WavyCircles";


const SPINS_ON_CHANGE = 8;

/**
 * Props for `Carousel`.
 */
export type CarouselProps = SliceComponentProps<Content.CarouselSlice>;

/**
 * Component for "Carousel" Slices.
 */
const Carousel = ({ slice }: CarouselProps): JSX.Element => {
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0);
  const sodaCanRef = useRef<THREE.Group>(null);

  function changeFlavor(index: number) {
    if (!sodaCanRef.current) return;

    const nextIndex = (index + FLAVORS.length) % FLAVORS.length;

    const tl = gsap.timeline();

    tl
      .to(sodaCanRef.current.rotation, {
        y: index > currentFlavorIndex
          ? `-=${Math.PI * 2 * SPINS_ON_CHANGE}`
          : `+=${Math.PI * 2 * SPINS_ON_CHANGE}`,
        ease: "power2.inOut",
        duration: 1,
      }, 0)
      .to(".background, .wavy-circles-inner, .wavy-circles-outer", {
        backgroundColor: FLAVORS[nextIndex]?.color,
        fill: FLAVORS[nextIndex]?.color,
        ease: "power2.inOut",
        duration: 1,
      }, 0)
      .to(".text-wrapper", { duration: 0.2, y: -10, opacity: 0 }, 0)
      .to({}, { onStart: () => setCurrentFlavorIndex(nextIndex) }, 0.5)
      .to(".text-wrapper", { duration: 0.2, y: 0, opacity: 1 }, 0.7);
  }

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="carousel relative grid h-screen grid-rows-[auto,4fr,auto] justify-center overflow-hidden bg-white py-12 text-white"
    >
      {/* Background */}
      <div className="background pointer-events-none absolute inset-0 bg-[#710523] opacity-50" />

      {/* Wavy Circles */}
      <WavyCircles className="absolute left-1/2 top-1/2 h-[120vmin] -translate-x-1/2 -translate-y-1/2 text-[#710523]" />

      <h2 className="relative text-center text-5xl font-bold">
        <PrismicText field={slice.primary.heading} />
      </h2>

      <div className="grid grid-cols-[auto,auto,auto] items-center">
        {/* Left */}
        <ArrowButton onClick={() => changeFlavor(currentFlavorIndex - 1)} />
        {/* Can */}
        <View className="aspect-square h-[70vmin] min-h-40">
          <Center position={[0, 0, 1.5]}>
            <FloatingCan
              ref={sodaCanRef}
              floatIntensity={0.3}
              rotationIntensity={1}
              flavor={FLAVORS[currentFlavorIndex].flavor}
            />
          </Center>

          <Environment
            files={"/hdr/lobby.hdr"}
            environmentIntensity={0.6}
            environmentRotation={[0, 3, 0]}
          />
          <directionalLight intensity={6} position={[0, 1, 1]} />
        </View>
        {/* Right */}
        <ArrowButton direction="right" label="Next Can" onClick={() => changeFlavor(currentFlavorIndex + 1)} />
      </div>

      <div className="text-area relative mx-auto text-center">
        <div className="text-wrapper text-4xl font-medium">
          <p>
            {FLAVORS[currentFlavorIndex].name}
          </p>
        </div>
        <div className="mt-2 text-2xl font-normal opacity-90">
          <PrismicText field={slice.primary.price_copy} />
        </div>
      </div>
    </Bounded>
  );
};

export default Carousel;

type ArrowButtonProps = {
  direction?: "right" | "left";
  label?: string;
  onClick: () => void;
}

function ArrowButton({ direction = "left", label = "Previous Can", onClick }: ArrowButtonProps) {
  return <button
    onClick={onClick}
    className="size-12 rounded-full border-2 border-white bg-white/10 hover:bg-white/25 transition-colors p-3 opacity-85 ring-white focus:outline-none focus-visible:opacity-100 focus-visible:ring-4 md:size-16 lg:size-20"
    title={label}
  >
    <ArrowIcon className={clsx(direction === "right" && "-scale-x-100")} />
    <span className="sr-only">label</span>
  </button>
}