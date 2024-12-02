import React from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../services/api";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    console.log("Submitting data:", JSON.stringify(data));
    try {
      // Wywołanie funkcji API z danymi z formularza
      const response = await registerUser({
        login: data.username,
        email: data.email,
        password: data.password,
      });
      alert("User registered successfully: " + response.message);
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="login-form">
      <h2>Rejestracja</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            {...register("email", {
              required: "Email jest wymagany",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Niepoprawny format email",
              },
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Login:</label>
          <input
            type="username"
            {...register("username", {
              required: "Login jest wymagany",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]{3,}$/,
                message: "Niepoprawny format login (min.3 znaki)",
              },
            })}
          />
          {errors.username && <p>{errors.username.message}</p>}
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
        <div>
          <label>Potwierdź hasło:</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Potwierdzenie hasła jest wymagane",
              validate: (value) =>
                value === password || "Hasła muszą być takie same",
            })}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit">Zarejestruj się</button>
      </form>
      <button>Masz konto? Zaloguj się</button>
    </div>
  );
};

export default RegisterForm;
