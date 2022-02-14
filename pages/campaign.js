import React from "react";
import { Box, Button, Center, Flex, Heading, Stack } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { AddIcon } from "@chakra-ui/icons";
import CampaignCard from "../components/CampaignCard";

const Campaign = () => {
  return (
    <Flex direction="row">
      <NavBar />
      <Box p={8} flex={1} h={800}>
        <Heading>Campaigns</Heading>
        <Center flexDir="column">
          <Button
            mb={10}
            rightIcon={<AddIcon />}
            bgColor="#2D285C"
            textColor="white"
            _hover={{ bgColor: "#57537d" }}
          >
            Create New Campaign
          </Button>
          <Stack direction="column" spacing={4} h={800} overflowY="scroll">
            {Array.from(Array(10)).map(() => (
              <CampaignCard />
            ))}
          </Stack>
        </Center>
      </Box>
    </Flex>
  );
};

export default Campaign;
