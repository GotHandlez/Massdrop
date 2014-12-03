var Card = require('./cardModel.js');

module.exports = {
  addCard: function (req, res, next) {
  	var data = req.body;
    console.log('!@#$$#@$@#$@#$@#$@#');
    // var query = Card.find({card: data.card});

    Card.findOne({card: data.card}, function(err, card) {
    	// Card.update(data);
      if(!card) {
        new Card(data).save(function(e) {
    	console.log('12324', card);
          res.json(data);
        });
      }
      else {
        card.update(data);
      }
    });
  	res.json(data);
    
  }
}