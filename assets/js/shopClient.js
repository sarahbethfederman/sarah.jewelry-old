var keys = require('./config.js');

var shopClient = ShopifyBuy.buildClient({
  apiKey: keys.shopifyKey,
  myShopifyDomain: 'sarah-jewelry',
  appId: '6'
});

module.exports = shopClient;