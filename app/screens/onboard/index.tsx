import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "../../styles";
import DatePick from "../../components/DatePick";
import { Formik } from "formik";
import * as yup from "yup";
import { sendOnboarding } from "../../helpers/claim/verify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../../components/Button";
import useClaims from "../../hooks/useClaims";
import { IClaimRequest } from "../../helpers/interfaces";

const Onboard = () => {
  const [showDate, setShowDate] = useState<boolean>(false);
  const [date, setDate] = useState<string>(new Date().toLocaleDateString());
  const [dateError, setDateError] = useState<string | undefined>(undefined);
  const { fetchClaims } = useClaims();

  const validateSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Please enter valid email")
      .required("Email is required"),
    address: yup.string().required("Address is required"),
    mobile: yup.string().required("Mobile number is required"),
  });

  const onPressSubmit = async (values: IClaimRequest) => {
    if (!date) {
      setDateError("Date of birth is required");
      return;
    }
    try {
      const claims = await sendOnboarding(values, "");
      if (!!claims) {
        await AsyncStorage.setItem("claims", JSON.stringify(claims));
      }
      fetchClaims();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ScrollView>
      <View style={styles.baseStyle.viewPager}>
        <Formik
          initialValues={{
            name: "",
            email: "",
            dob: "",
            address: "",
            mobile: "",
          }}
          onSubmit={onPressSubmit}
          validationSchema={validateSchema}
          enableReinitialize
        >
          {({ handleSubmit, values, errors, handleChange, handleBlur }) => (
            <View style={styles.baseStyle.viewPage} key="1">
              <View style={{ alignItems: "center", paddingBottom: 20 }}>
                <Text style={styles.baseStyle.baseTitle}>Idem</Text>
              </View>
              <Text style={styles.baseStyle.baseText}>Full Name</Text>
              <TextInput
                style={styles.baseStyle.baseTextInput}
                keyboardType="default"
                placeholder="Please enter your first and last names"
                placeholderTextColor="gray"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
              />
              {errors.name && (
                <Text style={styles.baseStyle.errorMessage}>{errors.name}</Text>
              )}
              <Text style={styles.baseStyle.baseText}>Email</Text>
              <TextInput
                style={styles.baseStyle.baseTextInput}
                keyboardType="email-address"
                placeholder="Please enter your email address"
                placeholderTextColor="gray"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
              />
              {errors.email && (
                <Text style={styles.baseStyle.errorMessage}>
                  {errors.email}
                </Text>
              )}
              <Text style={styles.baseStyle.baseText}>Mobile</Text>
              <TextInput
                style={styles.baseStyle.baseTextInput}
                keyboardType="default"
                placeholder="Please enter your mobile number"
                placeholderTextColor="gray"
                value={values.mobile}
                onChangeText={handleChange("mobile")}
                onBlur={handleBlur("mobile")}
              />
              {errors.mobile && (
                <Text style={styles.baseStyle.errorMessage}>
                  {errors.mobile}
                </Text>
              )}
              <Text style={styles.baseStyle.baseText}>DOB</Text>
              <TouchableOpacity
                onPress={() => setShowDate(!showDate)}
                style={styles.baseStyle.dataPick}
              >
                <Text style={styles.baseStyle.dataText}>{`${date || "Please enter the specific date"
                  }`}</Text>
              </TouchableOpacity>
              {dateError && (
                <Text style={styles.baseStyle.errorMessage}>{dateError}</Text>
              )}
              <DatePick
                show={showDate}
                handleCloseDate={() => {
                  setShowDate(false);
                }}
                handleDateChange={(value: Date) => {
                  setDate(value.toLocaleDateString());
                  setShowDate(false);
                }}
              />
              <Text style={styles.baseStyle.baseText}>Address</Text>
              <TextInput
                style={styles.baseStyle.baseTextInput}
                keyboardType="default"
                placeholder="Please enter your address"
                placeholderTextColor="gray"
                value={values.address}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
              />
              {errors.address && (
                <Text style={styles.baseStyle.errorMessage}>
                  {errors.address}
                </Text>
              )}
              <Button
                title="Submit"
                style={styles.baseStyle.baseButton}
                onPress={handleSubmit}
              />
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default Onboard;
