import { forwardRef, useState } from "react";
import {
  Box,
  Text,
  Input,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Divider,
  Button,
  Flex,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { Form, Formik, Field, useFormikContext, useField } from "formik";

const validateReq = (value) => {
  let error;
  if (!value) {
    error = "Required field";
  }
  return error;
};

const CustomDateInput = forwardRef(
  ({ value, onClick, setFieldTouched }, ref) => (
    <Input
      ref={ref}
      defaultValue={value}
      isReadOnly
      onClick={() => {
        onClick();
        setFieldTouched("campaignStartDate", true, true);
      }}
    />
  )
);

const DatePickerField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);

  return (
    <DatePicker
      {...field}
      {...props}
      isClearable
      selected={field.value}
      onChange={(val) => {
        setFieldValue(field.name, val);
      }}
      customInput={
        <CustomDateInput
          id="campaignStartDate"
          setFieldTouched={props.setFieldTouched}
        />
      }
    />
  );
};

const CampaignInfo = ({ setCurrentPage, campaignForm, setCampaignForm }) => {
  return (
    <>
      <Formik
        initialValues={campaignForm}
        onSubmit={(values) => {
          setCampaignForm(values);
          setCurrentPage(1);
        }}
      >
        {(props) => (
          <Form>
            <Stack direction="column" spacing={4}>
              <Field name="campaignName" validate={validateReq}>
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.campaignName && form.touched.campaignName
                    }
                  >
                    <FormLabel htmlFor="campaignName">Campaign name</FormLabel>
                    <Input {...field} id="campaignName" />
                    <FormErrorMessage>
                      {form.errors.campaignName}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="campaignDescription">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="campaignDescription">
                      Description/Purpose
                    </FormLabel>
                    <Textarea {...field} id="campaignDescription" />
                    <FormErrorMessage>
                      {form.errors.campaignDescription}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="campaignStartDate" validate={validateReq}>
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.campaignStartDate &&
                      form.touched.campaignStartDate
                    }
                  >
                    <FormLabel htmlFor="campaignStartDate">
                      Start date
                    </FormLabel>
                    <DatePickerField {...form} name="campaignStartDate" />
                    <FormErrorMessage>
                      {form.errors.campaignStartDate}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Stack>
            <Box mt={6} mb={4}>
              <Divider color="gray.400" mb={4} />
              <Flex justifyContent="right">
                <Button colorScheme="brand" type="submit">
                  Next
                </Button>
              </Flex>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CampaignInfo;
