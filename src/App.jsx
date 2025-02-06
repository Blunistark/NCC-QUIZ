import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import AuthPage from "./pages/Auth";
import MockTests from "./pages/MockTest";
import MockTest from "./pages/Mocktests";
import { useAuth } from "./context/AuthContext";

function App() {
    const { isAuthenticated } = useAuth(); // Get auth state from context

    return (
        <Router>
                    <Routes>
                        <Route path="/" element={<AuthPage />} />
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/quiz"
                            element={
                                <ProtectedRoute>
                                    <Quiz />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/leaderboard"
                            element={
                                <ProtectedRoute>
                                    <Leaderboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/mock-tests"
                            element={
                                <ProtectedRoute>
                                    <MockTests />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/mocktest/:mock_test_id" element={<MockTest />} />  {/* Ensure this path exists */}
    
                    </Routes>
        </Router>
    );
}

export default App;
