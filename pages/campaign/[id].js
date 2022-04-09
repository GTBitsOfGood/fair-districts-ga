import { Card, Box, Flex, Divider, Heading, IconButton, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import NavBar from "../../components/NavBar";
import { getSession, useSession } from "next-auth/react";
import AccessDeniedPage from "../../components/AccessDeniedPage";
import { ArrowBackIcon, EmailIcon } from "@chakra-ui/icons";
import Link from "next/link";

const CampaignDetailsPage = ({
  id,
  name,
  description,
  startDate,
  assignments,
}) => {
  const { data: session } = useSession();
  if (!session) {
    return <AccessDeniedPage />;
  }
  return (
    <>
      <Flex direction="row" height="100%">
        <NavBar session={session} />
        <Box p={8} flex={1} overflowY="auto">
          <Stack direction="row" spacing={5}>
            <Link href="/campaign">
              <IconButton
                size="lg"
                variant="ghost"
                fontSize="30px"
                colorScheme="brand"
                icon={<ArrowBackIcon />}
              />
            </Link>
            <Heading>{name}</Heading>
          </Stack>
          <Divider />
          <Stack direction="row" spacing={5}>
            <Text><b>Description: </b></Text>
            <Text>{description}</Text>
          </Stack>
          <Stack direction="row" spacing={5}>
            <Text><b>Start Date: </b></Text>
            <Text>{startDate.split("T")[0]}</Text>
          </Stack>
            <Text><b>Assignments: </b></Text>
            {assignments.map(({volunteer, newspaper}) => (
                  <Box>
                    <Stack direction="column">
                  <Stack direction="row">
                  <Text><b>Newspaper: </b></Text>
                     <Text>{newspaper.name}</Text>
                     <Link aref={"mailto: " + newspaper.email}><IconButton
                      size="lg"
                      variant="ghost"
                      fontSize="30px"
                      colorScheme="brand"
                      icon={<EmailIcon />}
                    /></Link>
                  </Stack>
                   <Stack direction="row">
                     <Text><b>Volunteer: </b></Text>
                     <Text>{volunteer.first_name + " " + volunteer.last_name}</Text>
                     <Link href="mailto: <volunteer.email>"><IconButton
                      size="lg"
                      variant="ghost"
                      fontSize="30px"
                      colorScheme="brand"
                      icon={<EmailIcon />}
                    /></Link>
                  </Stack>
                </Stack>
                  </Box>
               ))}
          </Box>
      </Flex>
    </>
  );
};

export async function getServerSideProps(context) {
  const {
    query: { id },
  } = context;
  const res = await axios.get(
    `http://${
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_VERCEL_URL
        : "localhost:3000"
    }/api/campaign?id=${id}`
  );
  const data = await res.data;

  return {
    props: data,
  };
}

export default CampaignDetailsPage;
