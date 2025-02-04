import React, { useEffect, useState } from 'react';
import LoginService from '../../services/login';
import {
  ActivityIndicator, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PepperSellerStackRoutes, PepperBuyerStackRoutes } from '../../models/routes';
import {
  pepper, white, space_unit, fontSizeHeader, indigo, black, fontSizeRegular, color, fontSizeSubSubHeader, indigo_3, fontSizeTypo, raven,
} from '../../styles/common';
import { UtilService } from '../../services/util';
import { useFonts, Sora_400Regular, Sora_700Bold } from '@expo-google-fonts/sora';
import { ArchitectsDaughter_400Regular } from '@expo-google-fonts/architects-daughter';
// import { setCustomText } from 'react-native-global-props';
import { LinearGradient } from 'expo-linear-gradient';
import PepperIcon from '../pepperIcon/pepperIcon';

const PepperLandingPage = (): JSX.Element => {
  // TODO: Library does not provide a type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const [isLangingPageShowing, setIsLangingPageShowing] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  // Font name must be named like this
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let [fontsLoaded] = useFonts({ Sora_400Regular, Sora_700Bold, ArchitectsDaughter_400Regular });

  useEffect(() => {
    if (!fontsLoaded) { return; }
    // setCustomText({ style: { fontFamily: 'Sora_400Regular' } });
    (async() => {
      try {
        const isLoggedin = await LoginService.isLoggedin();
        if (isLoggedin) {
          navigation.navigate(PepperBuyerStackRoutes.Main);
          return;
        }
        const isOrganizer = await UtilService.isOrganizer();
        setIsOrganizer(isOrganizer);
        setIsLangingPageShowing(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        UtilService.throwError(error);
      }
    })();
  }, [fontsLoaded]);

  const onGo = (): void => {
    if (isOrganizer) {
      navigation.navigate(PepperSellerStackRoutes.Login);
      return;
    }
    navigation.navigate(PepperBuyerStackRoutes.LoginRouter);
  };

  const onToggleApp = async(): Promise<void> => {
    await UtilService.toggleBetweenUserAndOrganizer();
  };

  return isLangingPageShowing ?
    (
      <LinearGradient
        colors={[indigo, indigo_3, pepper]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View>
          <View style={styles.titleWithIcon}>
            <PepperIcon name='pepper-chili' size={ 10 * space_unit} color={white} style={styles.titleIcon}/>
            <Text style={styles.title}>Pepper</Text>
          </View>
          <Text style={styles.punchline}>Better to go out to find a lover than to find a lover to go out</Text>
        </View>
        <View style={{ width: '100%' }}>
          <TouchableOpacity onPress={onGo} style={styles.goButton}>
            <Text style={styles.goButtonText}> Let's go! </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onToggleApp}>
            <Text style={styles.switchToOrganizerButton}>{ !isOrganizer ? 'Become an organizer!' : 'Looking for love ? find Pepper Parties!'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.founders}>
          <Text style={styles.foundersText}> Pepper dating </Text>
          <Text style={styles.foundersText}> Founded by </Text>
          <Text style={styles.foundersText}> Meddah Tchoulak Houamel </Text>
        </View>
      </LinearGradient>
    ) :
    (<View style={styles.container}>
      <ActivityIndicator size="large" color={pepper} />
    </View>);
};

export default PepperLandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 7 * space_unit,
    paddingVertical: 20 * space_unit,
  },
  goButton: {
    color: white,
    backgroundColor: color(raven, .9),
    width: '100%',
    paddingVertical: 2 * space_unit,
    justifyContent: 'center',
    borderRadius: space_unit,
    shadowColor: black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: .5,
    shadowRadius: 3,
    elevation: 1,
  },
  goButtonText: {
    color: white,
    fontSize: fontSizeSubSubHeader,
    textAlign: 'center',
    fontFamily: 'Sora_700Bold',
  },
  punchline: {
    color: color(white, .9),
    fontSize: fontSizeRegular,
    textAlign: 'center',
    marginTop: 8 * space_unit,
    fontFamily: 'Sora_700Bold',
  },
  switchToOrganizerButton: {
    color: color(white, .9),
    fontSize: fontSizeRegular,
    textAlign: 'center',
    marginTop: 4 * space_unit,
    fontFamily: 'Sora_700Bold',
  },
  title: {
    color: white,
    fontSize: 2 * fontSizeHeader,
    textAlign: 'center',
    shadowColor: white,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: .5,
    shadowRadius: 1,
    elevation: 2,
    fontFamily: 'Sora_700Bold',
  },
  titleIcon: {
    shadowColor: white,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: .5,
    shadowRadius: 2,
    elevation: 2,
    fontFamily: 'Sora_700Bold',
  },
  titleWithIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  founders: {
    bottom: 3 * space_unit,
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  foundersText: {
    color: white,
    fontSize: fontSizeTypo,
    flexWrap: 'wrap',
    textAlign: 'center',
    fontFamily: 'ArchitectsDaughter_400Regular',
  }
});
