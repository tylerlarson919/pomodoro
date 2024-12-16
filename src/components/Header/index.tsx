import { useEffect, useState } from "react";
import {Navbar, Image, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { auth } from "../../../firebase"; // Adjust the path if necessary
import { onAuthStateChanged, User } from "firebase/auth";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function Header() {
    const [user, setUser] = useState<null | User>(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe(); // Cleanup listener on unmount
    }, []);
    
    
    return (
    <Navbar>
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#" className="text-white">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#" className="text-white">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#" className="text-white">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
      {user ? (
          <NavbarItem>
            <div className="flex flex-row gap-2 items-center">
                <Button as={Link} color="primary" href="/timer" variant="flat" className="text-white">
                Go to App
                </Button>
                <Image
                    className="w-full rounded-full"
                    alt="NextUI hero Image"
                    src={user?.photoURL || "https://via.placeholder.com/40"}
                    height={35}
                />
            </div>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem>
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat" className="text-white">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
