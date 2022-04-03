import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Platform, Keyboard,
} from 'react-native';
import {
  white, space_unit, indigo_3, fontSizeRegular,
} from '../../styles/common';
import {
  FormSchema, FormType, KeyBoardType, tagValidator,
} from '../pepperForm';
import {
  legalAgeValidator, nameValidator, cityValidator, alwaysValidValidator, codeValidator,
} from '../pepperForm';
import { PepperFormStepper } from '../pepperForm/pepperFormStepper';
import { useNavigation } from '@react-navigation/native';
import { PepperStackRoutes } from '../../models/routes';
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
        validator: nameValidator,
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
      job: {
        type: FormType.Text,
        label: 'Job',
        max: 20,
        validator: nameValidator,
      },
      address: {
        type: FormType.Text,
        label: 'Ville',
        max: 30,
        validator: cityValidator,
      },
      description: {
        type: FormType.Text,
        label: 'Description',
        multiline: true,
        max: 200,
        validator: alwaysValidValidator,
      },
    },
    {
      interests: {
        type: FormType.Tags,
        label: 'You & your hobbies',
        validator: tagValidator,
      },
    },
    {
      imgs: {
        type: FormType.Image,
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
          address,
          description,
          interests,
          job,
          imgs,
        } = subscriptionFormOutput;

        try {
          // TODO: remove phoneNumberInput
          const subcribeSuccess = await LoginService.subscribe(
            subscriptionProps.route.params.phoneNumber,
            code as string,
            name as string,
            gender as Gender,
            address as string,
            description as string,
            interests as string[],
            job as string,
            imgs as Array<{ uri: string}>,
          );
          if (subcribeSuccess) {
            navigation.navigate(PepperStackRoutes.Tutorial);
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
          <TouchableOpacity style={styles.loginButton} onPress={() => { navigation.navigate(PepperStackRoutes.LoginRouter); }}>
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
  }
});
