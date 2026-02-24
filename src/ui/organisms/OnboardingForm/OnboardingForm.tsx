import React from "react";
import { View, StyleSheet } from "react-native";
import { OnboardingFormProps } from "@ui/organisms/OnboardingForm/OnboardingForm.interface";
import { EUserGender } from "@core/enums/UserGender";
import AppText from "@ui/atoms/AppText/AppText";
import AppTextInput from "@ui/atoms/AppTextInput/AppTextInput";
import AppButton from "@ui/atoms/AppButton/AppButton";
import DatePickerInput from "@ui/molecules/DatePickerInput/DatePickerInput";
import GenderSelector from "@ui/molecules/GenderSelector/GenderSelector";

const maximumUserBirthDate = new Date(
  new Date().setFullYear(new Date().getFullYear() - 18),
);

const userGenderOptions = [
  { label: "Male", value: EUserGender.MALE },
  { label: "Female", value: EUserGender.FEMALE },
  { label: "Prefer not", value: EUserGender.PREFER_NOT_TO_SAY },
];

export default function OnboardingForm({
  firstName,
  lastName,
  birthDate,
  mobile,
  gender,
  fieldErrors,
  saveStatus,
  onFirstNameChange,
  onLastNameChange,
  onBirthDateChange,
  onMobileChange,
  onGenderChange,
  onSubmit,
}: OnboardingFormProps): React.JSX.Element {
  const isSubmitting = saveStatus === "LOADING";
  const allFieldsFilled =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    birthDate !== null &&
    mobile.trim().length >= 6 &&
    gender !== null;

  return (
    <View style={onboardingFormStyles.container}>
      <View style={onboardingFormStyles.fieldGroup}>
        <AppText variant="caption" style={onboardingFormStyles.fieldLabel}>
          FIRST NAME
        </AppText>
        <AppTextInput
          value={firstName}
          onChangeText={onFirstNameChange}
          placeholder="Enter your first name"
          editable={!isSubmitting}
          errorMessage={fieldErrors.firstName}
        />
      </View>

      <View style={onboardingFormStyles.fieldGroup}>
        <AppText variant="caption" style={onboardingFormStyles.fieldLabel}>
          LAST NAME
        </AppText>
        <AppTextInput
          value={lastName}
          onChangeText={onLastNameChange}
          placeholder="Enter your last name"
          editable={!isSubmitting}
          errorMessage={fieldErrors.lastName}
        />
      </View>

      <DatePickerInput
        label="DATE OF BIRTH"
        value={birthDate}
        onDateChange={onBirthDateChange}
        maximumDate={maximumUserBirthDate}
        errorMessage={fieldErrors.birthDate}
      />

      <View style={onboardingFormStyles.fieldGroup}>
        <AppText variant="caption" style={onboardingFormStyles.fieldLabel}>
          MOBILE NUMBER
        </AppText>
        <AppTextInput
          value={mobile}
          onChangeText={onMobileChange}
          placeholder="+1 234 567 8900"
          keyboardType="phone-pad"
          editable={!isSubmitting}
          errorMessage={fieldErrors.mobile}
        />
      </View>

      <View style={onboardingFormStyles.fieldGroup}>
        <AppText variant="caption" style={onboardingFormStyles.fieldLabel}>
          GENDER
        </AppText>
        <GenderSelector
          options={userGenderOptions}
          selectedValue={gender}
          onSelect={onGenderChange}
          errorMessage={fieldErrors.gender}
        />
      </View>

      <View style={onboardingFormStyles.submitButtonContainer}>
        <AppButton
          label="Next →"
          onPress={onSubmit}
          variant="primary"
          isLoading={isSubmitting}
          isDisabled={!allFieldsFilled || isSubmitting}
        />
      </View>
    </View>
  );
}

const onboardingFormStyles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8A8AA0",
    letterSpacing: 1.2,
  },
  submitButtonContainer: {
    marginTop: 8,
  },
});
