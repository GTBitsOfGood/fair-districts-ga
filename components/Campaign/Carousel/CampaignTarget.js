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
                initialValues={{ counties: [] }}
                onSubmit={(values) => {
                  console.log("here");
                }}
              >
                {(props) => (
                  <Form>
                    <Field name="counties" validate={validateEmpty}>
                      {({ field, form }) => {
                        return (
                          <FormControl
                            isRequired
                            isInvalid={
                              form.errors.counties && form.touched.counties
                            }
                          >
                            <Select
                              isMulti
                              closeMenuOnSelect={false}
                              options={georgiaCounties.map((county) => ({
                                label: county,
                                value: county,
                                selected: false,
                              }))}
                              onChange={(options) => {
                                form.setFieldValue(
                                  field.name,
                                  options.map((option) => option.value)
                                );
                              }}
                              onBlur={() => props.setFieldTouched("counties")}
                            />
                            <FormErrorMessage>
                              {form.errors.counties}
                            </FormErrorMessage>
                          </FormControl>
                        );
                      }}
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
              <Select
                isMulti
                closeMenuOnSelect={false}
                options={legislators.map((legislator) => ({
                  label: `${legislator.firstName} ${legislator.lastName}`,
                  value: legislator.id,
                }))}
              />
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
