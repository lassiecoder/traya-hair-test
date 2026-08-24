import React from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CLOSE_ICON = require('../../assets/images/close.png');

/** Deliberately darker than theme `colors.overlay` — a lightbox needs the image to read against near-black, not the app's tinted backdrop. */
const BACKDROP_COLOR = 'rgba(0, 0, 0, 0.92)';

type ImagePreviewOverlayProps = {
  images: ImageSourcePropType[];
  initialIndex: number;
  onDismiss: () => void;
};

/**
 * Full-screen image lightbox. Tap the close button or anywhere outside an
 * image to dismiss; swipe to page through `images`, starting at `initialIndex`.
 */
function ImagePreviewOverlay({images, initialIndex, onDismiss}: ImagePreviewOverlayProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onDismiss} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable style={[styles.closeButton, {top: insets.top + 12}]} onPress={onDismiss} hitSlop={12}>
          <Image source={CLOSE_ICON} style={styles.closeIcon} resizeMode="contain" />
        </Pressable>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentOffset={{x: initialIndex * screenWidth, y: 0}}>
          {images.map((source, index) => (
            <View key={index} style={[styles.slide, {width: screenWidth, height: screenHeight}]}>
              {/* Swallows the tap so it doesn't bubble to the backdrop's dismiss handler. */}
              <Pressable onPress={() => {}}>
                <Image source={source} style={styles.image} resizeMode="contain" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: BACKDROP_COLOR,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    width: 16,
    height: 16,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: Dimensions.get('window').width * 0.86,
    height: '70%',
  },
});

export default ImagePreviewOverlay;
