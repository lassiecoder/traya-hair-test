import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, textStyles} from '../theme';

/** Horizontal distance (points) between two adjacent whole-year tick marks. */
const YEAR_SPACING = 56;
/** Total tick marks per year-cell (evenly spaced); the middle one is the labeled/major tick.
 * 2 minors before + 2 after the major = 4 minor ticks visible between any two majors. */
const TICKS_PER_UNIT = 5;
const MAJOR_TICK_INDEX = 2;
/** Width of the fade-to-background overlay at each edge, drawing focus to the centered tick. */
const EDGE_FADE_WIDTH = 64;
const BACKGROUND_TRANSPARENT = 'rgba(220, 232, 213, 0)';

type AgePickerProps = {
  minAge: number;
  maxAge: number;
  value: number;
  onChange: (age: number) => void;
};

function AgePicker({minAge, maxAge, value, onChange}: AgePickerProps): React.JSX.Element {
  const listRef = useRef<FlatList<number>>(null);
  const hasCentered = useRef(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [displayedAge, setDisplayedAge] = useState(value);

  const ages = useMemo(() => {
    const list: number[] = [];
    for (let age = minAge; age <= maxAge; age += 1) {
      list.push(age);
    }
    return list;
  }, [minAge, maxAge]);

  function ageFromOffset(offsetX: number): number {
    const index = Math.round(offsetX / YEAR_SPACING);
    const clampedIndex = Math.max(0, Math.min(ages.length - 1, index));
    return ages[clampedIndex];
  }

  function handleContainerLayout(event: LayoutChangeEvent) {
    setViewportWidth(event.nativeEvent.layout.width);
  }

  // Fires once, right after the container's width is first measured — decoupled from any
  // particular onLayout firing order, so the ruler always ends up centered on `value`.
  useEffect(() => {
    if (hasCentered.current || viewportWidth === 0) {
      return;
    }
    hasCentered.current = true;
    const initialIndex = Math.max(0, ages.indexOf(value));
    listRef.current?.scrollToOffset({offset: initialIndex * YEAR_SPACING, animated: false});
  }, [viewportWidth, ages, value]);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setDisplayedAge(ageFromOffset(event.nativeEvent.contentOffset.x));
  }

  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    onChange(ageFromOffset(event.nativeEvent.contentOffset.x));
  }

  // Clamped so a not-yet-measured (zero) viewport never produces negative padding —
  // the ruler renders from the very first frame and just re-centers once measured,
  // instead of staying unmounted until layout and popping in whole.
  const sidePadding = Math.max(0, viewportWidth / 2 - YEAR_SPACING / 2);

  return (
    <View style={styles.container} onLayout={handleContainerLayout}>
      <Text style={styles.bigNumber}>{displayedAge}</Text>

      <View style={styles.rulerContainer}>
        <FlatList
          ref={listRef}
          data={ages}
          keyExtractor={age => String(age)}
          // Fixed-width items — lets FlatList place/scroll to any index without needing to
          // render everything up to it first, and is what actually makes virtualization
          // possible here. Without it (a plain ScrollView with all 78 age × ~15 tick views
          // mounted eagerly, ~1,100+ native views) this screen visibly stalls for close to a
          // second the first time it mounts.
          getItemLayout={(_, index) => ({length: YEAR_SPACING, offset: YEAR_SPACING * index, index})}
          initialNumToRender={10}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={YEAR_SPACING}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          contentContainerStyle={{paddingHorizontal: sidePadding}}
          renderItem={({item: age}) => (
            <View style={styles.tickUnit}>
              <View style={styles.labelSlot}>
                <Text style={[styles.tickLabel, age === displayedAge && styles.tickLabelActive]}>
                  {age}
                </Text>
              </View>
              <View style={styles.tickRow}>
                {Array.from({length: TICKS_PER_UNIT}).map((_, index) => (
                  <View key={index} style={styles.tickSlot}>
                    <View style={index === MAJOR_TICK_INDEX ? styles.majorTick : styles.minorTick} />
                  </View>
                ))}
              </View>
            </View>
          )}
        />
        <View style={styles.indicator} pointerEvents="none" />

        <LinearGradient
          pointerEvents="none"
          colors={[colors.background, BACKGROUND_TRANSPARENT]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.leftFade}
        />
        <LinearGradient
          pointerEvents="none"
          colors={[BACKGROUND_TRANSPARENT, colors.background]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.rightFade}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  bigNumber: {
    fontSize: 88,
    lineHeight: 96,
    letterSpacing: -1.76,
    fontFamily: textStyles.title.fontFamily,
    color: colors.textPrimary,
    marginBottom: 32,
  },
  rulerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  tickUnit: {
    width: YEAR_SPACING,
    alignItems: 'center',
  },
  // Fixed height regardless of which label is active (larger font), so every
  // unit's tick row below it starts at exactly the same Y position.
  labelSlot: {
    height: 26,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  tickRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: YEAR_SPACING,
    height: 28,
    marginTop: 10,
  },
  // Each tick centers within its own slot (never touching a slot edge), so
  // adjacent year-cells never place a tick at the same absolute position.
  tickSlot: {
    width: YEAR_SPACING / TICKS_PER_UNIT,
    alignItems: 'center',
  },
  majorTick: {
    width: 2,
    height: 28,
    borderRadius: 1,
    backgroundColor: colors.textPrimary,
  },
  minorTick: {
    width: 1.5,
    height: 14,
    borderRadius: 1,
    backgroundColor: colors.textMuted,
  },
  tickLabel: {
    fontFamily: textStyles.body.fontFamily,
    fontSize: 16,
    color: colors.textMuted,
  },
  tickLabelActive: {
    fontFamily: textStyles.title.fontFamily,
    fontSize: 20,
    color: colors.textPrimary,
  },
  indicator: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.textPrimary,
  },
  leftFade: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: EDGE_FADE_WIDTH,
  },
  rightFade: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: EDGE_FADE_WIDTH,
  },
});

export default AgePicker;
