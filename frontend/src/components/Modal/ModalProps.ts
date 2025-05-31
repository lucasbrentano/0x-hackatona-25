export interface CustomModalProps {
  visible: boolean;
  title: string;
  icon?: string; // URL da imagem (em React web usamos string para src)
  buttons?: { text: string; onPress: () => void }[];
  onClose?: () => void;
}
