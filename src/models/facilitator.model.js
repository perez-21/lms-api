const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const facilitatorSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
});

// add plugin that converts mongoose to json
facilitatorSchema.plugin(toJSON);
facilitatorSchema.plugin(paginate);

/**
 * @typedef Facilitator
 */
const Facilitator = mongoose.model('Facilitator', facilitatorSchema);

module.exports = Facilitator;
