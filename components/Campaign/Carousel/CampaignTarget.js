import {
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tab,
  Text,
  Checkbox,
  Stack,
  Box,
  Divider,
  Flex,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import axios from "axios";
import { Select } from "chakra-react-select";
import { Field, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { georgiaCounties } from "../../../utils/consts";
import CampaignFooter from "../Footer";

const validateEmpty = (value) => {
  let error;
  if (value.length === 0) {
    error = "Please select 1 or more options";
  }
  return error;
};

const CampaignTarget = ({
  focusTab,
  setFocusTab,
  incrementPage,
  decrementPage,
  setCurrentPage,
  campaignForm,
  setCampaignForm,
  selectedCounties,
  setSelectedCounties,
  legislators,
  selectedLegislators,
  setSelectedLegislators,
}) => {
  return (
    <>
      <Tabs
        variant="soft-rounded"
        colorScheme="brand"
        align="center"
        defaultIndex={focusTab}
        onChange={(index) => setFocusTab(index)}
      >
        <TabList>
          <Tab>Counties</Tab>
          <Tab>Legislators</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box>
              <Text fontSize="lg" fontWeight={600} mb={2}>
                Choose counties
              </Text>
              <Formik
                initialValues={{
                  counties:
                    selectedCounties.length === 0 ? [] : selectedCounties,
                }}
                onSubmit={({ counties }) => {
                  setCampaignForm({
                    ...campaignForm,
                    focus: {
                      counties: counties.map((county) => county.value),
                    },
                  });
                  incrementPage();
                }}
              >
                {(props) => (
                  <Form>
                    <Field name="counties" validate={validateEmpty}>
                      {({ field, form }) => (
                        <FormControl
                          isRequired
                          isInvalid={
                            form.errors.counties && form.touched.counties
                          }
                        >
                          <Select
                            name="counties"
                            isMulti
                            closeMenuOnSelect={false}
                            value={props.values.counties}
                            options={georgiaCounties.map((county) => ({
                              label: county,
                              value: county,
                            }))}
                            onChange={(options) => {
                              form.setFieldValue(field.name, options);
                              setSelectedCounties(options);
                            }}
                            onBlur={() => props.setFieldTouched("counties")}
                          />
                          <FormErrorMessage>
                            {form.errors.counties}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <CampaignFooter decrementPage={decrementPage} />
                  </Form>
                )}
              </Formik>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <Text fontSize="lg" fontWeight={600} mb={2}>
                Choose legislators
              </Text>
              <Formik
                initialValues={{
                  legislators:
                    selectedLegislators.length === 0 ? [] : selectedLegislators,
                }}
                onSubmit={({ legislators }) => {
                  setCampaignForm({
                    ...campaignForm,
                    focus: {
                      legislators: legislators.map(
                        (legislator) => legislator.value
                      ),
                    },
                  });
                  incrementPage();
                }}
              >
                {(props) => (
                  <Form>
                    <Field name="legislators" validate={validateEmpty}>
                      {({ field, form }) => (
                        <FormControl
                          isRequired
                          isInvalid={
                            form.errors.legislators && form.touched.legislators
                          }
                        >
                          <Select
                            name="legislators"
                            isMulti
                            closeMenuOnSelect={false}
                            value={props.values.legislators}
                            options={legislators}
                            onChange={(options) => {
                              form.setFieldValue(field.name, options);
                              setSelectedLegislators(options);
                            }}
                            onBlur={() => props.setFieldTouched("legislators")}
                          />
                          <FormErrorMessage>
                            {form.errors.legislators}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <CampaignFooter decrementPage={decrementPage} />
                  </Form>
                )}
              </Formik>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default CampaignTarget;
