import { Button, Card, Icon, Layout, List, ListItem, Modal, Text } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

import React from 'react';
import getRoute from '../assets/gtfs/route'
import  getTrips from '../assets/gtfs/trips';

const data = getRoute();

export const BusFetch = () => {
  const [selected , SetSelected] = React.useState(null);
  function openModal(selected) {
    setVisible(true);
    SetSelected(selected);
  }

  const renderItemIcon = (props) => (
    <Icon {...props} name='pin'/>
  );
  const [visible, setVisible] = React.useState(false);

  const renderItem = ({ item, index }) => {

    return(
    <ListItem
      onPress={() => openModal(item.description)}
      title={`${item.description}`}
      description={`${item.title}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={
        (props) => (
          <Button style={{backgroundColor: item.color, borderColor: 'transparent'}} 
      size='tiny'  > 12:50pm</Button>
        )
      }
      
    />
  )};

  return (
    <View>
 <Modal
          animationType={"fade"}
          visible={visible}
          transparent={true} >
 
            <View style={styles.modal}>
 
              <Text style={styles.title}> Ticket: {selected}</Text>
 
        <Button style={styles.btn}
      size='tiny' onPressOut={
        () => setVisible(false)
      } > Cancel</Button>
            </View>
 
        </Modal>
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
    modal: {
      width: 300,
      height: 200,
      backgroundColor: '#00BFA5',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 7,
      borderWidth: 1,
      borderColor: 'red'
    },
    
});