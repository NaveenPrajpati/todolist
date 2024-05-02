import React from 'react';
import {GestureResponderEvent, TextStyle} from 'react-native';

// Import the necessary icon sets from 'react-native-vector-icons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';

// Define a type for the supported icon sets
type IconSet =
  | 'MaterialIcons'
  | 'FontAwesome'
  | 'Ionicons'
  | 'Feather'
  | 'AntDesign'
  | 'EvilIcons'
  | 'FontAwesome5'
  | 'Entypo'; // ... add other icon sets here

// Define a type for the icon component props
type IconComponentProps = {
  iconName: string;
  iconPack?: IconSet;
  size?: number;
  color?: string;
  style?: TextStyle;
  onPress?: (event: GestureResponderEvent) => void;
};

// A mapping from the icon set name to the corresponding icon set component
const IconSets: Record<IconSet, React.ComponentType<any>> = {
  MaterialIcons,
  FontAwesome,
  Ionicons,
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome5,
};

const VectorIcon: React.FC<IconComponentProps> = ({
  iconName,
  iconPack = 'FontAwesome',
  size,
  color,
  style,
  onPress,
  ...props
}) => {
  // Access the correct icon set using the iconPack name, default to FontAwesome
  const IconComponent = IconSets[iconPack] || FontAwesome;

  return (
    <IconComponent
      name={iconName}
      size={size}
      color={color}
      style={style}
      onPress={onPress}
      {...props}
    />
  );
};

export default VectorIcon;
