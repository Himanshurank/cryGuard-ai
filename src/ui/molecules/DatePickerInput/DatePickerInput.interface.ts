export interface DatePickerInputProps {
  label: string;
  value: Date | null;
  onDateChange: (selectedDate: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  errorMessage?: string | null;
}
