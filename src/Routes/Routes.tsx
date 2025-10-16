import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import TrainingProgramPage from "../Pages/TrainingProgramPage/TraininProgramPage";
import SearchPage from "../Pages/SearchPage/SearchPage";
import ProgramDay from "../Components/ProgramDay/ProgramDay";
import IncomeStatement from "../Components/IncomeStatement/IncomeStatement";
import DesignGuide from "../Pages/DesignGuide/DesignGuide";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "", element: <HomePage /> },

            { path: "search", element: <ProtectedRoute><SearchPage /></ProtectedRoute> },
            { path: "design-guide", element: <ProtectedRoute><DesignGuide /></ProtectedRoute> },
            { path: "program/:programId",
                element: <ProtectedRoute><TrainingProgramPage /></ProtectedRoute>,
                children: [
                    { path: ":dayId", element: <ProgramDay /> },
                ]
            }
        ]
    },
    {
    }
]);