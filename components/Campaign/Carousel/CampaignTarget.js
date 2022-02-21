import {
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tab,
  Text,
  Checkbox,
  Stack,
  Box,
  Divider,
  Flex,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const CampaignTarget = ({
  setCurrentPage,
  campaignForm,
  setCampaignForm,
  counties,
  setCounties,
  legislators,
  setLegislators,
}) => {
  return (
    <>
      <Tabs variant="soft-rounded" colorScheme="brand" align="center">
        <TabList>
          <Tab>Counties</Tab>
          <Tab>Legislators</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Flex direction="row">
              <Box flex={1}>
                <Text fontSize="lg" fontWeight={600} mb={2}>
                  Choose counties
                </Text>
                <Stack direction="column">
                  {Object.keys(counties).map((county) => (
                    <Checkbox
                      key={`checkbox-${county}`}
                      colorScheme="brand"
                      isChecked={counties[county]}
                      onChange={() => {
                        const newCounties = { ...counties };
                        newCounties[county] = !newCounties[county];
                        setCounties(newCounties);
                      }}
                    >
                      {county}
                    </Checkbox>
                  ))}
                </Stack>
              </Box>
              <Box flex={1}>
                <Text fontSize="lg" fontWeight={600} mb={2}>
                  Selected counties
                </Text>
                <Stack direction="column">
                  {Object.keys(counties)
                    .filter((county) => counties[county])
                    .map((county) => (
                      <Text key={`selected-${county}`}>{county}</Text>
                    ))}
                </Stack>
              </Box>
            </Flex>
          </TabPanel>
          <TabPanel>
            <Flex direction="row">
              <Box flex={1}>
                <Text fontSize="lg" fontWeight={600} mb={2}>
                  Choose legislators
                </Text>
                <Stack direction="column">
                  {Object.keys(legislators).map((legislatorId) => (
                    <Checkbox
                      key={`checkbox-${legislatorId}`}
                      colorScheme="brand"
                      isChecked={legislators[legislatorId].selected}
                      onChange={() => {
                        const newLegislators = { ...legislators };
                        const newLegislator = {
                          ...legislators[legislatorId],
                          selected: !legislators[legislatorId].selected,
                        };
                        newLegislators[legislatorId] = newLegislator;
                        setLegislators(newLegislators);
                      }}
                    >
                      {legislators[legislatorId].firstName}{" "}
                      {legislators[legislatorId].lastName}
                    </Checkbox>
                  ))}
                </Stack>
              </Box>
              <Box flex={1}>
                <Text fontSize="lg" fontWeight={600} mb={2}>
                  Selected legislators
                </Text>
                <Stack direction="column">
                  {Object.keys(legislators)
                    .filter(
                      (legislatorId) => legislators[legislatorId].selected
                    )
                    .map((legislatorId) => (
                      <Text key={`selected-${legislatorId}`}>
                        {legislators[legislatorId].firstName}{" "}
                        {legislators[legislatorId].lastName}
                      </Text>
                    ))}
                </Stack>
              </Box>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Box mb={3}>
        <Divider color="gray.400" mb={4} />
        <Flex justifyContent="space-between">
          <Button colorScheme="gray" onClick={() => setCurrentPage(0)}>
            Back
          </Button>
          <Button
            colorScheme="brand"
            onClick={() => /* validation */ setCurrentPage(2)}
          >
            Next
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default CampaignTarget;
