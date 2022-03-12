import React, { useEffect, useMemo, useState } from "react";
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
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  Textarea,
  Flex,
  IconButton,
  Divider,
  Text,
  Checkbox,
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import axios from "axios";
import VolunteerAlertDialog from "./VolunteerAlertDialog";
import { Select } from "chakra-react-select";
import { georgiaCounties } from "../utils/consts";

const validateReq = (value) => {
  let error;
  if (!value) {
    error = "Required field";
  }
  return error;
};

const validateEmail = (value) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let error;
  if (!value) {
    error = "Required field";
  } else if (!re.test(value)) {
    error = "Not a valid email";
  }
  return error;
};

const VolunteerEditModal = ({
  isOpen,
  onClose,
  volunteers,
  volunteerIndex,
  setVolunteers,
}) => {
  const [alertOpen, setAlertOpen] = useState(false);

  const volunteer = volunteers[volunteerIndex];
  if (volunteers.length > 0) {
    const { countyId, assignments, ...prunedVolunteer } = volunteer;

  }


  return (
    <>
      {volunteer ? (
        <>
          <VolunteerAlertDialog
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            volunteerId={volunteer.id}
            volunteers={volunteers}
            index={volunteerIndex}
            setVolunteers={setVolunteers}
            onClose={onClose}
          />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{`Edit ${prunedVolunteer.first_name} ${prunedVolunteer.last_name}`}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Formik
                  initialValues={{
                    ...prunedVolunteer,
                    county: volunteer.county.name,
                  }}
                  onSubmit={async (values, actions) => {
                    if (document.getElementById("submitter").checked) {
                      values.submitter = true;
                    } else {
                      values.submitter = false;
                    }
                    if (document.getElementById("writer").checked) {
                      values.writer = true;
                    } else {
                      values.writer = false;
                    }
                    if (document.getElementById("tracker").checked) {
                      values.tracker = true;
                    } else {
                      values.tracker = false;
                    }
                    const res = await axios.post("/api/volunteer", {
                      type: "edit",
                      id: volunteer.id,
                      formData: values,
                      original: prunedVolunteer,
                    });
                    const status = await res.status;
                    const data = await res.data;

                    if (status === 200) {
                      const clonedVolunteers = [...volunteers];
                      clonedVolunteers[volunteerIndex] = data;
                      setVolunteers(clonedVolunteers);
                      onClose();
                    }
                  }}
                >
                  {(props) => (
                    <Form>
                      <Stack direction="column" spacing={4}>
                        <Field name="first_name" validate={validateReq}>
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.first_name &&
                                form.touched.first_name
                              }
                              isRequired
                            >
                              <FormLabel htmlFor="first_name">
                                First Name
                              </FormLabel>
                              <Input {...field} id="first_name" />
                              <FormErrorMessage>
                                {form.errors.first_name}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="last_name" validate={validateReq}>
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.last_name && form.touched.last_name
                              }
                              isRequired
                            >
                              <FormLabel htmlFor="last_name">
                                Last Name
                              </FormLabel>
                              <Input {...field} id="last_name" />
                              <FormErrorMessage>
                                {form.errors.last_name}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="email" validate={validateEmail}>
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.email && form.touched.email
                              }
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
                        <Field name="phone">
                          {({ field, form }) => (
                            <FormControl>
                              <FormLabel htmlFor="phone">Phone</FormLabel>
                              <Input {...field} id="phone" />
                              <FormErrorMessage>
                                {form.errors.phone}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="county" validate={validateReq}>
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.county && form.touched.county
                              }
                              isRequired
                            >
                              <FormLabel htmlFor="county">County</FormLabel>

                              <Select
                                defaultValue={{
                                  label: field.value,
                                  value: field.value,
                                }}
                                options={georgiaCounties.map((county) => ({
                                  label: county,
                                  value: county,
                                }))}
                                onChange={(option) => {
                                  form.setFieldValue(field.name, option.value);
                                }}
                              />
                              <FormErrorMessage>
                                {form.errors.county}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="comments">
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.comments && form.touched.comments
                              }
                            >
                              <FormLabel htmlFor="comments">Comments</FormLabel>
                              <Input {...field} id="comments" />
                              <FormErrorMessage>
                                {form.errors.comments}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="submitter">
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.submitter && form.touched.submitter
                              }
                            >
                              <FormLabel htmlFor="submitter">
                                Submitter
                              </FormLabel>
                              <Checkbox id="submitter" />
                              <FormErrorMessage>
                                {form.errors.submitter}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="writer">
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.writer && form.touched.writer
                              }
                            >
                              <FormLabel htmlFor="writer">Writer</FormLabel>
                              <Checkbox id="writer" />
                              <FormErrorMessage>
                                {form.errors.writer}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="tracker">
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.tracker && form.touched.tracker
                              }
                            >
                              <FormLabel htmlFor="tracker">Tracker</FormLabel>
                              <Checkbox id="tracker" />
                              <FormErrorMessage>
                                {form.errors.tracker}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </Stack>
                      <Box mt={6} mb={4}>
                        <Divider color="gray.400" mb={4} />
                        <Flex justifyContent="space-between">
                          <Button
                            colorScheme="red"
                            onClick={() => {
                              setAlertOpen(true);
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
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default VolunteerEditModal;
