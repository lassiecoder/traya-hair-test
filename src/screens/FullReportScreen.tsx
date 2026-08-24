import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IncludedCard from '../components/IncludedCard';
import MonthProgressCard from '../components/MonthProgressCard';
import ProductRow from '../components/ProductRow';
import {
  ALSO_INCLUDED,
  CLINICAL_EVIDENCE,
  DENSITY_MAP_MONTH_0_ICON,
  DIAGNOSIS,
  MONTH_PROGRESS,
  PLAN_TOTAL_PRICE,
  REPORT_PRODUCTS,
  ReportProduct,
} from '../data/fullReport';
import { IconGender } from '../data/userGender';
import { colors, textStyles } from '../theme';

const START_PLAN_ICON = require('../../assets/images/start-plan.png');
const BACK_ICON = require('../../assets/images/back-btn.png');

const DIAGNOSIS_ENTRANCE_MS = 360;
const DENSITY_ENTRANCE_MS = 420;
const DENSITY_ENTRANCE_DELAY_MS = 120;
const DIAGNOSIS_ENTRANCE_OFFSET = 24;
const DENSITY_ENTRANCE_OFFSET = 56;

type FullReportScreenProps = {
  iconGender: IconGender;
  onStartPlan: () => void;
  onSelectProduct: (product: ReportProduct) => void;
  onBack: () => void;
  /** Scroll offset to restore to on mount — RootNavigator remembers this across unmounts. */
  initialScrollY: number;
  onScroll: (y: number) => void;
};

