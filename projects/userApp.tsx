import React, { FunctionComponent } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Provider } from 'react-redux';
import store from '../services/store';
import { PepperTitle, PepperUserProfile, PepperQrCode } from '../components/pepperHeader/pepperHeader';
import { PepperBuyerStackRoutes } from '../models/routes';
import PepperIntro from '../components/pepperIntro/pepperIntro';
import PepperUserSubscription from '../components/pepperUserSubscription/pepperUserSubscription';
import PepperTutorial from '../components/pepperTutorial/pepperTutorial';
import PepperMain from '../components/pepperMain/pepperMain';
import PepperMatchDescription from '../components/pepperMatchDescription/pepperMatchDescription';
import PepperUserCodeLogin from '../components/pepperUserCodeLogin/pepperUserCodeLogin';
import PepperLoginRouter from '../components/pepperLoginRouter/pepperLoginRouter';
import PepperUserDescription from '../components/pepperUserDescription/pepperUserDescription';
import { white } from '../styles/common';
import PepperLandingPage from '../components/pepperLandingPage/pepperLandingPage';
import PepperPartyDetails from '../components/pepperPartyDetails/pepperPartyDetails';
import PepperPartyDescription from '../components/pepperPartyDescription/pepperPartyDescription';

const ReactStack = createNativeStackNavigator();

const PepperUserApp = (): JSX.Element => (
  <RootSiblingParent>
    <Provider store={store}>
      <NavigationContainer>
        <ReactStack.Navigator
          screenOptions={({ route, navigation }) => ({
            headerShadowVisible: false,
            gestureEnabled: false,
            headerBackVisible: false,
            headerStyle: { backgroundColor: white },
            headerTitle: () => (<PepperTitle/>),
            headerLeft: () => (<PepperUserProfile navigation={navigation} route={route}/>),
            headerRight: () => (<PepperQrCode />),
          })}>
          <ReactStack.Screen name={PepperBuyerStackRoutes.LandingPage} component={PepperLandingPage} options={{ headerShown: false }}/>
          <ReactStack.Screen name={PepperBuyerStackRoutes.LoginRouter} component={PepperLoginRouter} />
          <ReactStack.Screen name={PepperBuyerStackRoutes.CodeLogin} component={PepperUserCodeLogin as unknown as FunctionComponent<{}>} />
          <ReactStack.Screen name={PepperBuyerStackRoutes.Intro} component={PepperIntro as unknown as FunctionComponent<{}>} />
          <ReactStack.Screen name={PepperBuyerStackRoutes.Subscription} component={PepperUserSubscription as unknown as FunctionComponent<{}>} />
          <ReactStack.Screen name={PepperBuyerStackRoutes.Tutorial} component={PepperTutorial} />
          <ReactStack.Screen name={PepperBuyerStackRoutes.Main} component={PepperMain} />
          <ReactStack.Screen name={PepperBuyerStackRoutes.PartyDescription} component={PepperPartyDescription as unknown as FunctionComponent<{}>} />
          <ReactStack.Screen name={PepperBuyerStackRoutes.PartyDetails} component={PepperPartyDetails as unknown as FunctionComponent<{}>} />
          <ReactStack.Screen name={PepperBuyerStackRoutes.MatchDescription} component={PepperMatchDescription as unknown as FunctionComponent<{}>} />
          <ReactStack.Screen name={PepperBuyerStackRoutes.UserDescription} component={PepperUserDescription as unknown as FunctionComponent<{}>} />
        </ReactStack.Navigator>
      </NavigationContainer>
    </Provider>
  </RootSiblingParent>
);

export default PepperUserApp;
