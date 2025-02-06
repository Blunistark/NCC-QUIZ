import { NavLink } from "react-router-dom";
import { Home, User, List, ClipboardList, Trophy } from "lucide-react";

const NavBar = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md flex justify-around p-2 border-t">
      <NavLink to="/home" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
        <Home size={24} />
        <span className="text-xs">Home</span>
      </NavLink>

      <NavLink to="/quiz" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
        <List size={24} />
        <span className="text-xs">Quiz</span>
      </NavLink>

      <NavLink to="/mock-tests" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
        <ClipboardList size={24} />
        <span className="text-xs">Mock Tests</span>
      </NavLink>

      <NavLink to="/leaderboard" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
        <Trophy size={24} />
        <span className="text-xs">Leaderboard</span>
      </NavLink>

      <NavLink to="/profile" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
        <User size={24} />
        <span className="text-xs">Profile</span>
      </NavLink>
    </div>
  );
};

export default NavBar;
