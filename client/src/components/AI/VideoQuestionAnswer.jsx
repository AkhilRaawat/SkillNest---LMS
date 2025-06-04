import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';

const VideoQuestionAnswer = ({ videoId }) => {
  const { backendUrl, getToken } = useContext(AppContext);
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentQA, setRecentQA] = useState(null);

  const askQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/video-ai/ask-question`,
        { videoId, question },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setRecentQA(data.data);
        setAnswers(prev => [data.data, ...prev]);
        setQuestion('');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const [minutes, seconds] = timestamp.split(':');
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const QuestionAnswerCard = ({ qa, isRecent = false }) => (
    <div className={`bg-white rounded-lg shadow-sm border ${isRecent ? 'border-blue-200' : 'border-gray-200'} overflow-hidden`}>
      <div className={`p-4 ${isRecent ? 'bg-blue-50' : 'bg-gray-50'} border-b border-gray-200`}>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-8 h-8 ${isRecent ? 'bg-blue-100' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isRecent ? 'text-blue-600' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-gray-900 font-medium flex-1">{qa.question}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-8 h-8 ${isRecent ? 'bg-green-100' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isRecent ? 'text-green-600' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-gray-700 leading-relaxed">{qa.answer}</p>
            {qa.relevantTimestamps?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {qa.relevantTimestamps.map((timestamp, i) => (
                  <span key={i} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isRecent ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {formatTimestamp(timestamp)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {qa.source === 'cache' && (
        <div className={`px-4 py-2 ${isRecent ? 'bg-blue-50' : 'bg-gray-50'} border-t border-gray-200`}>
          <p className="text-xs text-gray-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Similar question was previously answered
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={askQuestion} className="mb-8">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the video content..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24 text-gray-700"
              disabled={loading}
            />
            {loading && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2 justify-center w-full sm:w-auto sm:self-end"
            disabled={loading || !question.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            {loading ? 'Thinking...' : 'Ask Question'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center text-red-600 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Error</span>
          </div>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Recently Asked Question */}
      {recentQA && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Answer
          </h3>
          <QuestionAnswerCard qa={recentQA} isRecent={true} />
        </div>
      )}

      {/* Previous Questions */}
      {answers.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Asked Questions</h3>
          <div className="space-y-6">
            {answers.slice(1).map((qa, index) => (
              <QuestionAnswerCard key={index} qa={qa} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoQuestionAnswer; 