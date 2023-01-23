import { Button, Icon, List,Card, Modal, ListItem, Layout, Text } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

import React from 'react';
import getRoute from '../assets/gtfs/route'
import  getTrips from '../assets/gtfs/trips';
import { useNavigation } from '@react-navigation/native';
const data = getRoute();

export const BusFetch = () => {



  const renderItemIcon = (props) => (
    <Icon {...props} name='pin'/>
  );

  const renderItem = ({ item, index }) => {
    const navigation = useNavigation();
    const trip = useStore(state => state.trip)

    return(
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={
        (props) => (
          <Button style={{backgroundColor: item.color, borderColor: 'transparent'}} 
      size='tiny' onPress={() => trip} >12:30pm</Button>
        )
      }
      
    />
  )};
  const [visible, setVisible] = React.useState(false);

  return (
    <View>

    <List
      style={styles.container}
      data={data}
      renderItem={renderItem}
 
    />
    </View>
  );
};

 export default BusFetch

const styles = StyleSheet.create({

  cardContainer: {
    width: '100%',
    height: '100%',
    zIndex: -1,
  },

  container: {
    minWidth: '100%',
    height: '30%',
    zIndex: -1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    
});