import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import Navbar from "../components/Navbar";
import "../styles/Quiz.css";

const Quiz = () => {
    const [topics, setTopics] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [topicProgress, setTopicProgress] = useState({});
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [answerStatus, setAnswerStatus] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (!error) setUserId(data?.user?.id);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchTopics = async () => {
            setLoading(true);
            const { data, error } = await supabase.from("questions").select("topic");

            if (!error) {
                const uniqueTopics = Array.from(new Set(data.map(item => item.topic)));
                setTopics(uniqueTopics);
                setTopicProgress(prev => uniqueTopics.reduce((acc, topic) => ({
                    ...acc,
                    [topic]: prev[topic] || { correctAnswers: 0, totalQuestions: 0 }
                }), {}));
            }
            setLoading(false);
        };
        fetchTopics();
    }, []);

    useEffect(() => {
        if (selectedTopic && userId) {
            const fetchProgress = async () => {
                const { data, error } = await supabase
                    .from("user_progress")
                    .select("correct_answers, total_questions")
                    .eq("user_id", userId)
                    .eq("topic", selectedTopic)
                    .single();

                if (!error) {
                    setTopicProgress(prev => ({
                        ...prev,
                        [selectedTopic]: {
                            correctAnswers: data?.correct_answers || 0,
                            totalQuestions: data?.total_questions || 0
                        }
                    }));
                }

                const savedIndex = localStorage.getItem(`currentQuestion_${selectedTopic}`);
                if (savedIndex) {
                    setCurrentQuestion(parseInt(savedIndex, 10));
                }
            };
            fetchProgress();
        }
    }, [selectedTopic, userId]);

    useEffect(() => {
        if (selectedTopic) {
            const fetchQuestions = async () => {
                setLoading(true);
                const { data, error } = await supabase
                    .from("questions")
                    .select("*")
                    .eq("topic", selectedTopic);

                if (!error) {
                    setQuestions(data);
                    setTopicProgress(prev => ({
                        ...prev,
                        [selectedTopic]: {
                            correctAnswers: prev[selectedTopic]?.correctAnswers || 0,
                            totalQuestions: data.length || 0
                        }
                    }));
                }
                setLoading(false);
            };
            fetchQuestions();
        }
    }, [selectedTopic]);

    const handleAnswer = async (selectedOption) => {
        if (!userId) return;

        const currentQuestionData = questions[currentQuestion];
        const isCorrect = currentQuestionData.correct_option === selectedOption;
        setAnswerStatus(isCorrect ? "correct" : "wrong");

        if (isCorrect) {
            setScore(prev => prev + 1);
            setTopicProgress(prev => ({
                ...prev,
                [selectedTopic]: {
                    ...prev[selectedTopic],
                    correctAnswers: prev[selectedTopic].correctAnswers + 1
                }
            }));

            const { data } = await supabase
                .from("user_progress")
                .select("correct_answers, total_questions")
                .eq("user_id", userId)
                .eq("topic", selectedTopic)
                .single();

            await supabase
                .from("user_progress")
                .upsert({
                    user_id: userId,
                    topic: selectedTopic,
                    correct_answers: (data?.correct_answers || 0) + 1,
                    total_questions: questions.length
                });
        }

        setTimeout(() => {
            setAnswerStatus(null);
            if (currentQuestion + 1 < questions.length) {
                setCurrentQuestion(prev => {
                    const nextIndex = prev + 1;
                    localStorage.setItem(`currentQuestion_${selectedTopic}`, nextIndex);
                    return nextIndex;
                });
            } else {
                setQuizCompleted(true);
                alert(`Quiz finished! Your score: ${score + (isCorrect ? 1 : 0)}`);
            }
        }, 1000);
    };

    const handleBack = () => {
        setSelectedTopic(null);
        setCurrentQuestion(0);
        setQuizCompleted(false);
        setScore(0);
        localStorage.removeItem(`currentQuestion_${selectedTopic}`);
    };

    const selectTopic = (topic) => {
        setSelectedTopic(topic);
        setCurrentQuestion(0);
        setScore(0);
        setQuizCompleted(false);
    };

    const calculateProgress = (topic) => {
        const progress = topicProgress[topic] || { correctAnswers: 0, totalQuestions: 1 };
        return progress.totalQuestions > 0 ? (progress.correctAnswers / progress.totalQuestions) * 100 : 0;
    };

    if (!selectedTopic) {
        return (
            <div className="quiz-container">
                <h1 className="quiz-title">📚 Select a Topic</h1>
                <div className="topic-grid">
                    {topics.map((topic) => (
                        <div key={topic} className="topic-card" onClick={() => selectTopic(topic)}>
                            <h2>{topic}</h2>
                            <p>Questions: {topicProgress[topic]?.totalQuestions}</p>
                            <div className="progress-bar-background">
                                <div className="progress-bar" style={{ width: `${calculateProgress(topic)}%` }}></div>
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
            <button className="back-button" onClick={handleBack}>🔙 Back</button>
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
                        {['a', 'b', 'c', 'd'].map(option => (
                            <button
                                key={option}
                                className={`option-button ${answerStatus && (questions[currentQuestion].correct_option === option ? "correct" : "wrong")}`}
                                onClick={() => handleAnswer(option)}
                                disabled={answerStatus !== null}
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
