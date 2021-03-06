const createError = require('http-errors');
const mongoose = require('mongoose');

const Product = require('../Models/Product.model');

module.exports = {
    getAllProducts: async (req, res, next) => {
        try {
            const results = await Product.find({});
            res.send(results);
        } catch (error) {
            res.send(error.message);
            console.log(error.message);
        }
    },
    createNewProduct: async (req, res, next) => {

        try {
            if (req.decodedEmail) {
                const product = new Product(req.body);
                const result = await product.save();
                res.send({ message: "Product added successfully" });
            } else {
                res.status(401).json({ message: "User not Authorized" });

            }

        } catch (error) {
            console.log(error.message);
            if (error.name === 'ValidationError') {
                next(createError(422, error.message));
                return;
            }
            next(error);
        }
    },

    findProductById: async (req, res, next) => {
        const id = req.params.id;
        try {
            const product = await Product.findById(id);
            // const product = await product.findOne({ _id: id });
            if (!product) {
                throw createError(404, 'product does not exist.');
            }
            res.send(product);
        } catch (error) {
            console.log(error.message);
            if (error instanceof mongoose.CastError) {
                next(createError(400, 'Invalid product id'));
                return;
            }
            next(error);
        }
    },
    findProductsByCategory: async (req, res, next) => {
        const category = req.params.category;
        try {
            const product = await Product.find({ category: [category] });
            if (!product) {
                throw createError(404, 'No Products of this category found');
            }
            res.send(product);
        } catch (error) {
            console.log(error.message);
            if (error instanceof mongoose.CastError) {
                next(createError(400, 'Invalid product category'));
                return;
            }
            next(error);
        }
    },

    updateAProduct: async (req, res, next) => {
        try {
            if (req.decodedEmail) {
                const id = req.params.id;
                const updates = req.body;
                const options = { new: true };
                const result = await Product.findByIdAndUpdate(id, updates, options);
                if (!result) {
                    throw createError(404, 'Product does not exist');
                }
                res.send(result);

            } else {
                res.status(401).json({ message: "User not Authorized" });

            }

        } catch (error) {
            console.log(error.message);
            if (error instanceof mongoose.CastError) {
                return next(createError(400, 'Invalid Product Id'));
            }

            next(error);
        }
    },

    deleteAProduct: async (req, res, next) => {
        const id = req.params.id;
        try {
            if (req.decodedEmail) {
                const result = await Product.findByIdAndDelete(id);
                if (!result) {
                    throw createError(404, 'Product does not exist.');
                }
                res.send(result);

            } else {
                res.status(401).json({ message: "User not Authorized" });

            }
        } catch (error) {
            console.log(error.message);
            if (error instanceof mongoose.CastError) {
                next(createError(400, 'Invalid Product id'));
                return;
            }
            next(error);
        }
    }
};
