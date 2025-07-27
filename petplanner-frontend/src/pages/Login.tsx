import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonCard,
  IonCardContent,
  IonLoading,
  IonToast,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import {
  mail,
  lockClosed,
  logIn,
  person,
  logoGoogle,
  logoApple,
  logoFacebook,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoginForm } from "../types";
import { useAppStore } from "../store/appStore";
import "./Login.css";

const Login: React.FC = () => {
  const history = useHistory();
  const { login, isLoading, error, clearError } = useAppStore();
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    console.log("form submitted", data);
    try {
      await login(data.email, data.password);
      console.log("login finished, redirecting");
      history.replace("/tabs");
    } catch (err) {
      console.log("login error caught in component", err);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonContent className="orange-gradient-background">
        <div className="login-container">
          {/* Avatar and Title Section */}
          <div className="avatar-section">
            <div className="avatar-container">
              <div className="avatar-circle">
                <img
                  src="./src/assets/img/LogoGIF.gif"
                  alt="Pet GIF"
                  className="avatar-gif"
                />
              </div>
            </div>
          </div>

          {/* Login Form Card */}
          <IonCard className="login-card">
            <IonCardContent className="login-card-content">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Input */}
                <div className="input-group">
                  <IonLabel className="input-label">Email </IonLabel>
                  <IonInput
                    type="email"
                    placeholder="shevchenko123@gmail.com"
                    className="custom-input"
                    {...register("email", {
                      required: "El email es requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                  />
                  {errors.email && (
                    <IonText color="danger" className="error-text">
                      <small>{errors.email.message}</small>
                    </IonText>
                  )}
                </div>

                {/* Password Input */}
                {/* Password Input */}
                <div className="input-group password-group">
                  <IonLabel className="input-label">Contraseña</IonLabel>
                  <div className="password-input-wrapper">
                    <IonInput
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      className="custom-input"
                      {...register("password", {
                        required: "La contraseña es requerida",
                        minLength: {
                          value: 6,
                          message: "Mínimo 6 caracteres",
                        },
                      })}
                    />
                    <div
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? "🙈" : "👁"}
                    </div>
                  </div>
                  {errors.password && (
                    <IonText color="danger" className="error-text">
                      <small>{errors.password.message}</small>
                    </IonText>
                  )}
                </div>

                {/* Login Button */}
                <IonButton
                  expand="block"
                  type="submit"
                  className="login-button"
                  disabled={isLoading}
                >
                  Log In
                </IonButton>

                {/* Divider */}
                <div className="divider">
                  <span>Or</span>
                </div>

                {/* Sign Up Link */}
                <div className="signup-link">
                  <IonText>
                    No tienes cuenta?{" "}
                    <span
                      className="link-text"
                      onClick={() => history.push("/register")}
                    >
                      Registrate
                    </span>
                  </IonText>
                </div>
              </form>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => {
            setShowToast(false);
            clearError();
          }}
          message={error || "Error al iniciar sesión"}
          duration={3000}
          color="danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
