import VolunteerAlertDialog from "./VolunteerAlertDialog";

const validateReq = (value) => {
  let error;
  if (!value) {
    error = "Required field";
  }
  return error;
};

const VolunteerEditModal = ({
  isOpen,
  onClose,
  volunteerMeta,
  volunteers,
  setVolunteers,
}) => {
  const [alertOpen, setAlertOpen] = useState(false);

  const prunedVolunteer = useMemo(() => {
    if (volunteerMeta === undefined) return;
    return {
      ...volunteerMeta.volunteer,
      assignments: volunteerMeta.volunteer.assignments.map((a) => a.name),
    };
  }, [volunteerMeta]);

  const { volunteer, index } = volunteerMeta || {};

  return (
    <>
      {volunteerMeta ? (
        <>
          <VolunteerAlertDialog
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            volunteerId={volunteer.id}
            index={index}
            volunteer={volunteers}
            setVolunteers={setVolunteers}
            onClose={onClose}
          />
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
                                              isInvalid={form.errors.comments && form.touched.comments}>
                                                  <FormLabel htmlFor="comments">Comments</FormLabel>
                                                  <Input {...field} id="comments" />
                                                  <FormErrorMessage>{form.errors.comments}</FormErrorMessage>
                                              </FormControl>
                                         )}
                                     </Field>
                                     <Field name="submitter">
                                         {({ field, form}) => (
                                             <FormControl
                                              isInvalid={form.errors.submitter && form.touched.submitter}>
                                                  <FormLabel htmlFor="submitter">Submitter</FormLabel>
                                                  <Checkbox />
                                                  <FormErrorMessage>{form.errors.submitter}</FormErrorMessage>
                                              </FormControl>
                                         )}
                                     </Field>
                                     <Field name="writer">
                                         {({ field, form}) => (
                                             <FormControl
                                              isInvalid={form.errors.writer && form.touched.writer}>
                                                  <FormLabel htmlFor="writer">Writer</FormLabel>
                                                  <Checkbox />
                                                  <FormErrorMessage>{form.errors.writer}</FormErrorMessage>
                                              </FormControl>
                                         )}
                                     </Field>
                                     <Field name="tracker">
                                         {({ field, form}) => (
                                             <FormControl
                                              isInvalid={form.errors.tracker && form.touched.tracker}>
                                                  <FormLabel htmlFor="tracker">Tracker</FormLabel>
                                                  <Checkbox />
                                                  <FormErrorMessage>{form.errors.tracker}</FormErrorMessage>
                                              </FormControl>
                                         )}
                                     </Field>
                                     <FieldArray name="assignments">
                                        {(arrayHelpers) => (
                                            <>
                                                <Flex direction="row">
                                                    <FormLabel htmlFor="assignments">
                                                    Assignments
                                                    </FormLabel>
                                                    <IconButton
                                                        size="xs"
                                                        icon={<AddIcon />}
                                                        onClick={() => arrayHelpers.push("")}
                                                    />
                                                </Flex>
                                            <Stack direction="column" spacing={2}>
                                                {props.values.assignments.map((assignment, i) => (
                                            <Field key={i} name={`assignments.${i}`}>
                                            {({ field, form }) => (
                                        <Flex
                                                direction="row"
                                                alignItems="center"
                                            >
                                            <Input
                                                {...field}
                                                id={`assignment-${i}`}
                                            />
                                            <IconButton
                                                m={1}
                                                size="xs"
                                                icon={<MinusIcon />}
                                                onClick={() =>
                                                arrayHelpers.remove(i)
                                                }
                                            />
                                        </Flex>
                                        )}
                                        </Field>
                                        ))}
                                    </Stack>
                                    </>
                                    )}
                                    </FieldArray>
                                 </Stack>
                             </Form>
                         }}
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