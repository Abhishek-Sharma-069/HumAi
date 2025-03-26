import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const ArticleForm = ({ onSubmit, article }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
      setCategory(article.category);
      setImage(article.image);
    } else {
      setTitle('');
      setContent('');
      setCategory('');
      setImage(null);
    }
  }, [article]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, category, image });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Content</label>
        <Editor
          apiKey='b3u8sc7didfzj1owf1nim2fvn3xrovfx9zj9hzea1cl2uysj'
          value={content}
          onEditorChange={(newContent) => setContent(newContent)}
          init={{
            height: 500,
            plugins: [
              'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
              'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
            ],
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            tinycomments_mode: 'embedded',
            tinycomments_author: 'Author name',
            mergetags_list: [
              { value: 'First.Name', title: 'First Name' },
              { value: 'Email', title: 'Email' },
            ],
            ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
          }}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select a category</option>
          <option value="Mental Health">Mental Health</option>
          <option value="Physical Fitness">Physical Fitness</option>
          <option value="Nutrition">Nutrition</option>
          <option value="Sleep Health">Sleep Health</option>
          <option value="Preventive Care">Preventive Care</option>
          <option value="Chronic Conditions">Chronic Conditions</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block text-gray-700 font-bold mb-2">Image</label>
        <input
          type="file"
          id="image"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Submit</button>
    </form>
  );
};

export default ArticleForm;
