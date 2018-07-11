

var config = {
    address: "", 
    port: 8080,
    ipWhitelist: [], 
    language: "en",
    timeFormat: 12,
    displaySeconds: false,
    units: "metric",

    modules: [
        {
            module: "alert",
        },
        {
            module: "updatenotification",
            position: "top_bar"
        },
        {
            module: 'MMM-OneNote',
            position: 'middle_center',
            config: {
                appSecret: "gzeFYRQR74-aurbKN221?~%",
                clientId: "9b1ff838-c5f1-462c-994a-80e1d55d3c10",
                loginCode: "M6ae4f858-cb2a-e771-7802-abe29135e5e5"
			}

        },
    ]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }