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
  } from "@chakra-ui/react";
  import { Field, FieldArray, Form, Formik } from "formik";
  import { AddIcon, MinusIcon } from "@chakra-ui/icons"
  import axios from "axios"

  const validateReq = (value) => {
      let error;
      if (!value) {
          error = "Required field. Please provide a value."
      }
  };

  const VolunteerAddModal = ({ isOpen, onClose, volunteers, setVolunteers }) => {
      return (
          <Modal isOpen={isOpen} onClose={}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add a volunteer!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Formik
                      initialValues={{
                          id: cuid(),
                          first_name: "",
                          last_name: "",
                          email: "",
                          phone: "", 
                          county: "",
                          countyId: "",
                          comments: "", 
                          submitter: false,
                          writer: false,
                          tracker: false, 
                          assignments: [""],
                      }}
                      onsubmit = {async (values, actions) => {
                          const prunedVals = {...values};
                          prunedVals.assignments = prunedVals.assignments.filter((a) => a);
                          const res = await axios.post("/api/volunteer", {
                              type: "add", 
                              formData: prunedVals,
                          });
                          const status = await res.status;
                          const data = await res.data;
                          if (status === 200) {
                              setVolunteers([...volunteers, data])
                              onClose();
                          }
                      }}>
                         {(props) => {
                             <Form>
                                 <Stack direction="column" spacing={4}>
                                     <Field name="first_name" validate={validateReq}>
                                         {({ field, form}) => (
                                             <FormControl
                                              isInvalid={form.errors.first_name && form.touched.first_name}
                                              isRequired>
                                                  <FormLabel htmlFor="first_name">First Name</FormLabel>
                                                  <Input {...field} id="first_name" />
                                                  <FormErrorMessage>{form.errors.first_name}</FormErrorMessage>
                                              </FormControl>
                                         )}
                                     </Field>
                                     <Field name="last_name" validate={validateReq}>
                                         {({ field, form}) => (
                                             <FormControl
                                              isInvalid={form.errors.last_name && form.touched.last_name}
                                              isRequired>
                                                  <FormLabel htmlFor="last_name">Last Name</FormLabel>
                                                  <Input {...field} id="last_name" />
                                                  <FormErrorMessage>{form.errors.last_name}</FormErrorMessage>
                                              </FormControl>
                                         )}
                                     </Field>
                                     <Field name="email" validate={validateReq}>
                                         {({ field, form}) => (
                                             <FormControl
                                              isInvalid={form.errors.email && form.touched.email}
                                              isRequired>
                                                  <FormLabel htmlFor="email">Email</FormLabel>
                                                  <Input {...field} id="email" />
                                                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                              </FormControl>
                                         )}
                                     </Field>
                                     <Field name="phone" validate={validateReq}>
                                         {({ field, form}) => (
                                             <FormControl
                                              isInvalid={form.errors.phone && form.touched.phone}
                                              isRequired>
                                                  <FormLabel htmlFor="phone">Phone</FormLabel>
                                                  <Input {...field} id="phone" />
                                                  <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                                              </FormControl>
                                         )}
                                     </Field>
                                     <Field name="county" validate={validateReq}>
                                         {({ field, form}) => (
                                             <FormControl
                                              isInvalid={form.errors.county && form.touched.county}
                                              isRequired>
                                                  <FormLabel htmlFor="county">County</FormLabel>
                                                  <Input {...field} id="county" />
                                                  <FormErrorMessage>{form.errors.county}</FormErrorMessage>
                                              </FormControl>
                                         )}
                                     </Field>
                                     <Field name="county" validate={validateReq}>
                                         {({ field, form}) => (
                                             <FormControl
                                              isInvalid={form.errors.county && form.touched.county}
                                              isRequired>
                                                  <FormLabel htmlFor="county">County</FormLabel>
                                                  <Input {...field} id="county" />
                                                  <FormErrorMessage>{form.errors.county}</FormErrorMessage>
                                              </FormControl>
                                         )}
                                     </Field>
                                     <Field name="comments">
                                         {({ field, form}) => (
                                             <FormControl
                                              isInvalid={form.errors.county && form.touched.county}
                                              isRequired>
                                                  <FormLabel htmlFor="comments">Comments</FormLabel>
                                                  <Input {...field} id="comments" />
                                                  <FormErrorMessage>{form.errors.comments}</FormErrorMessage>
                                              </FormControl>
                                         )}
                                     </Field>
                                 </Stack>
                             </Form>
                         }}
                    </Formik>
                </ModalBody>
            </ModalContent>
          </Modal>
      );
  };

  /*
    model Volunteer {
        id String @id @default(cuid())
        first_name String
        last_name String
        email String @unique
        phone String?
        county County @relation(fields: [countyId], references: [id])
        countyId String
        comments String?
        submitter Boolean? @default(false)
        writer Boolean? @default(false)
        tracker Boolean? @default(false)
        assignments Assignment[]
      }
    */