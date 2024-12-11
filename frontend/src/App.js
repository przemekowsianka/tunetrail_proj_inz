import "./App.css";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import RecommendAlbum from "./components/RecommendAlbum";
import RecommendArtist from "./components/RecommendArtist";
import GetAccounts from "./components/GetAccounts";
import FetchUserData from "./components/import";
import "./custom.scss";
function App() {
  return (
    <div className="App">
      <LoginForm />
      <RegisterForm />
      <FetchUserData />

      <GetAccounts />
      <RecommendArtist />
      <RecommendAlbum />
    </div>
  );
}
export default App;
