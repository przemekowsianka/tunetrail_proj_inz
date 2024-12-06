import "./App.css";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Recommend from "./components/Recommend";
import GetAccounts from "./components/GetAccounts";
import FetchUserData from "./components/import";

function App() {
  return (
    <div className="App">
      <LoginForm />
      <RegisterForm />
      <FetchUserData />

      <GetAccounts />
      <Recommend />
    </div>
  );
}
export default App;
