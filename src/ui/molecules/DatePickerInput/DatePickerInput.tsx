import React, { useState } from "react";
import { View, Pressable, Platform, StyleSheet } from "react-native";
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

function formatDateForHtmlInput(date: Date): string {
  return date.toISOString().split("T")[0];
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

  // Web: render a native HTML date input styled to match
  if (Platform.OS === "web") {
    return (
      <View style={datePickerInputStyles.container}>
        <AppText variant="caption" style={datePickerInputStyles.fieldLabel}>
          {label}
        </AppText>
        <View style={datePickerInputStyles.webInputWrapper}>
          <input
            type="date"
            value={value ? formatDateForHtmlInput(value) : ""}
            min={minimumDate ? formatDateForHtmlInput(minimumDate) : undefined}
            max={maximumDate ? formatDateForHtmlInput(maximumDate) : undefined}
            onChange={(webEvent) => {
              const parsedDate = new Date(webEvent.target.value);
              if (!isNaN(parsedDate.getTime())) {
                onDateChange(parsedDate);
              }
            }}
            style={webDateInputStyle}
          />
        </View>
        {errorMessage ? (
          <AppText variant="caption" style={datePickerInputStyles.errorText}>
            {errorMessage}
          </AppText>
        ) : null}
      </View>
    );
  }

  return (
    <View style={datePickerInputStyles.container}>
      <AppText variant="caption" style={datePickerInputStyles.fieldLabel}>
        {label}
      </AppText>
      <Pressable onPress={() => setIsPickerVisible(true)}>
        <View pointerEvents="none">
          <AppTextInput
            value={value ? formatDateForDisplay(value) : ""}
            onChangeText={() => {}}
            placeholder="Select date"
            editable={false}
            errorMessage={errorMessage}
          />
        </View>
      </Pressable>

      {isPickerVisible && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display="default"
          onChange={handlePickerChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
}

// Inline style object for the web <input> element (not StyleSheet — it's a DOM element)
const webDateInputStyle: React.CSSProperties = {
  width: "100%",
  height: 56,
  border: "1.5px solid #E8E8F0",
  borderRadius: 16,
  paddingLeft: 16,
  paddingRight: 16,
  fontSize: 16,
  color: "#1A1A2E",
  backgroundColor: "#F8F8FF",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

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
  webInputWrapper: {
    width: "100%",
  },
  errorText: {
    color: "#E53935",
    marginTop: 6,
    marginLeft: 4,
  },
});
