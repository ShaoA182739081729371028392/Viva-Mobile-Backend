import React from "react";
import { StyleSheet, View } from "react-native";

export default function BasicCard({ children }) {
    return (
        <View style={styles.basicCard}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    basicCard: {
        // elevation: 5,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20
    }
})