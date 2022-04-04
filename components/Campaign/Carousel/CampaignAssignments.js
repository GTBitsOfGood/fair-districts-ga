import { Text, Box, Divider, Flex, Button } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

const CampaignAssignments = ({ campaignForm, decrementPage }) => {
  const [assignments, setAssignments] = useState([]);

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
    setAssignments(res.data);
  }, []);

  return (
    <>
      <Text>Assignments</Text>

      <Box mb={3}>
        <Divider color="gray.400" mb={4} />
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
