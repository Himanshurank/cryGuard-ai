import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppTextInputProps } from "@ui/atoms/AppTextInput/AppTextInput.interface";
import AppText from "@ui/atoms/AppText/AppText";

export default function AppTextInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  errorMessage,
  editable = true,
  style,
}: AppTextInputProps): React.JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordField = secureTextEntry;
  const shouldHideText = isPasswordField && !isPasswordVisible;

  return (
    <View style={appTextInputStyles.container}>
      <View
        style={[
          appTextInputStyles.inputWrapper,
          isFocused && appTextInputStyles.inputWrapperFocused,
          !!errorMessage && appTextInputStyles.inputWrapperError,
          !editable && appTextInputStyles.inputWrapperDisabled,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8A8AA0"
          secureTextEntry={shouldHideText}
          keyboardType={keyboardType}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[appTextInputStyles.input, style]}
          autoCapitalize="none"
        />
        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            style={appTextInputStyles.eyeIconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={isFocused ? "#6C63FF" : "#8A8AA0"}
            />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage ? (
        <AppText variant="caption" style={appTextInputStyles.errorText}>
          {errorMessage}
        </AppText>
      ) : null}
    </View>
  );
}

const appTextInputStyles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 56,
    borderWidth: 1.5,
    borderColor: "#E8E8F0",
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "#F8F8FF",
  },
  inputWrapperFocused: {
    borderColor: "#6C63FF",
    backgroundColor: "#FFFFFF",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  inputWrapperError: {
    borderColor: "#E53935",
  },
  inputWrapperDisabled: {
    backgroundColor: "#F0F0F5",
    borderColor: "#E0E0E8",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A2E",
  },
  eyeIconButton: {
    paddingLeft: 8,
  },
  errorText: {
    color: "#E53935",
    marginTop: 6,
    marginLeft: 4,
  },
});
