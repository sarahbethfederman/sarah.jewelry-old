shopClient.fetchProduct(1234)
  .then(function (product) {
    console.log(product);
  })
  .catch(function () {
    console.log('Request failed');
  });