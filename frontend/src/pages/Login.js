import React from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // Dodano useNavigate
import { loginUser } from "../services/api";

const Login = () => {
  const navigate = useNavigate(); // Hook do nawigacji
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

      // Przeniesienie na stronę główną po zalogowaniu
      navigate("/home");
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || error.message));
    }
  };

  // Funkcja przekierowująca do strony rejestracji
  const handleRegisterRedirect = () => {
    navigate("/register"); // Przeniesienie do /register
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
            <h2 className="text-center mb-4">Logowanie</h2>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="formIdentifier">
                <Form.Label>Email lub login</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Wprowadź email lub login"
                  {...register("identifier", {
                    required: "Email lub login jest wymagany",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$|^[a-zA-Z0-9_.+-]{3,}$/,
                      message:
                        "Wprowadź poprawny email lub login (min. 3 znaki)",
                    },
                  })}
                  isInvalid={!!errors.identifier}
                />
                {errors.identifier && (
                  <Form.Control.Feedback type="invalid">
                    {errors.identifier.message}
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

              <Button type="submit" className="w-100" variant="primary">
                Zaloguj się
              </Button>
            </Form>

            <div className="text-center mt-3">
              <Button
                variant="link"
                onClick={handleRegisterRedirect} // Obsługa kliknięcia przycisku rejestracji
              >
                Nie masz konta? Zarejestruj się
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
