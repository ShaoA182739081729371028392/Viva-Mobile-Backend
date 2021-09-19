import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Button, Pressable, Modal, TouchableWithoutFeedback } from "react-native";
import { StatusBar } from 'expo-status-bar';
import getUserData, { backendURL } from "../../util/getUserData";
import MyColors from "../../MyColors";
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from 'react-native-progress/Bar';
import GetReaditData from "../../util/GetReaditData";
import { useNavigation } from "@react-navigation/core";
import GraphWithText from "../../components/GraphWithText";
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

const accThreshold = 0.75;

const Card = ({ text, style, behind }) => (
    <View style={{ paddingVertical: 25, width: "90%", backgroundColor: "white", borderRadius: 15, alignItems: "center", justifyContent: "center", ...style }}>
        <Text style={{ fontSize: 20, color: "#383838", opacity: behind ? 0.5 : 1, textAlign: "center" }}>
            {text}
        </Text>
    </View>
);

const defaultResults = {
    accuracy: 0,
    xp: 0,
    show: false
};

export default function Page({ data, name }) {
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    Audio.requestPermissionsAsync().then(() => {
        console.log("ok");
    }).catch(() => {
        console.log(":((");
    });

    const navigation = useNavigation();
    const [results, setResults] = useState({
        accuracy: 0,
        xp: 0,
        show: false
    });

    const [showReplay, setShowReplay] = useState(false);

    const sound = new Audio.Sound();

    const recording = new Audio.Recording();

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

    const currentIdx = (user && data) ? (user.readitProgress % data.lines.length) : 0;

    const currentLine = (user && data) && data.lines[currentIdx];


    const startRecording = async () => {
        try {
            let result = await SecureStore.getItemAsync("user");

            await recording.prepareToRecordAsync({ 
                isMeteringEnabled: true,
                android: {
                  extension: '.amr',
                  outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AMR_WB,
                  audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_WB,
                  sampleRate: 16000,
                  numberOfChannels: 1,
                  bitRate: 128000,
                },
                ios: {
                  extension: '.caf',
                  audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
                  sampleRate: 16000,
                  numberOfChannels: 1,
                  bitRate: 128000,
                  linearPCMBitDepth: 16,
                  linearPCMIsBigEndian: false,
                  linearPCMIsFloat: false,
                },
            });
            await recording.startAsync();

            setTimeout(async () => {
                await recording.stopAndUnloadAsync();

                const newSound = await recording.createNewLoadedSoundAsync();

                const uri = recording.getURI();

                // console.log(newSound.status);
                // newSound.sound.playAsync();

                if (uri) {
                    const audioData = await FileSystem.readAsStringAsync(uri, {
                        encoding: FileSystem.EncodingType.Base64
                    });

                    const res = await fetch(`${backendURL}/stt`, {
                        method: "POST",
                        body: JSON.stringify({
                            data: audioData
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    const apiData = await res.json();

                    console.log(apiData);

                    console.log(currentLine);

                    // Run IOU calculations to get score
                    const wordsWantedSet = new Set(currentLine.toLocaleLowerCase().split(" ").map(word => word.replace(/[^a-zA-Z]/g,"")));
                    const wordGotSet = new Set(apiData.words.map(
                        word => word.toLocaleLowerCase().replace(/[^0-9a-z]/gi, '')
                    ));

                    console.log(wordsWantedSet, wordGotSet);

                    const intersection = new Set([...wordsWantedSet].filter(x => wordGotSet.has(x)));
                    const union = new Set([...wordsWantedSet, ...wordGotSet]);

                    console.log(intersection, union);

                    const finalScore = (intersection.size / union.size) * apiData.confidence;

                    console.log(finalScore);

                    setResults({
                        accuracy: finalScore,
                        xp: finalScore > accThreshold ? 4 : 0,
                        show: true
                    });

                    if (finalScore > accThreshold) {
                        const currentRes = await fetch(`${backendURL}/get-person`, {
                            method: "POST",
                            headers: {
                                "content-type": "application/json"
                            },
                            body: JSON.stringify({
                                username: JSON.parse(result).username,
                                password: JSON.parse(result).password
                            })
                        });

                        const currentProgress = (await currentRes.json()).progress;

                        console.log(currentProgress);

                        await fetch(`${backendURL}/set-progress`, {
                            method: "POST",
                            headers: {
                                "content-type": "application/json"
                            },
                            body: JSON.stringify({
                                username: JSON.parse(result).username,
                                progress: currentProgress + 1
                            })
                        })
                    }
                }
            }, 5000);
        } catch (e) {
            recording.stopAndUnloadAsync();
            console.log(e);
        }
    }

    const playTTS = async text => {
        await sound.loadAsync({
            uri: `${backendURL}/tts/${text}/audio.mp3`
        });
        const status = await sound.playAsync();

        console.log(status);

        setTimeout(async () => {
            await sound.unloadAsync();
        }, 3000);

    };

    if (data && user) {
        return (
            <LinearGradient colors={["#fd14920D", "#2414fd0D", "#14fd9c0D"]} style={{ minHeight: "100%" }}>
                <ScrollView>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={showReplay}
                        onRequestClose={() => {
                            setShowReplay(false);
                        }}
                    >
                        <View style={{ width: "100%", height: "100%", backgroundColor: "#000000CC", padding: 20 }}>
                            <Pressable onPress={() => setShowReplay(false)}>
                                <Image source={require("../../assets/cross.png")} style={{ width: 40, height: 40, resizeMode: "contain", marginTop: 20, tintColor: "white" }} />
                            </Pressable>

                            <View style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", top: -60 }}>
                                <Text style={{ color: "white", bottom: 0 }}>
                                    Tap on the orb to replay!
                                </Text>

                                <TouchableOpacity style={{ elevation: 2, top: -15 }} onPress={() => playTTS(currentLine)} activeOpacity={0.6}>
                                    <Image source={require("../../assets/xd-assets/wavey.png")} style={{ width: 125, height: 125, resizeMode: "contain", top: 50 }} />
                                </TouchableOpacity>

                                <Text style={{ width: "60%", textAlign: "center", fontSize: 40, color: "white", marginTop: 70 }}>
                                    "{currentLine}"
                                </Text>
                            </View>
                        </View>
                    </Modal>

                    <View style={styles.container}>
                        <View style={{ alignItems: "center", ...styles.main }}>
                            <ProgressBar progress={(currentIdx) / data.progress.total} width={300} height={24} borderRadius={16} borderWidth={0} color="#808080" style={{ backgroundColor: "#dbdbdb" }} />
                        </View>

                        <View style={{ alignItems: "center" }}>
                            <Text style={{ color: "#a8a8a8", marginTop: 15, marginBottom: 5 }}>
                                Listen
                            </Text>

                            <Text style={{ fontSize: 30 }}>
                                Round <Text style={{ color: MyColors.primary }}>{currentIdx + 1}</Text>
                            </Text>
                        </View>

                        <View style={{ marginTop: results.show ? 30 : 80, width: "100%", alignItems: "center" }}>
                            {!results.show &&
                                <>
                                    <Card
                                        text={data.lines[2]}
                                        style={{ position: "absolute", top: -60, opacity: 0.5, elevation: 3, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, backgroundColor: "#e0e0e0" }}
                                        behind
                                    />
                                    <Card text={data.lines[1]} style={{ position: "absolute", top: -35, elevation: 6, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, backgroundColor: "#ededed" }} behind />
                                </>
                            }

                            <Card text={currentLine} style={{ elevation: results.show ? -1 : 9, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5 }} />

                            {results.show &&
                                <TouchableOpacity style={{ elevation: 1 }} onPress={() => setShowReplay(true)}>
                                    <Image source={require("../../assets/xd-assets/wavey.png")} style={{ width: 125, height: 125, resizeMode: "contain", top: -25 }} />
                                </TouchableOpacity>
                            }
                        </View>

                        <View style={{ marginTop: 150, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => {
                                setTimeout(() => {
                                    startRecording();
                                    
                                }, 1000);
                            }}>
                                <Image source={require("../../assets/xd-assets/wavey.png")} style={{ width: 125, height: 125, resizeMode: "contain" }} />
                            </TouchableOpacity>

                            <View style={{ marginTop: 30, flexDirection: "row", alignItems: "center" }}>
                                <Image source={require("../../assets/xd-assets/microphone.png")} style={{ width: 15, height: 15, resizeMode: "contain", tintColor: "gray", marginRight: 5 }} />
                                <Text style={{ color: "gray" }}>
                                    Tap on the orb to speak!
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {results.show &&
                    <View style={{ position: "absolute", bottom: 0, backgroundColor: "white", width: "100%", height: 350, borderTopLeftRadius: 40, borderTopRightRadius: 40, alignItems: "center", padding: 16, elevation: 10 }}>
                        <Text style={{ marginTop: 10, ...basicStyles.heading1 }}>
                            {results.accuracy > accThreshold ? "Well Done! 🎉" : "Nice Try! 🤠"}
                        </Text>

                        <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", marginTop: 10, alignSelf: "baseline", marginLeft: 20 }}>
                            <View style={{ width: "50%" }}>
                                <Text style={{ ...basicStyles.heading1, fontSize: 25 }}>Viva</Text>
                                <Text style={{ ...basicStyles.heading1, fontSize: 25 }}>Score</Text>
                                <Text style={{ ...styles.welcomeSubText, fontSize: 14 }}>+{results.xp} XP</Text>
                            </View>

                            <View style={{ marginRight: 20 }}>
                                <GraphWithText title={`${Math.round(results.accuracy * 100)}%`} subText="Accuracy" percentage={results.accuracy} />
                            </View>
                        </View>

                        <View style={{ width: "100%", marginTop: 10 }}>
                            {results.accuracy <= accThreshold &&
                                <>
                                    <Text style={{ textAlign: "center" }}>
                                        To pass the round you need to reach over {accThreshold * 100}% accuracy.
                                    </Text>
                                    <Text style={{ textAlign: "center", marginTop: 3 }}>
                                        Listen to the correct audio and try again!
                                    </Text>
                                </>
                            }

                            {results.accuracy > accThreshold &&
                                <TouchableOpacity onPress={() => { navigation.push(name) }} style={{ marginTop: 10 }}>
                                    <View style={{ height: 50, backgroundColor: `${MyColors.primary}CC`, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                        <Text style={{ color: "white", fontSize: 15 }}>Continue</Text>
                                    </View>
                                </TouchableOpacity>
                            }

                            <TouchableOpacity onPress={() => { setResults(defaultResults) }} style={{ marginTop: 10 }}>
                                <View style={{ height: 50, backgroundColor: "white", borderColor: MyColors.primary, borderWidth: 2, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ color: MyColors.primary, fontSize: 15 }}>Try Again</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
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
        minHeight: "100%",
        width: "100%"
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