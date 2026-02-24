import React from "react";
import { View, StyleSheet } from "react-native";
import AppIcon from "@ui/atoms/AppIcon/AppIcon";
import AppText from "@ui/atoms/AppText/AppText";
import StatusIndicator from "@ui/atoms/StatusIndicator/StatusIndicator";
import { PermissionRowProps } from "./PermissionRow.interface";

export default function PermissionRow({
  iconName,
  permissionName,
  reason,
  status,
}: PermissionRowProps): React.JSX.Element {
  return (
    <View style={permissionRowStyles.row}>
      <View style={permissionRowStyles.iconContainer}>
        <AppIcon name={iconName} size={24} color="#6C63FF" />
      </View>
      <View style={permissionRowStyles.textContainer}>
        <AppText variant="body" style={permissionRowStyles.permissionNameText}>
          {permissionName}
        </AppText>
        <AppText variant="caption" style={permissionRowStyles.reasonText}>
          {reason}
        </AppText>
      </View>
      <StatusIndicator status={status} size={14} />
    </View>
  );
}

const permissionRowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  permissionNameText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 2,
  },
  reasonText: {
    fontSize: 12,
    color: "#8A8AA0",
    lineHeight: 16,
  },
});
