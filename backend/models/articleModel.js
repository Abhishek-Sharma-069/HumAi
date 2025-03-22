import mongoose from 'mongoose';

const articleSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Article = mongoose.model('Article', articleSchema);
export default Article;