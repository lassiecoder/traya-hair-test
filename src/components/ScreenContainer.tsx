import React, { PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

type ScreenContainerProps = PropsWithChildren<{
  /**
   * Rendered above the scrollable content, inside the same safe-area padding, so it inherits the
   * screen's top safe-area inset automatically (notch, Dynamic Island, no-notch devices, tablets)
   * without any device-specific handling of its own. Stays fixed in place while `children` scroll.
   */
  header?: ReactNode;
}>;

function ScreenContainer({
  children,
  header,
}: ScreenContainerProps): React.JSX.Element {
  // Insets come from context (already known, no native remeasure) rather than the native
  // SafeAreaView component — every screen here remounts on navigation (RootNavigator has no
  // real navigator, and the assessment flow remounts per question via `key`), and a freshly
  // mounted SafeAreaView renders one frame at padding 0 before its native measurement resolves,
  // which reads as the header flickering up to the top edge on every redirect.
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      {header ? <View style={styles.header}>{header}</View> : null}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            header ? styles.contentWithHeader : null,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  // The header now carries the top offset that `content.paddingTop` otherwise provides, so
  // scrollable content picks up right where the header's bottom edge leaves off.
  contentWithHeader: {
    paddingTop: 0,
  },
});

export default ScreenContainer;
