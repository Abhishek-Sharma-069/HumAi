import React from 'react';
import { useParams } from 'react-router-dom';

const ArticleDetail = () => {
  const { id } = useParams();

  // Mock article data - in a real app, this would come from an API
  const article = {
    id: parseInt(id),
    title: 'Understanding Anxiety and Depression',
    category: 'Mental Health',
    readTime: '5 min',
    image: 'https://via.placeholder.com/800x400',
    content: `
      Anxiety and depression are two of the most common mental health conditions affecting millions of people worldwide. Understanding these conditions is crucial for early detection and proper treatment.

      Mental health awareness has become increasingly important in recent years, as more people recognize the impact of psychological well-being on overall health.
    `,
    keyTakeaways: [
      'Recognize common symptoms of anxiety and depression',
      'Understand the importance of seeking professional help',
      'Learn about various treatment options available',
      'Discover self-help techniques and coping strategies'
    ],
    quiz: {
      title: 'Test Your Knowledge',
      questions: [
        {
          question: 'What is a common symptom of depression?',
          options: ['Persistent sadness', 'Temporary happiness', 'Increased energy', 'None of the above'],
          correctAnswer: 0
        }
      ]
    }
  };

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Article Header */}
        <div className="mb-8">
          <div className="text-sm text-primary mb-2">{article.category}</div>
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center text-gray-500 text-sm">
            <span className="mr-4">{article.readTime} read</span>
          </div>
        </div>

        {/* Article Image */}
        <div className="mb-8">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-[400px] object-cover rounded-xl"
          />
        </div>

        {/* Article Content */}
        <div className="prose max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {article.content}
          </p>
        </div>

        {/* Key Takeaways */}
        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Key Takeaways</h2>
          <ul className="space-y-4">
            {article.keyTakeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive Quiz */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6">{article.quiz.title}</h2>
          {article.quiz.questions.map((q, index) => (
            <div key={index} className="mb-6">
              <p className="font-medium mb-4">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors duration-300"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;