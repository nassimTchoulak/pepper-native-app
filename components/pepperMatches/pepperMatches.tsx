import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Modal,
} from 'react-native';
import {
  space_unit, fontSizeSubHeader, white, fontSizeRegular, heaven, grey_3, black, fontSizeBody, pepper, raven, sea,
} from '../../styles/common';
import {
  IMatch, MatchStatus, Gender, StoreStatus,
} from '../../models/types';
import PepperImage, { PepperImages } from '../pepperImage/pepperImage';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { usePepperUser } from '../../hooks/user.hooks';
import { usePepperDispatch } from '../../hooks/store.hooks';
import { fetchUser, deleteMatch } from '../../features/user/userActions';
import { PepperBuyerStackRoutes } from '../../models/routes';
import { keyExtractor, limitTextLength } from '../../helpers/uiHelper';

const PepperMatches = (): JSX.Element => {
  // TODO: Library does not provide a type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const [patienceModalVisible, setPatienceModalVisible] = useState<boolean>(false);
  const [cupidModalVisible, setCupidModalVisible] = useState<boolean>(false);
  const [selectedMatch, setSelectedMatch] = useState<IMatch>();
  const storeDispatch = usePepperDispatch();
  // Fetch user on load
  useEffect(() => { storeDispatch(fetchUser()); }, []);
  const currentUser = usePepperUser();

  const StaticStatusTag = (statusProps: { status: MatchStatus, matchName: string }): JSX.Element => {
    switch (statusProps.status) {
      case MatchStatus.ACCEPTED:
        return <Text style={{ fontSize: fontSizeRegular, color: heaven }}>
          Check { currentUser.user.gender === Gender.MAN ? 'his' : 'her'} profile
        </Text>;
      default:
        return <Text style={{ fontSize: fontSizeRegular, color: grey_3 }}>Didn't check you yet</Text>;
    }
  };

  const checkMatch = (match: IMatch): void => {
    switch (match.status) {
      case MatchStatus.ACCEPTED:
        navigation.push(PepperBuyerStackRoutes.MatchDescription, { user: match, withContact: true });
        break;
      case MatchStatus.WAITING:
        setSelectedMatch(match);
        setPatienceModalVisible(true);
        break;
      default:
        break;
    }
  };

  const closeModalAndResetSelection = (): void => {
    setPatienceModalVisible(false);
    setSelectedMatch(undefined);
  };

  const discardMatch = (matchId?: number): void => {
    if (!matchId) { return; }
    closeModalAndResetSelection();
    storeDispatch(deleteMatch({ matchId }));
  };

  const matchItem = (match: IMatch): JSX.Element => (
    <TouchableOpacity style={styles.matchItemContainer} onPress={() => checkMatch(match)}>
      <Image source={match.imgs[0]} style={styles.matchImage}/>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: fontSizeSubHeader }}>{limitTextLength(match.name)}</Text>
        <View style={styles.themeAndDateContainer}>
          <Text style={{ fontSize: fontSizeRegular }}>{limitTextLength(match.job)}</Text>
          <StaticStatusTag status={match.status} matchName={match.name}></StaticStatusTag>
        </View>
      </View>
    </TouchableOpacity>
  );

  const StaticPatienceModal = (): JSX.Element => (
    <Modal
      animationType="fade"
      visible={patienceModalVisible}
      transparent={true}
      onRequestClose={() => closeModalAndResetSelection() }>
      <BlurView tint="dark" style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <PepperImage src={PepperImages.ShyHeart} style={styles.modalImage}></PepperImage>
          <Text style={styles.modalDescription}>
            Maybe {selectedMatch?.gender === Gender.MAN ? 'He' : 'She' } Didn't see you, go talk to them!
          </Text>
          <View style={{
            marginTop: 2 * space_unit, width: '100%', flexDirection: 'row', justifyContent: 'space-around'
          }}>
            <TouchableOpacity onPress={() => discardMatch(selectedMatch?.id) }>
              <Text style={{ fontSize: fontSizeBody, color: pepper }}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => closeModalAndResetSelection() }>
              <Text style={{ fontSize: fontSizeBody, color: sea }}>Okey</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );

  const StaticCupidModal = (): JSX.Element => (
    <Modal
      animationType="fade"
      visible={cupidModalVisible}
      transparent={true}
      onRequestClose={() => setCupidModalVisible(false)}>
      <BlurView tint="dark" style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <PepperImage src={PepperImages.Cupid} style={styles.modalImage}></PepperImage>
          <Text style={{ ...styles.modalDescription, color: pepper }}>
            Cupid has heard your wish!
          </Text>
          <TouchableOpacity onPress={() => setCupidModalVisible(false) }>
            <Text style={{ fontSize: fontSizeBody }}>Okey</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );

  const StaticGoGetMatches = (): JSX.Element => (
    currentUser.user.gender === Gender.MAN ?
      (<View style={styles.goGetMatchContainer}>
        <PepperImage src={PepperImages.Sir} style={styles.goGetMatchImage}></PepperImage>
        <Text style={styles.goGetMatchDescription}> Remember! </Text>
        <Text style={styles.goGetMatchDescription}> Nobody likes mean people </Text>
        <Text style={styles.goGetMatchDescription}> Always be a gentleman </Text>
      </View>) :
      (<View style={styles.goGetMatchContainer}>
        <PepperImage src={PepperImages.Madam} style={styles.goGetMatchImage}></PepperImage>
        <Text style={styles.goGetMatchDescription}> Remember! </Text>
        <Text style={styles.goGetMatchDescription}> Nobody likes mean people </Text>
        <Text style={styles.goGetMatchDescription}> Always be a lady </Text>
      </View>)
  );

  return (
    <View style={styles.listContainer}>
      <StaticPatienceModal/>
      <StaticCupidModal/>
      { !currentUser.user.matches.length ?
        <StaticGoGetMatches/> :
        <FlatList
          data={currentUser.user.matches}
          refreshing={currentUser.fetchStatus !== StoreStatus.Fulfilled}
          onRefresh={() => storeDispatch(fetchUser())}
          renderItem={(item) => matchItem(item.item) }
          keyExtractor={(item) => keyExtractor(item.id) }
        />
      }
    </View>
  );
};

export default PepperMatches;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    padding: 1 * space_unit,
    paddingHorizontal: 2 * space_unit,
    backgroundColor: white,
  },
  matchItemContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 1 * space_unit,
  },
  themeAndDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchImage: {
    width: 10 * space_unit,
    height: 10 * space_unit,
    borderRadius: space_unit,
    marginRight: space_unit,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    backgroundColor: white,
    borderRadius: 2 * space_unit,
    padding: 3 * space_unit,
    alignItems: 'center',
    textAlign: 'center',
    shadowColor: black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    height: 22 * space_unit,
  },
  modalDescription: {
    textAlign: 'center',
    marginVertical: 2 * space_unit,
    fontSize: fontSizeRegular,
  },
  goGetMatchContainer: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goGetMatchImage: {
    height: '30%',
    marginBottom: 4 * space_unit,
  },
  goGetMatchDescription: {
    width: '80%',
    textAlign: 'center',
    fontSize: fontSizeRegular,
    color: raven,
    marginBottom: space_unit,
  },
});
