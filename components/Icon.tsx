import React from 'react';
import { View } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Carrot } from 'lucide-react-native';
import { EggFried } from 'lucide-react-native';

interface IconProps {
  size?: number;
  color?: string;
}

interface IoniconsProps extends IconProps {
  type: 'ionicons';
  name: keyof typeof Ionicons.glyphMap;
}

interface MaterialIconsProps extends IconProps {
  type: 'material';
  name: keyof typeof MaterialIcons.glyphMap;
}

const dietIconMap = (diet: string, size = 24, color = '#333') => {
  const dietName = diet.toLowerCase();

  switch (dietName) {
    case 'vegetarian':
      return <EggFried size={size} color={color} />;
    case 'vegan':
      return <Carrot size={size} color={color} />;
    case 'omnivore':
      return <MaterialCommunityIcons name="food-drumstick-outline" size={size} color={color} />;
    case 'pescatarian':
      return (
        <View style={{ transform: [{ rotate: '-30deg' }] }}>
          <Ionicons name="fish-outline" size={size} color={color} />
        </View>
      );
    default:
      return <MaterialIcons name="restaurant" size={size} color={color} />;
  }
};

const weatherIconMap = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear sky':
      return require('../assets/sun.png');
    case 'few clouds':
      return require('../assets/clouds.png');
    case 'scattered clouds':
      return require('../assets/clouds.png');
    case 'broken clouds':
      return require('../assets/clouds.png');
    case 'shower rain':
      return require('../assets/rain.png');
    case 'rain':
      return require('../assets/rain.png');
    case 'thunderstorm':
      return require('../assets/thunderstorm.png');
    case 'mist':
      return require('../assets/mist.png');
    case 'snow':
      return require('../assets/snow.png');
    default:
      return require('../assets/sun.png');
  }
};

export default { dietIconMap, weatherIconMap };
