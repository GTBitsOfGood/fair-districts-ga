import { Box, Flex, Heading, IconButton, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import NavBar from "../../components/NavBar";
import { getSession, useSession } from "next-auth/react";
import AccessDeniedPage from "../../components/AccessDeniedPage";
import { ArrowBackIcon } from "@chakra-ui/icons";
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
          <Text>{description}</Text>
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
