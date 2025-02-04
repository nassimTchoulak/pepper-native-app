import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, Modal, TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  fontSizeBody, white, space_unit, black, fontSizeRegular, raven,
} from '../../styles/common';
import PepperImage, { imagesPepperSources, PepperImages } from '../pepperImage/pepperImage';
import PepperIcon from '../pepperIcon/pepperIcon';
import { BarCodeScanningResult } from 'expo-camera';
import { usePepperUser } from '../../hooks/user.hooks';
import { fetchUser, addMatch, attendParty } from '../../features/user/userActions';
import { usePepperDispatch } from '../../hooks/store.hooks';

enum QRcodeModalMode {
  Scan = 'scan',
  Display = 'display'
}

enum QRCodeType {
  User = 'user',
  Party = 'party',
}

enum QrCodeScannedType {
  User = 'user',
  Party = 'party',
  None = 'none',
}

const PepperQRCodeModal = (modalProps: { show: boolean, onRequestClose: () => void }): JSX.Element => {
  const [mode, setMode] = useState(QRcodeModalMode.Display);
  const [qrCodeScannedType, setQrCodeScannedType] = useState(QrCodeScannedType.None);
  const storeDispatch = usePepperDispatch();
  const currentUser = usePepperUser();

  // Fetch user on load
  useEffect(() => {
    if (modalProps.show) {
      storeDispatch(fetchUser());
    }
  }, [modalProps.show]);

  const handleBarCodeScanned = (result: BarCodeScanningResult): void => {
    // Keeping console log until implmentation
    // eslint-disable-next-line no-console
    console.log(`Bar code with type ${result.type} and data ${result.data} has been scanned!`);
    const qrCodeData = JSON.parse(result.data);
    if (qrCodeData.type === QRCodeType.User) {
      storeDispatch(addMatch({ matchId: qrCodeData.id })).then(() => {
        modalProps.onRequestClose();
        setQrCodeScannedType(QrCodeScannedType.User);
      });
      return;
    }
    storeDispatch(attendParty({ organizerId: qrCodeData.id })).then(() => {
      modalProps.onRequestClose();
      setQrCodeScannedType(QrCodeScannedType.Party);
    });
  };

  const StaticQrCodeScannedModal = (): JSX.Element => (
    <Modal
      animationType="fade"
      visible={qrCodeScannedType !== QrCodeScannedType.None}
      transparent={true}
      onRequestClose={() => setQrCodeScannedType(QrCodeScannedType.None)}>
      <BlurView tint="dark" style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <PepperImage src={
            qrCodeScannedType === QrCodeScannedType.User ?
              PepperImages.Peace :
              PepperImages.Welcome
          } style={styles.modalImage}></PepperImage>
          <Text style={styles.modalDescription}>
            { qrCodeScannedType === QrCodeScannedType.User ?
              'Somebody new has entered your life, Treat them right this might go somewhere!' :
              'Welcome to the party, go meet some new people!'
            }
          </Text>
          <TouchableOpacity onPress={() => setQrCodeScannedType(QrCodeScannedType.None) }>
            <Text style={{ fontSize: fontSizeBody }}>Great!</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );

  return (
    <>
      <StaticQrCodeScannedModal/>
      <Modal
        animationType="fade"
        visible={modalProps.show}
        transparent={true}
        onRequestClose={modalProps.onRequestClose}>
        <BlurView tint="dark" style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={modalProps.onRequestClose} style={styles.closeButton}>
              <PepperIcon name="pepper-close" size={3 * space_unit} />
            </TouchableOpacity>
            { mode === QRcodeModalMode.Display ?
              (
                <>
                  <Text style={{ fontSize: fontSizeBody, marginBottom: 3 * space_unit }}>Ask someone to scan me!</Text>
                  <View style={styles.qrCodeContainer}>
                      CONTAINER
                  </View>
                  <TouchableOpacity onPress={() => setMode(QRcodeModalMode.Scan) }>
                    <Text style={{ fontSize: fontSizeBody, marginTop: 5 * space_unit }}>Scan</Text>
                  </TouchableOpacity>
                </>
              ) :
              (
                <>
                  <Text style={{ fontSize: fontSizeBody, marginBottom: 3 * space_unit }}>Scan a QR code</Text>
                  <TouchableOpacity onPress={() => setMode(QRcodeModalMode.Display) }>
                    <Text style={{ fontSize: fontSizeBody, marginTop: 5 * space_unit }}>Show your QR code</Text>
                  </TouchableOpacity>
                </>
              )}
          </View>
        </BlurView>
      </Modal>
    </>);
};

export default PepperQRCodeModal;

const styles = StyleSheet.create({
  closeButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  scannerContainer: {
    borderRadius: 2 * space_unit,
    overflow: 'hidden',
    height: 40 * space_unit,
    width: 40 * space_unit,
    backgroundColor: raven,
  },
  qrCodeContainer: {
    borderRadius: 2 * space_unit,
    overflow: 'hidden',
    height: 40 * space_unit,
    width: 40 * space_unit,
  }
});
