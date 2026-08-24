import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, textStyles} from '../theme';

/** How long the left-to-right fill animation takes — callers time their "advance" delay to match. */
export const OPTION_SELECT_ANIMATION_MS = 380;

/** Fixed width (points) of the soft leading edge — constant throughout the sweep, not scaled to it. */
const FILL_FEATHER_WIDTH = 48;

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type OptionCardProps = {
  title: string;
  description?: string;
  icon?: ImageSourcePropType;
  /** Light-colored variant crossfaded in as the card fills. */
  selectedIcon?: ImageSourcePropType;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
  /** 'row' (default): icon left, text right, full width. 'grid': icon above title, sized by the parent (e.g. two-column). */
  layout?: 'row' | 'grid';
  style?: StyleProp<ViewStyle>;
};

function OptionCard({
  title,
  description,
  icon,
  selectedIcon,
  selected,
  disabled,
  onPress,
  layout = 'row',
  style,
}: OptionCardProps): React.JSX.Element {
  const isGrid = layout === 'grid';
  const [cardWidth, setCardWidth] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selected) {
      Animated.timing(progress, {
        toValue: 1,
        duration: OPTION_SELECT_ANIMATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  }, [selected, progress]);

  function handleLayout(event: LayoutChangeEvent) {
    setCardWidth(event.nativeEvent.layout.width);
  }

  // A fixed-width gradient rect slides in from the left; only its `left` position
  // animates (numeric, not `%`, so it reliably reaches the card's true right edge).
  // The soft (feathered-to-transparent) tail stays a constant width and simply
  // slides past the card's right edge — clipped and invisible — once fully filled,
  // so the resting "selected" state ends up solid, not permanently translucent.
  const gradientRectWidth = cardWidth + FILL_FEATHER_WIDTH;
  const featherStartLocation = cardWidth > 0 ? cardWidth / gradientRectWidth : 0;
  const fillLeft = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-gradientRectWidth, 0],
  });
  const titleColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textPrimary, colors.onPrimary],
  });
  const descriptionColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textMuted, 'rgba(255, 255, 255, 0.75)'],
  });

  return (
    <Pressable
      onPress={onPress}
      onLayout={handleLayout}
      disabled={disabled}
      style={({pressed}) => [
        isGrid ? styles.cardGrid : styles.card,
        pressed && !disabled && styles.cardPressed,
        style,
      ]}>
      {cardWidth > 0 ? (
        <AnimatedLinearGradient
          pointerEvents="none"
          colors={[colors.primary, colors.primary, 'rgba(23, 63, 53, 0)']}
          locations={[0, featherStartLocation, 1]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[styles.fill, {width: gradientRectWidth, left: fillLeft}]}
        />
      ) : null}

      {icon ? (
        <View style={isGrid ? styles.iconWrapGrid : styles.iconWrap}>
          <Image source={icon} style={isGrid ? styles.iconGrid : styles.icon} resizeMode="contain" />
          {selectedIcon ? (
            <Animated.Image
              source={selectedIcon}
              resizeMode="contain"
              style={[isGrid ? styles.iconGrid : styles.icon, styles.iconOverlay, {opacity: progress}]}
            />
          ) : null}
        </View>
      ) : null}
      <View style={isGrid ? styles.textWrapGrid : styles.textWrap}>
        <Animated.Text
          style={[
            isGrid ? styles.titleGrid : styles.title,
            !description && styles.titleOnly,
            {color: titleColor},
          ]}>
          {title}
        </Animated.Text>
        {description ? (
          <Animated.Text style={[styles.description, {color: descriptionColor}]}>
            {description}
          </Animated.Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardGrid: {
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.75,
  },
  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    width: 46,
    height: 46,
  },
  iconWrapGrid: {
    width: '100%',
    height: 60,
    marginBottom: 14,
  },
  iconGrid: {
    width: '100%',
    height: '100%',
  },
  iconOverlay: {
    position: 'absolute',
  },
  textWrap: {
    flex: 1,
  },
  textWrapGrid: {
    alignItems: 'center',
  },
  title: {
    ...textStyles.label,
    marginBottom: 2,
  },
  titleGrid: {
    ...textStyles.label,
    textAlign: 'center',
  },
  titleOnly: {
    marginBottom: 0,
  },
  description: {
    ...textStyles.caption,
  },
});

export default OptionCard;
