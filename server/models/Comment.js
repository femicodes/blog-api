import { Schema, model } from 'mongoose';

const CommentSchema = Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Comment = model('Comment', CommentSchema);

export default Comment;
