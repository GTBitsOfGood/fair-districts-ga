import { useEffect, useMemo, useState } from "react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Text,
  Box,
  Divider,
  Flex,
  Button,
  Stack,
  Center,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import { Select } from "chakra-react-select";
import { Else, If, Then, When } from "react-if";

const CampaignAssignments = ({
  campaignForm,
  decrementPage,
  appendNewCampaign,
  onClose,
  resetModal,
}) => {
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newspapers, setNewspapers] = useState([]);
  const [options, setOptions] = useState(false);

  const error = useMemo(() => {
    if (!options && assignments.length === 0) return "No volunteers or newspapers corresponding to chosen focus. Please reselect counties or legislators.";
    for (let a of assignments) {
      if (a.newspaper.value === null || a.volunteer.value === null) {
        return "Resolve empty field";
      }
    }
    return "";
  }, [assignments]);

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
    if (initialAssignments.length > 0) setOptions(true);
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
                      value={volunteer}
                      options={volunteers}
                      onChange={(option) => {
                        const clonedAssignments = [...assignments];
                        clonedAssignments[i] = {
                          ...assignments[i],
                          volunteer: option,
                        };
                        setAssignments(clonedAssignments);
                      }}
                      getOptionLabel={({ label, county, value }) =>
                        value ? `${label}: ${county}` : ""
                      }
                      defaultValue={volunteer}
                    />
                  </Box>
                  <Flex alignItems="center">
                    <IconButton
                      size="xs"
                      variant="ghost"
                      icon={<CloseIcon />}
                      colorScheme="red"
                      onClick={() => {
                        const clonedAssignments = [...assignments];
                        clonedAssignments.splice(i, 1);
                        setAssignments(clonedAssignments);
                      }}
                    />
                  </Flex>
                  <Box w="47%">
                    <Select
                      value={newspaper}
                      options={newspapers}
                      defaultValue={newspaper}
                      onChange={(option) => {
                        const clonedAssignments = [...assignments];
                        clonedAssignments[i] = {
                          ...assignments[i],
                          newspaper: option,
                        };
                        setAssignments(clonedAssignments);
                      }}
                      getOptionLabel={({ label, rating, value }) =>
                        value ? `${label}: ${rating}` : ""
                      }
                    />
                  </Box>
                </Flex>
              ))}
            </Stack>
            <When condition={options || assignments.length > 0 && volunteers.length > 0}>
              <Center>
                <IconButton
                  mt={4}
                  colorScheme="gray"
                  size="sm"
                  icon={<AddIcon />}
                  onClick={() => {
                    const clonedAssignments = [...assignments];
                    clonedAssignments.push({
                      newspaper: {
                        label: "",
                        value: null,
                        rating: "",
                      },
                      volunteer: {
                        label: "",
                        value: null,
                        county: "",
                      },
                    });
                    setAssignments(clonedAssignments);
                  }}
                />
              </Center>
            </When>
            <When condition={error}>
            <Center>
              <Text color="red" fontSize="m" mt={3} textAlign="center">
                {error}
              </Text>
            </Center>
          </When>
          </Box>
        </Else>
      </If>

      <Box mb={3}>
        <Divider color="gray.400" mt={4} mb={4} />
        <Flex justifyContent="space-between">
          <Button colorScheme="gray" onClick={() => decrementPage()}>
            Back
          </Button>
          <Button
            colorScheme={ (error || assignments.length === 0) ? "gray" : "brand"}
            onClick={async () => {
              if (error || assignments.length === 0) return;
              const res = await axios.post("/api/campaign", {
                campaignForm,
                assignments,
              });
              const status = await res.status;
              const data = await res.data;
              if (status === 200) {
                appendNewCampaign(data);
                resetModal();
                onClose();
              }
            }}
          >
            Submit
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default CampaignAssignments;
