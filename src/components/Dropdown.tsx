import React, {FC, ReactNode, useState} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import VectorIcon from './VectorIcon';
import {colors} from '../utils/styles';

interface SelectTagProps {
  data: Array<{label: string; value: string}>;
  [key: string]: any;
  onChange: () => void;
  renderLeftIcon: () => ReactNode;
  value: string;
  containerStyle: StyleProp<ViewStyle>;
}

const SelectTag: FC<SelectTagProps> = ({
  data,
  value,
  onChange,
  renderLeftIcon,
  containerStyle,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[
          styles.dropdown,
          containerStyle,
          isFocus && {borderColor: 'blue'},
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        containerStyle={{backgroundColor: 'black'}}
        itemTextStyle={{color: 'white'}}
        itemContainerStyle={{backgroundColor: 'black'}}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select List' : 'choose...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={onChange}
        renderLeftIcon={renderLeftIcon}
      />
    </View>
  );
};

export default SelectTag;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardbg,
  },
  dropdown: {
    height: 50,
    borderColor: colors.pirmary,
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: 300,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'white',
    marginHorizontal: 10,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
    marginHorizontal: 10,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
