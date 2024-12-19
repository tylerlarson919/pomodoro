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
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button
} from "@nextui-org/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import StatsHeader from "@/components/StatsHeader";
import { faChevronDown, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";

// Define the type for session data
type Session = {
  timerName: string;
  startTime: string;
  endTime: string;
  timerLength: string;
  status: string;
};

 const columns = [
  { name: "NAME", uid: "timerName" },
  { name: "START TIME", uid: "startTime" },
  { name: "END TIME", uid: "endTime" },
  { name: "TIMER LENGTH", uid: "timerLength" },
  { name: "STATUS", uid: "status" }
];

const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon), {
    ssr: false,
  });

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
  const [timeThisMonth, setTimeThisMonth] = useState(0);
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("day");
  const [period, setPeriod] = useState("this");
  const periodOrder = ["last", "this"]; // Define the order of periods


  // Function to set the current month
  const getCurrentMonth = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'long' }; // Specify the type explicitly
    setCurrentMonth(new Date().toLocaleString('default', options));
  };


  // Use effect for most stats calculations
  useEffect(() => {
    getCurrentMonth();

    const calculateAvgTimePerDay = () => {
      const finishedSessions = sessionsData.filter(session => session.status === "finished");
  
      if (finishedSessions.length === 0) {
        setAvgTimeValue(0);
        setTimeThisMonth(0); // Reset timeThisMonth as well
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
  
      // Calculate time this month by summing the timerLength of finished sessions
      const timeThisMonth = finishedSessions.reduce((sum, session) => {
        const [time] = session.timerLength.split(" ");
        return sum + Number(time);
      }, 0);
  
      setTimeThisMonth(timeThisMonth);
    };
  
    calculateAvgTimePerDay();
  }, [sessionsData]);
  
  
  // Function to filter sessions based on the selected timeframe
  const filterSessionsByTimeframe = (sessions: Session[], timeframe: string) => {
    const now = new Date();
    return sessions.filter(session => {
      const sessionDate = new Date(Number(session.startTime));
      switch (timeframe) {
        case "day":
          return sessionDate.toDateString() === now.toDateString();
        case "week":
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          return sessionDate >= startOfWeek && sessionDate <= new Date();
        case "month":
          return sessionDate.getMonth() === now.getMonth() && sessionDate.getFullYear() === now.getFullYear();
        case "year":
          return sessionDate.getFullYear() === now.getFullYear();
        default:
          return true; // No filtering
      }
    });
  };


  const fetchSessions = async () => {
    const user = auth.currentUser;
    if (user) {
      const sessions = await getSessions(); // Fetch all sessions
      const currentSessions = sessions
        ?.filter((session) => session.status !== "current")
        ?.map((session) => {
          const timerName = session.timerName || "";
          const startTime = formatTimestamp(session.startTime);
          const endTime = formatTimestamp(session.endTime);
          const timerLength = calculateTimerLength(session.startTime, session.endTime);

          return {
            timerName,
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
          return dateA - dateB; // Descending order
        });

      setSessionsData(currentSessions || []);
    }
  };
// Format timestamp into a readable format like "9/15/24, 3:30pm"
const formatTimestamp = (timestamp: string | number) => {
  if (!timestamp) return "N/A";
  const date = new Date(Number(timestamp));
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
  const hours = date.getHours() % 12 || 12; // Convert 0 to 12 for 12-hour format
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Keep 2-digit minutes
  const ampm = date.getHours() >= 12 ? "pm" : "am"; // Use lowercase for AM/PM

  return `${month}/${day}/${year}, ${hours}:${minutes}${ampm}`;
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
    <div className="flex flex-col w-full h-full min-h-screen items-center justify-start bg-dark1  px-6 lg:px-52 gap-6 pb-6">
      <StatsHeader/>
      <div className="flex flex-col items-center justify-start w-full">
        <div className="flex flex-row items-center justify-start w-full gap-4">
          <div className="flex items-center justify-center gap-2 w-full pt-6">
            <Button
              aria-label="Previous Period"
              isIconOnly
              variant="bordered"
              className="border-none bg-transparent text-white"
              onPress={() =>
                setPeriod((prev) => {
                  const currentIndex = periodOrder.indexOf(prev);
                  return periodOrder[Math.max(currentIndex - 1, 0)];
                })
              }
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <span aria-label="Current Selection" className="text-white mx-1 ">{period}</span>
            <Button
              aria-label="Next Period"
              isIconOnly
              variant="bordered"
              className="border-none bg-transparent text-white"
              onPress={() =>
                setPeriod((prev) => {
                  const currentIndex = periodOrder.indexOf(prev);
                  return periodOrder[Math.min(currentIndex + 1, periodOrder.length - 1)];
                })
              }
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
            <Dropdown aria-label="Filter Timeframe" className="dark">
              <DropdownTrigger>
                <Button className="dark" aria-label="Filter Timeframe" endContent={<FontAwesomeIcon icon={faChevronDown} />} variant="shadow" color="default">
                  {selectedTimeframe} {/* Display the selected timeframe */}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                className="dark"
                aria-label="Filter Timeframe Menu"
                selectedKeys={selectedTimeframe}
                selectionMode="single"
                onSelectionChange={(key) => setSelectedTimeframe(Array.from(key as Set<string>)[0])}
              >
                <DropdownItem className="text-white" key="day" aria-label="Filter by Day">Day</DropdownItem>
                <DropdownItem className="text-white" key="week" aria-label="Filter by Week">Week</DropdownItem>
                <DropdownItem className="text-white" key="month" aria-label="Filter by Month">Month</DropdownItem>
                <DropdownItem className="text-white" key="year" aria-label="Filter by Year">Year</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4 mt-4">Session Stats</h1>
        <Table classNames={{wrapper: "bg-darkaccent", th: "bg-darkaccent3"}} className="dark" aria-label="Session Stats Table">
          <TableHeader className="dark" columns={columns}>
            {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
          </TableHeader>
          <TableBody className="dark " items={sessionsData}>
            {(item) => (
              <TableRow className="dark" key={item.startTime}>
                <TableCell className="dark text-white">{item.timerName}</TableCell>
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
      <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-6">
        <Card className="dark bg-darkaccent w-full h-full sm:w-1/2 py-4 sm:h-[260px]">
            <CardBody className="dark flex flex-row sm:flex-col gap-4 items-center justify-center overflow-hidden">
                <h4 className="text-3xl sm:text-4xl text-white text-center">Avg Time per Day</h4>
                <CircularProgress
                    aria-label="Average Time per Day"
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
        <Card className="dark bg-darkaccent w-full sm:w-1/2 py-4 px-6 sm:h-[260px]">
            <CardBody className="dark flex flex-col items-center justify-start md:justify-center">
                <p className="text-left md:text-center text-5xl font-medium text-white">
                  Focused for {timeThisMonth} mins in {currentMonth}. 
                </p>
            </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Stats;
