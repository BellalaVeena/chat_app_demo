const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const url = "mongodb://localhost:27017/chat";

const connect = mongoose.connect(url, { useNewUrlParser: true },

)
module.exports = connect;


// <script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.0.1/mustache.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.6.0/qs.min.js"></script>