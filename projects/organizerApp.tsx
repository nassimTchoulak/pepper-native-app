import React, { FunctionComponent } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Provider } from 'react-redux';
import store from '../services/store';
import { PepperTitle, PepperQrCode } from '../components/pepperHeader/pepperHeader';
import { PepperSellerStackRoutes } from '../models/routes';
import { white } from '../styles/common';
import PepperLandingPage from '../components/pepperLandingPage/pepperLandingPage';
import PepperOrganizerMain from '../components/pepperOrganizerMain/pepperOrganizerMain';
import PepperOrganizerLogin from '../components/pepperOrganizerLogin/pepperOrganizerLogin';
import PepperOrganizerSubscription from '../components/pepperOrganizerSubscription/pepperOrganizerSubscription';
import PepperOrganizerNewParty from '../components/pepperOrganizerNewParty/pepperOrganizerNewParty';
import PepperOrganizerCancelParty from '../components/pepperOrganizerCancelParty/pepperOrganizerCancelParty';

const ReactStack = createNativeStackNavigator();

const PepperOrganizerApp = (): JSX.Element => (
  <RootSiblingParent>
    <Provider store={store}>
      <NavigationContainer>
        <ReactStack.Navigator
          screenOptions={() => ({
            headerShadowVisible: false,
            gestureEnabled: false,
            headerBackVisible: false,
            headerStyle: { backgroundColor: white },
            headerTitle: () => (<PepperTitle/>),
            headerRight: () => (<PepperQrCode />),
          })}>
          <ReactStack.Screen name={PepperSellerStackRoutes.LandingPage} component={PepperLandingPage} options={{ headerShown: false }}/>
          <ReactStack.Screen name={PepperSellerStackRoutes.Login} component={PepperOrganizerLogin} />
          <ReactStack.Screen name={PepperSellerStackRoutes.Subscription} component={PepperOrganizerSubscription} />
          <ReactStack.Screen name={PepperSellerStackRoutes.Main} component={PepperOrganizerMain} />
          <ReactStack.Screen name={PepperSellerStackRoutes.NewParty} component={PepperOrganizerNewParty as unknown as FunctionComponent<{}>} />
          <ReactStack.Screen name={PepperSellerStackRoutes.CancelParty} component={PepperOrganizerCancelParty as unknown as FunctionComponent<{}>} />
        </ReactStack.Navigator>
      </NavigationContainer>
    </Provider>
  </RootSiblingParent>
);

export default PepperOrganizerApp;
