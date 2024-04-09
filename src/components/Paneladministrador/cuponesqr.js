import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CuponesQRadmin = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>proximamente</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default CuponesQRadmin;
