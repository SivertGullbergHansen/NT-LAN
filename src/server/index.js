const { Server } = require("socket.io");

const heldSeats = {};

const io = new Server(3005, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`User(${socket.id.substring(0, 4)}) connected!`);

  socket.on("disconnect", () => {
    delete heldSeats[socket.id];

    // Extract all held seats from the updated heldSeats object
    const allHeldSeats = Object.values(heldSeats).flat();
  
    // Emit the updated list of held seats to all users
    socket.broadcast.emit("userHoldSeats", allHeldSeats);
  });

  socket.on("HoldingNewSeats", (seats) => {
    console.log(
      `User(${socket.id.substring(0, 4)}) holding current seats: ${seats}`
    );
  
    // Store the held seats for the current user
    heldSeats[socket.id] = seats;
  
    // Extract all held seats from the heldSeats object
    const allHeldSeats = Object.values(heldSeats).flat();

    console.log(allHeldSeats);
  
    // Emit the list of held seats to all users
    socket.broadcast.emit("userHoldSeats", allHeldSeats);
  });
});

console.log("Server running at port 3005");
