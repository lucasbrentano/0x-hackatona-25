export interface AppBarProps {
  coins: number;
  onConfigPress?: () => void;
  rightButtonType?: "config" | "avatar";
  avatarUri?: string;
}