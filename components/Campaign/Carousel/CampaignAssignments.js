import {
  Text,
  Box,
  Divider,
  Flex,
  Button,
  Stack,
  AlertDialogOverlay,
  Center,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { Select } from "chakra-react-select";
import { useEffect, useMemo, useReducer, useState } from "react";
import { Else, If, Then } from "react-if";
import Loader from "../../Loader";

const CampaignAssignments = ({ campaignForm, decrementPage }) => {
  // const [assignments, setAssignments] = useState({
  //   newspapersInCounties: [],
  //   initialAssignments: [],
  //   volunteers: [],
  // });

  // const [initialAssignments]
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newspapers, setNewspapers] = useState([]);

  const selectedVolunteers = useMemo(
    () => new Set(assignments.map(({ volunteer }) => volunteer.value)),
    [assignments]
  );

  useEffect(async () => {
    let focus;
    const {
      focus: { counties, legislators },
    } = campaignForm;
    if (counties) {
      focus = "counties";
    } else if (legislators) {
      focus = "legislators";
    }

    const res = await axios.post(`/api/campaign?focus=${focus}`, campaignForm);
    const {
      newspapersInCounties,
      initialAssignments,
      volunteers: allVolunteers,
    } = res.data;

    setNewspapers(newspapersInCounties);
    setAssignments(initialAssignments);
    setVolunteers(allVolunteers);
    setLoading(false);
  }, []);

  return (
    <>
      <Flex direction="row" justifyContent="space-between">
        <Box w="47%">
          <Center>
            <Text fontSize="lg" fontWeight={600} mb={2}>
              Volunteers
            </Text>
          </Center>
        </Box>
        <Box w="47%">
          <Center>
            <Text fontSize="lg" fontWeight={600} mb={2}>
              Newspapers
            </Text>
          </Center>
        </Box>
      </Flex>
      <If condition={loading}>
        <Then>
          <Center mt={10}>
            <Spinner
              size="xl"
              thickness="4px"
              speed="0.8s"
              emptyColor="blue.200"
              color="blue.800"
            />
          </Center>
        </Then>
        <Else>
          <Box>
            <Stack direction="column" spacing={4}>
              {assignments.map(({ newspaper, volunteer }, i) => (
                <Flex
                  direction="row"
                  justifyContent="space-between"
                  key={`assignment-${i}`}
                >
                  <Box w="47%">
                    <Select
                      options={volunteers.filter(
                        (v) => !selectedVolunteers.has(v.value)
                      )}
                      onChange={(option) => {
                        const clonedAssignments = [...assignments];
                        clonedAssignments[i] = {
                          ...assignments[i],
                          volunteer: option,
                        };
                        setAssignments(clonedAssignments);
                      }}
                      defaultValue={volunteer}
                    />
                  </Box>
                  <Box w="47%">
                    <Select options={newspapers} defaultValue={newspaper} />
                  </Box>
                </Flex>
              ))}
            </Stack>
          </Box>
        </Else>
      </If>

      <Box mb={3}>
        <Divider color="gray.400" mt={4} mb={4} />
        <Flex justifyContent="space-between">
          <Button colorScheme="gray" onClick={() => decrementPage()}>
            Back
          </Button>
          <Button colorScheme="brand">Submit</Button>
        </Flex>
      </Box>
    </>
  );
};

export default CampaignAssignments;
