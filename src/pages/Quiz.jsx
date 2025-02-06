import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import Navbar from "../components/Navbar";
import "../styles/Quiz.css"; // Import CSS

const Quiz = () => {
    const [topics, setTopics] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [quizCompleted, setQuizCompleted] = useState(false);

    // Fetch all unique topics
    useEffect(() => {
        const fetchTopics = async () => {
            const { data, error } = await supabase
                .from("questions")
                .select("topic");

            if (error) {
                console.error("Error fetching topics:", error);
            } else {
                // Get unique topics using Set
                const uniqueTopics = Array.from(new Set(data.map(item => item.topic)));
                setTopics(uniqueTopics);
            }
        };

        fetchTopics();
    }, []);

    // Fetch questions based on the selected topic
    useEffect(() => {
        if (selectedTopic) {
            const fetchQuestions = async () => {
                const { data, error } = await supabase
                    .from("questions")
                    .select("*")
                    .eq("topic", selectedTopic);

                if (error) {
                    console.error("Error fetching questions:", error);
                } else {
                    setQuestions(data);
                }
            };

            fetchQuestions();
        }
    }, [selectedTopic]);

    const handleAnswer = (selectedOption) => {
        if (questions[currentQuestion].correct_option === selectedOption) {
            setScore(score + 1);
        }

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setQuizCompleted(true);
            alert(`Quiz finished! Your score: ${score + 1}`);
        }
    };

    if (!selectedTopic) {
        return (
            <div className="quiz-container">
                <h1 className="quiz-title">📚 Select a Topic</h1>
                <div className="topic-grid">
                    {topics.map((topic) => (
                        <div
                            key={topic}
                            className="topic-card"
                            onClick={() => setSelectedTopic(topic)}
                        >
                            <h2>{topic}</h2>
                        </div>
                    ))}
                </div>
                <Navbar />
            </div>
        );
    }

    if (questions.length === 0) return <p className="loading-text">Loading questions...</p>;

    return (
        <div className="quiz-container">
            <h1 className="quiz-title">📝 NCC Quiz</h1>
            {quizCompleted ? (
                <div className="quiz-result">
                    <h2>🎉 Quiz Completed!</h2>
                    <p>Your Score: {score} / {questions.length}</p>
                </div>
            ) : (
                <div className="quiz-card">
                    <h2 className="question-text">{questions[currentQuestion].question}</h2>
                    <div className="options-container">
                        {["a", "b", "c", "d"].map((option) => (
                            <button
                                key={option}
                                className="option-button"
                                onClick={() => handleAnswer(option)}
                            >
                                {questions[currentQuestion][`option_${option}`]}
                            </button>
                        ))}
                    </div>
                    <p className="score-text">Score: {score}</p>
                </div>
            )}
            <Navbar />
        </div>
    );
};

export default Quiz;
