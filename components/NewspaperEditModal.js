import React, { useMemo } from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Stack,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  Textarea,
  Flex,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import axios from "axios";

const validateReq = (value) => {
  let error;
  if (!value) {
    error = "Required field";
  }
  return error;
};

const NewspaperEditModal = ({
  isOpen,
  onClose,
  newspaperMeta,
  newspapers,
  setNewspapers,
}) => {
  const prunedNewspaper = useMemo(() => {
    if (newspaperMeta === undefined) return;
    return {
      ...newspaperMeta.newspaper,
      counties: newspaperMeta.newspaper.counties.map((c) => c.name),
    };
  }, [newspaperMeta]);

  const { newspaper, index } = newspaperMeta;

  return (
    <>
      {newspaperMeta ? (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{`Edit ${prunedNewspaper.name}`}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Formik
                initialValues={prunedNewspaper}
                onSubmit={async (values, actions) => {
                  const prunedVals = { ...values };
                  prunedVals.counties = prunedVals.counties.filter((e) => e);
                  prunedVals.rating = parseInt(prunedVals.rating);
                  const res = await axios.post("/api/newspaper", {
                    type: "edit",
                    id: newspaper.id,
                    formData: prunedVals,
                    original: newspaper,
                  });
                  const status = await res.status;
                  const data = await res.data;
                  console.log(data);

                  if (status === 200) {
                    const clonedNewspapers = [...newspapers];
                    clonedNewspapers[index] = data;
                    setNewspapers(clonedNewspapers);
                    onClose();
                  }
                }}
              >
                {(props) => (
                  <Form>
                    <Stack direction="column" spacing={4}>
                      <Field name="name" validate={validateReq}>
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.name && form.touched.name}
                            isRequired
                          >
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Input {...field} id="name" />
                            <FormErrorMessage>
                              {form.errors.name}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="email" validate={validateReq}>
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.email && form.touched.email}
                            isRequired
                          >
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input {...field} id="email" />
                            <FormErrorMessage>
                              {form.errors.email}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="rating">
                        {({ field, form }) => (
                          <FormControl>
                            <FormLabel htmlFor="rating">Rating</FormLabel>
                            <NumberInput
                              onChange={(val) =>
                                form.setFieldValue(field.name, val)
                              }
                              defaultValue={50}
                              id="rating"
                              precision={0}
                            >
                              <NumberInputField />
                            </NumberInput>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="description">
                        {({ field, form }) => (
                          <FormControl>
                            <FormLabel htmlFor="description">
                              Description
                            </FormLabel>
                            <Textarea {...field} id="description" />
                          </FormControl>
                        )}
                      </Field>
                      <Field name="website">
                        {({ field, form }) => (
                          <FormControl>
                            <FormLabel htmlFor="website">Website</FormLabel>
                            <Input {...field} id="website" />
                          </FormControl>
                        )}
                      </Field>
                      <Field name="instagram">
                        {({ field, form }) => (
                          <FormControl>
                            <FormLabel htmlFor="instagram">Instagram</FormLabel>
                            <InputGroup>
                              <InputLeftElement color="gray.400">
                                @
                              </InputLeftElement>
                              <Input {...field} id="instagram" />
                            </InputGroup>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="twitter">
                        {({ field, form }) => (
                          <FormControl>
                            <FormLabel htmlFor="twitter">Twitter</FormLabel>
                            <InputGroup>
                              <InputLeftElement color="gray.400">
                                @
                              </InputLeftElement>
                              <Input {...field} id="twitter" />
                            </InputGroup>
                          </FormControl>
                        )}
                      </Field>
                      <Box>
                        <FieldArray name="counties">
                          {(arrayHelpers) => (
                            <>
                              <Flex direction="row">
                                <FormLabel htmlFor="counties">
                                  Counties
                                </FormLabel>
                                <IconButton
                                  size="xs"
                                  icon={<AddIcon />}
                                  onClick={() => arrayHelpers.push("")}
                                />
                              </Flex>
                              <Stack direction="column" spacing={2}>
                                {props.values.counties.map((county, i) => (
                                  <Field key={i} name={`counties.${i}`}>
                                    {({ field, form }) => (
                                      <Flex direction="row" alignItems="center">
                                        <Input {...field} id={`county-${i}`} />
                                        <IconButton
                                          m={1}
                                          size="xs"
                                          icon={<MinusIcon />}
                                          onClick={() => arrayHelpers.remove(i)}
                                        />
                                      </Flex>
                                    )}
                                  </Field>
                                ))}
                              </Stack>
                            </>
                          )}
                        </FieldArray>
                      </Box>
                    </Stack>
                    <Box mt={6} mb={4}>
                      <Divider color="gray.400" mb={4} />
                      <Flex justifyContent="space-between">
                        <Button
                          colorScheme="red"
                          onClick={async () => {
                            const res = await axios.post("/api/newspaper", {
                              type: "delete",
                              id: newspaper.id,
                            });
                          }}
                        >
                          Delete
                        </Button>
                        <Box>
                          <Button
                            colorScheme="red"
                            variant="ghost"
                            mr={3}
                            onClick={onClose}
                          >
                            Cancel
                          </Button>
                          <Button colorScheme="teal" type="submit">
                            Save
                          </Button>
                        </Box>
                      </Flex>
                    </Box>
                  </Form>
                )}
              </Formik>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
};

export default NewspaperEditModal;
