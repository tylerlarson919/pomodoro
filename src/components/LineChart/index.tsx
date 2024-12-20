




import type { NextPage } from "next";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Line, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { useEffect } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';



const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon), {
    ssr: false,
  });


interface Session {
    status: string; // Assuming status is a string
    timerName: string; 
    timerLength: string;
    startTime: string;
    endTime: string;
}


interface ChartData {
    name: string;
    length: number;
    date: string;
}


// Chart component
const LineChart: NextPage<{ data: any }> = ({ data }) => {
    const [initialData, setInitialData] = React.useState<Session[]>([]); 
    const [chartData, setChartData] = React.useState<ChartData[]>([]); // Initialize as empty array
    const [sortTF, setSortTF] = React.useState<string[]>(["day"]);


    const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
        const formatDate = (dateString: string, sortType: string) => {
            const date = new Date(dateString);
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (01-12)
    
            if (sortType === "month") {
                const year = date.getFullYear(); // Get the year
                return `${month}/${year}`; // Return formatted as MM/YYYY
            } else if (sortType === "week") {
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay() + 1); // Get Monday of that week
                const weekStartMonth = String(weekStart.getMonth() + 1).padStart(2, '0'); // Get month (01-12)
                return `${weekStartMonth}/${weekStart.getDate()}`; // Return formatted as MM/DD
            }
    
            // Default to day format if neither "month" nor "week" is selected
            const day = String(date.getDate()).padStart(2, '0'); // Get day (01-31)
            return `${month}/${day}`; // Return formatted as MM/DD
        };
    
        if (active && payload && payload.length) {
            return (
                <div className="bg-darkaccent3/80 p-2 rounded-md text-textcolor">
                    <p className="">{formatDate(label, sortTF[0])}</p> {/* Pass sortTF[0] as the second argument */}
                    <p className="">{`${payload[0].value} mins`}</p>
                </div>
            );
        }
    
        return null;
    };


    
    useEffect(() => {
        if (data) {
    
            const groupData = (filteredData: ChartData[]) => {
                const grouped: { [key: string]: number } = {};
            
                filteredData.forEach(({ date, length }) => {
                    // Ensure date is in YYYY-MM-DD format
                    const normalizedDate = new Date(date).toISOString().split("T")[0];
            
                    if (sortTF[0] === "day") {
                        // Group by individual days
                        grouped[normalizedDate] = (grouped[normalizedDate] || 0) + length;
                    } else if (sortTF[0] === "week") {
                        // Group by week (Monday as the start of the week)
                        const d = new Date(normalizedDate);
                        const mondayOfWeek = new Date(d);
                        mondayOfWeek.setDate(d.getDate() - d.getDay() + 1); // Adjust to Monday
                        const weekKey = mondayOfWeek.toISOString().split("T")[0]; // Use Monday as key
                        grouped[weekKey] = (grouped[weekKey] || 0) + length;
                    } else if (sortTF[0] === "month") {
                        // Group by month (YYYY-MM)
                        const monthKey = normalizedDate.slice(0, 7); // Extract "YYYY-MM"
                        grouped[monthKey] = (grouped[monthKey] || 0) + length;
                    }
                });
            
                return grouped;
            };
            
            
            const fillMissingData = (grouped: { [key: string]: number }) => {
                const sortedKeys = Object.keys(grouped).sort();
                const allDates: string[] = [];
            
                const start = new Date(sortedKeys[0]);
                const end = new Date(sortedKeys[sortedKeys.length - 1]);
            
                for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    allDates.push(d.toISOString().split("T")[0]);
                }
            
                return allDates.map((key) => ({
                    date: key,
                    length: grouped[key] || 0, // Fill missing dates with 0
                    name: "Focus", // Default name for filled data
                }));
            };
            
            
            const filterData = () => {
                const sessions = Array.isArray(data) ? data : [];
                const filteredData = sessions.filter((session: Session) => session.status === "finished");
                if (filteredData.length > 0) {
                    const reformattedData = filteredData.map((session: Session) => ({
                        name: session.timerName || "Focus",
                        length: parseInt(session.timerLength.replace(" min", ""), 10),
                        date: new Date(session.startTime.split(",")[0].trim()).toISOString().split("T")[0], // Normalize date
                    }));
                    
                    const grouped = groupData(reformattedData);
                    const filledData = fillMissingData(grouped);
                    setChartData(filledData);
                }
            };
            
    
            filterData();
            
            // Dummy data can be logged here if needed
        }
    }, [data, sortTF]);
    
    
    

    return (
  <div className="flex justify-center items-center w-full h-full rounded-lg box-border p-2 sm:p-0 flex-col gap-4">
        <div className="flex w-full h-fit justify-center sm:justify-end">
            <Dropdown className="dark">
                <DropdownTrigger className="w-full h-full">
                <Button endContent={<FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5"/>} size="sm" className="h-10 capitalize text-[12px] p-1 w-28 text-textcolor dark hover:bg-gray-100/10" variant="bordered">
                    {sortTF}
                </Button>
                </DropdownTrigger>
                <DropdownMenu
                className=""
                disallowEmptySelection
                defaultSelectedKeys={["this"]}
                aria-label="Filter Options"
                selectedKeys={sortTF}
                selectionMode="single"
                variant="flat"
                onSelectionChange={(keys) => setSortTF(Array.from(keys).map(key => String(key)))} // Convert each key to a string
                >
                <DropdownItem className="text-textcolor" key="day">Day</DropdownItem>
                <DropdownItem className="text-textcolor" key="week">Week</DropdownItem>
                <DropdownItem className="text-textcolor" key="month">Month</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    <ResponsiveContainer width="100%" height="100%">

      <AreaChart
        width={500}
        height={300}
        data={chartData}
        dataKey="date"
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="25%" stopColor="#af7dff" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#af7dff" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          axisLine={false} 
          tickLine={false}
          tick={{ display: 'none' }} // Hide X axis labels
        />
        <YAxis
          dataKey="length"
          axisLine={false} 
          tickLine={false}
          tick={{ display: 'none' }} // Hide Y axis labels
        />
        <Tooltip content={<CustomTooltip />}
          contentStyle={{ border: '0px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.4)', color: '#fff', fontSize: '12px' }}
          itemStyle={{ color: '#fff' }}
        />
        <Area
          type="monotone"
          dataKey="length"
          stroke="#8a41ff"  // Line color
          strokeWidth={3}
          fill="url(#colorUv)"
          fillOpacity={0.2} // Opacity of the fill color
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
};

export default LineChart;






