import { useRef } from "react";
import {
  Card,
  Box,
  Flex,
  Divider,
  Heading,
  IconButton,
  Stack,
  Text,
  Icon,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import NavBar from "../../components/NavBar";
import { getSession, useSession } from "next-auth/react";
import AccessDeniedPage from "../../components/AccessDeniedPage";
import { ArrowBackIcon, EmailIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { BsNewspaper, BsPersonFill } from "react-icons/bs";
import * as dayjs from "dayjs";
import CampaignDeleteDialog from "../../components/Campaign/CampaignDeleteDialog";

const CampaignDetailsPage = ({
  id,
  name,
  description,
  startDate,
  assignments,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();

  const cancelRef = useRef();

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
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="column">
              <Text>
                <b>Description: </b>
                {description}
              </Text>
              <Text>
                <b>Start Date: </b>
                {dayjs(startDate).format("MMMM D, YYYY")}
              </Text>
              <Text>
                <b>Assignments: </b>
              </Text>
            </Stack>
            <Button colorScheme="red" onClick={onOpen}>
              Delete
            </Button>
          </Flex>
          <Stack direction="column" mt={2}>
            {assignments.map(({ volunteer, newspaper }, i) => (
              <Box
                key={`assignment-${i}`}
                bgColor="gray.200"
                p={4}
                borderRadius={5}
              >
                <Stack direction="column">
                  <Stack direction="row" alignItems="center" spacing={5}>
                    <Icon as={BsPersonFill} fontSize={18} />
                    <Text>
                      {volunteer.first_name} {volunteer.last_name}
                    </Text>
                    <Link href={`mailto:${volunteer.email}`}>
                      <IconButton
                        size="lg"
                        variant="link"
                        colorScheme="brand"
                        icon={<EmailIcon />}
                      />
                    </Link>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={5}>
                    <Icon as={BsNewspaper} fontSize={18} />
                    <Text>{newspaper.name}</Text>
                    <Link href={`mailto:${newspaper.email}`}>
                      <IconButton
                        size="lg"
                        variant="link"
                        colorScheme="brand"
                        icon={<EmailIcon />}
                      />
                    </Link>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Flex>
      <CampaignDeleteDialog
        id={id}
        isOpen={isOpen}
        onClose={onClose}
        cancelRef={cancelRef}
      />
    </>
  );
};

export async function getServerSideProps(context) {
  const {
    query: { id },
  } = context;
  const res = await axios.get(
    `http${process.env.NODE_ENV === "production" ? "s" : ""}://${
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
