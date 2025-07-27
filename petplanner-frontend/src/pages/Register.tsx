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
  IonSelect,
  IonSelectOption,
  IonBackButton,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import {
  person,
  mail,
  lockClosed,
  personAdd,
  paw,
  logoGoogle,
  logoApple,
  logoFacebook,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RegisterForm, PetType } from "../types";
import "./Login.css";
import { useAppStore } from "../store/appStore";

const Register: React.FC = () => {
  const history = useHistory();
  const {
    register: registerUser,
    isLoading,
    error,
    clearError,
  } = useAppStore();
  const [showToast, setShowToast] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data);
      history.replace("/tabs");
    } catch (err) {
      setShowToast(true);
    }
  };

  const petTypeOptions = [
    { value: PetType.DOG, label: "🐕 Perro", emoji: "🐕" },
    { value: PetType.CAT, label: "🐱 Gato", emoji: "🐱" },
    { value: PetType.RABBIT, label: "🐰 Conejo", emoji: "🐰" },
    { value: PetType.BIRD, label: "🐦 Pájaro", emoji: "🐦" },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" className="back-button" />
          </IonButtons>
          <IonTitle className="header-title">Crear Cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="orange-gradient-background">
        <div className="register-container">
          {/* Welcome Section */}
          <div className="welcome-section">
            <img
              src="./src/assets/img/LogoGIF.gif"
              alt="Pet GIF"
              className="avatar-gif"
            />
            <IonText className="welcome-text">
              <h2>¡Únete a nosotros!</h2>
              <p>Crea tu cuenta y adopta tu mascota</p>
            </IonText>
          </div>

          {/* Register Form Card */}
          <IonCard className="register-card">
            <IonCardContent className="register-card-content">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* User Information Section */}
                <div className="section-header">
                  <IonIcon icon={person} className="section-icon" />
                  <span>Información Personal</span>
                </div>

                {/* Username Input */}
                <div className="input-group">
                  <IonLabel className="input-label">Nombre de usuario</IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Tu nombre de usuario"
                    className="custom-input"
                    {...register("username", {
                      required: "El nombre de usuario es requerido",
                      minLength: {
                        value: 3,
                        message: "Mínimo 3 caracteres",
                      },
                    })}
                  />
                  {errors.username && (
                    <IonText color="danger" className="error-text">
                      <small>{errors.username.message}</small>
                    </IonText>
                  )}
                </div>

                {/* Email Input */}
                <div className="input-group">
                  <IonLabel className="input-label">Email</IonLabel>
                  <IonInput
                    type="email"
                    placeholder="tu@email.com"
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
                <div className="input-group">
                  <IonLabel className="input-label">Contraseña</IonLabel>
                  <IonInput
                    type="password"
                    placeholder="Tu contraseña"
                    className="custom-input"
                    {...register("password", {
                      required: "La contraseña es requerida",
                      minLength: {
                        value: 6,
                        message: "Mínimo 6 caracteres",
                      },
                    })}
                  />
                  <div className="password-toggle">👁</div>
                  {errors.password && (
                    <IonText color="danger" className="error-text">
                      <small>{errors.password.message}</small>
                    </IonText>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="input-group">
                  <IonLabel className="input-label">
                    Confirmar contraseña
                  </IonLabel>
                  <IonInput
                    type="password"
                    placeholder="Repite tu contraseña"
                    className="custom-input"
                    {...register("confirmPassword", {
                      required: "Confirma tu contraseña",
                      validate: (value) =>
                        value === password || "Las contraseñas no coinciden",
                    })}
                  />
                  {errors.confirmPassword && (
                    <IonText color="danger" className="error-text">
                      <small>{errors.confirmPassword.message}</small>
                    </IonText>
                  )}
                </div>

                {/* Pet Information Section */}
                <div className="pet-section">
                  <div className="section-header">
                    <IonIcon icon={paw} className="section-icon" />
                    <span>Adopta tu mascota</span>
                  </div>

                  {/* Pet Name Input */}
                  <div className="input-group">
                    <IonLabel className="input-label">
                      Nombre de tu mascota
                    </IonLabel>
                    <IonInput
                      type="text"
                      placeholder="Mochi"
                      className="custom-input"
                      {...register("petName", {
                        required: "El nombre de la mascota es requerido",
                        minLength: {
                          value: 2,
                          message: "Mínimo 2 caracteres",
                        },
                      })}
                    />
                    {errors.petName && (
                      <IonText color="danger" className="error-text">
                        <small>{errors.petName.message}</small>
                      </IonText>
                    )}
                  </div>

                  {/* Pet Type Select */}
                  <div className="input-group">
                    <IonLabel className="input-label">Tipo de mascota</IonLabel>
                    <IonSelect
                      placeholder="Selecciona una mascota"
                      className="custom-select"
                      {...register("petType", {
                        required: "Selecciona un tipo de mascota",
                      })}
                    >
                      {petTypeOptions.map((option) => (
                        <IonSelectOption
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                    {errors.petType && (
                      <IonText color="danger" className="error-text">
                        <small>{errors.petType.message}</small>
                      </IonText>
                    )}
                  </div>
                </div>

                {/* Register Button */}
                <IonButton
                  expand="block"
                  type="submit"
                  className="register-button"
                  disabled={isLoading}
                >
                  <IonIcon icon={personAdd} slot="start" />
                  Crear Cuenta
                </IonButton>

                {/* Divider */}
                <div className="divider">
                  <span>O</span>
                </div>

                {/* Login Link */}
                <div className="signup-link">
                  <IonText>
                    ¿Ya tienes cuenta?{" "}
                    <span
                      className="link-text"
                      onClick={() => history.push("/login")}
                    >
                      Iniciar Sesión
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
          message={error || "Error al crear cuenta"}
          duration={3000}
          color="danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
