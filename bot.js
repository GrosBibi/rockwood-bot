require('dotenv').config();
var Botkit = require('botkit');
var redis = require('botkit/lib/storage/redis_storage');
var http = require('http');
var url = require('url');
var moment = require('moment');

moment.locale('rockwood', {
    months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
    monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
    weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
    weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
    weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        LTS : "HH:mm:ss",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[Aujourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "Il est rockwood -%s !",
        past : "Le rockwood est déjà ouvert depuis %s, qu'est-ce que tu fais encore là ?!",
        s : "quelques secondes",
        m : "1 minute",
        mm : "%d minutes",
        h : "1 heure",
        hh : "%d heures",
        d : "1 jour",
        dd : "%d jours",
        M : "1 mois",
        MM : "%d mois",
        y : "1 année",
        yy : "%d années"
    },
    ordinalParse : /\d{1,2}(er|ème)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'ème');
    },
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === 'M';
    },
    // in case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example)
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});


/*var redisURL = url.parse(process.env.REDISCLOUD_URL);
var redisStorage = redis({
    namespace: 'rockwood-bot',
    host: redisURL.hostname,
    port: redisURL.port,
    auth_pass: redisURL.auth.split(":")[1]
});
*/
var controller = Botkit.slackbot(
/*{
    storage: redisStorage
}*/);

var bot = controller.spawn({
    token: process.env.SLACK_TOKEN
}).startRTM();

controller.hears(['rockwood'],'direct_message,direct_mention,mention,ambient',function(bot, message) {
  bot.api.users.info({user:message.user},function(err,response) {
    if(response.user.name != "slackbot"){
      var now = moment(new Date());
      var rockwoodOpen = moment(new Date()).hour(17).minute(00).second(0);
      bot.reply(message,now.to(rockwoodOpen));    
    }
  })
});

http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Ok, dyno is awake.');
}).listen(process.env.PORT || 5000);
