import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { EAppRole } from "@core/enums/AppRole";
import AppIcon from "@ui/atoms/AppIcon/AppIcon";
import AppText from "@ui/atoms/AppText/AppText";
import { RoleSelectionCardProps } from "./RoleSelectionCard.interface";

export default function RoleSelectionCard({
  role,
  title,
  description,
  iconName,
  isSelected,
  onSelect,
}: RoleSelectionCardProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[
        roleSelectionCardStyles.card,
        isSelected
          ? roleSelectionCardStyles.cardSelected
          : roleSelectionCardStyles.cardUnselected,
      ]}
      onPress={() => onSelect(role)}
      activeOpacity={0.8}
    >
      <View style={roleSelectionCardStyles.iconContainer}>
        <AppIcon
          name={iconName}
          size={40}
          color={isSelected ? "#6C63FF" : "#8A8AA0"}
        />
      </View>
      <AppText
        variant="heading"
        style={[
          roleSelectionCardStyles.titleText,
          isSelected && roleSelectionCardStyles.titleTextSelected,
        ]}
      >
        {title}
      </AppText>
      <AppText variant="body" style={roleSelectionCardStyles.descriptionText}>
        {description}
      </AppText>
      {isSelected && (
        <View style={roleSelectionCardStyles.selectedBadge}>
          <AppIcon name="checkmark-circle" size={20} color="#6C63FF" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const roleSelectionCardStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    position: "relative",
  },
  cardUnselected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E8F0",
  },
  cardSelected: {
    backgroundColor: "#F0EEFF",
    borderColor: "#6C63FF",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    marginBottom: 16,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
    textAlign: "center",
    marginBottom: 8,
  },
  titleTextSelected: {
    color: "#6C63FF",
  },
  descriptionText: {
    fontSize: 13,
    color: "#8A8AA0",
    textAlign: "center",
    lineHeight: 18,
  },
  selectedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
  },
});
