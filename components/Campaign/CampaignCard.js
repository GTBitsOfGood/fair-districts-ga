import { Box, Flex, Text, Button, Center } from "@chakra-ui/react";

const CampaignCard = () => {
  return (
    <Box
      padding={4}
      w={800}
      borderColor="black"
      borderRadius={6}
      borderStyle="solid"
      borderWidth={0.8}
    >
      <Flex direction="row" justifyContent="space-between">
        <Flex direction="column" flex="4">
          <Text fontSize="xl">Campaign Title</Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </Flex>
        <Flex direction="column" justifyContent="space-between">
          <Text fontSize="xl">12/31/22 - 12/31/22</Text>
          <Center>
            <Button variant="ghost" size="sm" colorScheme="brand">
              View Details
            </Button>
          </Center>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CampaignCard;