function FullReportScreen({
  iconGender,
  onStartPlan,
  onSelectProduct,
  onBack,
  initialScrollY,
  onScroll,
}: FullReportScreenProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const diagnosisAnim = useRef(new Animated.Value(0)).current;
  const densityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(diagnosisAnim, {
        toValue: 1,
        duration: DIAGNOSIS_ENTRANCE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(densityAnim, {
        toValue: 1,
        duration: DENSITY_ENTRANCE_MS,
        delay: DENSITY_ENTRANCE_DELAY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const diagnosisTranslateY = diagnosisAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-DIAGNOSIS_ENTRANCE_OFFSET, 0],
  });
  const densityTranslateX = densityAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [DENSITY_ENTRANCE_OFFSET, 0],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.flexFull, {paddingTop: insets.top}]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          contentOffset={{x: 0, y: initialScrollY}}
          onScroll={event => onScroll(event.nativeEvent.contentOffset.y)}
          scrollEventThrottle={16}
        >
          <View style={styles.headerRow}>
            <Pressable onPress={onBack} style={styles.backButton} hitSlop={8}>
              <Image source={BACK_ICON} style={styles.backIcon} resizeMode="contain" />
            </Pressable>
            <Animated.Text
              style={[styles.headerEyebrow, {transform: [{translateY: diagnosisTranslateY}]}]}>
              DIAGNOSIS
            </Animated.Text>
          </View>

          <Animated.View style={{transform: [{translateY: diagnosisTranslateY}]}}>
            <Text style={styles.diagnosisHeadline}>{DIAGNOSIS.headline}</Text>
            <Text style={styles.diagnosisDescription}>
              {DIAGNOSIS.description}
            </Text>
          </Animated.View>

          <Animated.View style={{transform: [{translateX: densityTranslateX}]}}>
            <View style={styles.densityCard}>
              <Text style={styles.densityCardLabel}>
                Your density map · Month 0
              </Text>
              <Image
                source={DENSITY_MAP_MONTH_0_ICON[iconGender]}
                style={styles.densityCardIcon}
                resizeMode="contain"
              />
            </View>

            <View style={styles.divider} />

            <Text style={styles.eyebrow}>WHAT 5 MONTHS LOOKS LIKE</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.monthScrollContent}
            >
              {MONTH_PROGRESS.map(month => (
                <MonthProgressCard
                  key={month.id}
                  icon={month.genderedIcon[iconGender]}
                  label={month.label}
                  description={month.description}
                />
              ))}
            </ScrollView>
          </Animated.View>

          <View style={styles.clinicalBand}>
            <Text style={styles.clinicalEyebrow}>CLINICAL EVIDENCE</Text>
            <Text style={styles.clinicalHeadline}>
              {CLINICAL_EVIDENCE.headline}
            </Text>
            <Text style={styles.clinicalBody}>
              {CLINICAL_EVIDENCE.studyLine}
            </Text>
            <Text style={styles.clinicalBody}>
              {CLINICAL_EVIDENCE.caveatLine}
            </Text>
          </View>

          <Text style={styles.eyebrow}>MONTH 1 · CUSTOMISED KIT</Text>
          <Text style={styles.sectionHeadline}>
            Four products, one protocol
          </Text>
          <View style={styles.divider} />

          {REPORT_PRODUCTS.map((product, index) => (
            <ProductRow
              key={product.id}
              category={product.category}
              title={product.title}
              description={product.description}
              price={product.price}
              originalPrice={product.originalPrice}
              icon={product.icon}
              isLast={index === REPORT_PRODUCTS.length - 1}
              onPress={() => onSelectProduct(product)}
            />
          ))}

          <Text style={[styles.eyebrow, styles.includedEyebrow]}>
            ALSO INCLUDED, NO EXTRA COST
          </Text>
          <View style={styles.includedRow}>
            {ALSO_INCLUDED.map((item, index) => (
              <IncludedCard
                key={item.id}
                title={item.title}
                description={item.description}
                style={index === 0 ? styles.includedCardSpacing : undefined}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={[styles.bottomBarSafeArea, {paddingBottom: insets.bottom}]}>
        <Pressable onPress={onStartPlan} style={styles.bottomBar}>
          <View>
            <Text style={styles.priceLabel}>₹{PLAN_TOTAL_PRICE}</Text>
            <Text style={styles.priceSubLabel}>Inclusive of all taxes</Text>
          </View>
          <View style={styles.startPlanRow}>
            <Text style={styles.startPlanText}>Start my plan</Text>
            <Image
              source={START_PLAN_ICON}
              style={styles.startPlanIcon}
              resizeMode="contain"
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flexFull: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    width: 22,
    height: 22,
  },
  headerEyebrow: {
    ...textStyles.captionEmphasis,
    color: colors.textPrimary,
  },
  eyebrow: {
    ...textStyles.captionEmphasis,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  diagnosisHeadline: {
    ...textStyles.title,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  diagnosisDescription: {
    ...textStyles.body,
    color: colors.textMuted,
    marginBottom: 24,
  },
  densityCard: {
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
  },
  densityCardLabel: {
    ...textStyles.label,
    color: colors.textPrimary,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  densityCardIcon: {
    width: 140,
    height: 140,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 24,
  },
  monthScrollContent: {
    paddingRight: 24,
    marginBottom: 8,
  },
  clinicalBand: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: colors.primary,
    marginTop: 32,
    marginBottom: 32,
  },
  clinicalEyebrow: {
    ...textStyles.captionEmphasis,
    color: colors.onPrimary,
    marginBottom: 16,
  },
  clinicalHeadline: {
    ...textStyles.title,
    color: colors.onPrimary,
    marginBottom: 16,
  },
  clinicalBody: {
    ...textStyles.caption,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  sectionHeadline: {
    fontSize: 24,
    lineHeight: 29,
    fontFamily: textStyles.title.fontFamily,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  includedEyebrow: {
    marginTop: 8,
  },
  includedRow: {
    flexDirection: 'row',
  },
  includedCardSpacing: {
    marginRight: 16,
  },
  bottomBarSafeArea: {
    backgroundColor: colors.primary,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  priceLabel: {
    fontSize: 20,
    fontFamily: textStyles.title.fontFamily,
    color: colors.onPrimary,
  },
  priceSubLabel: {
    ...textStyles.caption,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  startPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startPlanText: {
    fontSize: 17,
    fontFamily: textStyles.title.fontFamily,
    color: colors.onPrimary,
    marginRight: 8,
  },
  startPlanIcon: {
    width: 20,
    height: 20,
  },
});

export default FullReportScreen;
