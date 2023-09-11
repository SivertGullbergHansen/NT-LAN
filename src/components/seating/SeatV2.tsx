import React, { startTransition, useEffect, useState } from "react";
import { SeatProps } from "./props";
import { mousePosition, useMousePosition } from "@/utils/useMousePosition";
import { useMouseButtonDown } from "@/utils/useMouseButtonDown";

export default function Seat({
  isSelected,
  selectSeat,
  id,
  highlight,
  occupant,
  isDisabled,
  onHold,
}: SeatProps) {
  const [isDragging, setisDragging] = useState(false);
  const [startPosition, setstartPosition] = useState<mousePosition>({
    x: null,
    y: null,
  });
  const [offset, setOffset] = useState<mousePosition>({
    x: null,
    y: null,
  });
  const [boxSize, setboxSize] = useState<mousePosition>({ x: null, y: null });
  const mousePosition = useMousePosition();
  const mouseButtonDown = useMouseButtonDown();
  const seatNumberClassName =
    "absolute text-sm top-0 right-0 px-2 py-1 font-extralight";

  useEffect(() => {
    if (
      mouseButtonDown &&
      startPosition.x &&
      startPosition.y &&
      mousePosition.x &&
      mousePosition.y
    ) {
      if (
        Math.abs(startPosition.x - mousePosition.x) > 6 ||
        Math.abs(startPosition.y - mousePosition.y) > 6
      ) {
        setisDragging(true);
      }
    }

    if (!mouseButtonDown && isDragging) {
      setstartPosition({ x: null, y: null });
      setOffset({ x: null, y: null });
      setisDragging(false);
      setboxSize({ x: null, y: null });
    }
  }, [isDragging, mouseButtonDown, mousePosition, startPosition]);

  return (
    <>
      {isDragging &&
        mousePosition.x &&
        mousePosition.y &&
        offset.x &&
        offset.y && (
          <span
            style={{
              width: boxSize.x + "px",
              height: boxSize.y + "px",
              left: mousePosition.x - offset.x + "px",
              top: mousePosition.y - offset.y + "px",
              cursor: "grabbing",
            }}
            className={`fixed z-10 opacity-70 flex items-center justify-center select-none capitalize truncate whitespace-nowrap 2xl:px-4 text-sm 2xl:text-lg font-medium rounded-lg
      ${
        onHold
          ? "border-2 border-[#FF5797] text-[#FF5797] hover:cursor-not-allowed"
          : ""
      } 
      ${isDisabled && "cursor-not-allowed"}
      ${
        !onHold &&
        (isSelected
          ? "bg-[#91FFC3] text-gray-900"
          : highlight
          ? "bg-[#D7AAFF] text-gray-900"
          : occupant.length > 0
          ? "border-2 border-[#FF5797] cursor-grab text-[#FF5797]"
          : "border-[#E7E4ED] border")
      }
          `}
          >
            {occupant}
            <p
              className={`${seatNumberClassName} ${
                isSelected || highlight ? "opacity-100" : "opacity-75"
              }`}
            >
              {id + 1}
            </p>
          </span>
        )}

      <button
        disabled={onHold || (!highlight && occupant !== "") || isDisabled}
        onClick={() => {
          selectSeat(id);
          setstartPosition({ x: null, y: null });
          setOffset({ x: null, y: null });
          setboxSize({ x: null, y: null });
          setisDragging(false);
        }}
        onMouseDown={(event: any) => {
          if (highlight) {
            const rect = event.target.getBoundingClientRect();
            setboxSize({
              x: event.target.offsetWidth,
              y: event.target.offsetHeight,
            });
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;

            setOffset({ x: offsetX, y: offsetY });
            setstartPosition(mousePosition);
          }
        }}
        className={`${
          isDragging && "opacity-0"
        } w-full h-[64px] flex-1 select-none relative capitalize disabled:transition-none disabled:scale-100 disabled:cursor-not-allowed truncate whitespace-nowrap 2xl:px-4 text-sm 2xl:text-lg font-medium rounded-lg
      ${
        onHold
          ? "border-2 border-[#FF5797] text-[#FF5797] hover:cursor-not-allowed"
          : "active:scale-95 transition-all duration-[100ms]"
      } 
      ${isDisabled && "cursor-not-allowed"}
      ${
        !onHold &&
        (isSelected
          ? "bg-[#91FFC3] text-gray-900"
          : highlight
          ? "bg-[#D7AAFF] text-gray-900"
          : occupant.length > 0
          ? "border-2 border-[#FF5797] cursor-grab text-[#FF5797]"
          : "border-[#E7E4ED] border")
      }
          `}
      >
        {occupant}
        <p
          className={`${seatNumberClassName} ${
            isSelected || highlight ? "opacity-100" : "opacity-75"
          }`}
        >
          {id + 1}
        </p>
      </button>
    </>
  );
}
