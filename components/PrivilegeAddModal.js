import React, { useState } from "react";
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

const PrivilegeAddModal = ({ isOpen, onClose, privileges, setPrivileges }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a Special User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              email: "",
            }}
            onSubmit={async (values, actions) => {
              const prunedVals = { ...values };
              const res = await axios.post("/api/specialUser", {
                type: "add",
                formData: prunedVals,
              });
              const status = res.status;
              const data = res.data;
              if (status === 200) {
                setPrivileges([...privileges, data]);
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
                        isInvalid={form.errors.email && form.touched.email}
                        isRequired
                      >
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input {...field} id="email" />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Stack>
                <Box mt={6} mb={4}>
                  <Divider color="gray.400" mb={4} />
                  <Flex justifyContent="right">
                    <Button
                      colorScheme="red"
                      variant="ghost"
                      mr={3}
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button colorScheme="teal" type="submit">
                      Submit
                    </Button>
                  </Flex>
                </Box>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PrivilegeAddModal;
