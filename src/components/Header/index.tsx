
import { useEffect, useState } from "react";
import { Image, Link, Button } from "@nextui-org/react";
import { auth } from "../../../firebase"; // Adjust the path if necessary
import { onAuthStateChanged, User } from "firebase/auth";
import UserHeaderIconMainPage from "@/components/userHeaderIconMainPage";


export default function Header() {
    const [user, setUser] = useState<null | User>(null);
  

    const getStarted = () => {
      window.location.href = "/signup";
    };
    
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe(); // Cleanup listener on unmount
    }, []);
    
    const pricingClick = () => {
      const element = document.getElementById('pricing-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const featuresClick = () => {
      const element = document.getElementById('features-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    return (
      <div className="w-full min-h-20 max-h-20 md:px-32 lg:px-40 sticky top-0 z-50 max-w-[1320px]">
        <div className="border-b-2 md:border-2 border-[#823fca]/50 shadow-[0_0_30px_0px_rgba(130,63,202,0.3)] w-full h-full md:rounded-2xl bg-darkaccent/50 backdrop-blur-lg flex flex-row items-center justify-between px-6 py-3">
          <Image
            className="rounded-none"
            alt="Focus Flow Logo"
            src="./logo/focus-flow-icon-white.png"
            height={40}
            width={40}
          />
          <div className="flex flex-row gap-4 items-center justify-center">
            <Link onPress={featuresClick} className="text-white hover:cursor-pointer">Features</Link>
            <Link onPress={pricingClick} className="text-white hover:cursor-pointer">Pricing</Link>
            {user ? (
            <div className="flex flex-row gap-4 items-center justify-center pr-10">
              <UserHeaderIconMainPage />
            </div>
          ) : (
            <>
              <Button className="dark pl-4"
                color="secondary"
                variant="shadow"
                onPress={getStarted}
              >
                Get Started For Free!

              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
