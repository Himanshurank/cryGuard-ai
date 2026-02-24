import React from "react";
import { View, StyleSheet } from "react-native";
import { EBabyGender } from "@core/enums/BabyGender";
import AppTextInput from "@ui/atoms/AppTextInput/AppTextInput";
import AppButton from "@ui/atoms/AppButton/AppButton";
import DatePickerInput from "@ui/molecules/DatePickerInput/DatePickerInput";
import GenderSelector from "@ui/molecules/GenderSelector/GenderSelector";
import { BabyProfileFormProps } from "./BabyProfileForm.interface";

const babyGenderOptions = [
  { label: "Boy", value: EBabyGender.BOY },
  { label: "Girl", value: EBabyGender.GIRL },
  { label: "Prefer not to say", value: EBabyGender.PREFER_NOT_TO_SAY },
];

const todayDate = new Date();
const fiveYearsAgoDate = new Date(
  todayDate.getFullYear() - 5,
  todayDate.getMonth(),
  todayDate.getDate(),
);

const allFieldsFilled = (
  babyName: string,
  birthDate: Date | null,
  gender: EBabyGender | null,
): boolean =>
  babyName.trim().length >= 2 && birthDate !== null && gender !== null;

export default function BabyProfileForm({
  babyName,
  birthDate,
  gender,
  fieldErrors,
  saveStatus,
  onBabyNameChange,
  onBirthDateChange,
  onGenderChange,
  onSubmit,
}: BabyProfileFormProps): React.JSX.Element {
  const isFormComplete = allFieldsFilled(babyName, birthDate, gender);

  return (
    <View style={babyProfileFormStyles.container}>
      <AppTextInput
        value={babyName}
        onChangeText={onBabyNameChange}
        placeholder="Baby's name"
        errorMessage={fieldErrors.babyName ?? undefined}
      />

      <View style={babyProfileFormStyles.fieldSpacing}>
        <DatePickerInput
          label="Date of Birth"
          value={birthDate}
          onDateChange={onBirthDateChange}
          minimumDate={fiveYearsAgoDate}
          maximumDate={todayDate}
          errorMessage={fieldErrors.birthDate ?? undefined}
        />
      </View>

      <View style={babyProfileFormStyles.fieldSpacing}>
        <GenderSelector
          options={babyGenderOptions}
          selectedValue={gender}
          onSelect={onGenderChange}
          errorMessage={fieldErrors.gender ?? undefined}
        />
      </View>

      <View style={babyProfileFormStyles.submitButtonContainer}>
        <AppButton
          label="Done →"
          onPress={onSubmit}
          variant="primary"
          isLoading={saveStatus === "LOADING"}
          isDisabled={!isFormComplete || saveStatus === "LOADING"}
        />
      </View>
    </View>
  );
}

const babyProfileFormStyles = StyleSheet.create({
  container: {
    width: "100%",
  },
  fieldSpacing: {
    marginTop: 16,
  },
  submitButtonContainer: {
    marginTop: 32,
  },
});
