import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';

import { AppStack } from './AppStack';
import { Auth } from '../screens';
import { AuthStack } from './AuthStack';
import { AuthenticatedUserContext } from '../providers';
import { LoadingIndicator } from '../components';
// import { onAuthStateChanged } from 'firebase/auth';
// supabase auth
import { Session } from '@supabase/supabase-js';
import {supabase} from '../utils/supabase'
import { useColorScheme } from 'react-native';

export const RootNavigator = () => {
  // const { user, setUser } = useContext(AuthenticatedUserContext);
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const theme = useColorScheme();
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsLoading(false);
    })
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false);
    })

  }, [])
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer  theme={theme === 'dark' ? DarkTheme : DefaultTheme } >
      {session && session.user ?
        <AppStack />
        : <AuthStack />
      }
    </NavigationContainer>
  );
};
