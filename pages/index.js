import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import NavBar from '../components/NavBar';
import Loader from '../components/Loader';
import { Button } from '@chakra-ui/react';

import { Box, Divider, Image, Stack } from '@chakra-ui/react';
import {
  MdOutlineCampaign,
  MdOutlinePeople,
  MdOutlinePerson,
} from 'react-icons/md';
import { FiHome, FiLogIn, FiLogOut } from 'react-icons/fi';
import { BsNewspaper } from 'react-icons/bs';
import { VscLaw } from 'react-icons/vsc';

const MainNav = ({ session }) => {
  return (
    <Stack padding={2} width={180} direction="column">
      <Image
        src="/FairDistrictsGA-Logo.png"
        objectFit="cover"
        maxWidth={160}
        maxHeight={172}
        paddingBottom={15}
      />
      <Divider />
      <Stack direction="column" spacing={3} paddingTop={2}>
        <Link href="/">
          <Button
            leftIcon={<FiHome />}
            variant="ghost"
            justifyContent="flex-start"
          >
            Home
          </Button>
        </Link>
        <Link href="/campaign">
          <Button
            leftIcon={<MdOutlineCampaign />}
            variant="ghost"
            justifyContent="flex-start"
          >
            Campaign
          </Button>
        </Link>
        <Link href="/volunteer">
          <Button
            leftIcon={<MdOutlinePeople />}
            variant="ghost"
            justifyContent="flex-start"
          >
            Volunteer
          </Button>
        </Link>
        <Link href="/newspaper">
          <Button
            leftIcon={<BsNewspaper />}
            variant="ghost"
            justifyContent="flex-start"
          >
            Newspapers
          </Button>
        </Link>
        <Link href="/legislator">
          <Button
            leftIcon={<VscLaw />}
            variant="ghost"
            justifyContent="flex-start"
          >
            Legislators
          </Button>
        </Link>
      </Stack>
      <Box color="white" paddingTop={250} />
      <Divider />
      <Stack orientation="vertical" spacing={3}>
        <Button
          leftIcon={<MdOutlinePerson />}
          variant="ghost"
          justifyContent="flex-start"
        >
          Profile
        </Button>
        {session ? (
          <Button
            leftIcon={<FiLogOut />}
            variant="ghost"
            onClick={signOut}
            justifyContent="flex-start"
          >
            Log Out
          </Button>
        ) : (
          <Button
            leftIcon={<FiLogIn />}
            variant="ghost"
            onClick={signIn}
            justifyContent="flex-start"
          >
            Log In
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

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
    <button
      onClick={() => {
        props.signIn();
      }}
      className="bg-blue-900 rounded-full py-2 px-4 m-8 text-white hover:bg-white hover:text-blue-900 hover:border-2 hover:border-blue-900"
    >
      {props.children}
    </button>
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
          <MainButton href="/campaigns" message="Manage Campaigns" />
          <MainButton href="/volunteers" message="Manage Volunteers" />
          <MainButton href="/legislators" message="Manage Legislators" />
          <MainButton href="/counties" message="Manage Counties" />
          <MainButton2 message="Sign Out" />
        </div>
      </div>
    </div>
  );
};

export default function Component() {
  const { data: session } = useSession();

  const OtherComponent = React.lazy(() => MainPageMenu);

  if (session === undefined) {
    return <Loader />;
  }
  if (session) {
    return (
      <React.Suspense fallback={<Loader />}>
        <div className="flex flex-row">
          <MainNav session={session} />
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
        {/* <div>
          <MainPageMenu session={session} />
          <MainNav session={session} />
        </div> */}
      </React.Suspense>
    );
  }
  return (
    <div className="w-full flex flex-col items-center justify-center my-24">
      <div className="border-2 border-blue-900 p-4">
        <h1 className="font-bold text-xl">Fair Districts GA</h1>
        <p>You are not signed in.</p>
        <SignInOrOutButton signIn={signIn}>Sign In</SignInOrOutButton>
      </div>
    </div>
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
