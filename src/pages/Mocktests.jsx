import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import Navbar from '../components/Navbar';
import '../styles/MockTest.css';

const MockTest = () => {
    const { mock_test_id } = useParams();  // Get the mock test ID from the URL
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(60);  // 60 seconds timer for each question
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            const { data, error } = await supabase
                .from('mocktest_questions')
                .select('*')
                .eq('mock_test_id', mock_test_id);  // Fetch questions for the specific mock test ID

            if (error) {
                console.error('Error fetching questions:', error);
            } else {
                setQuestions(data);
            }
            setLoading(false);
        };

        fetchQuestions();
    }, [mock_test_id]);  // Re-run effect when mock_test_id changes

    useEffect(() => {
        if (loading || questions.length === 0) return;

        // Timer logic for each question
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleNextQuestion();
                    return 60; // Reset timer for the next question
                }
                return prev - 1;
            });
        }, 1000); // Decrease every second

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [currentQuestionIndex, loading, questions.length]);

    const handleAnswerSelection = (option) => {
        setSelectedOption(option);
    };

    const handleNextQuestion = () => {
        // Check answer and update score
        if (selectedOption === questions[currentQuestionIndex].correct_option) {
            setScore(score + 1);
        }

        // Move to the next question
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption('');
            setTimer(60);  // Reset timer for the next question
        } else {
            // End quiz and save score
            saveScore();
        }
    };

    const saveScore = async () => {
        const userId = 'user-uuid-here'; // Replace with actual logged-in user's UUID

        const { error } = await supabase
            .from('mocktest_scores')
            .insert([
                {
                    user_id: userId,
                    mocktest_id: mock_test_id,
                    score: score,
                },
            ]);

        if (error) {
            console.error('Error saving score:', error);
        } else {
            // After saving score, update leaderboard
            updateLeaderboard();
        }
    };

    const updateLeaderboard = async () => {
        const userId = 'user-uuid-here'; // Replace with actual logged-in user's UUID

        const { error } = await supabase
            .from('leaderboard')
            .upsert([
                {
                    user_id: userId,
                    score: score,
                },
            ]);

        if (error) {
            console.error('Error updating leaderboard:', error);
        } else {
            navigate('/leaderboard'); // Redirect to leaderboard page
        }
    };

    if (loading) {
        return <p>Loading questions...</p>;
    }

    const question = questions[currentQuestionIndex];

    return (
        <div className="mocktest-container">
            <h1>Mock Test: {question.topic}</h1>
            <div className="question-card">
                <p>{currentQuestionIndex + 1}. {question.question}</p>
                <p>Time Remaining: {timer} seconds</p>
                <ul>
                    <li>
                        <button onClick={() => handleAnswerSelection('a')} className={selectedOption === 'a' ? 'selected' : ''}>
                            {question.option_a}
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleAnswerSelection('b')} className={selectedOption === 'b' ? 'selected' : ''}>
                            {question.option_b}
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleAnswerSelection('c')} className={selectedOption === 'c' ? 'selected' : ''}>
                            {question.option_c}
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleAnswerSelection('d')} className={selectedOption === 'd' ? 'selected' : ''}>
                            {question.option_d}
                        </button>
                    </li>
                </ul>
                <button onClick={handleNextQuestion}>
                    {currentQuestionIndex === questions.length - 1 ? 'Submit Test' : 'Next Question'}
                </button>
            </div>
            <Navbar />
        </div>
    );
};

export default MockTest;
