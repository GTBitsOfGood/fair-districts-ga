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
import { RiAdminLine } from 'react-icons/ri'
import Link from 'next/link';
import adminEmails from "../pages/api/auth/adminEmails";

const NavBar = ({ session }) => {
  return (
    <Stack padding={2} width={180} height='100%' direction="column" borderRightWidth='1px' borderColor='gray.200'>
      <Image
        src="/FairDistrictsGA-Logo.png"
        objectFit="cover"
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
            Campaigns
          </Button>
        </Link>
        <Link href="/volunteer">
          <Button
            leftIcon={<MdOutlinePeople />}
            variant="ghost"
            justifyContent="flex-start"
          >
            Volunteers
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
        {adminEmails.includes(session.user.email) && 
        <Link href="/privilege">
          <Button
            leftIcon={<RiAdminLine />}
            variant="ghost"
            justifyContent="flex-start"
          >
            Privileges
          </Button>
        </Link>}
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
