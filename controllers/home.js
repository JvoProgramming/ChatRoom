// Controller handler to handle functionality in home page

const Rooms = require("../models/Rooms");

// Example for handle a get request at '/' endpoint.

function getHome(request, response){
  // do any work you need to do, then
  Rooms.find().lean().then(items => 
  {
    response.render('home', {title: 'home', rooms: items, isAvailable: true});
  })
}

module.exports = {
    getHome
};