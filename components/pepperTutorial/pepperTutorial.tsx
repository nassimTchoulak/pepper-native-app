import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PepperCarousel from '../pepperCarousel/pepperCarousel';
import { PepperImages } from '../pepperImage/pepperImage';
import { PepperOrganizerStackRoutes } from '../../models/routes';
import { pepper, white } from '../../styles/common';

const PepperTutorial = (): JSX.Element => {

  const genderDependentSlideEncouragement =
    ({
      image: PepperImages.FamousMan, text: (<>
        Being ghosted is no way to find a lover, in
        {(<Text style={{ color: pepper, fontFamily: 'Sora_700Bold' }}> Pepper parties </Text>)}
        everyone will see the star you are </>)
    });

  const genderDependentSlideAfterParty =
    ({
      image: PepperImages.SwipeOnMan, text: (<> The day after the party, you will be able to swipe on the people you met at the party! </>)
    });

  return (
    <View style={styles.container}>
      <PepperCarousel pages={[
        { image: PepperImages.Romance, text: 'When you’ll get to the event you will probably meet some lovely people, talk to them!' },
        genderDependentSlideAfterParty,
        genderDependentSlideEncouragement,
      ]}
      nextStep={PepperOrganizerStackRoutes.Login}
      ></PepperCarousel>
    </View>
  );
};

export default PepperTutorial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
