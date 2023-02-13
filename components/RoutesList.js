import { Button, Icon, List, ListItem, Text } from '@ui-kitten/components';

import React from 'react';
import { StyleSheet } from 'react-native';
import { getRoutes } from '../assets/gtfs/route';

export const RoutesList = () => {

  const renderItemAccessory = (props) => (
    <Button size='tiny'>Start</Button>
  );

  const renderItemIcon = (props) => (
    <Icon {...props} name='person'/>
  );

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.id}`}
      description={`${item.route}`}
      accessoryLeft={<Text>🚌</Text>}
      accessoryRight={renderItemAccessory}
    />
  );

  return (
    <List
      style={styles.container}
      data={getRoutes()}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '50%',
    width: '80%',
  },
});
