

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
                loginCode: "M6fa1a9eb-f0f4-c60f-81fe-e2edd12756e2",
                pagesId: ["0-172cac4bb473d44aac4bca34e8930b46!1-5C3350735A2D52EB!77037"],
                refreshRate: 1000*60 //every 1 minute
			}

        },
    ]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }