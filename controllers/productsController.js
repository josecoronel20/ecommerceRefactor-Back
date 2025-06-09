const products = require("../data/products.json");

const getProducts = (req, res) => {
  res.json(products);
};

module.exports = { getProducts };
