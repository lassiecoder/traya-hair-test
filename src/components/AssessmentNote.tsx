import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {colors, textStyles} from '../theme';

const NOTE_ICON = require('../../assets/images/note.png');

type AssessmentNoteProps = {
  text: string;
};

/** Callout banner shown below a question's options, e.g. flagging a high-impact answer. */
function AssessmentNote({text}: AssessmentNoteProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Image source={NOTE_ICON} style={styles.icon} resizeMode="contain" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#57654F',
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
  },
  icon: {
    width: 26,
    height: 26,
    marginRight: 12,
  },
  text: {
    ...textStyles.caption,
    flex: 1,
    fontStyle: 'italic',
    color: colors.onPrimary,
  },
});

export default AssessmentNote;
