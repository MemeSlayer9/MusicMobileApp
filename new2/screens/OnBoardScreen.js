import React from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
 import {PrimaryButton} from '../components/Button';
 import { COLORS, SIZES, SHADOWS, assets } from "../constants";

const OnBoardScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.black}}>
      <View style={{height: 400}}>
        <Image
          style={{
            width: '100%',
            resizeMode: 'contain',
            top: 100,
          }}
          source={require('../assets/images/headphone.jpg')}

        />
      </View>
      <View style={style.textContainer}>
        <View>
          <Text style={{fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: COLORS.white,}}>
           The Sound of Life
          </Text>
          <Text
            style={{
              marginTop: 20,
              fontSize: 18,
              textAlign: 'center',
              color: COLORS.white,
            }}>
           Music is not an entertainment, but also it is our life
          </Text>
        </View>
       
        <PrimaryButton
          onPress={() => navigation.navigate('Home')}
          title="Get Started"
        />
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  textContainer: {
    flex: 1,
    paddingHorizontal: 50,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  indicatorContainer: {
    height: 50,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentIndicator: {
    height: 12,
    width: 30,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    marginHorizontal: 5,
  },
  indicator: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: COLORS.grey,
    marginHorizontal: 5,
  },
});

export default OnBoardScreen;