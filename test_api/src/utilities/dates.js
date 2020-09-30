/**
 * For MongoDB Atlas Cloud.
 */

const DateUtils = {}

DateUtils.getLocalDate = (localDate) => {
    if(localDate.getTimezoneOffset() === 0){
        return localDate;
    }

    localDate.setHours(localDate.getHours() - localDate.getTimezoneOffset()/60)
    return localDate;
}

module.exports = DateUtils