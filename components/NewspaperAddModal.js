import React, { useState } from "react";
import axios from "axios";
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
import { Field, Form, Formik } from "formik";
import { Select } from "chakra-react-select";
import { georgiaCounties } from "../utils/consts";

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

const NewspaperAddModal = ({ isOpen, onClose, newspapers, setNewspapers }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a newspaper</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              name: "",
              email: "",
              rating: 50,
              description: "",
              website: "",
              counties: [],
              published: false,
              campus: false, 
            }}
            onSubmit={async (values, actions) => {
              const prunedVals = { ...values };
              prunedVals.published = document.getElementById("published").checked;
              prunedVals.rating = parseInt(prunedVals.rating);
              prunedVals.campus= document.getElementById("campus").checked;

              const res = await axios.post("/api/newspaper", {
                type: "add",
                formData: prunedVals,
              });
              const status = await res.status;
              const data = await res.data;
              if (status === 200) {
                setNewspapers([...newspapers, data]);
                onClose();
              }
            }}
          >
            {(props) => (
              <Form>
                <Stack direction="column" spacing={4}>
                  <Field name="name" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                        isRequired
                      >
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input {...field} id="name" />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
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
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Textarea
                          {...field}
                          onChange={(e) => {
                            e.target.value.length <= 500 &&
                              form.setFieldValue(field.name, e.target.value);
                          }}
                          id="description"
                        />
                        <Flex justifyContent="right">
                          <Text fontSize="sm" textColor="gray.600">
                            {field.value.length}/500
                          </Text>
                        </Flex>
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
                  <Field name="published">
                    {({ field, form }) => (
                      <FormControl>
                        <Checkbox size="md" id="published" colorScheme="red">
                          Published
                        </Checkbox>
                        <FormErrorMessage>
                          {form.errors.published}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="campus">
                    {({ field, form }) => (
                      <FormControl>
                        <Checkbox size="md" id="campus" colorScheme="gray">
                          Campus Paper
                        </Checkbox>
                        <FormErrorMessage>
                          {form.errors.campus}
                        </FormErrorMessage>
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

export default NewspaperAddModal;
