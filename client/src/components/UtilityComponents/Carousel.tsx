import Slider from "react-slick";
import type { CarouselProps } from "../../types";

export default function Carousel({
  children,
  settings,
  className,
}: CarouselProps) {
  return (
    <>
      <div className={className}>
        <Slider {...settings}>{children}</Slider>
      </div>
    </>
  );
}
