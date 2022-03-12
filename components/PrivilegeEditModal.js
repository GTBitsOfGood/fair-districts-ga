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
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import axios from "axios";
import PrivilegeAlertDialog from "./PrivilegeAlertDialog";

const validateName = (value) => {
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

const PrivilegeEditModal = ({
  isOpen,
  onClose,
  privileges,
  privilegeIndex,
  setPrivileges,
}) => {
  const [alertOpen, setAlertOpen] = useState(false);

  const privilege = privileges[privilegeIndex];

  return (
    <>
      {privilege ? (
        <>
          <PrivilegeAlertDialog
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            privilegeId={privilege.id}
            index={privilegeIndex}
            privileges={privileges}
            setPrivileges={setPrivileges}
            onClose={onClose}
          />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{`Edit ${privilege.email}`}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Formik
                  initialValues={privilege}
                  onSubmit={async (values, actions) => {
                    const res = await axios.post("/api/specialUser", {
                      type: "edit",
                      id: privilege.id,
                      formData: values,
                      original: privilege,
                    });
                    const status = res.status;
                    const data = res.data;

                    if (status === 200) {
                      const clonedPrivileges = [...privileges];
                      clonedPrivileges[privilegeIndex] = data;
                      setPrivileges(clonedPrivileges);
                      onClose();
                    }
                  }}
                >
                  {(props) => (
                    <Form>
                      <Stack direction="column" spacing={4}>
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

export default PrivilegeEditModal;
