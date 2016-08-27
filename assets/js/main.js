var shopClient = require('./shopClient.js');

shopClient.fetchAllProducts(products)
  .then(function (product) {
    console.log(products);
  })
  .catch(function () {
    console.log('Request failed');
  });