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
import CampaignFooter from "../Footer";

const validateReq = (value) => {
  let error;
  if (!value) {
    error = "Required field";
  }
  return error;
};

const CustomDateInput = forwardRef(
  ({ value, onClick, setFieldTouched, ...field }, ref) => (
    <Input
      {...field}
      ref={ref}
      value={value}
      isReadOnly
      onClick={() => {
        onClick();
        setFieldTouched("campaignStartDate", true, true);
      }}
    />
  )
);
CustomDateInput.displayName = "CustomDateInput";

const DatePickerField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);

  return (
    <DatePicker
      selected={field.value}
      onChange={(val) => {
        setFieldValue(field.name, val);
      }}
      customInput={
        <CustomDateInput
          {...field}
          id="campaignStartDate"
          setFieldTouched={props.setFieldTouched}
        />
      }
    />
  );
};

const CampaignInfo = ({ incrementPage, campaignForm, setCampaignForm }) => {
  return (
    <>
      <Formik
        initialValues={{
          campaignName: campaignForm.name,
          campaignDescription: campaignForm.description,
          campaignStartDate: campaignForm.startDate,
        }}
        onSubmit={({
          campaignName: name,
          campaignDescription: description,
          campaignStartDate: startDate,
        }) => {
          setCampaignForm({ name, description, startDate });
          incrementPage();
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
            <CampaignFooter hasBack={false} />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CampaignInfo;
