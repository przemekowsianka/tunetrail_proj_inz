import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // Dodano useNavigate
import { registerUser } from "../services/api"; // Usunięto loginUser, bo nie jest potrzebny
import { Button, Form, Container, Row, Col } from "react-bootstrap";

const Register = () => {
  const navigate = useNavigate(); // Hook do nawigacji
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
      // Wywołanie funkcji API do rejestracji
      const response = await registerUser({
        login: data.username,
        email: data.email,
        password: data.password,
      });

      alert("User registered successfully: " + response.message);

      // Przekierowanie na stronę logowania po rejestracji
      navigate("/login");
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || error.message));
    }
  };

  // Przejście na stronę logowania
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <Container fluid className="min-vh-100 d-flex">
      <Row className="w-100">
        <Col
          md={6}
          className="bg-primary text-white d-flex flex-column justify-content-center align-items-center"
        >
          <h1 className="display-3">TuneTrail</h1>
        </Col>

        <Col
          md={6}
          className="d-flex justify-content-center align-items-center"
        >
          <div className="w-75">
            <h2 className="text-center mb-4">Rejestracja</h2>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Wprowadź email"
                  {...register("email", {
                    required: "Email jest wymagany",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Niepoprawny format email",
                    },
                  })}
                  isInvalid={!!errors.email}
                />
                {errors.email && (
                  <Form.Control.Feedback type="invalid">
                    {errors.email.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Login</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Wprowadź login"
                  {...register("username", {
                    required: "Login jest wymagany",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]{3,}$/,
                      message: "Niepoprawny format login (min.3 znaki)",
                    },
                  })}
                  isInvalid={!!errors.username}
                />
                {errors.username && (
                  <Form.Control.Feedback type="invalid">
                    {errors.username.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Hasło</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Wprowadź hasło"
                  {...register("password", {
                    required: "Hasło jest wymagane",
                    minLength: {
                      value: 8,
                      message: "Hasło musi mieć przynajmniej 8 znaków",
                    },
                  })}
                  isInvalid={!!errors.password}
                />
                {errors.password && (
                  <Form.Control.Feedback type="invalid">
                    {errors.password.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Potwierdź hasło</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Potwierdź hasło"
                  {...register("confirmPassword", {
                    required: "Potwierdzenie hasła jest wymagane",
                    validate: (value) =>
                      value === password || "Hasła muszą być takie same",
                  })}
                  isInvalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 mb-3">
                Zarejestruj się
              </Button>
            </Form>

            <div className="text-center">
              <Button variant="link" onClick={handleLoginRedirect}>
                Masz konto? Zaloguj się
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
