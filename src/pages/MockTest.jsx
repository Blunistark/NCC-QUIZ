import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import Navbar from '../components/Navbar';
import '../styles/MockTests.css'; // Import CSS file

const MockTests = () => {
    const [mockTests, setMockTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMockTests = async () => {
            const { data, error } = await supabase
                .from('mocktest_questions')
                .select('mock_test_id, topic');

            if (error) {
                console.error('Error fetching mock tests:', error);
            } else {
                // Group by mock_test_id and topic and count questions
                const groupedTests = data.reduce((acc, item) => {
                    const key = `${item.mock_test_id}-${item.topic}`;
                    if (!acc[key]) {
                        acc[key] = { mock_test_id: item.mock_test_id, topic: item.topic, question_count: 0 };
                    }
                    acc[key].question_count += 1;
                    return acc;
                }, {});

                // Convert grouped data to array
                setMockTests(Object.values(groupedTests));
            }
            setLoading(false);
        };

        fetchMockTests();
    }, []);

    const startMockTest = (mock_test_id) => {
        navigate(`/mocktest/${mock_test_id}`);
    };

    return (
        <div className="mocktests-container">
            <h1 className="mocktests-title">Mock Tests</h1>
            {loading ? (
                <p className="loading-text">Loading mock tests...</p>
            ) : mockTests.length > 0 ? (
                <div className="mocktest-grid">
                    {mockTests.map((test) => (
                        <div key={test.mock_test_id} className="mocktest-card">
                            <h2>{test.topic}</h2>
                            <p>Questions: {test.question_count}</p>
                            <button 
                                className="start-test-btn"
                                onClick={() => startMockTest(test.mock_test_id)}
                            >
                                Start Test
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-tests-text">No mock tests available.</p>
            )}
            <Navbar />
        </div>
    );
};

export default MockTests;
