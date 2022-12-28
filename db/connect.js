const mongoose = require('mongoose') ;
mongoose.set("strictQuery", false);
module.exports = async (url)=>{
    await mongoose.connect(url).then(()=>console.log("CONNECTED TO DATABASE")) ;
};




