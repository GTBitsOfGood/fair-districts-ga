import React from "react";
import { 
  Image,
  Text,
  Stack
} from "@chakra-ui/react";
import { signOut } from 'next-auth/react';


const SignInOrOutButton = (props) => {
    return (
      <button
        onClick={() => {
          props.signIn();
        }}
        className="bg-blue-900 rounded-full py-2 px-4 m-8 text-white hover:bg-black hover:text-blue-900 hover:border-blue-900"
      >
        {props.children}
      </button>
    );
  };

const AccessSignOutPage = () => {
  return (
    <Stack h="100vh" spacing={2} justifyContent="center" alignItems="center" direction="column">
      <Image 
        src="/FairDistrictsGA-Logo.png"
        alt='Fair Districts GA Logo'
        objectFit="cover"
        maxWidth={160}
        maxHeight={172}
        paddingBottom={15}
      />
      <Text>Sorry, you are not allowed to use this application.</Text>
      <SignInOrOutButton signIn={signOut}>Sign Out</SignInOrOutButton>
    </Stack>
  );
};

export default AccessSignOutPage;