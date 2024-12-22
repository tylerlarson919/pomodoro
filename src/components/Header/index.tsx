
import { useEffect, useState } from "react";
import {Navbar, Image, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { auth } from "../../../firebase"; // Adjust the path if necessary
import { onAuthStateChanged, User } from "firebase/auth";
import { BackgroundGradient } from "../ui/background-gradient";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import LoginIcon from "../../../public/icons/log-in";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { HoverBorderGradientPurple } from "../ui/hover-border-gradient-purple";

export default function Header() {
    const [user, setUser] = useState<null | User>(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe(); // Cleanup listener on unmount
    }, []);
    
    
    return (
      <div className="w-full min-h-20 max-h-20 px-5 sm:px-32 lg:px-40 py-2 bg-transparent sticky top-0 z-50">
        <HoverBorderGradientPurple as="div" containerClassName="rounded-2xl w-full" className="w-full h-full rounded-2xl bg-darkaccent/90 backdrop-blur-sm shadow-sm flex flex-row items-center justify-between p-2">
            <Image
              className="w-full rounded-full"
              alt="FocuusFlow Logo"
              src="./podo_logo.png"
              height={50}
            />
          <div className="flex flex-row gap-2 items-center justify-center">
            <Link href="/features" className="text-white">Features</Link>
            <Link href="/pricing" className="text-white">Pricing</Link>
          </div>
          {user ? (
            <div className="flex flex-row gap-2 items-center justify-center">
              <Button as={Link} color="primary" href="/timer" variant="flat" className="text-white">
                Go to App
              </Button>
              <Image
                className="w-full rounded-full"
                alt="User Profile"
                src={user?.photoURL || "https://via.placeholder.com/40"}
                height={35}
              />
            </div>
        ) : (
          <>
            <div className="flex flex-row gap-2 items-center justify-center">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="bg-darkaccent text-white flex items-center space-x-2"
            >
              <span>Get Started</span>
            </HoverBorderGradient>

            </div>
          </>
        )}
      </HoverBorderGradientPurple>
    </div>
  );
}
