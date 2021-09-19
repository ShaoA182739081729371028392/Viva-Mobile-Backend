import React from "react";
import { ProgressChart } from "react-native-chart-kit";
import { View, Text } from "react-native";

const chartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(253, 20, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};

export default function GraphWithText({ title, subText, percentage }) {
    return (
        <View style={{ alignItems: "center" }}>
            <ProgressChart
                data={{ data: [percentage] }}
                width={150}
                height={150}
                radius={64}
                chartConfig={chartConfig}
                hideLegend={true}
                style={{}}
            />

            <Text style={{ position: "absolute", top: 55, fontSize: 20, fontWeight: "bold" }}>{title}</Text>
            <Text style={{ position: "absolute", top: 85, fontSize: 11, color: "gray" }}>{subText}</Text>
        </View>
    );
}