import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Platform, Keyboard,
} from 'react-native';
import {
  white, space_unit, indigo_3, fontSizeRegular, raven,
} from '../../styles/common';
import {
  FormSchema, FormType, KeyBoardType, SocialMedia, SocialMediaType,
} from '../pepperForm';
import {
  legalAgeValidator, freeNameValidator, codeValidator,
} from '../pepperForm';
import { PepperFormStepper } from '../pepperForm/pepperFormStepper';
import { useNavigation } from '@react-navigation/native';
import { PepperBuyerStackRoutes } from '../../models/routes';
import LoginService from '../../services/login';
import { Gender } from '../../models/types';
import { UtilService } from '../../services/util';
import Toast from 'react-native-root-toast';

const PepperUserSubscription = (subscriptionProps: { route: { params: { phoneNumber: string} } }): JSX.Element => {
  const [hasGoToLoginButton, setHasGoToLoginButton] = useState(true);
  const schemas: FormSchema[] = [
    {
      name: {
        type: FormType.Text,
        label: 'Name',
        max: 20,
        validator: freeNameValidator,
      },
      gender: {
        type: FormType.Gender,
      },
      dateOfBirth: {
        type: FormType.Date,
        label: 'Date of birth',
        validator: legalAgeValidator,
      },
    },
    {
      imgs: {
        type: FormType.Image,
      },
    },
    {
      socialMedia: {
        type: FormType.SocialMedia,
        socialMediaType: SocialMediaType.Facebook,
        required: true,
      },
    },
    {
      code: {
        type: FormType.Text,
        keyboardType: KeyBoardType.Numeric,
        label: 'Enter the code received by sms',
        max: 6,
        validator: codeValidator,
      },
    }
  ];

  // TODO: Library does not provide a type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => setHasGoToLoginButton(false));
    Keyboard.addListener('keyboardDidHide', () => setHasGoToLoginButton(true));
  }, []);

  return (
    <View style={styles.container}>
      <PepperFormStepper schemas={schemas} onDone={async(subscriptionFormOutput) => {
        // FIX: fix type inferance
        const {
          code,
          name,
          gender,
          imgs,
          socialMedia,
        } = subscriptionFormOutput;

        try {
          // TODO: remove phoneNumberInput
          const subcribeSuccess = await LoginService.subscribe(
            subscriptionProps.route.params.phoneNumber,
            code as string,
            name as string,
            gender as Gender,
            imgs as Array<{ uri: string}>,
            (socialMedia as SocialMedia).facebook as string,
            (socialMedia as SocialMedia).instagram as string,
            (socialMedia as SocialMedia).snapchat as string,
          );
          if (subcribeSuccess) {
            navigation.navigate(PepperBuyerStackRoutes.Tutorial);
          }
        // we are catching an error that could be anything
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error.status === 401 ) {
            Toast.show('The code is not valid', {
              duration: Toast.durations.LONG,
              hideOnPress: true,
              opacity: .9,
              textStyle: Platform.select({
                ios: {
                  fontFamily: 'Arial'
                },
                android: {
                  fontFamily: 'normal'
                },
              })
            });
            return;
          }
          UtilService.throwError(error);
        }
      }}/>
      {
        hasGoToLoginButton ?
          <TouchableOpacity style={styles.loginButton} onPress={() => { navigation.navigate(PepperBuyerStackRoutes.LoginRouter); }}>
            <Text style={styles.loginText}>Already have an account?</Text>
          </TouchableOpacity> :
          null
      }
    </View>
  );
};

export default PepperUserSubscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    position: 'absolute',
    bottom: 5 * space_unit,
    left: 3 * space_unit,
    zIndex: 2,
  },
  loginText: {
    fontSize: fontSizeRegular,
    color: indigo_3,
    textDecorationLine: 'underline'
  },
  image: {
    height: '40%',
    marginBottom: 4 * space_unit,
  },
  description: {
    width: '90%',
    textAlign: 'center',
    fontSize: fontSizeRegular,
    color: raven,
  },
  headerContainer: {
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
