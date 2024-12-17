"use client";

import React, { useEffect, useState } from "react";
import { auth, getSessions } from "../../../firebase";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/table";

// Define the type for session data
type Session = {
  startTime: string;
  endTime: string;
  timerLength: string;
  status: string;
};

 const columns = [
  { name: "START TIME", uid: "startTime" },
  { name: "END TIME", uid: "endTime" },
  { name: "TIMER LENGTH", uid: "timerLength" },
  { name: "STATUS", uid: "status" }
];

const Stats = () => {
  const [sessionsData, setSessionsData] = useState<Session[]>([]);

  const fetchSessions = async () => {
    const user = auth.currentUser;
    if (user) {
      const sessions = await getSessions(); // Fetch all sessions
      const currentSessions = sessions
        ?.filter((session) => session.status !== "current")
        ?.map((session) => {
          const startTime = formatTimestamp(session.startTime);
          const endTime = formatTimestamp(session.endTime);
          const timerLength = calculateTimerLength(session.startTime, session.endTime);

          return {
            startTime,
            endTime,
            timerLength,
            status: session.status
          };
        })
        ?.sort((a, b) => {
          // Sort by most recent `endTime`
          const dateA = new Date(Number(a.endTime)).getTime();
          const dateB = new Date(Number(b.endTime)).getTime();
          return dateB - dateA; // Descending order
        });

      setSessionsData(currentSessions || []);
    }
  };

  // Format timestamp into a readable format like "2:30 PM"
  const formatTimestamp = (timestamp: string | number) => {
    if (!timestamp) return "N/A";
    const date = new Date(Number(timestamp));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Calculate timer length in minutes
  const calculateTimerLength = (start: string | number, end: string | number) => {
    if (!start || !end) return "N/A";
    const diff = (Number(end) - Number(start)) / 1000 / 60; // Convert milliseconds to minutes
    return `${Math.round(diff)} min`;
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center overflow-hidden bg-dark1 p-6">
      <h1 className="text-2xl text-white mb-4">Session Stats</h1>
      <Table aria-label="Session Stats Table">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody items={sessionsData}>
          {(item) => (
            <TableRow key={item.startTime}>
              <TableCell>{item.startTime}</TableCell>
              <TableCell>{item.endTime}</TableCell>
              <TableCell>{item.timerLength}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Stats;
