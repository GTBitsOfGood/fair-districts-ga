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
  Divider,
  Checkbox,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import React from "react";
import { Select } from "chakra-react-select";
import { georgiaCounties } from "../utils/consts";
import { validateReq, validateEmail, validateZipCode, validatePhone } from "../utils/validation";


const VolunteerAddModal = ({ isOpen, onClose, volunteers, setVolunteers }) => {
  const handleAddSubmit = async (values, actions) => {
    values["submitter"] = document.getElementById("submitter").checked;
    values["writer"] = document.getElementById("writer").checked;
    values["tracker"] = document.getElementById("tracker").checked;
    values["quality"] = parseInt(values["quality"]);
    const res = await axios.post("/api/volunteer", {
      type: "add",
      formData: values,
    });
    const newVolunteer = await res.data;
    if (res.status === 200) {
      setVolunteers([...volunteers, newVolunteer]);
      actions.resetForm();
      onClose();
    } else {
      actions.setErrors({
        api: "There was an error when adding to the database.",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a volunteer</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              first_name: "",
              last_name: "",
              email: "",
              phone: "",
              zip_code: "",
              county: undefined,
              comments: "",
              submitter: false,
              writer: false,
              tracker: false,
              assignments: [],
              quality: null,
            }}
            onSubmit={handleAddSubmit}
          >
            {(props) => (
              <Form>
                <Stack direction="column" spacing={4}>
                  <Field name="first_name" validate={validateReq}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.first_name && form.touched.first_name
                        }
                        isRequired
                      >
                        <FormLabel htmlFor="first_name">First Name</FormLabel>
                        <Input
                          {...field}
                          id="first_name"
                          placeholder="George"
                        />
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
                        <FormLabel htmlFor="last_name">Last Name</FormLabel>
                        <Input
                          {...field}
                          id="last_name"
                          placeholder="Burdell"
                        />
                        <FormErrorMessage>
                          {form.errors.last_name}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="email" validate={validateEmail}>
                    {({ field, form }) => (
                      <FormControl
                        isRequired
                        isInvalid={form.errors.email && form.touched.email}
                      >
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                          {...field}
                          id="email"
                          placeholder="gburdell3@gatech.edu"
                        />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="phone" validate={validatePhone}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.phone && form.touched.phone}
                      >
                        <FormLabel htmlFor="phone">Phone</FormLabel>
                        <Input {...field} id="phone" placeholder="4044044040" />
                        <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="zip_code" validate={validateZipCode}>
                    {({ field, form }) => (
                      <FormControl 
                        isInvalid={form.errors.zip_code && form.touched.zip_code}
                        isRequired
                      >
                        <FormLabel htmlFor="zip_code">Zip Code</FormLabel>
                        <Input {...field} id="zip_code" placeholder="30332" />
                        <FormErrorMessage>{form.errors.zip_code}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="county" validate={validateReq}>
                    {({ field, form }) => (
                      <FormControl
                        isRequired
                        isInvalid={form.errors.county && form.touched.county}
                      >
                        <FormLabel htmlFor="county">County</FormLabel>
                        <Select
                          options={georgiaCounties.map((county) => ({
                            label: county,
                            value: county,
                          }))}
                          onChange={(option) => {
                            form.setFieldValue(field.name, option.value);
                          }}
                          onBlur={() => props.setFieldTouched("county")}
                        />
                        <FormErrorMessage>
                          {form.errors.county}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="comments">
                    {({ field, form }) => (
                      <FormControl>
                        <FormLabel htmlFor="comments">Comments</FormLabel>
                        <Input {...field} id="comments" placeholder="" />
                        <FormErrorMessage>
                          {form.errors.comments}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="submitter">
                    {({ field, form }) => (
                      <FormControl>
                        <Checkbox size="md" id="submitter" colorScheme="red">
                          Submitter
                        </Checkbox>
                        <FormErrorMessage>
                          {form.errors.submitter}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="writer">
                    {({ field, form }) => (
                      <FormControl>
                        <Checkbox size="md" id="writer" colorScheme="gray">
                          Writer
                        </Checkbox>
                        <FormErrorMessage>
                          {form.errors.writer}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="tracker">
                    {({ field, form }) => (
                      <FormControl>
                        <Checkbox size="md" id="tracker" colorScheme="blue">
                          Tracker
                        </Checkbox>
                        <FormErrorMessage>
                          {form.errors.tracker}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="quality">
                    {({ field, form }) => (
                      <FormControl>
                        <FormLabel htmlFor="quality">Quality</FormLabel>
                        <NumberInput
                          onChange={(val) =>
                            form.setFieldValue(field.name, val)
                          }
                          defaultValue={1}
                          min={1}
                          max={3}
                          id="quality"
                          precision={0}
                        >
                          <NumberInputField />
                        </NumberInput>
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

export default VolunteerAddModal;
