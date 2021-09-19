import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, Platform } from "react-native";
import MyColors from "../MyColors";

import { useNavigation, useRoute } from '@react-navigation/native';

const items = [
    {
        name: "Learn",
        img: require("../assets/xd-assets/brain.png"),
        focused: true,
        pageName: "Home",
        routes: [
            "Readit",
            "Movie Lines",
            "Shakespeare"
        ]
    },
    {
        name: "Gym",
        img: require("../assets/xd-assets/gym.png"),
        focused: false,
        pageName: null,
        routes: [
        ]
    },
    {
        name: "Profile",
        img: require("../assets/xd-assets/profile.png"),
        focused: false,
        pageName: "Profile",
        routes: [
            "Profile"
        ]
    }
];

export default function Navbar() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.items}>
                {items.map(({ name, img, focused, pageName }, idx) => (
                    <TouchableOpacity
                        style={{
                            ...styles.item,
                            ...(idx !== items.length - 1 && styles.itemMargin),
                        }}
                        key={idx}
                        onPress={() => {
                            if (pageName) navigation.navigate(pageName);
                        }}
                    >
                        <Image source={img} style={{ width: 20, height: 20, resizeMode: "contain", marginRight: 5, opacity: styles.itemText.opacity }} />
                        <Text style={styles.itemText}>
                            {name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingVertical: 20,
        backgroundColor: "white",
        borderRadius: 50,
        borderTopRightRadius: 50,
        alignItems: "center"
    },
    items: {
        flexDirection: "row",
        alignItems: "center"
    },
    item: {
        flexDirection: "row"
    },
    itemHighlighted: {
        elevation: 5
    },
    itemMargin: {
        marginRight: 40
    },
    itemText: {
        color: MyColors.primary,
        fontSize: Platform.OS === 'ios' ? 18 : 15,
        opacity: 0.7,
    }
})