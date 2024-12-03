import "./App.css";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Recommend from "./components/Recommend";

function App() {
  return (
    <div className="App">
      <LoginForm />
      <RegisterForm />
      <Recommend />
    </div>
  );
}
export default App;
