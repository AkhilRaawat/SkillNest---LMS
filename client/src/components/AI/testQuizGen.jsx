const QuizTester = () => {
  const [quiz, setQuiz] = useState(null);
  
  const testQuiz = async () => {
    const content = "Machine learning is a subset of AI that enables computers to learn from data.";
    const settings = { questionCount: 3, difficulty: 'medium' };
    
    try {
      const result = await aiQuizApi.generateQuiz(content, settings);
      setQuiz(result);
    } catch (error) {
      console.error('Quiz generation failed:', error);
    }
  };
  
  return (
    <div>
      <button onClick={testQuiz}>Test AI Quiz Generation</button>
      {quiz && <pre>{JSON.stringify(quiz, null, 2)}</pre>}
    </div>
  );
};