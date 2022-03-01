const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    category: { type: mongoose.Types.ObjectId, required: true, ref: 'Category' },
    price: { type: Number, required: true },
})

module.exports = mongoose.model('Product', productSchema);