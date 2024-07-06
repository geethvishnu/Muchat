const mongoose = require('mongoose');

const ScheduledMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  sendAt: { type: Date, required: true },
});

const ScheduledMessage = mongoose.model('ScheduledMessage', ScheduledMessageSchema);

module.exports = ScheduledMessage;


// dummy
