import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from "react-native";
import { StatusBar } from 'expo-status-bar';
import getUserData from "../../util/getUserData";
import MyColors from "../../MyColors";
import BasicCard from "../../components/BasicCard";
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from 'react-native-progress/Bar';
import ReaditLevelCard from "../../components/ReaditLevel";

const allLevels = [
    {
        name: "Shakespeare",
        desc: "Practice speech with quotes from Shakespeare's most iconic plays.",
        img: require("../../assets/shakespeare.jpg"),
        pageName: "Shakespeare",
        progress: 24, // Percentage
        liked: false
    },
    {
        name: "Movie Lines",
        desc: "Practice speech with iconic lines in movies from 1990 - Present.",
        img: require("../../assets/ironman.jpg"),
        pageName: "Movie Lines",
        progress: 97, // Percentage
        liked: true
    },
];

export default function Home({ navigation }) {
    const [user, setUser] = useState(null);
    const [search, setSearch] = useState("");

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
            <LinearGradient colors={["#fd14920D", "#2414fd0D", "#14fd9c0D"]} style={styles.fullHeight}>
                <ScrollView>
                    <View style={styles.container}>
                        <TextInput style={styles.searchBox} placeholder="Search levels..." onChangeText={text => setSearch(text)} />

                        <View style={styles.main}>
                            {allLevels.filter(({ name }) => name.toLocaleLowerCase().includes(search.toLocaleLowerCase())).map((data) => (
                                <ReaditLevelCard {...data} key={data.pageName} navigation={navigation} />
                            ))}
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