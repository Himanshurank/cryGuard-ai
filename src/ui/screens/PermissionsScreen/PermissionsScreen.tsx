import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "@navigation/AppNavigator";
import { useAppStore } from "@application/stores/useAppStore";
import { EAppRole } from "@core/enums/AppRole";
import { EPermissionStatus } from "@core/enums/PermissionStatus";
import { PermissionIndicatorStatus } from "@ui/atoms/StatusIndicator/StatusIndicator.interface";
import AppText from "@ui/atoms/AppText/AppText";
import AppButton from "@ui/atoms/AppButton/AppButton";
import PermissionRow from "@ui/molecules/PermissionRow/PermissionRow";

type PermissionsScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "Permissions"
>;

interface PermissionRowDefinition {
  key: string;
  iconName: string;
  permissionName: string;
  reason: string;
}

const babyStationPermissionRows: PermissionRowDefinition[] = [
  {
    key: "microphone",
    iconName: "mic-outline",
    permissionName: "Microphone",
    reason: "Required to listen for baby crying",
  },
  {
    key: "localNetwork",
    iconName: "wifi-outline",
    permissionName: "Local Network",
    reason: "Required to connect to the parent device",
  },
  {
    key: "batteryOptimisation",
    iconName: "battery-charging-outline",
    permissionName: "Battery Optimisation",
    reason: "Keeps monitoring active in the background",
  },
];

const parentStationPermissionRows: PermissionRowDefinition[] = [
  {
    key: "notifications",
    iconName: "notifications-outline",
    permissionName: "Notifications",
    reason: "Required to alert you when baby is crying",
  },
  {
    key: "localNetwork",
    iconName: "wifi-outline",
    permissionName: "Local Network",
    reason: "Required to connect to the baby device",
  },
  {
    key: "batteryOptimisation",
    iconName: "battery-charging-outline",
    permissionName: "Battery Optimisation",
    reason: "Keeps the connection alive in the background",
  },
];

export default function PermissionsScreen({
  navigation,
}: PermissionsScreenProps): React.JSX.Element {
  const selectedRole = useAppStore((state) => state.selectedRole);
  const permissionCheckStatus = useAppStore(
    (state) => state.permissionCheckStatus,
  );
  const permissionStatuses = useAppStore((state) => state.permissionStatuses);
  const checkAndRequestPermissions = useAppStore(
    (state) => state.checkAndRequestPermissions,
  );
  const openDeviceSettings = useAppStore((state) => state.openDeviceSettings);

  const permissionRows =
    selectedRole === EAppRole.BABY_STATION
      ? babyStationPermissionRows
      : parentStationPermissionRows;

  const targetScreen =
    selectedRole === EAppRole.BABY_STATION ? "BabyStation" : "ParentStation";

  useEffect(() => {
    if (selectedRole) {
      checkAndRequestPermissions(selectedRole);
    }
  }, [selectedRole]);

  useEffect(() => {
    if (permissionCheckStatus === EPermissionStatus.ALL_GRANTED) {
      navigation.replace(targetScreen);
    }
  }, [permissionCheckStatus]);

  const isChecking = permissionCheckStatus === EPermissionStatus.CHECKING;
  const isPermanentlyDenied =
    permissionCheckStatus === EPermissionStatus.PERMANENTLY_DENIED;
  const needsGrant =
    permissionCheckStatus === EPermissionStatus.PENDING ||
    permissionCheckStatus === EPermissionStatus.PARTIALLY_DENIED;

  return (
    <SafeAreaView style={permissionsScreenStyles.root}>
      <View style={permissionsScreenStyles.container}>
        <View style={permissionsScreenStyles.headingContainer}>
          <AppText
            variant="heading"
            style={permissionsScreenStyles.headingText}
          >
            A few permissions needed
          </AppText>
          <AppText
            variant="body"
            style={permissionsScreenStyles.subheadingText}
          >
            CryGuard needs these to work properly
          </AppText>
        </View>

        <ScrollView
          style={permissionsScreenStyles.rowList}
          showsVerticalScrollIndicator={false}
        >
          {permissionRows.map((permissionRowDefinition) => (
            <PermissionRow
              key={permissionRowDefinition.key}
              iconName={permissionRowDefinition.iconName}
              permissionName={permissionRowDefinition.permissionName}
              reason={permissionRowDefinition.reason}
              status={
                (permissionStatuses[
                  permissionRowDefinition.key
                ] as PermissionIndicatorStatus) ?? "PENDING"
              }
            />
          ))}
        </ScrollView>

        <View style={permissionsScreenStyles.actionContainer}>
          {isChecking && <ActivityIndicator size="large" color="#6C63FF" />}
          {needsGrant && !isChecking && (
            <AppButton
              label="Grant Permissions"
              onPress={() =>
                selectedRole && checkAndRequestPermissions(selectedRole)
              }
              variant="primary"
            />
          )}
          {isPermanentlyDenied && (
            <AppButton
              label="Open Settings"
              onPress={openDeviceSettings}
              variant="primary"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const permissionsScreenStyles = StyleSheet.create({
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
    marginBottom: 32,
  },
  headingText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 6,
  },
  subheadingText: {
    fontSize: 15,
    color: "#8A8AA0",
  },
  rowList: {
    flex: 1,
  },
  actionContainer: {
    paddingTop: 24,
    minHeight: 56,
    justifyContent: "center",
  },
});
