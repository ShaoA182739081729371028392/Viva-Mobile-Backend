import React, { useState, useEffect } from "react";
import Page from "./Page";
import GetReaditData from "../../util/GetReaditData";

export default function Shakespeare() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Load in user data
        setData(GetReaditData("shakespeare"));
    }, []);

    return <Page data={data} name="Shakespeare" />
}