import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import React, {useState, useEffect} from 'react';
import NavBar from '../components/NavBar';
import Loader from '../components/Loader';
import AccessSignOutPage from '../components/AccessSignOutPage';
import adminEmails from './api/auth/adminEmails';
import axios from 'axios';

import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

const MainButton = (props) => {
  return (
    <Link href={props.href} passHref>
      <button className="border-blue-900 border-2 hover:bg-blue-900 hover:text-white text-black text-2xl font-bold py-4 px-4 rounded-2xl my-2 mx-4 w-2/4">
        <a>{props.message}</a>
      </button>
    </Link>
  );
};

const MainButton2 = (props) => {
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

const MainPageMenu = ({ session }) => {
  return (
    <div className="flex flex-row">
      <NavBar session={session} />
      <div className="flex flex-col w-full">
        <div className="flex flex-row items-center justify-end h-16 w-full">
          <SignInOrOutButton signIn={signOut}>Sign Out</SignInOrOutButton>
          <MainButton2 message="Sign Out" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <MainButton href="/campaign" message="Manage Campaigns" />
          <MainButton href="/volunteer" message="Manage Volunteers" />
          <MainButton href="/legislator" message="Manage Legislators" />
          <MainButton href="/counties" message="Manage Counties" />
          <MainButton2 message="Sign Out" />
        </div>
      </div>
    </div>
  );
};

export default function Component() {
  const { data: session } = useSession();

 // const OtherComponent = React.lazy(() => MainPageMenu);
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
              <MainButton href="/campaign" message="Manage Campaigns" />
              <MainButton href="/volunteer" message="Manage Volunteers" />
              <MainButton href="/legislator" message="Manage Legislators" />
              <MainButton href="/county" message="Manage Counties" />
            </div>
          </div>
        </div>
        {/* <div>
          <MainPageMenu session={session} />
          <MainNav session={session} />
        </div> */}
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

// import { useSession, signIn, signOut } from 'next-auth/react';
// import Link from 'next/link';
// import React, { useState, useEffect } from 'react';
// import NavBar from '../components/NavBar';
// import Loader from '../components/Loader';
// import adminEmails from './api/auth/adminEmails';
// import AccessSignOutPage from '../components/AccessSignOutPage';
// import axios from 'axios';
// import { Button } from '@chakra-ui/react';

// const MainButton = (props) => {
//   return (
//     <Link href={props.href} passHref>
//       <button className="border-blue-900 border-2 hover:bg-blue-900 hover:text-white text-black text-2xl font-bold py-4 px-4 rounded-2xl my-2 mx-4 w-2/4">
//         <a>{props.message}</a>
//       </button>
//     </Link>
//   );
// };

// const MainButton2 = (props) => {
//   return (
//     <Button
//       size="md"
//       borderRadius="3xl"
//       px="20px"
//       py="16px"
//       color="white"
//       bg="purple.700"
//     >
//       <a>{props.message}</a>
//     </Button>
//   );
// };

// const SignInOrOutButton = (props) => {
//   return (
//     <button
//       onClick={() => {
//         props.signIn();
//       }}
//       className="bg-blue-900 rounded-full py-2 px-4 m-8 text-white hover:bg-black hover:text-blue-900 hover:border-blue-900"
//     >
//       {props.children}
//     </button>
//   );
// };

// const MainPageMenu = ({ session }) => {
//   return (
//     <div className="flex flex-row h-full">
//       <NavBar session={session} />
//       <div className="flex flex-col w-full">
//         <div className="flex flex-row items-center justify-end h-16 w-full">
//           <SignInOrOutButton signIn={signOut}>Sign Out</SignInOrOutButton>
//           <MainButton2 message="Sign Out" />
//         </div>
//         <div className="flex flex-col items-center justify-center">
//           <MainButton href="/campaign" message="Manage Campaigns" />
//           <MainButton href="/volunteer" message="Manage Volunteers" />
//           <MainButton href="/newspaper" message="Manage Newspapers" />
//           <MainButton href="/legislator" message="Manage Legislators" />
//           {adminEmails.includes(session.user.email) && (
//             <MainButton href="/privilege" message="Manage Privileges" />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function Component() {
//   const { data: session } = useSession();
//   const [specialUsers, setSpecialUsers] = useState([]);

//   const OtherComponent = React.lazy(() => MainPageMenu);

//   // function MyComponent() {
//   //   return (
//   //     // Displays <Spinner> until OtherComponent loads
//   //     <React.Suspense fallback={<Spinner />}>
//   //       <div>
//   //         <OtherComponent />
//   //       </div>
//   //     </React.Suspense>
//   //   );
//   // }
//   useEffect(() => {
//     async function initSpecialUsers() {
//       let resSpecialUsers = await axios.get(`/api/specialUser`);
//       resSpecialUsers = resSpecialUsers.data.map((u) => u.email);
//       setSpecialUsers(resSpecialUsers);
//     }
//     initSpecialUsers();
//   }, []);

//   if (session === undefined) {
//     return <Loader />;
//   }
//   if (session) {
//     if (!adminEmails.includes(session.user.email)) {
//       if (!specialUsers.includes(session.user.email)) {
//         return <AccessSignOutPage />;
//       }
//     }

//     return (
//       <React.Suspense fallback={<Loader />} className="h-full">
//         <div className="h-full">
//           <MainPageMenu session={session} />
//         </div>
//         {/* <div>
//           <MainPageMenu session={session} />
//           <MainNav session={session} />
//         </div> */}
//       </React.Suspense>
//     );
//   }
//   return (
//     <div className="w-full flex flex-col items-center justify-center my-24">
//       <div className="border-2 border-blue-900 p-4">
//         <h1 className="font-bold text-xl">Fair Districts GA</h1>
//         <p>You are not signed in.</p>
//         <SignInOrOutButton signIn={signIn}>Sign In</SignInOrOutButton>
//       </div>
//     </div>
//   );
// }
