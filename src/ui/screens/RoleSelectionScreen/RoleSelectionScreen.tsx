import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "@navigation/AppNavigator";
import { useAppStore } from "@application/stores/useAppStore";
import { EAppRole } from "@core/enums/AppRole";
import AppText from "@ui/atoms/AppText/AppText";
import AppButton from "@ui/atoms/AppButton/AppButton";
import RoleSelectionCard from "@ui/molecules/RoleSelectionCard/RoleSelectionCard";

type RoleSelectionScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "RoleSelection"
>;

export default function RoleSelectionScreen({
  navigation,
}: RoleSelectionScreenProps): React.JSX.Element {
  const selectedRole = useAppStore((state) => state.selectedRole);
  const userProfile = useAppStore((state) => state.userProfile);
  const setSelectedRole = useAppStore((state) => state.setSelectedRole);

  const firstName = userProfile?.firstName ?? "there";

  return (
    <SafeAreaView style={roleSelectionScreenStyles.root}>
      <View style={roleSelectionScreenStyles.container}>
        <View style={roleSelectionScreenStyles.headingContainer}>
          <AppText
            variant="heading"
            style={roleSelectionScreenStyles.headingText}
          >
            Hi {firstName}!
          </AppText>
          <AppText
            variant="body"
            style={roleSelectionScreenStyles.subheadingText}
          >
            Which device is this?
          </AppText>
        </View>

        <View style={roleSelectionScreenStyles.cardsRow}>
          <RoleSelectionCard
            role={EAppRole.BABY_STATION}
            title="Baby Station"
            description={"Place this device\nnear your baby"}
            iconName="musical-notes-outline"
            isSelected={selectedRole === EAppRole.BABY_STATION}
            onSelect={setSelectedRole}
          />
          <View style={roleSelectionScreenStyles.cardGap} />
          <RoleSelectionCard
            role={EAppRole.PARENT_STATION}
            title="Parent Station"
            description={"Keep this device\nwith you"}
            iconName="headset-outline"
            isSelected={selectedRole === EAppRole.PARENT_STATION}
            onSelect={setSelectedRole}
          />
        </View>

        <View style={roleSelectionScreenStyles.continueButtonContainer}>
          <AppButton
            label="Continue"
            onPress={() => navigation.navigate("Permissions")}
            variant="primary"
            isDisabled={selectedRole === null}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const roleSelectionScreenStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F5FF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 40,
  },
  headingContainer: {
    marginBottom: 40,
  },
  headingText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 6,
  },
  subheadingText: {
    fontSize: 18,
    color: "#8A8AA0",
  },
  cardsRow: {
    flexDirection: "row",
    flex: 1,
    maxHeight: 280,
  },
  cardGap: {
    width: 16,
  },
  continueButtonContainer: {
    marginTop: "auto",
    paddingTop: 24,
  },
});
