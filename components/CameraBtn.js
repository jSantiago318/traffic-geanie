import {Button, Divider, Icon, Layout, StyleService, Text} from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { CameraIcon } from '../assets/icons';
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
