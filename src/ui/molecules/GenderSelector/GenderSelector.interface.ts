export interface GenderSelectorOption {
  label: string;
  value: string;
}

export interface GenderSelectorProps {
  options: GenderSelectorOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  errorMessage?: string | null;
}
