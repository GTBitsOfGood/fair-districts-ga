import { Spinner, Center, Stack, Text } from '@chakra-ui/react';

const Loader = () => {
  return (
    <Center>
      <Stack mt="200px" align="center">
        <Text fontSize="2xl">Loading...</Text>
        <Spinner
          size="xl"
          thickness="4px"
          speed="0.8s"
          emptyColor="blue.200"
          color="blue.800"
        />
      </Stack>
    </Center>
  );
};

export default Loader;
