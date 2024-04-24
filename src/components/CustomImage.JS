import React from 'react';
import { Image } from 'react-native';

const CustomImage = ({ source, width, height, marginBottom }) => {
  return (
    <Image
      source={source}
      style={{
        width: width || '100%',
        height: height || 200,
        marginBottom: marginBottom || 8,
      }}
    />
  );
};

export default CustomImage;
