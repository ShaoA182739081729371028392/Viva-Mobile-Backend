import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import getUserData from "../util/getUserData";
import MyColors from "../MyColors";
import BasicCard from "../components/BasicCard";
import { LinearGradient } from 'expo-linear-gradient';

import GraphWithText from "../components/GraphWithText";

// 1A means 10% transparency: https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4
const allLearnModes = [
    {
        name: "Readit",
        desc: "Practice with sentences from cultural classics.",
        colors: ["#FD14921A", "#F1992B1A"],
        img: require("../assets/xd-assets/book-open.png"),
        pageName: "Readit"
    },
    {
        name: "Flash!",
        desc: "Practice in a flash card format with single words.",
        colors: ["#3EE6891A", "#FD14921A"],
        img: require("../assets/xd-assets/sd-card.png"),
        pageName: ""
    },
    {
        name: "Listen",
        desc: "Practice comprehension and speech all in one.",
        colors: ["#9163DD1A", "#FD14921A"],
        img: require("../assets/xd-assets/headphones.png"),
        pageName: "Listen"
    }
];

export default function Home({ navigation }) {
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
            <LinearGradient colors={["#fd14920D", "#2414fd0D", "#14fd9c0D"]}>
                <ScrollView>

                    <View style={styles.container}>
                        <View style={styles.welcome}>
                            <View>
                                <Text style={basicStyles.heading1}>
                                    Hello {user.username} 👋
                                </Text>

                                <Text style={styles.welcomeSubText}>
                                    Welcome back!
                                </Text>
                            </View>

                            <Image source={{ uri: user.avatar }} style={{ width: 70, height: 70, borderRadius: 25 }} />
                        </View>

                        <View style={styles.main}>
                            <BasicCard>
                                <Text style={basicStyles.heading1}>
                                    Daily Goal
                                </Text>

                                <View style={dailyGoalStyles.content}>
                                    <GraphWithText
                                        title={`${user.dailyGoal.current}/${user.dailyGoal.goal}`}
                                        subText="XP Goal Met"
                                        percentage={user.dailyGoal.current / user.dailyGoal.goal}
                                    />

                                    <View>
                                        <View>
                                            <Text style={dailyGoalStyles.number}>
                                                {user.streak.current}
                                            </Text>

                                            <Text>
                                                Day Streak
                                            </Text>
                                        </View>

                                        <View>
                                            <Text style={dailyGoalStyles.number}>
                                                {user.streak.hoursLeft}
                                            </Text>

                                            <Text>
                                                Hours Left
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </BasicCard>

                            <View style={{ marginTop: 20 }}>
                                <Text style={{
                                    ...basicStyles.heading2,
                                    marginBottom: 10
                                }}>
                                    Learn Modes
                                </Text>

                                {allLearnModes.map(({ name, desc, img, colors, pageName }, idx) => (
                                    <TouchableOpacity style={{ marginBottom: 20 }} key={idx} onPress={() => {
                                        if (pageName) {
                                            navigation.navigate(pageName);
                                        } else {
                                            alert("TODO: Create page for this");
                                        }
                                    }}>
                                        <BasicCard>
                                            <View style={learnModes.content}>
                                                <LinearGradient colors={colors} style={{ marginRight: 10, padding: 15, borderRadius: 10 }}>
                                                    <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center" }}>
                                                        <Image style={{ width: 40, height: 40, resizeMode: "contain" }} source={img} />
                                                    </View>
                                                </LinearGradient>

                                                <View style={learnModes.text}>
                                                    <Text style={learnModes.title}>
                                                        {name}
                                                    </Text>
                                                    <Text style={learnModes.desc} textBreakStrategy="balanced">
                                                        {desc}
                                                    </Text>
                                                </View>
                                            </View>
                                        </BasicCard>
                                    </TouchableOpacity>
                                ))}
                            </View>
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
        padding: 20
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
        width: "90%",
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