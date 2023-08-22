import React, { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { confettiProps } from "@/utils/confetti";
import { InputBoxType, SidebarProps } from "./props";

export default function Sidebar({
  seatsSelected,
  setHighlight,
  updateSeat,
  seats,
  successFunction,
}: SidebarProps) {
  const [inputBoxes, setInputBoxes] = useState<InputBoxType>({});
  const [textBoxesSelected, setTextBoxesSelected] = useState<number[]>([]);
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [isFinished, setisFinished] = useState(false);

  useEffect(() => {
    if (textBoxesSelected.length === 0) setHighlight(-1);
  }, [setHighlight, textBoxesSelected, seatsSelected]);

  useEffect(() => {
    const seatOccupantValues: InputBoxType = {};

    seatsSelected.forEach((value) => {
      const seatIndex = seats.findIndex((seat) => seat.id === value);
      seatOccupantValues[value] = seats[seatIndex].occupant;
    });

    setInputBoxes(seatOccupantValues);
  }, [seats, seatsSelected]);

  const handleInputChange = (id: number, newValue: string) => {
    setInputBoxes((prevInputBoxes) => ({
      ...prevInputBoxes,
      [id]: newValue || '',
    }));

    updateSeat(id, newValue);
  };

  let selected = seatsSelected.sort((a, b) => a - b);

  return (
    <div className="bg-zinc-700 w-[300px] h-[792px] relative transition-all shadow rounded-2xl py-12 px-8 flex flex-col justify-start items-center gap-6 right-6">
      {!isFinished ? (
        <>
          <h2 className="font-medium">
            {seatsSelected.length === 0 ? (
              <span>
                Ingen plasser valgt.
                <br />
                <br />
                Trykk på ønsket plass for å komme i gang :)
              </span>
            ) : (
              "Hvem sitter på plassen?"
            )}
          </h2>
          <div className="flex flex-col gap-6 overflow-auto">
            {selected.map((id) => (
              <div key={id} className="flex flex-col gap-1 w-[236px]">
                <label htmlFor={`input_${id}`}>Plass {id + 1}:</label>
                <input
                  disabled={!submitEnabled}
                  name={`input_${id}`}
                  maxLength={12}
                  className="w-full capitalize rounded bg-zinc-800 p-2 border-2 focus:border-[#91FFC3] border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  value={inputBoxes[id] || ""}
                  onChange={(event) =>
                    handleInputChange(id, event.target.value)
                  }
                  onFocus={() => {
                    setHighlight(id);
                    setTextBoxesSelected((old) => [...old, id]);
                  }}
                  onBlur={() => {
                    setTextBoxesSelected((old) =>
                      old.filter((oldId) => oldId !== id)
                    );
                  }}
                />
              </div>
            ))}
          </div>
          {seatsSelected.length > 0 && (
            <button
              disabled={!submitEnabled}
              onClick={() => {
                setSubmitEnabled(false);
                successFunction();
                setisFinished(true);

                setTimeout(() => {
                  setisFinished(false);
                setSubmitEnabled(true);
              }, 2000);
              }}
              className="py-3 px-5 flex content-center items-center bg-[#91FFC3] relative rounded-3xl font-medium text-gray-900 active:scale-95 transition-all duration-[50ms] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Oppdater
            </button>
          )}
        </>
      ) : (
          <span className="relative">Done :)
          {<ConfettiExplosion {...confettiProps} />}
          </span>
      )}
    </div>
  );
}
