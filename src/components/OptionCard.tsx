import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, shadows, textStyles } from '../theme';

/** Brief pause after selection so the border/tint is visible before the flow advances — matches CheckboxOptionCard's feedback delay. */
export const OPTION_SELECT_ANIMATION_MS = 300;

type OptionCardProps = {
  title: string;
  description?: string;
  icon?: ImageSourcePropType;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
  /**
   * 'row' (default): small icon left, text right, full width.
   * 'grid': icon above title, sized by the parent (e.g. two-column).
   * 'photo': large cover-cropped photo left, text right.
   * 'photoGrid': title above a large cover-cropped photo, sized by the parent (e.g. two-column).
   */
  layout?: 'row' | 'grid' | 'photo' | 'photoGrid';
  /** 'photoGrid' only: aspect ratio (width / height) of the photo — defaults to a square. */
  photoAspectRatio?: number;
  style?: StyleProp<ViewStyle>;
};

function OptionCard({
  title,
  description,
  icon,
  selected,
  disabled,
  onPress,
  layout = 'row',
  photoAspectRatio = 1,
  style,
}: OptionCardProps): React.JSX.Element {
  const isGrid = layout === 'grid';
  const isPhoto = layout === 'photo';
  const isPhotoGrid = layout === 'photoGrid';

  if (isPhotoGrid) {
    return (
      <View style={[styles.wrapGrid, style]}>
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.cardPhotoGrid,
            selected && styles.cardSelected,
            pressed && !disabled && styles.cardPressed,
          ]}
        >
          <Text
            style={styles.titlePhotoGrid}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {title}
          </Text>
          {icon ? (
            <View
              style={[styles.photoGridWrap, { aspectRatio: photoAspectRatio }]}
            >
              <Image source={icon} style={styles.photo} resizeMode="cover" />
            </View>
          ) : null}
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[isGrid ? styles.wrapGrid : styles.wrap, style]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          isGrid ? styles.cardGrid : isPhoto ? styles.cardPhoto : styles.card,
          selected && styles.cardSelected,
          pressed && !disabled && styles.cardPressed,
        ]}
      >
        {icon ? (
          <View
            style={
              isGrid
                ? styles.iconWrapGrid
                : isPhoto
                ? styles.photoWrap
                : styles.iconWrap
            }
          >
            <Image
              source={icon}
              style={isGrid ? styles.iconGrid : isPhoto ? styles.photo : styles.icon}
              resizeMode={isPhoto ? 'cover' : 'contain'}
            />
          </View>
        ) : null}
        <View style={isGrid ? styles.textWrapGrid : styles.textWrap}>
          <Text
            style={[
              isGrid ? styles.titleGrid : styles.title,
              !description && styles.titleOnly,
            ]}
          >
            {title}
          </Text>
          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 20,
    marginBottom: 16,
    ...shadows.sm,
  },
  wrapGrid: {
    borderRadius: 20,
    marginBottom: 16,
    ...shadows.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 16,
  },
  cardPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 12,
  },
  cardGrid: {
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  cardPhotoGrid: {
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 14,
  },
  cardSelected: {
    backgroundColor: colors.inputBackgroundSelected,
    borderColor: colors.primary,
    ...shadows.md,
  },
  cardPressed: {
    opacity: 0.75,
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
  photoWrap: {
    width: 76,
    height: 76,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: colors.inputBackgroundSelected,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoGridWrap: {
    width: '48%',
    alignSelf: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 10,
    backgroundColor: colors.inputBackgroundSelected,
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
  textWrap: {
    flex: 1,
  },
  textWrapGrid: {
    alignItems: 'center',
  },
  title: {
    ...textStyles.label,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  titleGrid: {
    ...textStyles.label,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  titlePhotoGrid: {
    ...textStyles.label,
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  titleOnly: {
    marginBottom: 0,
  },
  description: {
    ...textStyles.caption,
    color: colors.textMuted,
  },
});

export default OptionCard;
