import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
    Defs,
    LinearGradient,
    Stop,
    Text as SvgText,
    TSpan,
} from 'react-native-svg';

interface MagicTimerProps {
  timeInSeconds: number;
  fontSize?: number;
}

const formatTime = (totalSeconds: number): string => {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = seconds.toString().padStart(2, '0');
  return `${minutesStr}:${secondsStr}`;
};

const MagicTimer: React.FC<MagicTimerProps> = ({
  timeInSeconds,
  fontSize = 80,
}) => {
  const formattedTimeStr = useMemo(() => formatTime(timeInSeconds), [timeInSeconds]);
  const chars = formattedTimeStr.split('');

  const charWidth = fontSize * 0.55;
  const colonWidth = fontSize * 0.3;
  const totalWidth = charWidth * 4 + colonWidth;
  
  const svgWidth = totalWidth + fontSize * 3;
  const svgHeight = fontSize * 3.5;

  const fontFamily = 'MedievalSharp_400Regular';

  const purpleGlow = '#a855f7';
  const greenGlow = '#4ade80';

  const glowLayers = [
    { scale: 1.5, opacity: 0.2, color: purpleGlow, stroke: 5 },
    { scale: 1.3, opacity: 0.3, color: purpleGlow, stroke: 1 },
    { scale: 1, opacity: 0.3, color: greenGlow, stroke: 1 },
  ];

  const getCharX = (index: number) => {
    const startX = (svgWidth - totalWidth) / 2;
    if (index < 2) {
      return startX + index * charWidth + charWidth / 2;
    } else if (index === 2) {
      return startX + 2 * charWidth + colonWidth / 2;
    } else {
      return startX + 2 * charWidth + colonWidth + (index - 3) * charWidth + charWidth / 2;
    }
  };

  const renderText = (
    layerScale: number,
    layerOpacity: number,
    fill: string,
    stroke?: string,
    strokeWidth?: number,
    strokeOpacity?: number,
    key?: string
  ) => (
    <SvgText
      key={key}
      y="50%"
      alignmentBaseline="central"
      fontSize={fontSize * layerScale}
      fontFamily={fontFamily}
      fontWeight="bold"
      fill={fill}
      opacity={layerOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
    >
      {chars.map((char, index) => (
        <TSpan
          key={index}
          x={getCharX(index)}
          textAnchor="middle"
        >
          {char}
        </TSpan>
      ))}
    </SvgText>
  );

  return (
    <View style={styles.container}>
      <Svg height={svgHeight} width={svgWidth}>
        <Defs>
          <LinearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#dcfce7" stopOpacity="1" />
            <Stop offset="30%" stopColor="#86efac" stopOpacity="1" />
            <Stop offset="100%" stopColor="#4ade80" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {glowLayers.map((layer, index) =>
          renderText(
            layer.scale,
            layer.opacity,
            layer.color,
            layer.color,
            layer.stroke,
            layer.opacity * 0.8,
            `glow-${index}`
          )
        )}

        {renderText(1, 1, 'url(#mainGradient)', '#16a34a', 1.5, 1, 'main')}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MagicTimer;
