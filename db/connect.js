const mongoose = require('mongoose') ;

module.exports = async (url)=>{
    await mongoose.connect(url).then(()=>console.log("CONNECTED TO DATABASE")) ;
};




