import { useRef } from "react";
import {
  Card,
  Box,
  Flex,
  Divider,
  Heading,
  IconButton,
  Stack,
  Spacer,
  Text,
  Icon,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import NavBar from "../../components/NavBar";
import { getSession, useSession } from "next-auth/react";
import AccessDeniedPage from "../../components/AccessDeniedPage";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import { BsMailbox } from "react-icons/bs";
import { ArrowBackIcon, EmailIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { BsNewspaper, BsPersonFill } from "react-icons/bs";
import * as dayjs from "dayjs";
import CampaignDeleteDialog from "../../components/Campaign/CampaignDeleteDialog";
import React, { useState  } from "react";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

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
  const [recipients, setRecipients] = useState({});
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const addRecipient = (index, volunteer, newspaper, id) => {
    setRecipients(recipients => {
      return {
        ...recipients,
        [index]: {volunteer, newspaper, id}
      }
    });
  }

  const removeRecipient = (index) => {
    setRecipients(recipients => {
      let copy = {...recipients};
      delete copy[index];
      return copy;
    });
  }

  async function sendEmails() {
    const production = process.env.NODE_ENV === "production";
    setSending(true);
    let res;
      if (!production) {
        res = await axios.post(`http://localhost:3000/api/mail`, {recipients, file: (file ? file.name : "")});
      } else {
        res = await axios.post(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/mail`, {recipient, file: (file ? file.name: "")})
      }
    const data = await res.data;
    setSending(false);
    setRecipients({});
    setFile(null);
  }

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  }

  async function uploadFile() {
    if (file) {
      const blobService = new BlobServiceClient(
        `https://fairdistricts.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-04-11T07:28:26Z&st=2022-04-10T23:28:26Z&spr=https,http&sig=Epx2E4%2BdBVRBnTEOwFOcFLPVFxB5w%2F%2ByQ9DV2PyQ0k0%3D`
      )

      const containerClient = blobService.getContainerClient('files');
    /* await containerClient.createIfNotExists({
        access: 'container'
      }); */

      const blobClient = containerClient.getBlockBlobClient(file.name);

      const options = {
        blobHTTPHeaders: {
          blobContentType: file.type,
        }
      }

      setUploading(true);
      let res = await blobClient.uploadBrowserData(file, options);
      setUploading(false);
  }
  }


  if (!session) {
    return <AccessDeniedPage />;
  }
  return (
    <>
      <Flex direction="row" height="100%">
        <NavBar session={session} />
        <Box p={8} flex={1} overflowY="auto">
          <Stack direction="row" spacing={5} marginBottom={3}>
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
             
              <Spacer/>
              {Object.keys(recipients).length > 0 && 
                <Flex flexDirection="row" alignItems='center'>
                  <Heading marginRight={3} as='h4' size='md'>{Object.keys(recipients).length} selected...</Heading>
                  <input onChange={onFileChange} type="file" style={{marginRight: 20}}></input>
                  <button onClick={uploadFile}
                      style={{backgroundColor: "blue", padding: "8px", borderRadius: "5px", paddingLeft: "20px", paddingRight: "20px", color:"white", fontWeight: 500}}
                      >{uploading ? "Uploading..." : "Upload File"} </button>
                  <Button leftIcon={<BsMailbox />} colorScheme='pink' variant='solid' onClick={sendEmails} marginLeft={4}>
                    {sending ? "Sending..." : "Send Mail"}
                  </Button>
                </Flex>
              }
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
            {assignments.map(({ volunteer, newspaper, emailSent, id }, i) => (
              <Box
                key={`assignment-${i}`}
                bgColor="gray.200"
                p={4}
                borderRadius={5}
              >
                <Flex flexDirection="row">
                {i in recipients &&      // check box should be active
                  <Flex height="50" flexDirection="column" justifyContent="center"  paddingRight={6}>
                      <MdCheckBox style={{fontSize: "25px"}}
                                  onClick={() => removeRecipient(i)}
                                  cursor="pointer"
                                  color="blue"
                                  /> 
                  </Flex>
                }
                {!(i in recipients) && // check box should not be active
                  <Flex height="50" flexDirection="column" justifyContent="center"  paddingRight={6}>
                      <MdCheckBoxOutlineBlank style={{fontSize: "25px"}} 
                                              onClick={() => addRecipient(i, volunteer, newspaper, id)} 
                                              cursor="pointer"/> 
                  </Flex>
                }
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

                {emailSent && 
                    <Flex flexDirection="column" height="50" justifyContent={"center"} marginLeft="auto" marginRight={10}>
                      <AiOutlineCheck color="green" fontSize="30px" />
                    </Flex>              
                }

                </Flex>
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

  const production = process.env.NODE_ENV === "production";
  let res;
    if (!production) {
      res = await axios.get(`http://localhost:3000/api/campaign?id=${id}`);
    } else {
      res = await axios.get(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/campaign?id=${id}`)
    }
  const data = await res.data;

  return {
    props: data,
  };
}

export default CampaignDetailsPage;
