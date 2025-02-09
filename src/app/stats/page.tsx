"use client";

import React, { useEffect, useState, useMemo } from "react";
import { auth, getSessions, isUserPaidOrTrial } from "../../../firebase";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Card,
  CardBody,
  CircularProgress,
  ScrollShadow,
  Avatar,
  Divider,
} from "@nextui-org/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import StatsHeader from "@/components/StatsHeader";
import { parse, getTime } from "date-fns";
import FilterIcon from  "../../../public/icons/filter-icon";
import SortIcon from  "../../../public/icons/sort-icon";
import FilterCard from '@/components/FilterCard';
import type {RangeValue} from "@react-types/shared";
import type {DateValue} from "@react-types/datepicker";
import UHeaderIcon from "@/components/userHeaderIcon";
import bulkAddSessions from "@/components/makeDummyData";
import { GlareCard } from "@/components/ui/glare-card";
import TrialEndedPopupModal from "@/components/TrialEndedPopupModal";
import LoadingPage from "@/components/LoadingPage"
import LineChart from "@/components/charts/LineChart"  ;

// Define the type for session data
type Session = {
  timerName: string;
  startTime: string;
  endTime: string;
  timerLength: string;
  status: string;
};

type ReplaceSpacesProps = {
  input: string;
};

 const columns = [
  { name: "NAME", uid: "timerName" },
  { name: "START TIME", uid: "startTime" },
  { name: "END TIME", uid: "endTime" },
  { name: "TIMER LENGTH", uid: "timerLength" },
  { name: "STATUS", uid: "status" }
];

