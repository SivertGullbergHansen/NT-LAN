"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io"); // Import Server and Socket types
var db_1 = require("./utils/db");
var heldSeats = {};
var registeredSeats = {};
var idList = {};
var serverPort = 3004;
// Database
var databaseUrl = "http://lan-party-seating.apps.ocpdq02.norsk-tipping.no"; // Replace with your actual database URL
var username = "admin";
var password = "IAMthecaptainnow100";
var db = new db_1.default(databaseUrl, username, password);
// Initialize server
var io = new socket_io_1.Server(serverPort, {
    cors: {
        origin: "*",
    },
});
io.on("connection", function (socket) {
    var _a;
    console.log("User(".concat((_a = socket.id) === null || _a === void 0 ? void 0 : _a.substring(0, 4), ") connected!"));
    idList[socket.id] = "";
    socket.on("disconnect", function () {
        var _a;
        if (idList[socket.id] && heldSeats[idList[socket.id]]) {
            delete heldSeats[idList[socket.id]];
            delete idList[socket.id];
        }
        console.log("User(".concat((_a = socket.id) === null || _a === void 0 ? void 0 : _a.substring(0, 4), ") disconnected!"));
        // Emit the updated list of held seats to all users
        io.emit("userHoldSeats", heldSeats);
    });
    socket.on("giveMeSeats", function (aNumber) {
        // When user loads map
        socket.emit("updateRegisteredSeats", registeredSeats);
        socket.emit("userHoldSeats", heldSeats);
        idList[socket.id] = aNumber;
    });
    socket.on("HoldingNewSeats", function (aNumber, heldSeat) {
        // When user is holding new seat
        heldSeats[aNumber] = heldSeat;
        // Emit the updated list of held seats to all users
        io.emit("userHoldSeats", heldSeats);
    });
    socket.on("updateRegisteredSeats", function (aNumber, registeredPeople) {
        // A user has now changed their registered Seats, so let's broadcast it to everyone
        console.log(aNumber, "has registered these", registeredPeople);
        registeredSeats[aNumber] = registeredPeople;
        io.emit("updateRegisteredSeats", registeredSeats);
    });
    socket.on("updateUser", function (userId, updatedUser) { return __awaiter(void 0, void 0, void 0, function () {
        var user, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db.updateEmployee({})];
                case 1:
                    user = _a.sent();
                    // Handle the updated user data as needed
                    io.emit("userUpdated", user); // Emit an event to inform clients about the update
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
});
console.log("Server running at port", serverPort);
