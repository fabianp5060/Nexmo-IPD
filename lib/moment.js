const momentJs = require('moment')
const logger = require('../lib/logger').getLogger('moment');

const checkESTTime = () => {
     logger.info('Moment::checkESTTime::momentJs().format()', momentJs().tz('America/New_York').format())
     logger.info('Moment::checkESTTime::momentJs().format() HH', momentJs().tz('America/New_York').format("HH"))
     logger.info('Moment::checkESTTime::momentJs().format() e', momentJs().tz('America/New_York').format("e"))
     day = momentJs().tz('America/New_York').format("e");
     hours = momentJs().tz('America/New_York').format("HH");
     if (day == 6) {
          logger.info('Moment::checkESTTime:: day Equal to 6 : ', (hours >= 9 && hours < 18));
          return (hours >= 9 && hours < 18);
     } else if (day >= 1 && day < 6) {
          logger.info('Moment::checkESTTime:: day Equal or less than 6 : ', (hours >= 9 && hours < 21));
          return (hours >= 9 && hours < 21);
     }
     //IST time vice checking
     // if (day == 6) {
     //      logger.info('Moment::checkESTTime:: day Equal to 6 : ', (hours >= 1 && hours < 18));
     //      return (hours >= 9 && hours < 18);
     // } else if (day >= 1 && day < 6) {
     //      logger.info('Moment::checkESTTime:: day Equal or less than 6 : ', (hours >= 1 && hours < 21));
     //      return (hours >= 1 && hours < 21);
     // }

}

module.exports = {
     checkESTTime
}