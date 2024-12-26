
import { useEffect, useState } from "react";
import { Image, Link, Button } from "@nextui-org/react";
import { auth } from "../../../firebase"; // Adjust the path if necessary
import { onAuthStateChanged, User } from "firebase/auth";

export default function Header() {
    const [user, setUser] = useState<null | User>(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe(); // Cleanup listener on unmount
    }, []);
    
    
    return (
      <div className="w-full min-h-20 max-h-20 sm:px-32 lg:px-40 sticky top-0 z-50 max-w-[1320px]">
        <div className="border-b sm:border border-textcolor w-full h-full sm:rounded-2xl bg-darkaccent/50 backdrop-blur-lg flex flex-row items-center justify-between px-10 md:px-14 py-3">
          <Image
            className="w-full rounded-full"
            alt="FocuusFlow Logo"
            src="./podo_logo.png"
            height={50}
          />
          <div className="flex flex-row gap-4 items-center justify-center">
            <Link href="/features" className="text-white">Features</Link>
            <Link href="/pricing" className="text-white">Pricing</Link>
            {user ? (
            <div className="flex flex-row gap-4 items-center justify-center">
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
              <Button className="dark pl-4"
                color="secondary"
                variant="shadow"
                href="/login"
              >
                Get Started

              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
