var NodeHelper = require('node_helper');
var request = require('request');

var authorizationToken = null;
var refreshToken = null;
var tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
var redirectUri = "https://google.com";

module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM-OneNote helper started...');
  },

  getOneNoteData: function (config) {
    var self = this;
    var appSecret = config.appSecret;
    var clientId = config.clientId;
    var initialToken = config.initialToken;

    if (authorizationToken == null){
      console.log("No authorization token, trying to grab it");
      console.log("Using refresh token: " + initialToken);
      refreshToken = initialToken;
      /* var loginCode = config.loginCode
      request(
        { url: tokenUrl, 
          method: 'POST',
          form: {
            client_id: clientId,
            scope:'offline_access notes.read.all',
            code: loginCode,
            redirect_uri: 'https://google.com',
            grant_type:'authorization_code',
            client_secret: appSecret
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
      }); */
    }
    if (refreshToken != null){
      //always refresh authorization token!
      console.log("Refreshing token")
      var requestBody = JSON.stringify({
        client_id: clientId,
        scope: 'offline_access notes.read.all',
        refresh_token: refreshToken,
        redirect_uri: redirectUri,
        grant_type: 'refresh_token',
        client_secret: appSecret
      } )
      console.log("Request body: " + requestBody);
      request(
        { url: tokenUrl, 
          method: 'POST',
          headers: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          body: requestBody
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
      // https://graph.microsoft.com/v1.0/me/onenote/pages/0-4ecd42f4f801e90102c9997626a05ef0!1-5C3350735A2D52EB!77037/content

      var pagesUrl = "https://graph.microsoft.com/v1.0/me/onenote/pages/"+ config.pagesId[0] + "/content";

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
              if (currentLine.indexOf("to-do\"") > -1 && currentLine.indexOf("completed" == -1)){
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
