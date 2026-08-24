import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ImagePreviewOverlay from '../components/ImagePreviewOverlay';
import {ReportProduct} from '../data/fullReport';
import {colors, textStyles} from '../theme';

const BACK_ICON = require('../../assets/images/back-btn.png');
const PLUS_ICON = require('../../assets/images/plus.png');
const MINUS_ICON = require('../../assets/images/minus.png');

/** Slide duration for the push/pop-style transitions — mimics a native navigation push instead of an instant cut. */
const SCREEN_ENTRANCE_MS = 320;
const SCREEN_EXIT_MS = 280;

type DetailTab = 'description' | 'ingredients' | 'howToUse';

const TABS: {key: DetailTab; label: string}[] = [
  {key: 'description', label: 'Description'},
  {key: 'ingredients', label: 'Ingredients'},
  {key: 'howToUse', label: 'How to use'},
];

type ProductDetailScreenProps = {
  product: ReportProduct;
  onBack: () => void;
};

function ProductDetailScreen({product, onBack}: ProductDetailScreenProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<DetailTab>('description');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(product.faqs[0]?.id ?? null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const screenEntranceAnim = useRef(new Animated.Value(0)).current;
  // Guards against a second tap re-triggering the exit animation (and re-firing onBack) while
  // the first one is still playing out.
  const isExitingRef = useRef(false);

  useEffect(() => {
    Animated.timing(screenEntranceAnim, {
      toValue: 1,
      duration: SCREEN_ENTRANCE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mirrors the push-in with a slide-out before actually unmounting — RootNavigator swaps
  // screens instantly with no transition of its own, so without this the screen would just
  // disappear rather than feel like a navigation pop.
  function handleBack() {
    if (isExitingRef.current) {
      return;
    }
    isExitingRef.current = true;
    Animated.timing(screenEntranceAnim, {
      toValue: 0,
      duration: SCREEN_EXIT_MS,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) {
        onBack();
      }
    });
  }

  const screenTranslateX = screenEntranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').width, 0],
  });

  const tabContent = {
    description: product.longDescription,
    ingredients: product.ingredients,
    howToUse: product.howToUse,
  }[activeTab];

  const thumbnails = product.gallery.slice(1);

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <Animated.View style={[styles.pushWrapper, {transform: [{translateX: screenTranslateX}]}]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <Image source={BACK_ICON} style={styles.backIcon} resizeMode="contain" />
        </Pressable>

        <View style={styles.gallery}>
          <Pressable style={styles.mainImageWrap} onPress={() => setPreviewIndex(0)}>
            <Image source={product.gallery[0]} style={styles.mainImage} resizeMode="cover" />
          </Pressable>
          <View style={styles.thumbnailColumn}>
            {thumbnails.map((source, index) => (
              <Pressable
                key={index}
                style={[styles.thumbnailWrap, index < thumbnails.length - 1 && styles.thumbnailSpacing]}
                onPress={() => setPreviewIndex(index + 1)}>
                <Image source={source} style={styles.thumbnailImage} resizeMode="cover" />
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.price}>₹{product.price}</Text>

        <View style={styles.divider} />

        <Text style={styles.eyebrow}>DIRECTIONS</Text>
        {product.directions.map(direction => (
          <View key={direction.period} style={styles.directionRow}>
            <View style={styles.directionPill}>
              <Text style={styles.directionPillText}>{direction.period}</Text>
            </View>
            <Text style={styles.directionText}>{direction.instruction}</Text>
          </View>
        ))}

        <View style={styles.badgeRow}>
          {product.badges.map(badge => (
            <View key={badge} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tabRow}>
          {TABS.map((tab, index) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={index < TABS.length - 1 && styles.tabSpacing}>
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
              <View style={[styles.tabIndicator, activeTab === tab.key && styles.tabIndicatorActive]} />
            </Pressable>
          ))}
        </View>
        <Text style={styles.tabContent}>{tabContent}</Text>

        <Text style={[styles.eyebrow, styles.faqEyebrow]}>FREQUENTLY ASKED</Text>
        {product.faqs.map((faq, index) => {
          const isExpanded = expandedFaqId === faq.id;
          return (
            <Pressable
              key={faq.id}
              onPress={() => setExpandedFaqId(isExpanded ? null : faq.id)}
              style={[styles.faqRow, index < product.faqs.length - 1 && styles.faqRowDivider]}>
              <View style={styles.faqQuestionRow}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Image
                  source={isExpanded ? MINUS_ICON : PLUS_ICON}
                  style={styles.faqToggleIcon}
                  resizeMode="contain"
                />
              </View>
              {isExpanded ? <Text style={styles.faqAnswer}>{faq.answer}</Text> : null}
            </Pressable>
          );
        })}
      </ScrollView>

      {previewIndex !== null ? (
        <ImagePreviewOverlay
          images={product.gallery}
          initialIndex={previewIndex}
          onDismiss={() => setPreviewIndex(null)}
        />
      ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pushWrapper: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  backIcon: {
    width: 22,
    height: 22,
  },
  gallery: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  mainImageWrap: {
    flex: 1.5,
    aspectRatio: 0.82,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.onPrimary,
    marginRight: 12,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailColumn: {
    flex: 1,
  },
  thumbnailWrap: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.onPrimary,
  },
  thumbnailSpacing: {
    marginBottom: 12,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontFamily: textStyles.title.fontFamily,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  description: {
    ...textStyles.body,
    color: colors.textMuted,
    marginBottom: 16,
  },
  price: {
    fontSize: 26,
    fontFamily: textStyles.title.fontFamily,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 24,
  },
  eyebrow: {
    ...textStyles.captionEmphasis,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  directionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  directionPill: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 12,
  },
  directionPillText: {
    ...textStyles.captionEmphasis,
    color: colors.onPrimary,
  },
  directionText: {
    ...textStyles.body,
    color: colors.textPrimary,
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 24,
  },
  badge: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  badgeText: {
    ...textStyles.captionEmphasis,
    color: colors.textPrimary,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    marginBottom: 20,
  },
  tabSpacing: {
    marginRight: 24,
  },
  tabLabel: {
    ...textStyles.label,
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.textPrimary,
  },
  tabIndicator: {
    height: 2,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  tabIndicatorActive: {
    backgroundColor: colors.primary,
  },
  tabContent: {
    ...textStyles.body,
    color: colors.textMuted,
    marginBottom: 32,
  },
  faqEyebrow: {
    marginTop: 4,
  },
  faqRow: {
    paddingVertical: 16,
  },
  faqRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    ...textStyles.label,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  faqToggleIcon: {
    width: 16,
    height: 16,
  },
  faqAnswer: {
    ...textStyles.body,
    color: colors.textMuted,
    marginTop: 10,
  },
});

export default ProductDetailScreen;
