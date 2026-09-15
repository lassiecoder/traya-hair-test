import React, {PropsWithChildren} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '../theme';

type IconBadgeProps = PropsWithChildren<{
  /** Either pass an image `icon`, or pass `children` (e.g. a number) — not both. */
  icon?: ImageSourcePropType;
  size?: number;
  /** Icon's own size within the badge — defaults to ~55% of `size`. */
  iconSize?: number;
  tint?: string;
  style?: StyleProp<ViewStyle>;
}>;

const DEFAULT_SIZE = 44;

/** Small circular tinted container for an icon or short text/number — a reusable "badge" look used wherever a bare image previously sat ungrounded on the page background. */
function IconBadge({
  icon,
  size = DEFAULT_SIZE,
  iconSize,
  tint = colors.primarySoft,
  style,
  children,
}: IconBadgeProps): React.JSX.Element {
  const resolvedIconSize = iconSize ?? Math.round(size * 0.55);

  return (
    <View
      style={[
        styles.badge,
        {width: size, height: size, borderRadius: size / 2, backgroundColor: tint},
        style,
      ]}>
      {icon ? (
        <Image
          source={icon}
          style={{width: resolvedIconSize, height: resolvedIconSize}}
          resizeMode="contain"
        />
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconBadge;
