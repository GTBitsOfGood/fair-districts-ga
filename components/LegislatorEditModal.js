import React, { useMemo } from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  Button,
  Input,
  Flex,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import axios from "axios";

const validateReq = (value) => {
  let error = value ? undefined : "Required field";
  return error;
};

const LegislatorEditModal = ({
  isOpen,
  onClose,
  legislatorIndex,
  legislators,
  setLegislators,
}) => {
  const prunedLegislator = useMemo(() => {
    if (legislatorIndex >= legislators.length) return;
    const legislator = legislators[legislatorIndex];
    return {
      ...legislator,
      counties: legislator.counties.split(', '),
    };
  }, [legislatorIndex, legislators]);

  return (
    <>
      {prunedLegislator ? (
        <>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{`Edit Legislator: ${prunedLegislator.firstName} ${prunedLegislator.lastName}`}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Formik
                  initialValues={{...prunedLegislator, counties: [...prunedLegislator.counties]}}
                  onSubmit={async (values, actions) => {
                    const prunedVals = { ...values };
                    prunedVals.counties = prunedVals.counties.filter((e) => e);
                    const res = await axios.post("/api/legislator", {
                      type: "edit",
                      id: prunedLegislator.id,
                      formData: prunedVals,
                      original: prunedLegislator,
                    });
                    const newLegislator = res.data;

                    if (res.status === 200) {
                      const clonedLegislators = [...legislators];
                      newLegislator.counties = newLegislator.counties
                        .map((county) => county.name)
                        .join(", ");
                      clonedLegislators[legislatorIndex] = newLegislator;
                      setLegislators(clonedLegislators);
                      onClose();
                    } else {
                      actions.setErrors({api: 'There was an error when adding to the database.'});
                    }
                  }}
                >
                  {(props) => (
                    <Form>
                      <Stack direction="column" spacing={4}>
                        <Field name="firstName" validate={validateReq}>
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={form.errors.firstName && form.touched.firstName}
                              isRequired
                            >
                              <FormLabel htmlFor="firstName">First Name</FormLabel>
                              <Input {...field} id="firstName" placeholder="George" />
                              <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="lastName" validate={validateReq}>
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={form.errors.lastName && form.touched.lastName}
                              isRequired
                            >
                              <FormLabel htmlFor="lastName">Last Name</FormLabel>
                              <Input {...field} id="lastName" placeholder="Burdell" />
                              <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="party">
                          {({ field, form }) => (
                            <FormControl>
                              <FormLabel htmlFor="party">Party</FormLabel>
                              <Input {...field} id="party" placeholder="Independent" />
                              <FormErrorMessage>{form.errors.party}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                    
                        <Box>
                          <FieldArray name="counties">
                            {(arrayHelpers) => (
                              <>
                                <Flex direction="row">
                                  <FormLabel htmlFor="counties">Counties</FormLabel>
                                  <Stack direction="row" spacing={1}>
                                    <IconButton
                                      size="xs"
                                      icon={<MinusIcon />}
                                      onClick={() =>
                                        arrayHelpers.pop()
                                      }
                                    />
                                    <IconButton
                                      size="xs"
                                      icon={<AddIcon />}
                                      onClick={() => arrayHelpers.push("")}
                                    />
                                  </Stack>
                                </Flex>
      
                                <Stack direction="column" spacing={2}>
                                  {props.values.counties.map((county, ind) => (
                                    <Field key={ind} name={`counties.${ind}`}>
                                      {({ field, form }) => (
                                        <Input {...field} id={`county-${ind}`} />
                                      )}
                                    </Field>
                                  ))}
                                </Stack>
                              </>
                            )}
                          </FieldArray>
                          {props.errors.api && props.errors.api}
                        </Box>
                      </Stack>
                      <Box mt={6} mb={4}>
                        <Divider color="gray.400" mb={4} />
                        <Flex justifyContent="right">
                          <Box>
                            <Button
                              colorScheme="red"
                              variant="ghost"
                              mr={3}
                              onClick={() => {
                                onClose();
                                props.resetForm();
                                props.setFieldValue('counties', [...prunedLegislator.counties]);
                              }}>
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
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default LegislatorEditModal;
