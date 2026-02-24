import React, { useState } from "react";
import { View, TouchableOpacity, Platform, StyleSheet } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { DatePickerInputProps } from "@ui/molecules/DatePickerInput/DatePickerInput.interface";
import AppText from "@ui/atoms/AppText/AppText";
import AppTextInput from "@ui/atoms/AppTextInput/AppTextInput";

function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function DatePickerInput({
  label,
  value,
  onDateChange,
  maximumDate,
  minimumDate,
  errorMessage,
}: DatePickerInputProps): React.JSX.Element {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  function handlePickerChange(
    _event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ): void {
    setIsPickerVisible(Platform.OS === "ios");
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  }

  return (
    <View style={datePickerInputStyles.container}>
      <AppText variant="caption" style={datePickerInputStyles.fieldLabel}>
        {label}
      </AppText>
      <TouchableOpacity
        onPress={() => setIsPickerVisible(true)}
        activeOpacity={0.7}
      >
        <AppTextInput
          value={value ? formatDateForDisplay(value) : ""}
          onChangeText={() => {}}
          placeholder="Select date"
          editable={false}
          errorMessage={errorMessage}
        />
      </TouchableOpacity>

      {isPickerVisible && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handlePickerChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
}

const datePickerInputStyles = StyleSheet.create({
  container: {
    width: "100%",
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8A8AA0",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
});
