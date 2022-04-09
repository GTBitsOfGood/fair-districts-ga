import { useSession, signIn } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Loader from '../components/Loader';
import AccessSignOutPage from '../components/AccessSignOutPage';
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import adminEmails from './api/auth/adminEmails';
import LegislatorPreview from '../components/LegislatorPreview';

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

const CampaignAdminBox = () => {
  // # active campaigns
  return <AdminGridBox>Campaigns</AdminGridBox>;
};

const VolunteerAdminBox = () => {
  return <AdminGridBox>Volunteers</AdminGridBox>;
};

const NewspaperAdminBox = () => {
  return <AdminGridBox>Newspapers</AdminGridBox>;
};

const LegislatorAdminBox = () => {
  return (
    <AdminGridBox>
      <LegislatorPreview />
    </AdminGridBox>
  );
};

const PrivilegeAdminBox = () => {
  return <AdminGridBox>Privileges</AdminGridBox>;
};

const AdminGridBox = (props) => {
  return (
    <Box
      borderRadius="4px"
      borderWidth="2px"
      borderColor="black"
      width="100%"
      height="400px"
    >
      {props.children}
    </Box>
  );
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
    if (
      !adminEmails.includes(session.user.email) &&
      !specialUsers.includes(session.user.email)
    ) {
      return <AccessSignOutPage />;
    }
    return (
      <React.Suspense fallback={<Loader />}>
        <Flex direction="row" height="100%">
          <NavBar session={session} />
          <Flex direction="column" width="100%" px="50px" py="40px">
            <Heading>Admin Dashboard</Heading>
            <SimpleGrid spacing="20px" py="10px" columns={[1, 1, 1, 2, 2]}>
              <CampaignAdminBox />
              <VolunteerAdminBox />
              <NewspaperAdminBox />
              <LegislatorAdminBox />
              <PrivilegeAdminBox />
            </SimpleGrid>
          </Flex>
        </Flex>
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
