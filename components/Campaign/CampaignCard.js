import { Box, Flex, Text, Button, Center } from "@chakra-ui/react";
import Link from "next/link";
import * as dayjs from "dayjs";

const CampaignCard = ({ id, description, name, startDate }) => {
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
          <Text fontSize="xl">{name}</Text>
          <Text>{description}</Text>
        </Flex>
        <Flex direction="column" justifyContent="space-between">
          <Text fontSize="xl">{dayjs(startDate).format("MM/DD/YYYY")}</Text>
          <Center>
            <Link href={"/campaign/[id]"} as={`/campaign/${id}`} key={id}>
              <Button variant="ghost" size="sm" colorScheme="brand">
                View Details
              </Button>
            </Link>
          </Center>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CampaignCard;
