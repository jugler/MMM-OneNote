var NodeHelper = require('node_helper');
var request = require('request');

var authorizationToken = null;
var refreshToken = null;
var tokenUrl = "https://login.live.com/oauth20_token.srf";
var redirectUri = "https://login.live.com/oauth20_desktop.srf";

module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM-OneNote helper started...');
  },

  getOneNoteData: function (config) {
    var self = this;
    var appSecret = config.appSecret;
    var clientId = config.clientId;

    if (authorizationToken == null){
      console.log("No authorization token, trying to grab it")
      var loginCode = config.loginCode
      request(
        { url: tokenUrl, 
          method: 'POST',
          form: {
            grant_type:'authorization_code',
            client_id: clientId,
            code: loginCode,
            redirect_uri: redirectUri
          } 
        }, 
        function (error, response, body) {
          if (!error && response.statusCode == 200){
            var result = JSON.parse(body);
            authorizationToken = result['access_token'];
            refreshToken = result["refresh_token"];
            console.log ("Got authorization token");
          }else {
            console.log("ERROR while getting the authorization token: " + error +  response + body);
          }
      });
    }
    if (refreshToken != null){
      //always refresh authorization token!
      request(
        { url: tokenUrl, 
          method: 'POST',
          form: {
            grant_type:'refresh_token',
            client_id: clientId,
            refresh_token: refreshToken,
            redirect_uri: redirectUri
          } 
        }, 
        function (error, response, body) {
          if (!error && response.statusCode == 200){
            var result = JSON.parse(body);
            authorizationToken = result['access_token'];
            refreshToken = result["refresh_token"];
            console.log ("Got refresh token");
            console.log ("Got authorization token");
          }else {
            console.log("ERROR while refreshing the authorization token: " + error +  response + body);
          }
      });
      
      // at this point we should have a valid authToken that is valid (since we are refreshing it!)
      var pagesUrl = "https://www.onenote.com/api/v1.0/me/notes/pages/"+ config.pagesId[0] + "/content";

      request(
        { url: pagesUrl, 
          method: 'GET',
          auth: {
              'bearer': authorizationToken
            }
        }, 
        function (error, response, body) {
          if (!error && response.statusCode == 200){
            var todoList = []
            var index = 0;
            var lines = body.split(/\r?\n/);
            for (var lineIndex=0; lineIndex<lines.length; lineIndex++){
              var currentLine = lines[lineIndex];
              if (currentLine.indexOf("title") > -1 || currentLine.indexOf("to-do\"") > -1){
                //remove HTML tags
                var rePattern = new RegExp(/(?:<.*>)(.*)(?:<\/.*>)/);
                var arrMatches = currentLine.match(rePattern);
                todoList[index++] = arrMatches[1];
              }
            }
            self.sendSocketNotification("ONENOTE_DATA", todoList)
          }else {
            console.log("ERROR while getting the page data: " + error +  response + body);
          }
      });

    }
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, payload) {
    if (notification === 'GET_ONENOTE_DATA') {
      this.getOneNoteData(payload);
    }
  }

});
