import mongoose, { Schema } from 'mongoose';

const TodoSchema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model('Todo', TodoSchema);
