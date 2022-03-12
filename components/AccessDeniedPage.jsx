import React from "react";
import { 
  Button,
  Image,
  Text,
  Stack
} from "@chakra-ui/react";
import Link from 'next/link'


const AccessDeniedPage = () => {
  return (
    <Stack h="100vh" spacing={2} justifyContent="center" alignItems="center" direction="column">
      <Image 
        src="/FairDistrictsGA-Logo.png"
        alt='Fair Districts GA Logo'
        objectFit="cover"
        maxWidth={160}
        maxHeight={172}
        paddingBottom={15}
      />
      <Text>Sorry, you are not authenticated</Text>
      <Link href="/" passHref>
        <Button 
          variant="ghost"
          maxWidth={40}
        >
          Back to Homepage
        </Button>
      </Link>
    </Stack>
  );
};

export default AccessDeniedPage;
