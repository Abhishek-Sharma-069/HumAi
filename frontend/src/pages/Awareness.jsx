import React from 'react';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import TrendingArticles from '../components/TrendingArticles';
import ArticleCard from '../components/ArticleCard';

const Awareness = () => {
  const categories = [
    { id: 1, title: 'Mental Health', icon: '🧠' },
    { id: 2, title: 'Physical Fitness', icon: '💪' },
    { id: 3, title: 'Nutrition', icon: '🥗' },
    { id: 4, title: 'Sleep Health', icon: '😴' },
    { id: 5, title: 'Preventive Care', icon: '🏥' },
    { id: 6, title: 'Chronic Conditions', icon: '❤️' },
  ];

  const trendingArticles = [
    {
      id: 1,
      title: 'Understanding Anxiety and Depression',
      category: 'Mental Health',
      readTime: '5 min',
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 2,
      title: 'Healthy Eating Habits for Better Living',
      category: 'Nutrition',
      readTime: '4 min',
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 3,
      title: 'Importance of Regular Exercise',
      category: 'Physical Fitness',
      readTime: '6 min',
      image: 'https://via.placeholder.com/300x200',
    },
  ];

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Search Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-6 text-center">Health Awareness Hub</h1>
          <SearchBar />
        </div>

        {/* Categories Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Health Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </section>

        {/* Trending Articles Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Trending Articles</h2>
          <TrendingArticles articles={trendingArticles} />
        </section>

        {/* Featured Articles Grid */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Featured Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingArticles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Awareness;