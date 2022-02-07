import React from 'react';
import { signIn, signOut } from 'next-auth/react';
import { Box, Button, Divider, Image, Stack } from '@chakra-ui/react';
import {
  MdOutlineCampaign,
  MdOutlinePeople,
  MdOutlinePerson,
} from 'react-icons/md';
import { FiHome, FiLogIn, FiLogOut } from 'react-icons/fi';
import { BsNewspaper } from 'react-icons/bs';
import { VscLaw } from 'react-icons/vsc';
import Link from 'next/link';

const NavBar = ({ session }) => {
  return (
    <Stack padding={2} width={180} direction="column">
      <Image
        src="/FairDistrictsGA-Logo.png"
        objectFit="cover"
        maxWidth={80}
        maxHeight={86}
        paddingBottom={15}
      />
      <Divider />
      <Stack direction="column" spacing={3} paddingTop={2}>
        <Button
          leftIcon={<FiHome />}
          variant="ghost"
          justifyContent="flex-start"
        >
          <Link href="/">Home</Link>
        </Button>
        <Button
          leftIcon={<MdOutlineCampaign />}
          variant="ghost"
          justifyContent="flex-start"
        >
          <Link href="/campaign">Campaign</Link>
        </Button>
        <Button
          leftIcon={<MdOutlinePeople />}
          variant="ghost"
          justifyContent="flex-start"
        >
          <Link href="/volunteer">Volunteer</Link>
        </Button>
        <Button
          leftIcon={<BsNewspaper />}
          variant="ghost"
          justifyContent="flex-start"
        >
          <Link href="/newspaper">Newspapers</Link>
        </Button>
        <Button
          leftIcon={<VscLaw />}
          variant="ghost"
          justifyContent="flex-start"
        >
          <Link href="/legislator">Legislators</Link>
        </Button>
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

export default NavBar;
