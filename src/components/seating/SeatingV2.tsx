import React, { useEffect, useState } from "react";
import Seat from "./Seat"; // Assuming you have a Seat component
import { SeatType } from "./types"; // Assuming you have defined the SeatType
import { socket } from "../../utils/socket";
import Legend from "../legend/Legend";
import { generateSeats } from "@/utils/seats";
import Title from "../title/Title";
import { RegisterFieldsType } from "../register/types";
import Sidebarv3 from "../sidebar/SidebarV3";

const numCols = 6;

export default function SeatingV2({ aNumber }: { aNumber: string }) {
  const [seatChecked, setSeatChecked] = useState<number | undefined>(undefined);
  const [seatList, setseatList] = useState<SeatType[]>(generateSeats(numCols));
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registeredPeople, setregisteredPeople] = useState<
    RegisterFieldsType[]
  >([]);

  function updateSeatsSocket(heldSeats: { [id: string]: number }) {
    // Extract all held seats from the heldSeats object
    const _seats = heldSeats;
    delete _seats[aNumber];
    const allHeldSeats = Object.values(_seats).flat();
    const updatedSeats = seatList.map((seat) => {
      const isSeatOnHold =
        allHeldSeats.findIndex((value) => value === seat.id) !== -1;

      return {
        ...seat,
        isOnHold: isSeatOnHold,
      };
    });

    setseatList(updatedSeats);
  }

  function updateSeats(socketRegisters: {
    [ntNumber: string]: RegisterFieldsType[];
  }) {
    let updatedSeats = generateSeats(numCols);
    Object.keys(socketRegisters).forEach((ntNumber) => {
      const registeredSeat = socketRegisters[ntNumber];
      const _updatedSeats = updatedSeats.map((seat) => {
        const reg = registeredSeat.findIndex(
          (person) => seat.id === person.seatNumber
        );
        if (reg !== -1) {
          const p = registeredSeat[reg];
          return {
            ...seat,
            firstName: p.firstName,
            lastName: p.lastName,
            isYours: aNumber === ntNumber,
          };
        }

        return seat;
      });
      updatedSeats = _updatedSeats;
    });

    setseatList(updatedSeats);
  }

  useEffect(() => {
    socket.emit("giveMeSeats", aNumber);
  }, []);

  useEffect(() => {
    socket.on("userHoldSeats", (heldSeats: { [id: string]: number }) => {
      updateSeatsSocket(heldSeats);
    });

    socket.on("updateRegisteredSeats", (registeredSeats) => {
      if (registeredSeats[aNumber])
        setregisteredPeople(registeredSeats[aNumber]);

      updateSeats(registeredSeats);
    });

    return () => {
      socket.off("connect");
      socket.off("userHoldSeats");
    };
  }, [seatList, setseatList]);

  // Function to update the occupant of a specific seat by id
  const updateSeat = (
    idToUpdate: number,
    newOccupant?: string,
    isOnHold?: boolean
  ) => {
    const updatedSeats = seatList.map((seat) => {
      if (seat.id === idToUpdate) {
        return {
          ...seat,
          occupant: newOccupant !== undefined ? newOccupant : seat.firstName,
          isOnHold: isOnHold !== undefined ? isOnHold : seat.isOnHold,
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
    // Tell socket we are holding new seats
    socket.emit("HoldingNewSeats", aNumber, seatChecked);

    return () => {
      socket.off("HoldingNewSeats");
    };
  }, [seatChecked]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex relative justify-start gap-12 mr-[364px]">
        <Title />
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
                    onHold={seat.isOnHold}
                    occupant={seat.firstName || ""}
                    highlight={seat.isYours}
                    id={seat.id}
                    selectSeat={() => {
                      return setSeatChecked(
                        seatChecked === seat.id ? undefined : seat.id
                      );
                    }} // Pass the seat ID to the toggle function
                    key={seat.id}
                    isSelected={seatChecked === seat.id}
                  />
                ))}
            </div>
          ))}
        </div>
        <Sidebarv3
          setSelectedSeat={(seatNumber: number) => {
            setSeatChecked(seatNumber);
          }}
          deletePerson={(seatNumber: number) => {
            const personIndex = registeredPeople.findIndex(
              (person) => person.seatNumber === seatNumber
            );

            if (personIndex !== -1) {
              const updatedPeople = [...registeredPeople];
              updatedPeople.splice(personIndex, 1); // Remove the person at personIndex
              setregisteredPeople(updatedPeople);
              socket.emit("updateRegisteredSeats", aNumber, updatedPeople);
            }
          }}
          registeredPeople={registeredPeople}
          updateRegisteredPeople={(person) => {
            const personIndex = registeredPeople.findIndex(
              (p) =>
                p.seatNumber === person.seatNumber ||
                (p.firstName === person.firstName &&
                  p.lastName === person.lastName)
            );

            if (personIndex !== -1) {
              // Person exists, update their data
              const updatedPeople = [...registeredPeople];

              updatedPeople[personIndex] = person;
              setSeatChecked(undefined);
              socket.emit("updateRegisteredSeats", aNumber, updatedPeople);
            } else {
              let d = registeredPeople;
              d.push(person);
              setSeatChecked(undefined);
              socket.emit("updateRegisteredSeats", aNumber, d);
            }
          }}
          selectedSeat={seatChecked}
          firstName={firstName}
          lastName={lastName}
          setFirstName={setFirstName}
          setLastName={setLastName}
        />
      </div>
    </div>
  );
}
