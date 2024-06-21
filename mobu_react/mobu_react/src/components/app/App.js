//import { createContext, useState } from 'react'
import LoginForm from '../forms/LoginForm'
import RegisterForm from '../forms/RegisterForm';
import ForgotPasswordForm from '../forms/ForgotPasswordForm';
import GroupFoundationForm from '../forms/GroupFoundationForm';
import PasswordResetForm from '../forms/PasswordResetForm';
import Error404Page from '../pages/Error404Page';
import MessagesPage from '../pages/MessagesPage';
import GroupProfilePage from '../pages/GroupProfilePage';
import PersonProfilePage from '../pages/PersonProfilePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchPage from '../pages/SearchPage';
//import {HubConnectionBuilder} from "@microsoft/signalr";
import Error500Page from '../pages/Error500Page';
import Error403Page from '../pages/Error403Page';
import EditPersonProfilePage from '../pages/EditPersonProfilePage';
import EditGroupProfilePage from '../pages/EditGroupProfilePage';
import PendingRequestsPage from '../pages/PendingRequestsPage';
import AuthorsPage from '../pages/AuthorsPage';

//var messagingContextInterface = {
//    context: {
//        friendsData: [],
//        groupsData: [],
//        connection: new HubConnectionBuilder()
//    },
//    setContext: () => { }
//}

//export const UserDataContext = createContext({ ...messagingContextInterface });

/**
 * Componente raíz da aplicação
 * @returns
 */
export default function App() {

    //const [context, setContext] = useState({ ...messagingContextInterface.context });

    try {

        return (
            <Router >
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                    <Route path="/group-foundation" element={<GroupFoundationForm />} />
                    <Route path="/password-reset" element={<PasswordResetForm />} />

                    <Route path="/error-404" element={<Error404Page />} />
                    <Route path="/error-500" element={<Error500Page />} />
                    <Route path="/error-403" element={<Error403Page />} />

                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/pending-requests" element={<PendingRequestsPage />} />
                    <Route path="/group-profile" element={<GroupProfilePage />} />
                    <Route path="/edit-group-profile" element={<EditGroupProfilePage />} />
                    <Route path="/person-profile" element={<PersonProfilePage />} />
                    <Route path="/edit-person-profile" element={<EditPersonProfilePage />} />

                    <Route path="/search" element={<SearchPage />} />

                    <Route path="/authors" element={<AuthorsPage />} />
                </Routes>
            </ Router>
        );
    } catch (e) {
        e.console.log(e.message);
    }   
}
