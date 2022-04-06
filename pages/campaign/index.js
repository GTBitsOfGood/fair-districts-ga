import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import NavBar from "../../components/NavBar";
import { AddIcon } from "@chakra-ui/icons";
import CampaignCard from "../../components/Campaign/CampaignCard";
import CampaignModal from "../../components/Campaign/CampaignModal";
import { getSession, useSession } from "next-auth/react";
import AccessDeniedPage from "../../components/AccessDeniedPage";
import adminEmails from "../api/auth/adminEmails";
import axios from "axios";

const Campaign = () => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [specialUsers, setSpecialUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  const appendNewCampaign = (newCampaign) => {
    setCampaigns([...campaigns, newCampaign]);
  };

  useEffect(() => {
    async function initCampaign() {
      const resSpecialUsers = await axios.get(`api/specialUser`);
      const specialUsers = resSpecialUsers.data.map((u) => u.email);
      setSpecialUsers(specialUsers);
      const resCampaigns = await axios.get("api/campaign");
      setCampaigns(resCampaigns.data);
    }
    initCampaign();
  }, []);

  if (!session) {
    return <AccessDeniedPage />;
  } else {
    if (!adminEmails.includes(session.user.email)) {
      if (!specialUsers.includes(session.user.email)) {
        return <AccessDeniedPage />;
      }
    }
  }

  return (
    <>
      <Flex direction="row" height="100%">
        <NavBar session={session} />
        <Box p={8} flex={1} overflowY="auto">
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
            <Stack direction="column" spacing={4} overflowY="scroll">
              {campaigns.map(({ id, description, name, startDate }) => (
                <CampaignCard
                  key={id}
                  id={id}
                  description={description}
                  name={name}
                  startDate={startDate}
                />
              ))}
            </Stack>
          </Center>
        </Box>
      </Flex>
      <CampaignModal
        appendNewCampaign={appendNewCampaign}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default Campaign;
