import React, { useEffect } from 'react';
import Svg, { Ellipse, Rect, Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface Props {
  size?: number;
  color?: string;
  animate?: boolean;
}

// Returns a slightly lighter shade for the snout based on the body color
function getSnoutColor(color: string): string {
  if (color === '#2D6A4F') return '#3D8B65';
  if (color === '#1A365D') return '#2C4F8A';
  return color;
}

const PiggyLogo: React.FC<Props> = ({ size = 40, color = '#2D6A4F', animate = false }) => {
  const snoutColor = getSnoutColor(color);
  // Deep dark shade for eyes, nostrils, and coin slot
  const darkColor = '#1F4D38';

  const translateY = useSharedValue(0);

  useEffect(() => {
    if (animate) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 1250, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1250, easing: Easing.inOut(Easing.ease) }),
        ),
        -1, // infinite
        false,
      );
    } else {
      translateY.value = 0;
    }
  }, [animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const svgContent = (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      <G>
        {/* Left ear */}
        <Ellipse cx={18} cy={28} rx={7} ry={9} fill={color} />

        {/* Right ear */}
        <Ellipse cx={62} cy={28} rx={7} ry={9} fill={color} />

        {/* Body */}
        <Ellipse cx={40} cy={46} rx={28} ry={22} fill={color} />

        {/* Coin slot on top of body */}
        <Rect x={35} y={26} width={10} height={3} rx={1.5} fill={darkColor} />

        {/* Left eye */}
        <Circle cx={30} cy={42} r={2.5} fill={darkColor} />

        {/* Right eye */}
        <Circle cx={50} cy={42} r={2.5} fill={darkColor} />

        {/* Snout — slightly lighter than body */}
        <Ellipse cx={40} cy={54} rx={10} ry={7} fill={snoutColor} />

        {/* Left nostril */}
        <Circle cx={37} cy={54} r={2} fill={darkColor} />

        {/* Right nostril */}
        <Circle cx={43} cy={54} r={2} fill={darkColor} />

        {/* 4 legs — small rounded rects at bottom of body */}
        <Rect x={17} y={63} width={8} height={10} rx={3} fill={color} />
        <Rect x={28} y={65} width={8} height={8} rx={3} fill={color} />
        <Rect x={44} y={65} width={8} height={8} rx={3} fill={color} />
        <Rect x={55} y={63} width={8} height={10} rx={3} fill={color} />
      </G>
    </Svg>
  );

  if (animate) {
    return (
      <Animated.View style={animatedStyle}>
        {svgContent}
      </Animated.View>
    );
  }

  return svgContent;
};

export default PiggyLogo;
