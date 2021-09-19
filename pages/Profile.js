import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, Button } from "react-native";
import { StatusBar } from 'expo-status-bar';
import getUserData from "../util/getUserData";
import MyColors from "../MyColors";
import { LinearGradient } from 'expo-linear-gradient';
import dayjs from "dayjs";
import { LineChart } from "react-native-chart-kit";
import * as SecureStore from 'expo-secure-store';

const screenWidth = Dimensions.get("window").width;

const allLevels = [
    {
        name: "Shakespeare",
        desc: "Practice speech with quotes from Shakespeare's most iconic plays.",
        img: require("../assets/shakespeare.jpg"),
        pageName: "shakespeare",
        progress: 24, // Percentage
        liked: false
    },
    {
        name: "Movie Lines",
        desc: "Practice speech with iconic lines in movies from 1990 - Present.",
        img: require("../assets/ironman.jpg"),
        pageName: "movie-lines",
        progress: 97, // Percentage
        liked: true
    },
];

const Statistic = ({ top, bottom }) => (
    <View style={{ marginRight: 10 }}>
        <View>

        </View>

        <View style={{}}>
            <Text style={basicStyles.heading1}>
                {top}
            </Text>

            <Text style={{ marginTop: 5 }}>
                {bottom}
            </Text>
        </View>
    </View>
);

const Badge = ({ img, name }) => (
    <View style={{ width: 110, margin: 5 }}>
        <View style={{ borderColor: "gray", borderWidth: 5, borderRadius: 100, width: 110, height: 110, alignItems: "center", justifyContent: "center" }}>
            <Image source={img} style={{ width: 100, height: 100, borderRadius: 100 }} />
        </View>

        <Text style={{ alignSelf: "center", marginTop: 5 }}>{name}</Text>
    </View>
);

const chartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(253, 20, 146, ${opacity})`,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => MyColors.textSecondary,
    style: {
        borderRadius: 16
    },
    propsForDots: {
        r: "0",
    }
};

export default function Profile({ navigation }) {
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
    
    const data = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Sat", "Sun"],
        datasets: [
            {
                data: user && user.activity,
                strokeWidth: 2 // optional
            }
        ],
    };

    if (user) {
        return (
            <LinearGradient colors={["#fd14920D", "#2414fd0D", "#14fd9c0D"]} style={styles.fullHeight}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <Button title="sus" onPress={async () => { 
                            await SecureStore.setItemAsync("user", "");
                            navigation.navigate("Onboarding");
                        }} />
                        <View style={{ width: 125, height: 125, borderRadius: 100, borderWidth: 3, borderColor: MyColors.primary, justifyContent: "center", alignItems: "center" }}>
                            <Image source={{ uri: user.avatar }} style={{ width: 100, height: 100, borderRadius: 100, }} />
                        </View>

                        <View style={{ marginTop: 5, alignItems: "center" }}>
                            <Text style={basicStyles.title}>
                                {user.username}
                            </Text>

                            <View>
                                <View style={{ flexDirection: "row" }}>
                                    <Image source={require("../assets/location.png")} style={{ width: 25, height: 25, marginRight: 4 }} />
                                    <Text>
                                        {user.location}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: "row" }}>
                                    <Image source={require("../assets/schedule.png")} style={{ width: 25, height: 25, marginRight: 4 }} />
                                    <Text style={basicStyles.subText}>
                                        Joined {dayjs(user.joinDate * 1000).format("MMMM YYYY")}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
                                <Statistic top="Verified" bottom="Viva User" />
                                <Statistic top={`${user.streak.current} Days`} bottom="Streak" />
                                <Statistic top={`${user.age} Yrs`} bottom="Age" />
                            </View>
                        </View>
                        <StatusBar style="auto" animated={true} />
                    </View>

                    <View style={{ marginTop: 10, backgroundColor: "white", height: "100%", flexGrow: 1, width: "100%", borderTopRightRadius: 50, borderTopLeftRadius: 50, padding: 40 }}>
                        <Text style={{ ...basicStyles.subtitle, marginBottom: 10 }}>My Activity</Text>

                        <View style={{ marginTop: 5, alignSelf: "center" }}>
                            <LineChart
                                data={data}
                                width={350}
                                height={220}
                                chartConfig={chartConfig}
                                withInnerLines={false}
                                bezier
                            />
                        </View>

                        <View style={{ marginTop: 5 }}>
                            <Text style={basicStyles.heading1}>Badges</Text>

                            <View style={{ flexDirection: "row", marginTop: 5 }}>
                                <Badge name="Did a thing" img={require("../assets/stars.jpg")} />
                            </View>
                        </View>
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
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: MyColors.textPrimary
    },
    subtitle: {
        fontSize: 21,
        fontWeight: "bold",
        color: MyColors.textPrimarySoft
    },
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
    subText: {
        color: MyColors.textSecondary
    }
});

const styles = StyleSheet.create({
    fullHeight: {
        flex: 1,
        minHeight: "100%",
        flexShrink: 1
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