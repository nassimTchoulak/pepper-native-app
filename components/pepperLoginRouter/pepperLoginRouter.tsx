import React from 'react';
import LoginService from '../../services/login';
import { useNavigation } from '@react-navigation/native';
import { PepperBuyerStackRoutes } from '../../models/routes';
import {
  PepperForm, FormType, FormSchema, MenuItem, phoneNumberValidator, KeyBoardType,
} from '../pepperForm';

const PepperLoginRouter = (): JSX.Element => {
  // TODO: Library does not provide a type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const schema: FormSchema = {
    phoneNumber: {
      type: FormType.Text,
      keyboardType: KeyBoardType.Numeric,
      label: 'Enter your phone number',
      max: 10,
      validator: phoneNumberValidator,
    },
  };

  // FIX: fix typing
  const onPhoneSubmit = async(output: { [key: string]: string | MenuItem[] | string[] }): Promise<void> => {
    const { phoneNumber } = output;
    const isSubscribed = await LoginService.isSubscribedAndInitLogin(phoneNumber as string);
    if (isSubscribed) {
      navigation.navigate(PepperBuyerStackRoutes.CodeLogin, { phoneNumber });
      return;
    }
    // Intro has subscription after it thats why we are routing to it
    navigation.navigate(PepperBuyerStackRoutes.Intro, { phoneNumber });
  };

  return <PepperForm schema={schema} onSubmit={onPhoneSubmit}/>;
};

export default PepperLoginRouter;
