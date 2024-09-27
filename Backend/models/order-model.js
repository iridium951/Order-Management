const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    Description: {
        type: String
    },
    OrderDate: {
        type: Date
    },
    ShippedDate: {
        type: Date
    },
    Status: {
        type: String
    },
    ShippedStatus: {
        type: Boolean
    },
    User: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }]
});

const OrderModel = mongoose.model("orders", orderSchema);

module.exports = OrderModel;