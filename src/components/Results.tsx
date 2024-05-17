"use client";
import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Results() {
  const [winner, setWinner] = useState("");

  const logout = async () => {
    await fetch("/api/logout");
  };

  const getWinner = async () => {
    const response = await fetch("/api/current_user");

    if (response.ok) {
      const responseJSON = await response.json();
      socket.emit("get-results-request", responseJSON.roomCode);

      const handleResultsResponse = (winner: string) => {
        setWinner(winner);
        logout();
      };

      socket.on("get-results-response", handleResultsResponse);
    }
  };

  useEffect(() => {
    socket.connect();
    getWinner();
  }, []);

  return (
    <section className="flex flex-col mt-20">
      <h2 className="absolute text-xl top-11 left-1/2 -translate-x-1/2">
        Results
      </h2>
      <h2 className="text-2xl text-center">The winner is: {winner}</h2>
    </section>
  );
}