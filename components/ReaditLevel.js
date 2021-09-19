import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from "react-native";
import { StatusBar } from 'expo-status-bar';
import getUserData from "../util/getUserData";
import MyColors from "../MyColors";
import BasicCard from "../components/BasicCard";
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from 'react-native-progress/Bar';
import { useNavigation } from "@react-navigation/core";

export default function ReaditLevelCard({ name, desc, img, pageName, progress, liked }) {
    const navigation = useNavigation();
    const [likedState, setLikedState] = useState(liked);

    return (
        <TouchableOpacity key={pageName} style={styles.levelCard} onPress={() => {navigation.navigate(pageName)}}>
            <Image style={{ width: "100%", height: 150, resizeMode: "cover", borderTopLeftRadius: 20, borderTopRightRadius: 20 }} source={img} />

            <View style={{ marginTop: 5, padding: 15 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ width: "75%" }}>
                        <Text style={basicStyles.heading1}>{name}</Text>

                        <Text style={{ fontSize: 12, marginTop: 3, color: MyColors.textSecondary }}>{desc}</Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <TouchableOpacity
                            style={{ backgroundColor: likedState ? "#FF4A7940" : null, padding: 5, borderRadius: 10 }}
                            onPress={() => {
                                setLikedState(!likedState);
                            }}
                        >
                            {!likedState &&
                                <Image style={{ width: 15, height: 15, resizeMode: "contain", tintColor: "#8a8a8a" }} source={require("../assets/xd-assets/heart-regular.png")} />
                            }

                            {likedState &&
                                <Image style={{ width: 15, height: 15, resizeMode: "contain", tintColor: "#FF4A79" }} source={require("../assets/xd-assets/heart-solid.png")} />
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "center", marginTop: 10 }}>
                    <ProgressBar progress={progress / 100} width={200} height={12} borderRadius={8} color="#a1a1a1" />
                    <Text style={{ marginLeft: 10, color: "#8a8a8a" }}>{progress}%</Text>
                </View>
            </View>

        </TouchableOpacity>
    );
}

const basicStyles = StyleSheet.create({
    heading1: {
        fontSize: 17,
        fontWeight: "bold",
        color: MyColors.textPrimarySoft
    },
    heading2: {
        fontSize: 17,
        fontWeight: "bold",
        color: MyColors.textPrimary
    },
    input: {
        padding: 10,
        backgroundColor: "white",
        elevation: 4,
        borderRadius: 15,
        width: "85%"
    },
});

const styles = StyleSheet.create({
    fullHeight: {
        flex: 1
    },
    container: {
        flex: 1,
        // backgroundColor: MyColors.background,
        alignItems: 'center',
        padding: 20,
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
        marginTop: 20,
        padding: 15,
        width: "100%"
    },
    searchBox: {
        ...basicStyles.input,
        paddingHorizontal: 30
    },
    levelCard: {
        borderRadius: 20,
        flex: 1,
        flexDirection: "column",
        backgroundColor: "white",
        marginBottom: 30
    }
});