const Stats = () => {
  const [sessionsData, setSessionsData] = useState<Session[]>([]);
  const [filteredSessionsData, setFilteredSessionsData] = useState<Session[]>([]);
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [avgTimeValue, setAvgTimeValue] = useState(0);
  const [timeThisMonth, setTimeThisMonth] = useState<string>("0 mins");
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [isFilterMenuOpen, setisFilterMenuOpen] = useState(false);
  const [isFilterActive, setisFilterActive] = useState(false);
  const [isSortMenuOpen, setisSortMenuOpen] = useState(false);
  const [isLoadingPageLoading, setIsLoadingPageLoading] = React.useState(false);
  const [trialEndedPopup, setTrialEndedPopup] = React.useState(false);

  // Unused settings props:
   const [selectedGif, setSelectedGif] = useState<string>('');
   const [selectedSound, setSelectedSound] = useState<string>('');
   const [selectedEndSound, setSelectedEndSound] = useState<string>('');
   const [selectedBackground, setSelectedBackground] = useState<string>('');
   const [isStarsSelected, setIsStarsSelected] = React.useState(false);

  // Filter card props
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [selectedFilterTypeKeys1, setSelectedFilterTypeKeys1] = useState<Set<string>>(new Set());
  const [selectedFilterTypeKeys2, setSelectedFilterTypeKeys2] = useState<Set<string>>(new Set());
  const [removeFilter, setRemoveFilter] = useState(false);
  const [filterType, setFilterType] = useState<string>("");
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);
  const [date, setDate] = useState<DateValue | null>(null);
  const [selectedStatusKey, setSelectedStatusKey] = useState<Set<string>>(new Set(["both"]));
  const [totalTimeFocused, setTotalTimeFocused] = useState("");  

  const ReplaceSpaces: React.FC<ReplaceSpacesProps> = ({ input }) => {
      const replaceSpaces = (str: string) => str.replace(/\s+/g, '+');
      return replaceSpaces(input);
  };

  const settingsProps = {
    selectedSound,
    selectedEndSound,
    selectedGif,
    selectedBackground,
    isStarsSelected,
  };

    useEffect(() => {
        const checkUserStatus = onAuthStateChanged(auth, async (user) => {
          // Redirect to home if not logged in
          if (!user) {
            console.log("User is not authenticated, redirecting to login.");
            router.push('/login');
            return; // Exit the function early to prevent further checks
          } else {
            await fetchUserSettings(user.uid);
            setUser(user);
          }
      
          const userStatus = await isUserPaidOrTrial();
    
          // Check if the current pathname is either /stats or /timer
          if (!userStatus) {
            console.log("userStatus is invalid, Opening popup.");
            setTrialEndedPopup(true);
    
          } else {
            console.log("User is paid or in a trial. Enjoy!");
          }
      
          // Hide loading indicator once checks are complete
          setIsLoadingPageLoading(false);
        });
      
        return () => {
          // Cleanup: Unsubscribe from the auth listener
          checkUserStatus(); 
        };
      }, [router]);
      
      // function to handle clicks outside of the popup, when the popup is open
      useEffect(() => {
        if (trialEndedPopup) { 
          // Adding event listener for clicks
          console.log("Adding event listener for clicks");
          document.addEventListener('click', handleTrialClick);
    
          // Cleanup event listener on component unmount or when trialEndedPopup changes
          return () => {
            document.removeEventListener('click', handleTrialClick);
          };
        }
      }, [trialEndedPopup, router]);
    
      const handleTrialClick = () => {
        router.push("/get-started");
      };

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
      });
      return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleTriggerReload = async () => {
    if (user) {
      console.log("Triggering reload...");
      await fetchUserSettings(user.uid); // Fetch updated settings based on user ID
    }
  };

  const fetchUserSettings = async (uid: string) => {
      console.log("No Settings to update on the stats page");
  }

  useEffect(() => {
    const resetData = () => {
      let statusFlteredSessionData = sessionsData;

      if (removeFilter === true || isFilterActive === false) {
        console.log("Filter Removed");
        if (statusFlteredSessionData) {
          setFilteredSessionsData(statusFlteredSessionData); 
        };
        return; // Exit
    }
    };

    const filterData = () => {
        let statusFlteredSessionData = sessionsData;
        let fullFilteredSessionData = null;

        // Check if sessionsData is empty
        if (sessionsData.length === 0) {
            console.log("No sessions data available to filter.");
            return; // Exit if no data
        }

        if (removeFilter === true) {
          console.log("Filter Removed");
          fullFilteredSessionData = sessionsData.filter(session => {
            const status = "both"; 
            return session.status === status;
          });
          if (fullFilteredSessionData) {
            setFilteredSessionsData(fullFilteredSessionData); 
          };
          return; // Exit if no data
      }

        if (selectedStatusKey) {
          if (selectedStatusKey.has("both")) {
          } else {
            statusFlteredSessionData = sessionsData.filter(session => {
              const status = Array.from(selectedStatusKey)[0]; 
              return session.status === status;
            });

          }
        };

        // Handle "is-relative-to-today" filter
        if (selectedKeys.has("is-relative-to-today")) {
          const today = new Date();
          const periodMultiplier = selectedFilterTypeKeys1.has("this") ? 0 : -1; // Adjust based on selection
          const timeFrame = selectedFilterTypeKeys2.has("day") ? 1 :
                            selectedFilterTypeKeys2.has("week") ? 7 :
                            selectedFilterTypeKeys2.has("month") ? 30 :
                            365; // Default to year if none selected
      
          let startDate, endDate;
      
          if (selectedFilterTypeKeys2.has("week")) {
              const currentDay = today.getDay();
              const sundayOffset = currentDay; // Days until last Sunday
              const endOfWeekOffset = 6 - currentDay; // Days until next Saturday
      
              // Calculate start and end dates for the current week
              startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - sundayOffset, 0, 0, 0);
              endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + endOfWeekOffset, 23, 59, 59);
          } else if (selectedFilterTypeKeys2.has("month")) {
              // Start of this month
              startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
              // End of this month
              endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
          } else if (selectedFilterTypeKeys2.has("year")) {
              // Start of this year
              startDate = new Date(today.getFullYear(), 0, 1, 0, 0, 0);
              // End of this year
              endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
          } else {
              // For day
              startDate = new Date(today.getTime() - (timeFrame * periodMultiplier * 24 * 60 * 60 * 1000));
              endDate = new Date(today.getTime() + (timeFrame * (1 - periodMultiplier) * 24 * 60 * 60 * 1000));
          }
      
          const formattedStartDate = startDate.toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
          }).replace(',', ''); // Remove comma for consistency
      
          const formattedEndDate = endDate.toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
          }).replace(',', ''); // Remove comma for consistency
      
          const parsedStartDate = parse(formattedStartDate, "MM/dd/yyyy", new Date());
          const parsedEndDate = parse(formattedEndDate, "MM/dd/yyyy", new Date());
      
          // Filter session data based on calculated start and end dates
          fullFilteredSessionData = statusFlteredSessionData.filter(session => {
              const sessionEnd = parse(session.endTime, "MM/dd/yy, h:mma", new Date());
              return sessionEnd >= parsedStartDate && sessionEnd <= parsedEndDate;
          });
      }
      
      
        // Handle "is", "is-before", and "is-after" filters
        else if (["is", "is-before", "is-after"].some(key => selectedKeys.has(key))) {
            // Check if date is defined before parsing
            if (date) {
                const { day, month, year } = date; // Correctly destructuring from the date object
                const sessionDate = new Date(year, month - 1, day);

                fullFilteredSessionData = statusFlteredSessionData.filter(session => {
                    const sessionEnd = parse(session.endTime, "MM/dd/yy, h:mma", new Date());
                    if (selectedKeys.has("is")) {
                        return sessionEnd.toDateString() === sessionDate.toDateString(); // Exact match
                    } else if (selectedKeys.has("is-before")) {
                        return sessionEnd < sessionDate; // Before
                    } else if (selectedKeys.has("is-after")) {
                        return sessionEnd > sessionDate; // After
                    }
                    return true; // Fallback if no conditions matched
                });
            } else {
            }
        } 
        // Handle "is-between" filter
        else if (selectedKeys.has("is-between") && dateRange) {
            // Check if dateRange.start is defined before parsing
            if (dateRange.start && dateRange.end) {
                // Destructure day, month, and year from dateRange.start and dateRange.end
                const { day: startDay, month: startMonth, year: startYear } = dateRange.start;
                const { day: endDay, month: endMonth, year: endYear } = dateRange.end;
        
                // Create Date objects for start and end range
                const startRange = new Date(startYear, startMonth - 1, startDay);
                const endRange = new Date(endYear, endMonth, endDay + 1);
                fullFilteredSessionData = statusFlteredSessionData.filter(session => {
                    const sessionEnd = parse(session.endTime, "MM/dd/yy, h:mma", new Date());
                    return sessionEnd >= startRange && sessionEnd <= endRange; // Within range
                });
            } else {
            }
        }
        if (fullFilteredSessionData) {
          setFilteredSessionsData(fullFilteredSessionData); 
        };
    };
        if (removeFilter === true || isFilterActive === false) {
            resetData();
            setisFilterActive(false);
            setisFilterMenuOpen(false);
        } else {
            filterData();
        }
    
  }, [selectedKeys, selectedFilterTypeKeys1, selectedFilterTypeKeys2, filterType, dateRange, date, isFilterActive, removeFilter, selectedStatusKey, ]);

  // Function to set the current month
  const getCurrentMonth = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'long' }; // Specify the type explicitly
    setCurrentMonth(new Date().toLocaleString('default', options));
  };

  // Use effect for most stats calculations
  useEffect(() => {
    getCurrentMonth();
  
    const calculateAvgTimePerDay = () => {
      const finishedSessions = sessionsData.filter(
        (session) => session.status === "finished"
      );
      console.log("finishedSessions:", finishedSessions);
  
      if (finishedSessions.length === 0) {
        setAvgTimeValue(0);
        setTimeThisMonth("0 mins"); // Reset timeThisMonth as well
        return;
      }
  
      // Helper function to parse timerLength (e.g., "1m")
      const parseTimerLength = (timerLength: string): number => {
        const match = timerLength.match(/^\d+[smhd]$/);
        if (!match) return 0;
  
        const value = Number(timerLength.slice(0, -1));
        const unit = timerLength.slice(-1);
  
        // Convert time to minutes
        switch (unit) {
          case "s":
            return value / 60; // seconds to minutes
          case "m":
            return value; // already in minutes
          case "h":
            return value * 60; // hours to minutes
          case "d":
            return value * 1440; // days to minutes
          default:
            return 0;
        }
      };
  
      const sessionsByDay = finishedSessions.reduce((acc: Record<string, number[]>, session) => {
        const day = new Date(session.startTime).toDateString();
        if (!acc[day]) acc[day] = [];
        acc[day].push(parseTimerLength(session.timerLength));
        return acc;
      }, {});
  
      console.log("sessionsByDay:", sessionsByDay);
  
      const avgTimePerDay = Object.values(sessionsByDay).reduce((sum, daySessions) => {
        const dayAvg = daySessions.reduce((a, b) => a + b, 0) / daySessions.length;
        return sum + dayAvg;
      }, 0) / Object.keys(sessionsByDay).length;
  
      console.log("avgTimePerDay:", avgTimePerDay);
  
      setAvgTimeValue(Math.round(avgTimePerDay));
  
      const totalTime = finishedSessions.reduce(
        (sum, session) => sum + parseTimerLength(session.timerLength),
        0
      );
  
      console.log("totalTime:", totalTime);
  
      const formatTime = (minutes: number): string => {
        const units = [
          { label: "month", value: 43800 },
          { label: "week", value: 10080 },
          { label: "day", value: 1440 },
          { label: "hour", value: 60 },
          { label: "min", value: 1 },
        ];
        let remainingMinutes = minutes;
        const parts: string[] = [];
  
        for (const unit of units) {
          const count = Math.floor(remainingMinutes / unit.value);
          if (count > 0) {
            parts.push(`${count} ${unit.label}${count > 1 ? "s" : ""}`);
            remainingMinutes %= unit.value;
          }
        }
  
        return parts.join(", ");
      };
  
      const formattedTime = formatTime(totalTime);
      setTotalTimeFocused(formattedTime);
      setTimeThisMonth(formattedTime);
    };
  
    calculateAvgTimePerDay();
  }, [sessionsData]);
  
  
  
  

  function formatTotalTime(totalTime: number): string {
    // Total time is expected to be in minutes
    const days = Math.floor(totalTime / (60 * 24));
    const hours = Math.floor((totalTime % (60 * 24)) / 60);
    const minutes = totalTime % 60;
    
    if (days > 0) {
        // Format for days
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        // Format for hours
        return `${hours}h ${minutes}m`;
    } else if (totalTime >= 60 * 24 * 7) {
        // Format for weeks
        const weeks = (totalTime / (60 * 24 * 7)).toFixed(1);
        return `${weeks}w`;
    } else if (totalTime >= 60 * 24 * 30) {
        // Format for months
        const months = (totalTime / (60 * 24 * 30)).toFixed(1);
        return `${months} months`;
    } else {
        return `${minutes}m`; // Fallback for minutes if all else fails
    }
}
// Function to filter sessions based on the selected timeframe
const filterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  if (!isFilterMenuOpen && !isFilterActive) {
    setisFilterMenuOpen(true);
    setisFilterActive(true);
  } else if (!isFilterMenuOpen && isFilterActive) {
    setisFilterActive(false);
  } else if ( isFilterMenuOpen && isFilterActive) {
    setisFilterActive(false);
    setisFilterMenuOpen(false);
  }
};


