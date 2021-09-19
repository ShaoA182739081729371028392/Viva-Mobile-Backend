import React, { useState, useEffect } from "react";
import Page from "./Page";
import GetReaditData from "../../util/GetReaditData";

export default function MovieLines() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Load in user data
        setData(GetReaditData("movieLines"));
    }, []);

    return <Page data={data} name="Movie Lines" />
}