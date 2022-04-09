import React, {useEffect, useState, useRef} from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { AddIcon } from "@chakra-ui/icons";
import { getSession, useSession } from "next-auth/react";
import AccessDeniedPage from "../components/AccessDeniedPage";
import adminEmails from "./api/auth/adminEmails";
import axios from "axios";

const Profile = () => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ specialUsers, setSpecialUsers] = useState([]);

  useEffect(() => {
    async function initProfile() {
      const resSpecialUsers = await axios.get(`api/specialUser`);
      const specialUsers = resSpecialUsers.data.map(u => u.email);
      setSpecialUsers(specialUsers);
    }
    initProfile();
  }, []);

  if (!session) {
    return <AccessDeniedPage />
  } else {
    if (!adminEmails.includes(session.user.email)) {
      if (!specialUsers.includes(session.user.email)) {
        return <AccessDeniedPage />
      }
    }
  }


  return (
    <>
      <Flex direction="row"  height="100%">
        <NavBar session={session}/>
        <Box p={8} flex={1} overflowY="auto">
          <Heading>Profile</Heading>
          <Stack marginTop="20px">
            <Text fontSize='xl'>Hello, {session.user.name}!</Text>
            <Text fontSize='xl'>You are {adminEmails.includes(session.user.email) ? "an admin (can give other users privileges)": "a user"}</Text>
          </Stack>
        </Box>
      </Flex>
    </>
  );
};

export default Profile;
