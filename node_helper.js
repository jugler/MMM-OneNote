var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM-OneNote helper started...');
  },

  getOneNoteData: function (config) {
    var self = this;
    var appSecret = config.appSecret;
    var clientId = config.clientId;
    var loginCode = config.loginCode

    console.log("appSecret: " + appSecret);
    console.log("clientId:" + clientId);
    console.log("loginCode:" +  loginCode);
    var results = ["allgood!"]
    self.sendSocketNotification("ONENOTE_DATA", "all good!")
    /*
    var url = "http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/" + stopId + ".json?key=TEST";
    request({ url: url, method: 'GET' }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);
        var arrivalsAndDepartures = result['data']['entry']['arrivalsAndDepartures']
        console.log("Got arrivals and departures data, size count:" + arrivalsAndDepartures.length);
        self.sendSocketNotification('BUSES_INFO', arrivalsAndDepartures);
      }
      else {
        console.log("ERROR while getting the url" + error);
      }
    });
    */
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, payload) {
    if (notification === 'GET_ONENOTE_DATA') {
      this.getOneNoteData(payload);
    }
  }

});
