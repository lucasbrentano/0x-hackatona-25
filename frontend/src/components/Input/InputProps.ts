export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "email-address" | "numeric";
  placeholder?: string;
  secureTextEntry?: boolean;
  withVisibilityToggle?: boolean;
  label?: string;
  onBlur?: () => void;
  height?: number;
}