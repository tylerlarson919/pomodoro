import Image from "next/image";
import {CircularProgress, Card, CardBody, Button} from "@nextui-org/react";

export default function Home() {
  return (
    <div className="py-10 md:py-0 px-5 md:px-10 flex flex-col items-center justify-start md:justify-center w-screen h-screen bg-dark1">
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4">
        <Card className="p-4 bg-darkaccent w-full md:w-1/2 rounded-lg">
          <CardBody className="flex flex-col md:flex-row items-center justify-center gap-4">
            <CircularProgress
              classNames={{
                svg: "w-36 h-36 drop-shadow-md",
                indicator: "stroke-secondary",
                track: "stroke-secondary/10",
                value: "text-3xl font-semibold text-secondary",
              }}
              showValueLabel={false}
              strokeWidth={4}
              value={70}
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-6xl font-bold text-white">10:00</h1>
              <Button variant="faded" color="secondary" size="lg">Start</Button>
            </div>
          </CardBody>
        </Card>
        <Card className="p-4 bg-darkaccent w-full md:w-1/2 rounded-lg">
          <CardBody>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
