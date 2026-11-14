import { useWindowDimensions } from "react-native";

const ROW_PADDING = 14;
const ROW_GAP = 12;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const useRowCardWidth = (visibleCards: number) => {
  const { width } = useWindowDimensions();
  return Math.round((width - ROW_PADDING) / visibleCards - ROW_GAP);
};

export const useHeroHeight = () => {
  const { height } = useWindowDimensions();
  return Math.round(clamp(height * 0.43, 320, 480));
};
