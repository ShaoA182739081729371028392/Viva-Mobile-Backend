import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from "react-native";
import { StatusBar } from 'expo-status-bar';
import MyColors from "../MyColors";
import BasicCard from "../components/BasicCard";
import { LinearGradient } from 'expo-linear-gradient';
import Pie from 'react-native-pie'
import ProgressBar from 'react-native-progress/Bar';
import { backendURL } from "../util/getUserData";
import * as SecureStore from 'expo-secure-store';

export default function Register({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    let registering = false;

    const runRegister = async () => {
        if (registering) {
            return;
        }
        registering = true;

        if (!username || !password) {
            alert("Error: Please enter a username or password.");
            return;
        }

        const res = await fetch(`${backendURL}/add-person`, {
            method: "POST",
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (res.ok) {
            console.log(JSON.stringify({ username, password }));
            await SecureStore.setItemAsync("user", JSON.stringify({ username, password }));
            navigation.navigate("Home");
        } else {
            alert(`Error: ${data.error}`);
        }
        
        registering = false;
    }

    return (
        <LinearGradient colors={["#fd14920D", "#2414fd0D", "#14fd9c0D"]} style={{ minHeight: "100%" }}>
            <ScrollView style={{ minHeight: "100%" }}>
                <View style={{ marginTop: 200, ...styles.container }}>
                    <Text style={basicStyles.heading1}>Sign Up</Text>
                    <Text style={{ marginBottom: 30 }}>Sign up below to access Viva!</Text>

                    <TextInput style={{ marginBottom: 20, ...basicStyles.input }} placeholder="Your email..." onChangeText={text => setUsername(text)} value={username} />
                    <TextInput style={basicStyles.input} placeholder="Your password..." onChangeText={text => setPassword(text)} value={password} secureTextEntry />

                    <TouchableOpacity style={{ width: "100%", marginTop: 10, marginRight: 20 }} onPress={() => { runRegister() }}>
                        <View style={{ height: 50, backgroundColor: `${MyColors.primary}CC`, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ color: "white", fontSize: 15 }}>Sign Up</Text>
                        </View>
                    </TouchableOpacity>

                    <StatusBar style="auto" animated={true} />
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const basicStyles = StyleSheet.create({
    heading1: {
        fontSize: 30,
        fontWeight: "normal",
        color: MyColors.textPrimary
    },
    heading2: {
        fontSize: 17,
        fontWeight: "bold",
        color: MyColors.textPrimary
    },
    input: {
        padding: 15,
        paddingVertical: 20,
        borderColor: `${MyColors.primary}99`,
        borderWidth: 2,
        borderRadius: 15,
        width: "100%"
    },
});

const styles = StyleSheet.create({
    container: {
        // backgroundColor: MyColors.background,
        padding: 30,
        minHeight: "100%",
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