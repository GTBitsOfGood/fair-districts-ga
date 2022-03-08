import React from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { AddIcon } from "@chakra-ui/icons";
import CampaignCard from "../components/Campaign/CampaignCard";
import CampaignModal from "../components/Campaign/CampaignModal";
import { getSession, useSession } from "next-auth/react";
import AccessDeniedPage from "../components/AccessDeniedPage";

const Campaign = () => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <Flex direction="row">
        <NavBar />
        <Box p={8} flex={1}>
          <Heading>Campaigns</Heading>
          <Center flexDir="column">
            <Button
              mb={10}
              rightIcon={<AddIcon />}
              colorScheme="brand"
              onClick={onOpen}
            >
              Create New Campaign
            </Button>
            <Stack
              direction="column"
              spacing={4}
              // h={650}
              overflowY="scroll"
              // display="flex"
              // flexDir="column"
              // flex={1}
            >
              {Array.from(Array(3)).map((i, j) => (
                <CampaignCard key={j} />
              ))}
            </Stack>
          </Center>
        </Box>
      </Flex>
      <CampaignModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export async function getServerSideProps(context) {
  // campaign fetch to go here
  return {
    props: {
      session: await getSession(context),
    },
  };
}

export default Campaign;
