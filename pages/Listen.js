import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import getUserData from "../util/getUserData";
import MyColors from "../MyColors";
import BasicCard from "../components/BasicCard";
import { LinearGradient } from 'expo-linear-gradient';
import Pie from 'react-native-pie'
import ProgressBar from 'react-native-progress/Bar';

// 1A means 10% transparency: https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4
const allLearnModes = [
    {
        name: "Readit",
        desc: "Practice with sentences from cultural classics.",
        colors: ["#FD14921A", "#F1992B1A"],
        img: require("../assets/xd-assets/book-open.png"),
        pageName: "readit"
    },
    {
        name: "Flash!",
        desc: "Practice in a flash card format with single words.",
        colors: ["#3EE6891A", "#FD14921A"],
        img: require("../assets/xd-assets/sd-card.png"),
        pageName: "flash"
    },
    {
        name: "Listen",
        desc: "Practice comprehension and speech all in one.",
        colors: ["#9163DD1A", "#FD14921A"],
        img: require("../assets/xd-assets/headphones.png"),
        pageName: "listen"
    }
];

export default function Listen({ navigation }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            // Load in user data
            const data = await getUserData();
            if (data === "NOTLOGGEDIN") {
                navigation.navigate("Onboarding");
            } else {
                setUser(data);
            }
        })();
    }, []);

    if (user) {
        return (
            <LinearGradient colors={["#fd14920D", "#2414fd0D", "#14fd9c0D"]} style={{ minHeight: "100%" }}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={{ alignItems: "center", ...styles.main }}>
                            <ProgressBar progress={user.listen.completed / user.listen.rounds} width={300} height={24} borderRadius={16} borderWidth={0} color="#808080" style={{ backgroundColor: "#dbdbdb" }} />
                        </View>

                        <View style={{ alignItems: "center" }}>
                            <Text style={{ color: "#a8a8a8", marginTop: 15, marginBottom: 5 }}>
                                Listen
                            </Text>

                            <Text style={{ fontSize: 30 }}>
                                Round <Text style={{ color: MyColors.primary }}>{user.listen.completed}</Text>
                            </Text>
                        </View>

                        <View>
                            <View style={{ marginTop: 10, backgroundColor: "#4F38F359", padding: 15, width: "90%", borderRadius: 20, flexDirection: "row", alignItems: "center" }}>
                                <Image source={require("../assets/speaker.png")} style={{ width: 40, height: 40, resizeMode: "contain", tintColor: "#4F38F3", marginRight: 20 }} />

                                <ProgressBar progress={user.listen.completed / user.listen.rounds} width={225} height={24} borderRadius={16} borderWidth={0} color="#4F38F3" style={{ backgroundColor: "#ffffff" }} />
                            </View>

                            <View style={{ flexDirection: "row", marginTop: 5, justifyContent: "space-between", color: MyColors.textPrimarySoft }}>
                                <Text style={{ color: MyColors.textSecondary }}>0:08</Text>
                                <Text style={{ color: MyColors.textSecondary }}>0:23</Text>
                            </View>
                        </View>

                        <View style={{ marginTop: 10 }}>

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