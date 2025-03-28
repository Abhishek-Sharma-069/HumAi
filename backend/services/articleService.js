import Article from '../models/articleModel.js';

class ArticleService {
  async getAllArticles() {
    try {
      return await Article.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new Error('Error fetching articles: ' + error.message);
    }
  }

  async getArticleById(id) {
    try {
      const article = await Article.findById(id);
      if (!article) {
        throw new Error('Article not found');
      }
      return article;
    } catch (error) {
      throw new Error('Error fetching article: ' + error.message);
    }
  }

  async createArticle(articleData) {
    try {
      const article = new Article(articleData);
      return await article.save();
    } catch (error) {
      throw new Error('Error creating article: ' + error.message);
    }
  }

  async updateArticle(id, articleData) {
    try {
      const article = await Article.findByIdAndUpdate(
        id,
        articleData,
        { new: true, runValidators: true }
      );
      if (!article) {
        throw new Error('Article not found');
      }
      return article;
    } catch (error) {
      throw new Error('Error updating article: ' + error.message);
    }
  }

  async deleteArticle(id) {
    try {
      const article = await Article.findByIdAndDelete(id);
      if (!article) {
        throw new Error('Article not found');
      }
      return article;
    } catch (error) {
      throw new Error('Error deleting article: ' + error.message);
    }
  }
}

export default new ArticleService();