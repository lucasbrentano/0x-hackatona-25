export interface ButtonProps {
  title?: string;
  iconColor?: string; // Nova prop para cor do ícone
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary'; 
  style?: React.CSSProperties;
  fontSize?: number; // Nova prop para tamanho da fonte
}
