const Clarifai = require('clarifai');

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
 apiKey: 'b2c562b34c624a1aac0277141420451f'
});


const handleApiCall = (req, res) => {
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(data => {
        res.json(data);
      })
      .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res,db) => {
    const { id } = req.body;
    db.where('published_date', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        console.log(entries);
    })
};

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}