/*
  - fetches a list of DataSet objects from the database
  - response body contains an array of DataSet objects
  {
    list: [ {DataSet0}, {DataSet1}, etc ]
  }
  - later we'll add a maximum page result configurable by an entry in environment.js's CONFIGURATION_VARS
  - later we'll add filter parameters, for example search by DataSet name/description for type-ahead results
*/

module.exports = function(router) {
  router.get('/api/datasets', function(req, res, next) {

    // TODO: replace this placeholder code

    res.status(200).send({
      list: [{
          _id: "123456789",
          _collectionName: "mircs_123456789",
          name: "People",
          description: "A list of people I care about",
          fields: [
            { name: "name", type: "string" },
            { name: "streetNumber", type: "number" },
            { name: "streetName", type: "string" }
          ]
        },
        {
          _id: "987654321",
          _collectionName: "mircs_987654321",
          name: "AddressLocations",
          description: "Mappable address data!",
          fields: [
            { name: "streetNumber", type: "number" },
            { name: "streetName", type: "string" },
            { name: "location", type: "geojson" }
          ]
        }
      ]
    });
  });
};