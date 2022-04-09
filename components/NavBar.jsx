import React from "react";
import { signIn, signOut } from "next-auth/react";
import { Box, Button, Divider, Icon, Image, Stack } from "@chakra-ui/react";
import {
  MdOutlineCampaign,
  MdOutlinePeople,
  MdOutlinePerson,
} from "react-icons/md";
import { FiHome, FiLogIn, FiLogOut } from "react-icons/fi";
import { BsNewspaper } from "react-icons/bs";
import { VscLaw } from "react-icons/vsc";
import { RiAdminLine } from "react-icons/ri";
import Link from "next/link";
import adminEmails from "../pages/api/auth/adminEmails";

const GAIcon = (props) => (
  <Icon viewBox="0 0 80 80" {...props}>
    <path d="M49.52 60.64v-0.88l0.48-2.080-0.88 1.040zM10 37.92l-0.24 1.12 1.040 0.88-1.52 1.44-1.44 4.56 1.12 3.68-0.88 4.72 0.88 1.28 0.16 1.52 1.44 3.44 29.92 2.32 0.8 2.56 1.44-0.080 0.48-2.72-0.32-2 0.72-1.12 5.36 1.44-0.32-1.84 0.48 0.080-0.16-0.88 0.56-0.64-0.64-0.4 0.64-0.4-0.64-0.88 0.96 0.88 0.16-1.44-0.4 0.72-0.48-0.72 0.4 0.16v-1.2l0.32-0.080 0.56 0.96 1.12-1.44-0.64-0.88-1.76-0.64 2.4 0.4-0.64-1.2 0.64 0.48 1.2-2.080-1.44 0.72 0.24-0.56-0.64-0.24 1.44-0.64-0.48-0.56 0.88 0.96 0.24-1.44v-0.4l-0.080 0.4-1.040 0.24 0.48-0.64-0.88-0.72 2 0.32 0.8-1.2-1.28-0.24 0.56-0.4-0.32-0.32 1.6 0.4 0.48-0.4-0.4-0.48 0.4-0.48 0.4 0.24 0.72-0.64-3.44-1.68v-2.48l-0.64-2.080-2.32-1.76v-1.68l-1.36-3.92-2.64-1.44-0.24-1.040-0.88-0.4 0.16-0.72-0.96-0.64v-1.44l-2.8-1.76-0.96-2.24-3.28-2.56-1.68-2.72-1.68-3.76-1.84-0.56-1.44-1.44-1.84-1.44 0.32-1.44 2.24-2.32-27.12-0.48 3.68 27.28 0.88 3.76z" />
  </Icon>
);

const NavBar = ({ session }) => {
  return (
    <Stack
      padding={2}
      width={180}
      height="100%"
      direction="column"
      borderRightWidth="1px"
      borderColor="gray.200"
      overflowY="auto"
    >
      <Image
        src="/FairDistrictsGA-Logo.png"
        objectFit="cover"
        maxWidth={80}
        maxHeight={86}
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
        <Link href="/county">
          <Button
            leftIcon={<GAIcon boxSize={5} />}
            variant="ghost"
            justifyContent="flex-start"
          >
            Counties
          </Button>
        </Link>
        {adminEmails.includes(session.user.email) && (
          <Link href="/privilege">
            <Button
              leftIcon={<RiAdminLine />}
              variant="ghost"
              justifyContent="flex-start"
            >
              Privileges
            </Button>
          </Link>
        )}
      </Stack>
      <Box color="white" paddingTop={250} />
      <Divider />
      <Stack orientation="vertical" spacing={3}>
        <Link href="/profile">
          <Button
            leftIcon={<MdOutlinePerson />}
            variant="ghost"
            justifyContent="flex-start"
          >
            Profile
          </Button>
        </Link>
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