// Use effect to handle click outside when the filter menu is open
useEffect(() => {
  if (isFilterMenuOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
  }

  // Clean up the event listener on component unmount or when isFilterMenuOpen changes
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isFilterMenuOpen]);


  // Function to handle clicks outside the filter menu
  const handleClickOutside = (event: MouseEvent) => {
    const filterButton = document.getElementById('filter-button'); // Use your filter button ID
    const filterMenu = document.getElementById('filter-menu'); // Use your filter menu ID

    if (filterButton && filterMenu && !filterButton.contains(event.target as Node) && !filterMenu.contains(event.target as Node)) {
        setisFilterMenuOpen(false);
        // Do not set isFilterActive to false here
    }
};


const sortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  setisSortMenuOpen(prevState => !prevState);
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
          const dateA = getTime(parse(a.endTime, "MM/dd/yy, h:mma", new Date()));
          const dateB = getTime(parse(b.endTime, "MM/dd/yy, h:mma", new Date()))
          return dateB - dateA; // Descending order
        });
      setSessionsData(currentSessions || []);
      setFilteredSessionsData(currentSessions || []);

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
    const hours = Math.floor(diff / 60);
    const minutes = Math.round(diff % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
    <div className="flex flex-col w-full h-full min-h-screen max-h-full items-center justify-start bg-dark1  px-6 lg:px-52 gap-6 pb-6">
      <TrialEndedPopupModal isPageVisable={trialEndedPopup}/>
      <LoadingPage isPageLoading={isLoadingPageLoading}/>
      <StatsHeader/>
      <UHeaderIcon onTriggerReload={handleTriggerReload} settingsProps={settingsProps}/>
      <h1 className="text-4xl font-bold text-white pb-2 pt-16 px-2 text-center">Session Stats</h1>
      <div className="w-full h-full">
        <GlareCard className="w-full h-[400px] sm:h-40">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 sm:gap-6 w-full h-full p-6">
            <div className="flex flex-col items-start justify-center w-fit h-fit">
              <Avatar
                isFocusable={false}
                className="w-18 h-18 sm:w-26 sm:h-26"
                alt="User Profile"
                id="user-profile"
                src={user?.photoURL || `https://eu.ui-avatars.com/api/?name=${ReplaceSpaces({ input: user?.displayName || "Anonymous" })}&size=95`}
              />
            </div>
            <div className="w-fit h-fit flex flex-col items-center sm:items-start justify-center text-textcolor">
              <p className="text-2xl sm:text-2xl font-semibold text-center sm:text-left">Sessions Complete</p>
              <p className="text-5xl font-bold text-shadow-glow text-center sm:text-left">
                {sessionsData.length ? sessionsData.length : 0}
              </p>
            </div>
            <Divider orientation="horizontal" className="dark block sm:hidden w-full max-w-[220px] h-[1px] rounded-full bg-textcolor" />
            <div className="w-fit h-fit flex flex-col items-center sm:items-start justify-center text-textcolor">
              <p className="text-2xl sm:text-2xl font-semibold text-center sm:text-left">Time Focused</p>
              <p className="text-5xl font-bold text-shadow-glow text-center sm:text-left">
                {totalTimeFocused ? totalTimeFocused : "0m"}
              </p>
            </div>
          </div>
        </GlareCard>
      </div>
      <div className="flex flex-col items-center justify-start w-full">
        <div className="bg-darkaccent w-full flex flex-col relative h-auto box-border outline-none shadow-medium rounded-large">
          <div className="flex items-center justify-center w-full h-[40px] group relative">
            <div className={`opacity-100 ${isFilterActive ? "opacity-100" : "opacity-0"} absolute left-0 right-0 top-0 bottom-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100 flex items-center justify-end gap-2`}>
              <div className="relative">
                  <button id="filter-button" onClick={filterClick} className="hover:bg-gray-100/10 p-1.5 rounded-md active:bg-gray-400/10">
                    <FilterIcon color={isFilterActive ? "#005BC4" : "#939393"} className="w-4 h-4" />
                  </button>
                  {isFilterMenuOpen && (
                    <div className="absolute z-[100]"
                      >
                      <FilterCard 
                        selectedKeys={selectedKeys}
                        setSelectedKeys={setSelectedKeys}
                        selectedFilterTypeKeys1={selectedFilterTypeKeys1}
                        setSelectedFilterTypeKeys1={setSelectedFilterTypeKeys1}
                        selectedFilterTypeKeys2={selectedFilterTypeKeys2}
                        setSelectedFilterTypeKeys2={setSelectedFilterTypeKeys2}
                        removeFilter={removeFilter}
                        setRemoveFilter={setRemoveFilter} // Assuming you need a setter for removeFilter
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        date={date}
                        setDate={setDate}
                        selectedStatusKey={selectedStatusKey}
                        setSelectedStatusKey={setSelectedStatusKey}
                      />
                    </div>
                  )}
                </div>
              <button id="sort-button" onClick={sortClick} className="hover:bg-gray-100/10 p-1.5 rounded-md active:bg-gray-400/10">
                <SortIcon color={isSortMenuOpen ? "#005BC4" : "#939393"} className="w-4 h-4 " />
              </button>
            </div>
          </div>
          <ScrollShadow size={10} orientation="vertical" className="dark h-[450px]">
            <Table isHeaderSticky removeWrapper classNames={{ th: "bg-darkaccent3"}} className="dark" aria-label="Session Stats Table"
              
            >
              <TableHeader className="dark" columns={columns}>
                {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
              </TableHeader>
              <TableBody className="dark " items={filteredSessionsData}>
                {(item) => (
                  <TableRow className="dark" key={item.startTime}>
                    <TableCell className="dark text-white">{item.timerName}</TableCell>
                    <TableCell className="dark text-white">{item.startTime}</TableCell>
                    <TableCell className="dark text-white">{item.endTime}</TableCell>
                    <TableCell className="dark text-white">{item.timerLength}</TableCell>
                    <TableCell className="dark text-white">
                      <div className="flex flex-row gap-2 content-center items-center justify-center sm:justify-start">
                          <div className={`w-4 h-4 sm:w-2 sm:h-2 rounded-full items-center ${item.status === "finished" ? "bg-green-600" : "bg-red-600"}`}></div>
                          <p className="hidden sm:flex">{item.status === "finished" ? "complete" : "failed"}</p>
                      </div>
                  </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollShadow>
        </div>
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
                    maxValue={avgTimeValue <= 120 ? 120 : 400}
                    classNames={{
                        svg: "w-36 h-36 drop-shadow-md",
                        value: "text-2xl  text-white",
                    }}
                />
            </CardBody>
        </Card>
        <Card className="dark bg-darkaccent w-full sm:w-1/2 py-4 px-6 min-h-[260px] md:min-h-full md:h-[260px]">
            <CardBody className="dark flex flex-col items-center justify-start md:justify-center">
                <p className="text-left md:text-center text-5xl font-medium text-white">
                  Focused for {timeThisMonth} in {currentMonth}. 
                </p>
            </CardBody>
        </Card>
      </div>
      
      <Card className="dark bg-darkaccent w-full py-1 px-1 h-[600px] md:h-[500px] overflow-hidden">
        <CardBody className="relative dark flex flex-col items-center justify-start md:justify-center">
          <div className="w-full h-full">
            <LineChart data={filteredSessionsData} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Stats;