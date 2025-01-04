"use client";
import type {RangeValue} from "@react-types/shared";
import type {DateValue} from "@react-types/datepicker";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { faTrash, faChevronDown, faChartSimple, faTimes } from "@fortawesome/free-solid-svg-icons";

import { Image, Card, CardBody, Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem, Button, Selection, DateRangePicker, DatePicker } from "@nextui-org/react";
import {parseDate} from "@internationalized/date";
import { set } from "lodash";

export type FilterCardProps = {
    selectedKeys: Set<string>;
    setSelectedKeys: (keys: Set<string>) => void; // Make sure this matches your usage
    selectedFilterTypeKeys1: Set<string>;
    setSelectedFilterTypeKeys1: (keys: Set<string>) => void;
    selectedFilterTypeKeys2: Set<string>;
    setSelectedFilterTypeKeys2: (keys: Set<string>) => void;
    removeFilter: boolean;
    setRemoveFilter: (value: boolean) => void;
    dateRange: RangeValue<DateValue> | null;
    setDateRange: (range: RangeValue<DateValue> | null) => void;
    date: DateValue | null;
    setDate: (date: DateValue | null) => void;
    selectedStatusKey: Set<string>;
    setSelectedStatusKey: (keys: Set<string>) => void;

  };
  
  



const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon), {
    ssr: false,
  });
  
  export default function FilterCard(props: FilterCardProps) {


    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(["is-relative-to-today"]));
    const [selectedFilterTypeKeys1, setSelectedFilterTypeKeys1] = useState<Set<string>>(new Set(["this"]));
    const [selectedFilterTypeKeys2, setSelectedFilterTypeKeys2] = useState<Set<string>>(new Set(["week"]));
    const [selectedStatusKey, setSelectedStatusKey] = useState<Set<string>>(new Set(["both"]));
    
    const [removeFilter, setRemoveFilter] = useState(false);
    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);
    const [date, setDate] = useState<DateValue | null>(
        parseDate(new Date().toLocaleDateString('en-CA'))
      );
    const selectedValue = React.useMemo(
      () => Array.from(selectedKeys).join(", ").replace(/-/g, " "),
      [selectedKeys],
    );

    const selectedFilterTypeKeys1Value = React.useMemo(
        () => Array.from(selectedFilterTypeKeys1).join(", ").replace(/-/g, " "),
        [selectedFilterTypeKeys1],
      );
      const selectedFilterTypeKeys2Value = React.useMemo(
        () => Array.from(selectedFilterTypeKeys2).join(", ").replace(/-/g, " "),
        [selectedFilterTypeKeys2],
      );


      const handleRemoveFilter = () => {
        setRemoveFilter(true);
        setTimeout(() => {
          setRemoveFilter(false);
        }, 100);
      };


      useEffect(() => {
        props.setSelectedKeys(selectedKeys);
        props.setSelectedFilterTypeKeys1(selectedFilterTypeKeys1);
        props.setSelectedFilterTypeKeys2(selectedFilterTypeKeys2);
        props.setRemoveFilter(removeFilter);
        props.setDateRange(dateRange);
        props.setDate(date);
        props.setSelectedStatusKey(selectedStatusKey);
    }, [selectedKeys, selectedFilterTypeKeys1, selectedFilterTypeKeys2, removeFilter, dateRange, date, selectedStatusKey]);
    
      

    return (
    <div id="filter-menu" className="relative h-full w-full z-[100]">
        <Card className="absolute top-full right-[-60px] lg:left-1/2 transform lg:-translate-x-1/2 min-w-[270px] max-w-[calc(100vw-2rem)] dark bg-darkaccent3">
            <CardBody>
            <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row gap-1 items-center">
                            <p className="text-textcolor text-[12px]">Start date</p>
                            <Dropdown className="dark" >
                                <DropdownTrigger>
                                    <Button endContent={<FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5"/>} size="sm" className="text-[12px] p-1 border-none w-fit text-textcolor dark hover:bg-gray-100/10" variant="bordered">
                                        {selectedValue}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Single selection example"
                                    selectedKeys={selectedKeys}
                                    selectionMode="single"
                                    variant="flat"
                                    onSelectionChange={(newSelection) => setSelectedKeys(new Set(Array.from(newSelection).map(String)))}

                                >
                                    <DropdownItem className="text-textcolor" key="is">is</DropdownItem>
                                    <DropdownItem className="text-textcolor" key="is-before">is before</DropdownItem>
                                    <DropdownItem className="text-textcolor" key="is-after">is after</DropdownItem>
                                    <DropdownItem className="text-textcolor" key="is-between">is between</DropdownItem>
                                    <DropdownItem className="text-textcolor" key="is-relative-to-today">is relative to today</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-red-700 cursor-pointer" onClick={() => handleRemoveFilter()}/>
                    </div>
                    {(selectedKeys as Set<string>).has("is-between") && (
                        <DateRangePicker
                            classNames={{
                                innerWrapper: "text-textcolor",
                            }}
                            calendarProps={{
                                className: "dark",
                                classNames: {
                                    base: "dark text-gray-100",
                                    content: "dark",
                                    cellButton: "data-[today=true]:bg-default-100 data-[selected=true]:bg-transparent"
                                },
                            }}
                            size="sm"
                            variant="bordered"
                            className="dark"
                            aria-label="Date Range Picker"
                            color="primary"
                            value={dateRange} 
                            onChange={setDateRange}
                        />
                    )}    
                    {Array.from(selectedKeys).some((key) =>
                    ["is", "is-before", "is-after"].includes(String(key))
                    ) && (         
                    <DatePicker
                        classNames={{
                                base: "dark",
                        }}
                            calendarProps={{
                                className: "dark",
                                classNames: {
                                    base: "dark text-textcolor",
                                    content: "dark",
                                    gridWrapper: "dark",
                                    cellButton: "data-[today=true]:bg-default-100 data-[selected=true]:bg-transparent"
                                },
                            }}
                            size="sm"
                            variant="bordered"
                            aria-label="Date Picker"
                            value={date} 
                            onChange={setDate}
                    />
                    )}
                    {(selectedKeys as Set<string>).has("is-relative-to-today") && (
                        <div className="flex flex-row gap-1 items-center">
                    <Dropdown className="dark " 
                    classNames={{
                        content: "max-w-[80px] min-w-[80px]",
                    }}
                    >
                        <DropdownTrigger className="">
                            <Button endContent={<FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5"/>} size="sm" className="capitalize text-[12px] p-1 w-fit text-textcolor dark hover:bg-gray-100/10" variant="bordered">
                                {selectedFilterTypeKeys1Value}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                                className=" max-w-[80px]"
                                disallowEmptySelection
                                defaultSelectedKeys={["this"]}
                                aria-label="Filter Options"
                                selectedKeys={selectedFilterTypeKeys1}
                                selectionMode="single"
                                variant="flat"
                                onSelectionChange={(newSelection) => setSelectedFilterTypeKeys1(new Set(Array.from(newSelection).map(String)))}

                            >
                                <DropdownItem className="text-textcolor" key="past">Past</DropdownItem>
                                <DropdownItem className="text-textcolor" key="this">This</DropdownItem>
                            </DropdownMenu>
                    </Dropdown>


                    <Dropdown className="dark " 
                    classNames={{
                    }}
                    >
                        <DropdownTrigger className="">
                            <Button endContent={<FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5"/>} size="sm" className="capitalize text-[12px] p-1 w-full text-textcolor dark hover:bg-gray-100/10 justify-between px-3" variant="bordered">
                                {selectedFilterTypeKeys2Value}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                                disallowEmptySelection
                                defaultSelectedKeys={["week"]}
                                aria-label="Filter Options"
                                selectedKeys={selectedFilterTypeKeys2}
                                selectionMode="single"
                                variant="flat"
                                onSelectionChange={(newSelection) => setSelectedFilterTypeKeys2(new Set(Array.from(newSelection).map(String)))}

                            >
                                <DropdownItem className="text-textcolor" key="day">Day</DropdownItem>
                                <DropdownItem className="text-textcolor" key="week">Week</DropdownItem>
                                <DropdownItem className="text-textcolor" key="month">Month</DropdownItem>
                                <DropdownItem className="text-textcolor" key="year">Year</DropdownItem>
                            </DropdownMenu>
                    </Dropdown>
                    </div>
                    )}
                </div>
                <div className="flex flex-row gap-1 items-center justify-end">
                    <p className="text-textcolor text-[12px] capitalize">Status is</p> 
                    <Dropdown className="dark " 
                        classNames={{
                        }}
                        >
                        <DropdownTrigger className="">
                            <Button endContent={<FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5"/>} size="sm" className="capitalize text-[12px] p-1 w-full max-w-[180px] text-textcolor dark hover:bg-gray-100/10 justify-between px-3" variant="bordered">
                                {selectedStatusKey}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            defaultSelectedKeys={["both"]}
                            aria-label="Status Options"
                            selectedKeys={selectedStatusKey}
                            selectionMode="single"
                            variant="flat"
                            onSelectionChange={(newSelection) => setSelectedStatusKey(new Set(Array.from(newSelection).map(String)))}

                        >
                            <DropdownItem className="text-textcolor" key="finished">Finished</DropdownItem>
                            <DropdownItem className="text-textcolor" key="failed">Failed</DropdownItem>
                            <DropdownItem className="text-textcolor" key="both">Both</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
              </div>
            </CardBody>
        </Card>
    </div>

  );
}
