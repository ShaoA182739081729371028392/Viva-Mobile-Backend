import { useNavigation } from '@react-navigation/core';
import * as SecureStore from 'expo-secure-store';

export const backendURL = "https://viva-backend.herokuapp.com";

export default async function getUserData() {    
    let result = await SecureStore.getItemAsync("user");
    if (!result) {
        return "NOTLOGGEDIN";
    }

    const prefData = JSON.parse(result);

    const res = await fetch(`${backendURL}/get-person`, {
        method: "POST",
        // TODO: Set to acc creds
        body: JSON.stringify({
            username: prefData.username,
            password: prefData.password
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await res.json();

    return {
        name: {
            first: "John",
            last: "Smith"
        },
        username: data.username,
        avatar: "https://reqres.in/img/faces/11-image.jpg",
        age: 24,
        streak: {
            current: 67,
            allTimeHigh: 142,
            hoursLeft: 2.5 // TODO: Make this dynamic
        },
        readitProgress: data.progress,
        location: "Toronto, Canada",
        joinDate: 1626508924,
        dailyGoal: {
            current: 23,
            goal: 30
        },
        // Mon to Sun
        activity: [
            10,
            30,
            20,
            50,
            40,
            45,
            55
        ],
        listen: {
            rounds: 20,
            completed: 8
        }
    }
}