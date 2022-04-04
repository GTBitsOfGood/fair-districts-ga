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
    error = "Required field";
  }
  return error;
};

const CampaignTarget = ({
  incrementPage,
  decrementPage,
  setCurrentPage,
  campaignForm,
  setCampaignForm,
  selectedCounties,
  setSelectedCounties,
  legislators,
  setLegislators,
}) => {
  return (
    <>
      <Tabs variant="soft-rounded" colorScheme="brand" align="center">
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
                    counties: counties.map((county) => county.value),
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
              <Select isMulti closeMenuOnSelect={false} options={legislators} />
              {/* <Stack direction="column">
                  {Object.keys(legislators).map((legislatorId) => (
                    <Checkbox
                      key={`checkbox-${legislatorId}`}
                      colorScheme="brand"
                      isChecked={legislators[legislatorId].selected}
                      onChange={() => {
                        const newLegislators = { ...legislators };
                        const newLegislator = {
                          ...legislators[legislatorId],
                          selected: !legislators[legislatorId].selected,
                        };
                        newLegislators[legislatorId] = newLegislator;
                        setLegislators(newLegislators);
                      }}
                    >
                      {legislators[legislatorId].firstName}{" "}
                      {legislators[legislatorId].lastName}
                    </Checkbox>
                  ))}
                </Stack> */}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default CampaignTarget;
