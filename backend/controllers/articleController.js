import Article from '../models/articleModel.js';

// @desc Create new article
// @route POST /api/articles
const createArticle = async (req, res) => {
  try {
    const { title, Description, categoryId, featuredImage } = req.body;

    const newArticle = await Article.create({
      user: req.user.id,
      title,
      Description,
      categoryId,
      featuredImage,
    });

    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: 'Error creating article' });
  }
};

// @desc Get all articles
// @route GET /api/articles
const getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles' });
  }
};

// @desc Get article by ID
// @route GET /api/articles/:id
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching article' });
  }
};

// @desc Update an article
// @route PUT /api/articles/:id
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    if (article.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    article.title = req.body.title || article.title;
    article.Description = req.body.Description || article.Description;
    article.categoryId = req.body.categoryId || article.categoryId;
    article.featuredImage = req.body.featuredImage || article.featuredImage;

    const updatedArticle = await article.save();
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: 'Error updating article' });
  }
};

// @desc Delete an article
// @route DELETE /api/articles/:id
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    if (article.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await article.remove();
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article' });
  }
};

export { createArticle, getArticles, getArticleById, updateArticle, deleteArticle };