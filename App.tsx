import React, { useState, useEffect } from 'react';
import PepperError from './components/pepperError/pepperError';
import * as SecureStore from 'expo-secure-store';
import { SecureStoreKeys } from './services/util';
import PepperOrganizerApp from './projects/organizerApp';

const PepperApp = (): JSX.Element => {
  const [isErrorFree, setIsErrorFree] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    (async() => {
      try {
        const error = await SecureStore.getItemAsync(SecureStoreKeys.Error);
        if (!!error) {
          setIsErrorFree(false);
        }
        // const isOrganizer = await UtilService.isOrganizer();
      } catch (error) {
        setIsErrorFree(false);
      }
    })();
    return () => { abortController.abort(); };
  }, []);


  return (
    <>
      {
        !isErrorFree ?
          (<PepperError/>) :
          <>
            <PepperOrganizerApp/>
          </>
      }
    </>
  );
};

export default PepperApp;
