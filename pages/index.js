import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import NavBar from '../components/NavBar';
import Loader from '../components/Loader';

const MainButton = (props) => {
  return (
    <Link href={props.href} passHref>
      <button className="border-blue-900 border-2 hover:bg-blue-900 hover:text-white text-black text-2xl font-bold py-4 px-4 rounded-2xl my-2 mx-4 w-2/4">
        <a>{props.message}</a>
      </button>
    </Link>
  );
};

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

/*
TODO:
change navbar to go all the way across, remove admin menu
design loading spinner -- something custom or with Chakra
remove tailwindcss
*/
const MainPageMenu = ({ session }) => {
  return (
    <div className="flex flex-row">
      <NavBar session={session} />
      <div className="flex flex-col w-full">
        <div className="flex flex-row items-center justify-end h-16 w-full">
          <SignInOrOutButton signIn={signOut}>Sign Out</SignInOrOutButton>
        </div>
        <div className="flex flex-col items-center justify-center">
          <MainButton href="/campaigns" message="Manage Campaigns" />
          <MainButton href="/volunteers" message="Manage Volunteers" />
          <MainButton href="/legislators" message="Manage Legislators" />
          <MainButton href="/counties" message="Manage Counties" />
        </div>
      </div>
    </div>
  );
};

export default function Component() {
  const { data: session } = useSession();

  const OtherComponent = React.lazy(() => MainPageMenu);

  // function MyComponent() {
  //   return (
  //     // Displays <Spinner> until OtherComponent loads
  //     <React.Suspense fallback={<Spinner />}>
  //       <div>
  //         <OtherComponent />
  //       </div>
  //     </React.Suspense>
  //   );
  // }
  if (session === undefined) {
    return <Loader />;
  }
  if (session) {
    return (
      <React.Suspense fallback={<Loader />}>
        <div>
          <MainPageMenu session={session} />
        </div>
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
