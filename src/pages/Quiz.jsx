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
    const [topicProgress, setTopicProgress] = useState({});
    const [loading, setLoading] = useState(false);

    const userId = "user-id"; // Replace with actual user ID logic

    // Fetch all unique topics
    useEffect(() => {
        const fetchTopics = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("questions")
                .select("topic");

            if (error) {
                console.error("Error fetching topics:", error);
            } else {
                const uniqueTopics = Array.from(new Set(data.map(item => item.topic)));
                setTopics(uniqueTopics);

                // Initialize progress state for each topic
                const progressState = {};
                uniqueTopics.forEach((topic) => {
                    progressState[topic] = { correctAnswers: 0, totalQuestions: 0 };
                });
                setTopicProgress(progressState);
            }
            setLoading(false);
        };

        fetchTopics();
    }, []);

    // Fetch user's progress for the selected topic
    useEffect(() => {
        if (selectedTopic) {
            const fetchProgress = async () => {
                const { data, error } = await supabase
                    .from("user_progress")
                    .select("correct_answers, total_questions")
                    .eq("user_id", userId)
                    .eq("topic", selectedTopic)
                    .single();

                if (error) {
                    console.error("Error fetching progress:", error);
                } else {
                    if (data) {
                        setTopicProgress(prev => ({
                            ...prev,
                            [selectedTopic]: {
                                correctAnswers: data.correct_answers,
                                totalQuestions: data.total_questions
                            }
                        }));
                    } else {
                        // No progress found for the user in the selected topic, initialize it
                        setTopicProgress(prev => ({
                            ...prev,
                            [selectedTopic]: {
                                correctAnswers: 0,
                                totalQuestions: 0
                            }
                        }));
                    }
                }
            };

            fetchProgress();
        }
    }, [selectedTopic]);

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
                    // Update the total question count for the selected topic
                    setTopicProgress(prev => ({
                        ...prev,
                        [selectedTopic]: {
                            ...prev[selectedTopic],
                            totalQuestions: data.length
                        }
                    }));
                }
            };

            fetchQuestions();
        }
    }, [selectedTopic]);

    // Handle answer selection
    const handleAnswer = async (selectedOption) => {
        const currentQuestionData = questions[currentQuestion];

        // If the answer is correct
        if (currentQuestionData.correct_option === selectedOption) {
            setScore(prevScore => prevScore + 1);
            setTopicProgress(prev => {
                const updatedProgress = { ...prev };
                updatedProgress[selectedTopic].correctAnswers += 1;
                return updatedProgress;
            });

            // Update progress in the backend
            await supabase
                .from("user_progress")
                .upsert({
                    user_id: userId,
                    topic: selectedTopic,
                    correct_answers: topicProgress[selectedTopic].correctAnswers + 1,
                    total_questions: topicProgress[selectedTopic].totalQuestions
                });
        }

        // Move to next question or complete the quiz
        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setQuizCompleted(true);
            alert(`Quiz finished! Your score: ${score + 1}`);
        }
    };

    // Calculate progress percentage
    const calculateProgress = (topic) => {
        const { correctAnswers, totalQuestions } = topicProgress[topic];
        return totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    };

    // Render the topic selection screen
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
                            <p>Questions: {topicProgress[topic]?.totalQuestions}</p>
                            <div className="progress-bar-background">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${calculateProgress(topic)}%`,
                                    }}
                                ></div>
                            </div>
                            <p>{Math.round(calculateProgress(topic))}%</p>
                        </div>
                    ))}
                </div>
                <Navbar />
            </div>
        );
    }

    if (questions.length === 0 || loading) return <p className="loading-text">Loading questions...</p>;

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
