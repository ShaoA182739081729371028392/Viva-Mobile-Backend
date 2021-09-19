const data = {
    movieLines: {
        lines: [
            "And, I am Iron Man.",
            "There’s no place like home.",
            "Do, or do not. There is no try.",
            "Hope is not a strategy.",
            "We are Groot.",
            "It's alive! It's alive!",
            "Bond. James Bond.",
            "Show me the money!",
            "Here's Johnny!",
            "Keep your friends close, but your enemies closer."
        ],
        progress: {
            completed: 1,
            total: 10
        }
    },
    shakespeare: {
        lines: [
            "To be, or not to be: that is the question",
            "Parting is such sweet sorrow, That I shall say good night till it be morrow",
            "What's in a name? That which we call a rose"
        ],
        progress: {
            completed: 1,
            total: 2
        }
    }
}

export default function GetReaditData(id) {
    return data[id];
}