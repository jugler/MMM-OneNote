"use strict";

Module.register("MMM-OneBusAway", {
    result: [],
    // Default module config.
    defaults: {
        appSecret: "",
        clientId: "",
        loginCode: "",
        fadeSpeed: 5000
    },

    // Override dom generator.
    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = "oneNote";
        if (this.hasLoaded == false) {   //No data has arrived
            var loadingMessage = document.createElement("span");
            loadingMessage.innerHTML = "Loading OneNote data...";
            wrapper.appendChild(loadingMessage);
        } else if (this.result.length == 0) { //No OneNote data...
            var noBuses = document.createElement("span");
            noBuses.innerHTML = "No OneNote data...";
            wrapper.appendChild(noBuses);
        } else { 
            /*
            var validResults = 0;
            for (var departureIndex = 0; departureIndex < this.result.length && validResults < this.config.maxResults; departureIndex++) {
                var departureDetails = this.result[departureIndex]
                if (this.config.buses.indexOf(departureDetails['routeId']) != -1){
                    var busShortName = departureDetails['routeShortName'];
                    var busDepartureTimeStamp = departureDetails['scheduledArrivalTime'];
                    var busEntry = this.getBusEntry(busShortName, busDepartureTimeStamp);
                    wrapper.appendChild(busEntry);
                    validResults++;
                }
            }
            */
        }
        return wrapper;
    },

    getBusEntry: function (route, arrival) {
        var busIcon = document.createElement("img");
        busIcon.className = "badge";
        busIcon.src = "modules/MMM-OneBusAway/oba_logo.png";
        busIcon.style.height = "25px";
        busIcon.style.width = "25px";
        var nextStop = document.createElement("div");
        var nextStopText = document.createElement("span");
        var busDepartureDate = new Date(arrival);
        var dateNow = new Date();
        var departingInMinutes = (busDepartureDate - dateNow) / 60000; //difference in minutes
        if (departingInMinutes > 0) {
            departingInMinutes = departingInMinutes.toFixed(0);
            var departureMessage = "  <b>" + route + "</b> in " + departingInMinutes + " mins";
            nextStopText.innerHTML = departureMessage;
            nextStop.appendChild(busIcon);
            nextStop.appendChild(nextStopText);
        }
        return nextStop;
    },

    getStyles: function () {
        return ["MMM-OneNote.css"];
    },

    start: function () {
        this.hasLoaded = false;

        this.getOneNoteData();
        var self = this;
        setInterval(function () {
            self.getOneNoteData(); 
        }, self.config.fadeSpeed);

    },

    getOneNoteData: function () {
        this.sendSocketNotification('GET_ONENOTE_DATA', this.config);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "ONENOTE_DATA") {
            this.hasLoaded = true;
            this.result = payload;
            this.updateDom();
        }
    },
});
