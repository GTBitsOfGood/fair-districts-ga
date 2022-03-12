import React, { useMemo, useState } from "react";
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
import { Field, Form, Formik } from "formik";
import axios from "axios";
import LegislatorDeleteDialog from "./LegislatorDeleteDialog";
import { Select } from "chakra-react-select";
import { georgiaCounties } from "../utils/consts";

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
  const [alertOpen, setAlertOpen] = useState(false);

  const legislator = legislators[legislatorIndex];

  return (
    <>
      {legislator ? (
        <>
          <LegislatorDeleteDialog
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            onClose={onClose}
            legislatorIndex={legislatorIndex}
            legislators={legislators}
            setLegislators={setLegislators}
          />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{`Edit Legislator: ${legislator.firstName} ${legislator.lastName}`}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Formik
                  initialValues={{
                    ...legislator,
                    counties: legislator.counties.map((county) => county.name),
                  }}
                  onSubmit={async (values, actions) => {
                    const res = await axios.post("/api/legislator", {
                      type: "edit",
                      id: legislator.id,
                      formData: values,
                      original: legislator,
                    });
                    const newLegislator = res.data;

                    if (res.status === 200) {
                      const clonedLegislators = [...legislators];
                      clonedLegislators[legislatorIndex] = newLegislator;
                      setLegislators(clonedLegislators);
                      onClose();
                    } else {
                      actions.setErrors({
                        api: "There was an error when adding to the database.",
                      });
                    }
                  }}
                >
                  {(props) => (
                    <Form>
                      <Stack direction="column" spacing={4}>
                        <Field name="firstName" validate={validateReq}>
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.firstName && form.touched.firstName
                              }
                              isRequired
                            >
                              <FormLabel htmlFor="firstName">
                                First Name
                              </FormLabel>
                              <Input
                                {...field}
                                id="firstName"
                                placeholder="George"
                              />
                              <FormErrorMessage>
                                {form.errors.firstName}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="lastName" validate={validateReq}>
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.lastName && form.touched.lastName
                              }
                              isRequired
                            >
                              <FormLabel htmlFor="lastName">
                                Last Name
                              </FormLabel>
                              <Input
                                {...field}
                                id="lastName"
                                placeholder="Burdell"
                              />
                              <FormErrorMessage>
                                {form.errors.lastName}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="party">
                          {({ field, form }) => (
                            <FormControl>
                              <FormLabel htmlFor="party">Party</FormLabel>
                              <Input
                                {...field}
                                id="party"
                                placeholder="Independent"
                              />
                              <FormErrorMessage>
                                {form.errors.party}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="counties">
                          {({ field, form }) => (
                            <FormControl>
                              <FormLabel>Counties</FormLabel>
                              <Select
                                isMulti
                                closeMenuOnSelect={false}
                                options={georgiaCounties.map((county) => ({
                                  label: county,
                                  value: county,
                                }))}
                                defaultValue={field.value.map((county) => ({
                                  label: county,
                                  value: county,
                                }))}
                                onChange={(options) => {
                                  form.setFieldValue(
                                    field.name,
                                    options.map((option) => option.value)
                                  );
                                }}
                              />
                            </FormControl>
                          )}
                        </Field>

                        <Box>{props.errors.api && props.errors.api}</Box>
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

export default LegislatorEditModal;
