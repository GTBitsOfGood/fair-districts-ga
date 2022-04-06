import React from "react";
import { Box, Divider, Flex, Button } from "@chakra-ui/react";
import { If, Else, Then } from "react-if";

const CampaignFooter = ({ hasBack = true, hasNext = true, decrementPage }) => {
  return (
    <Box mt={6}>
      <Divider color="gray.400" mb={4} />
      <Flex justifyContent="space-between" pb={2}>
        <If condition={hasBack}>
          <Then>
            <Button colorScheme="gray" onClick={decrementPage}>
              Back
            </Button>
          </Then>
          <Else>
            <div />
          </Else>
        </If>
        <If condition={hasNext}>
          <Then>
            <Button colorScheme="brand" type="submit">
              Next
            </Button>
          </Then>
          <Else>
            <div />
          </Else>
        </If>
      </Flex>
    </Box>
  );
};

export default CampaignFooter;
