import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { CameraIcon } from '../assets/icons';
import { Text } from 'native-base';
import { useState } from 'react';

function CameraBtn() {

 
    return (
        <Text style={style.title}>Camera</Text>
    )
}


export default CameraBtn

const style = StyleSheet.create({
    title: { 
        marginVertical: 4,
        fontSize: 24,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: 10,
        backgroundColor: '#00BFA5',
        borderColor: 'transparent',
        
    },
});
