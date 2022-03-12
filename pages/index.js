import { useSession, signIn } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Loader from '../components/Loader';
import AccessSignOutPage from '../components/AccessSignOutPage';
import { Button, Center, Heading, Text, VStack } from '@chakra-ui/react';
import adminEmails from './api/auth/adminEmails';

const MainButton = (props) => {
  return (
    <Button
      size="md"
      borderRadius="3xl"
      px="20px"
      py="16px"
      color="white"
      bg="purple.700"
    >
      <a>{props.message}</a>
    </Button>
  );
};

const AdminGridBox = (props) => {
  return null;
};

const SignInOrOutButton = (props) => {
  return (
    <Button
      onClick={() => {
        props.signIn();
      }}
      color="#fff"
      background="#39449d"
      _hover={{
        background: '#232a62',
      }}
    >
      {props.children}
    </Button>
  );
};

export default function Component() {
  const { data: session } = useSession();
  const [specialUsers, setSpecialUsers] = useState([]);

  useEffect(() => {
    async function initSpecialUsers() {
      let resSpecialUsers = await axios.get(`/api/specialUser`);
      resSpecialUsers = resSpecialUsers.data.map((u) => u.email);
      setSpecialUsers(resSpecialUsers);
    }
    initSpecialUsers();
  }, []);

  if (session === undefined) {
    return <Loader />;
  }
  if (session) {
    if (!adminEmails.includes(session.user.email)) {
      if (!specialUsers.includes(session.user.email)) {
        return <AccessSignOutPage />;
      }
    }
    return (
      <React.Suspense fallback={<Loader />}>
        <div className="flex flex-row">
          <NavBar session={session} />
          <div className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-end h-16 w-full"></div>
            <div className="flex flex-col items-center justify-center">
              <MainButton href="/campaigns" message="Manage Campaigns" />
              <MainButton href="/volunteers" message="Manage Volunteers" />
              <MainButton href="/legislators" message="Manage Legislators" />
              <MainButton href="/counties" message="Manage Counties" />
            </div>
          </div>
        </div>
      </React.Suspense>
    );
  }

  return (
    <Center width="100%" height="40%">
      <VStack
        borderWidth="4px"
        borderRadius="lg"
        borderColor="#39449d"
        flexDirection="column"
        alignItems="center"
        width="40%"
        justifyContent="center"
        p="10px"
        spacing="10px"
      >
        <Heading>Fair Districts GA</Heading>
        <Text fontSize="xl">You are not signed in.</Text>
        <SignInOrOutButton signIn={signIn}>Sign In</SignInOrOutButton>
      </VStack>
    </Center>
  );
}
