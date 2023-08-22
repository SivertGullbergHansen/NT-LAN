import React, { useEffect, useState } from "react";
import Seat from "./Seat"; // Assuming you have a Seat component
import { SeatType } from "./types"; // Assuming you have defined the SeatType
import Sidebar from "../sidebar/Sidebar";
import Legend from "../legend/Legend";
import ConfettiExplosion from 'react-confetti-explosion';
import { confettiProps } from '@/utils/confetti';
import { generateSeats } from "@/utils/seats";

const numCols = 6;

export default function Seating() {
  const [seatsChecked, setSeatsChecked] = useState<number[]>([]);
  const [highlightedSeat, sethighlightedSeat] = useState<number>(-1);
  const [seatList, setseatList] = useState<SeatType[]>(generateSeats(numCols));
  const [isExploding, setIsExploding] = useState(false);

  // Function to update the occupant of a specific seat by id
  const updateSeatOccupant = (idToUpdate: number, newOccupant: string) => {
    const updatedSeats = seatList.map((seat) => {
      if (seat.id === idToUpdate) {
        return {
          ...seat,
          occupant: newOccupant,
        };
      }
      return seat;
    });

    setseatList(updatedSeats);
  };

  useEffect(() => {
    const updatedSeats = seatList.map((seat) => {
      if (seat.id === 4) {
        return {
          ...seat,
          occupant: "Sivert",
        };
      }
      if (seat.id === 5) {
        return {
          ...seat,
          occupant: "Ronja",
        };
      }
      return seat;
    });

    setseatList(updatedSeats);
  }, []);

  useEffect(() => {
    if (
      seatsChecked.length === 0 ||
      seatsChecked.findIndex((seat) => seat === highlightedSeat) === -1
    )
      sethighlightedSeat(-1);
  }, [highlightedSeat, seatsChecked]);

  const toggleSeatSelection = (seatId: number) => {
    setSeatsChecked((prevSelectedSeats) => {
      const isSelected = prevSelectedSeats.includes(seatId);
      if (isSelected) {
        return prevSelectedSeats.filter((id) => id !== seatId); // Remove the seat if it's already selected
      } else {
        return [...prevSelectedSeats, seatId]; // Add the seat if it's not selected
      }
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex relative justify-start gap-12 mr-[364px]">
      <button
        className="font-extrabold text-3xl text-center active:scale-95 transition-all relative"
        onClick={() => {
          setIsExploding(true);
        }}
        onMouseUp={() => {
          setIsExploding(false);
        }}
        >
        NT LAN 2023
        {isExploding && <ConfettiExplosion {...confettiProps} />}
        </button>
      <Legend />
        </div>
      <div className="flex gap-16">
        <div className="flex flex-col gap-20">
          {Array.from({
            length: Math.ceil(seatList.length / (numCols * 2)),
          }).map((_, groupIndex) => (
            <div key={groupIndex} className="grid grid-cols-6 gap-3">
              {seatList
                .filter((seat) => Math.floor(seat.row / 2) === groupIndex)
                .map((seat) => (
                  <Seat
                    occupant={seat.occupant}
                    highlight={seat.id === highlightedSeat}
                    id={seat.id}
                    selectSeat={() => toggleSeatSelection(seat.id)} // Pass the seat ID to the toggle function
                    key={seat.id}
                    isSelected={seatsChecked.includes(seat.id)}
                  />
                ))}
            </div>
          ))}
        </div>
        <Sidebar
          seats={seatList}
          setHighlight={sethighlightedSeat}
          seatsSelected={seatsChecked}
          updateSeat={updateSeatOccupant}
        />
      </div>
    </div>
  );
}
