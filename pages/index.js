import React from "react";
import { useSession } from "next-auth/react"
import NavBar from "../components/NavBar";

export default function Component() {
  const { data: session } = useSession();

  return (
    <NavBar session={session} />
  );
};
