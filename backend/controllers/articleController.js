import Article from '../models/articleModel.js';

// @desc Create new article
// @route POST /api/articles
const createArticle = async (req, res) => {
  try {
    const { title, content, category, imageUrl } = req.body;

    const article = await Article.create({
      title,
      content,
      category,
      imageUrl,
      author: req.user.id,
    });

    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error creating article' });
  }
};

// @desc Get all articles
// @route GET /api/articles
const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate('author', 'name');
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles' });
  }
};

// @desc Update article
// @route PUT /api/articles/:id
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: 'Error updating article' });
  }
};

// @desc Delete article
// @route DELETE /api/articles/:id
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await article.deleteOne();
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article' });
  }
};

export { createArticle, getArticles, updateArticle, deleteArticle };