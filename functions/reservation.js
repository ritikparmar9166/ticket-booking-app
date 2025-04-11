import db from "../database/db.js";

import { JWT_SECRET } from "../config.js";
import jwt from "jsonwebtoken";


export const handleReservation = async (req,res)=>{
    const seatsRequested = req.body.seatsRequested;
  const userId = req.userId; 
  console.log("this is userId:", userId);
    // console.log(userId, seatsRequested);

    if(!userId || !seatsRequested || seatsRequested <= 0 || seatsRequested > 7){
        return res.status(400).json({message: "This is not a valid request"});
    }
    
    try {
        
        const result = await db.query(
          "SELECT seat_number FROM Seats WHERE is_booked = false ORDER BY seat_number"
        );
        const availableSeats= result.rows;
        console.log("the available seats are:", availableSeats);
    
        if (availableSeats.length < seatsRequested) {
          return res.status(400).json({   message: "Not enough seats available" });
        }
    
    
        const seatNumbers = availableSeats.map(seat => seat.seat_number);

        let chosenSeats = [];
    
        for (let i = 0; i <= seatNumbers.length - seatsRequested; i++) {
          const slice = seatNumbers.slice(i, i + seatsRequested);
          const selectedRow = Math.ceil(slice[0] / 7);

          const sameRow = slice.every(seat => {
            const rowOfSeat = Math.ceil(seat / 7);
            return rowOfSeat === selectedRow;
          });
    
          if (sameRow) {
            chosenSeats = slice;
            break;
          }
        }
    
        //in not in one row then we are giving from first available seat
        if (chosenSeats.length === 0) {
          chosenSeats = seatNumbers.slice(0, seatsRequested);
        }
    
        
        const seatUpdatePromises = chosenSeats.map(seat =>
          db.query(
            "UPDATE Seats SET is_booked = true, booked_by = $1, booked_at = CURRENT_TIMESTAMP WHERE seat_number = $2",
            [userId, seat]
          )
        );
        await Promise.all(seatUpdatePromises);
    
        res.status(200).json({
          message: "Seats successfully booked",
          seats: chosenSeats
        });
    
      } catch (error) {
        console.error("Reservation Error:", error);
        res.status(500).json({ message: "Server error during reservation" });
      }

}

export const getAllSeats = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Seats");
    const allSeats = result.rows;
    console.log("All seats:", allSeats);
    res.status(200).json(allSeats);
  } catch (error) {
    console.error("Error fetching seats:", error);
    res.status(500).json({ message: "Server error while fetching seats" });
  }

}

export const resetSeats = async (req, res) => {
    try {
        console.log("Resetting seats...");
        await db.query("UPDATE Seats SET is_booked = false, booked_by = NULL, booked_at = NULL");
        res.status(200).json({ message: "Seats reset successfully" });
    } catch (error) {
        console.error("Error resetting seats:", error);
        res.status(500).json({ message: "Server error while resetting seats" });
    }
}