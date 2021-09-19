import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import getUserData from "../util/getUserData";
import MyColors from "../MyColors";
import BasicCard from "../components/BasicCard";
import { LinearGradient } from 'expo-linear-gradient';
import Pie from 'react-native-pie'
import ProgressBar from 'react-native-progress/Bar';
import * as SecureStore from 'expo-secure-store';

export default function Onboarding({ navigation }) {
    SecureStore.getItemAsync("user").then((result) => {
        if (result) {
            navigation.navigate("Home");
        }
    });

    if (true) {
        return (
            <LinearGradient colors={["#fd14920D", "#2414fd0D", "#14fd9c0D"]} style={{ minHeight: "100%" }}>
                <ScrollView>
                    <View style={styles.container}>
                        <Image source={require("../assets/xd-assets/landing.png")} style={{ width: "100%", height: 250, resizeMode: "contain", marginTop: 150 }} />
                        <Text style={basicStyles.heading1}>Lorem Ipsum 1</Text>
                        <Text style={{ textAlign: "center", color: MyColors.textPrimarySoft }}>On the contrary, a empirical action of an assessment of the crucial component can partly be used for The Organization</Text>
                        
                        <View style={{ flexDirection: "row", alignSelf: "center" }}>
                            <TouchableOpacity style={{ width: "40%", marginTop: 10, marginRight: 20 }} onPress={() => {navigation.navigate("Register")}}>
                                <View style={{ height: 50, backgroundColor: `${MyColors.primary}CC`, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ color: "white", fontSize: 15 }}>Sign Up</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ width: "40%", marginTop: 10 }} onPress={() => {navigation.navigate("Login")}}>
                                <View style={{ height: 50, borderColor: MyColors.primary, borderWidth: 2, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ color: MyColors.primary, fontSize: 15 }}>Sign In</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <StatusBar style="auto" animated={true} />
                    </View>
                </ScrollView>
            </LinearGradient>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text>
                    Loading...
                </Text>
            </View>
        );
    }
}

const basicStyles = StyleSheet.create({
    heading1: {
        fontSize: 20,
        fontWeight: "bold",
        color: MyColors.textPrimary
    },
    heading2: {
        fontSize: 17,
        fontWeight: "bold",
        color: MyColors.textPrimary
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: MyColors.background,
        alignItems: 'center',
        padding: 20,
        minHeight: "100%"
    },
    welcome: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    welcomeSubText: {
        fontSize: 15,
        fontWeight: "bold",
        color: MyColors.textSecondary
    },
    main: {
        marginTop: 10,
        padding: 15,
        width: "100%"
    }
});

const dailyGoalStyles = StyleSheet.create({
    content: {
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        width: "75%",
        justifyContent: "space-between"
    },
    number: {
        fontSize: 35,
        fontWeight: "bold",
        color: MyColors.primary
    },
    gauge: {

    },
    stats: {

    }
});

const learnModes = StyleSheet.create({
    content: {
        padding: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    text: {
        flexDirection: "column"
    },
    title: {
        fontSize: 25,
        color: MyColors.textPrimarySoft,
    },
    desc: {
        fontSize: 15,
        color: MyColors.textSecondary,
        width: "60%",
    }
})