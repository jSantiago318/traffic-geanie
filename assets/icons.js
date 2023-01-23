import { Icon } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";

export const HomeIcon = (style) => <Icon {...style} name='home'  />;
export const MenuIcon = (style) => <Icon {...style} name="menu" />;
export const ArrowIosBackIcon = (style) => <Icon {...style} name="arrow-ios-back" />;
export const InfoIcon = (style) => <Icon {...style} name="info" />;
export const LoginIcon = (style) => <Icon {...style} name="log-in" />;
export const VideoIcon = (style) => <Icon {...style} name="video-outline" />;
export const MapIcon = (style) => <Icon {...style} name="map"  />;

const styles = StyleSheet.create({
    container: {
        backgroundColor : 'green',
    }
})