"use client";

import React, { useEffect, useState } from "react";
import { auth, getSessions } from "../../../firebase";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  ChipProps,
  Card,
  CardBody,
  CircularProgress,
  Dropdown
} from "@nextui-org/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import StatsHeader from "@/components/StatsHeader";

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


const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
  };

const Stats = () => {
  const [sessionsData, setSessionsData] = useState<Session[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [avgTimeValue, setAvgTimeValue] = useState(0);


  // Use effect for most stats calculations
  useEffect(() => {
    // for avg time
        const calculateAvgTimePerDay = () => {
          const finishedSessions = sessionsData.filter(session => session.status === "finished");
          
          if (finishedSessions.length === 0) {
            setAvgTimeValue(0);
            return;
          }
      
          const totalTime = finishedSessions.reduce((sum, session) => {
            const [time] = session.timerLength.split(" ");
            return sum + Number(time);
          }, 0);
      
          // Get unique days from sessions (assumes startTime is a timestamp in milliseconds)
          const uniqueDays = new Set(
            finishedSessions.map(session => {
              const date = new Date(Number(session.startTime));
              return date.toDateString();
            })
          );
      
          const avgTime = totalTime / uniqueDays.size;
          setAvgTimeValue(Math.round(avgTime));
        };
      
        calculateAvgTimePerDay();
      }, [sessionsData]);
      


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
    const hours = date.getHours() % 12 || 12; // Convert 0 to 12 for 12-hour format
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Keep 2-digit minutes
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes} ${ampm}`;
  };
  

  // Calculate timer length in minutes
  const calculateTimerLength = (start: string | number, end: string | number) => {
    if (!start || !end) return "N/A";
    const diff = (Number(end) - Number(start)) / 1000 / 60; // Convert milliseconds to minutes
    return `${Math.round(diff)} min`;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchSessions();
      } else {
        console.error("No user is logged in.");
      }
    });
  
    return () => unsubscribe(); // Clean up the listener
  }, []);
  

  return (
    <div className="flex flex-col w-full h-screen items-center justify-start overflow-hidden bg-dark1 p-6 gap-6">
      <StatsHeader/>
      <div className="flex flex-col items-center justify-start w-full">
        <h1 className="text-4xl font-bold text-white mb-4 mt-4">Session Stats</h1>
        <Table classNames={{wrapper: "bg-darkaccent", th: "bg-darkaccent3"}} className="dark bg-darkaccent" aria-label="Session Stats Table">
          <TableHeader className="dark" columns={columns}>
            {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
          </TableHeader>
          <TableBody className="dark" items={sessionsData}>
            {(item) => (
              <TableRow className="dark" key={item.startTime}>
                <TableCell className="dark text-white">{item.startTime}</TableCell>
                <TableCell className="dark text-white">{item.endTime}</TableCell>
                <TableCell className="dark text-white">{item.timerLength}</TableCell>
                <TableCell className="dark text-white">
                  <div className="flex flex-row gap-2 content-center items-center">
                      <div className={`w-2 h-2 rounded-full items-center ${item.status === "finished" ? "bg-green-600" : "bg-red-600"}`}></div>
                      {item.status}
                  </div>
              </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-row items-center justify-center w-full gap-6">
        <Card className="dark bg-darkaccent w-1/3">
            <CardBody className="dark flex flex-col items-center justify-center">
                <h4 className="text-2xl text-white mb-4">Avg Time per Day</h4>
                <CircularProgress
                    color="secondary"
                    formatOptions={{style: "unit", unit: "minute"}}
                    showValueLabel={true}
                    size="lg"
                    value={avgTimeValue}
                    maxValue={avgTimeValue <= 60 ? 60 : 120}
                    classNames={{
                        svg: "w-36 h-36 drop-shadow-md",
                        indicator: "stroke-white",
                        track: "stroke-white/10",
                        value: "text-2xl  text-white",
                    }}
                />
            </CardBody>
        </Card>
        <Card className="dark bg-darkaccent w-1/3">
            <CardBody className="dark flex flex-col items-center justify-center">
                <h4 className="text-2xl text-white mb-4">Time Focused</h4>
            </CardBody>
        </Card>
        <Card className="dark bg-darkaccent w-1/3">
            <CardBody className="dark flex flex-col items-center justify-center">
                <h4 className="text-2xl text-white mb-4">Time</h4>
            </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Stats;
