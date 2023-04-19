import React, { useContext, useEffect, useState } from 'react';

import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';
import { AuthenticatedUserContext } from '../providers';
import { LoadingIndicator } from '../components';
import { NavigationContainer } from '@react-navigation/native';
import { auth } from '../config';
import { onAuthStateChanged } from 'firebase/auth';

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, [user]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
