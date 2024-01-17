const moment = require('jalali-moment');
const jalai = require('jalali-moment');

exports.formatDate = date => {
    return  moment(date).format("D MMM YYYY")
}