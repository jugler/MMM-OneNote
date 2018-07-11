"use strict";

Module.register("MMM-OneBusAway", {
    result: [],
    // Default module config.
    defaults: {
        stopId: "1_2672",
        maxResults: 5,
        fadeSpeed: 1000 * 60, // update every minute
        buses: []
    },

    // Override dom generator.
    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = "oneBusAway";
        if (this.hasLoaded == false) {   //No data has arrived
            var loadingMessage = document.createElement("span");
            loadingMessage.innerHTML = "Checking Bus status...";
            wrapper.appendChild(loadingMessage);
        } else if (this.result.length == 0) { //No buses right now
            var noBuses = document.createElement("span");
            noBuses.innerHTML = "No bus departures soon.";
            wrapper.appendChild(noBuses);
        } else { //extract times of arrival for the buses
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
        return ["MMM-OneBusAway.css"];
    },

    start: function () {
        this.hasLoaded = false;

        this.getBusesInfo();
        var self = this;
        setInterval(function () {
            self.getBusesInfo(); 
        }, self.config.fadeSpeed);

    },

    getBusesInfo: function () {
        this.sendSocketNotification('GET_BUSES_INFO', this.config.stopId);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "BUSES_INFO") {
            this.hasLoaded = true;
            this.result = payload;
            this.updateDom();
        }
    },
});
