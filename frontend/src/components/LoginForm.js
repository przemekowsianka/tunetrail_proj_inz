import React from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../services/api";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Submitting data:", JSON.stringify(data));
    try {
      // Wywołanie funkcji API z danymi z formularza
      const response = await loginUser({
        login: data.identifier,
        email: data.identifier,
        password: data.password,
      });
      alert("User logged successfully: " + response.message);
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || error.message));
    }
  };
  return (
    <div className="login-form">
      <h2>Logowanie</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email lub login:</label>
          <input
            type="text"
            {...register("identifier", {
              required: "Email lub login jest wymagany",
              pattern: {
                value:
                  /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$|^[a-zA-Z0-9_.+-]{3,}$/,
                message: "Wprowadź poprawny email lub login (min. 3 znaki)",
              },
            })}
          />
          {errors.identifier && <p>{errors.identifier.message}</p>}
        </div>

        <div>
          <label>Hasło:</label>
          <input
            type="password"
            {...register("password", {
              required: "Hasło jest wymagane",
              minLength: {
                value: 8,
                message: "Hasło musi mieć przynajmniej 8 znaków",
              },
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit">Zaloguj się</button>
      </form>
      <button>Nie masz konta? Zarejestruj się</button>
    </div>
  );
};

export default LoginForm;
