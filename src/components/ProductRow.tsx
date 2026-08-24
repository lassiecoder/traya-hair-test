import React from 'react';
import {Image, ImageSourcePropType, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, textStyles} from '../theme';

type ProductRowProps = {
  category: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  icon: ImageSourcePropType;
  isLast?: boolean;
  onPress?: () => void;
};

/** One row in the "Four products, one protocol" list. */
function ProductRow({
  category,
  title,
  description,
  price,
  originalPrice,
  icon,
  isLast,
  onPress,
}: ProductRowProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [styles.row, !isLast && styles.rowDivider, pressed && onPress && styles.rowPressed]}>
      <Text style={styles.category}>{category}</Text>
      <View style={styles.content}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.priceWrap}>
          <Text style={styles.price}>₹{price}</Text>
          <Text style={styles.originalPrice}>₹{originalPrice}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 16,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowPressed: {
    opacity: 0.75,
  },
  category: {
    ...textStyles.caption,
    color: colors.textMuted,
    marginBottom: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 14,
  },
  textWrap: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    ...textStyles.label,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  description: {
    ...textStyles.caption,
    color: colors.textMuted,
  },
  priceWrap: {
    alignItems: 'flex-end',
  },
  price: {
    ...textStyles.label,
    color: colors.textPrimary,
  },
  originalPrice: {
    ...textStyles.caption,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
});

export default ProductRow;
