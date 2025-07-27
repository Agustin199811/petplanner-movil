// Profile.tsx
import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonText,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonAvatar,
  IonChip,
  IonProgressBar,
  IonRow,
  IonCol,
  IonAlert,
  IonToast,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import {
  person,
  mail,
  trophy,
  flame,
  star,
  calendar,
  statsChart,
  logOut,
  refresh,
  settings,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PetDisplay from "../components/PetDisplay";
import { useAppStore } from "../store/appStore";
import "./Profile.css";

const Profile: React.FC = () => {
  const history = useHistory();
  const {
    user,
    pet,
    taskStats,
    isLoading,
    error,
    logout,
    fetchPetStatus,
    fetchTaskStats,
    feedPet,
    playWithPet,
    recoverPet,
    clearError,
  } = useAppStore();

  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Efecto para cargar datos cuando el componente se monta Y cuando el usuario existe
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]); // Dependencia del user

  useEffect(() => {
    if (error) {
      setShowToast(true);
    }
  }, [error]);

  const loadData = async () => {
    try {
      await Promise.all([fetchPetStatus(), fetchTaskStats()]);
    } catch (err) {
      console.error("Error loading profile data:", err);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadData();
    event.detail.complete();
  };

  // FIX: Manejo correcto del logout
  const handleLogout = () => {
    setShowLogoutAlert(false);
    logout(); // Tu función existente

    // Redirección forzada con recarga
    setTimeout(() => {
      window.location.href = "/login";
      window.location.reload(); // Recarga completa
    }, 100);
  };
  const handleFeedPet = async () => {
    try {
      await feedPet();
      setSuccessMessage("¡Tu mascota está más feliz! 🍖");
      setShowSuccessToast(true);
    } catch (err) {
      // Error ya manejado por el store
    }
  };

  const handlePlayWithPet = async () => {
    try {
      await playWithPet();
      setSuccessMessage("¡Jugaste con tu mascota! 🎾");
      setShowSuccessToast(true);
    } catch (err) {
      // Error ya manejado por el store
    }
  };

  const handleRecoverPet = async () => {
    try {
      await recoverPet();
      setSuccessMessage("¡Tu mascota ha regresado! Dale más amor 💕");
      setShowSuccessToast(true);
    } catch (err) {
      // Error ya manejado por el store
    }
  };

  const getUserLevel = () => {
    if (!user) return 1;
    return Math.floor(user.totalPoints / 1000) + 1;
  };

  const getProgressToNextLevel = () => {
    if (!user) return 0;
    const currentLevel = getUserLevel();
    const pointsForCurrentLevel = (currentLevel - 1) * 1000;
    const pointsForNextLevel = currentLevel * 1000;
    const progressPoints = user.totalPoints - pointsForCurrentLevel;
    return (
      (progressPoints / (pointsForNextLevel - pointsForCurrentLevel)) * 100
    );
  };

  const getCompletionRate = () => {
    if (!taskStats || taskStats.totalTasks === 0) return 0;
    return ((taskStats.completedTasks / taskStats.totalTasks) * 100).toFixed(1);
  };

  // FIX: Protección adicional para redirigir si no hay usuario
  if (!user) {
    // Solo redirigir si no estamos ya en login
    if (history.location.pathname !== "/login") {
      setTimeout(() => {
        history.replace("/login");
      }, 0);
    }

    return (
      <IonPage>
        <IonContent className="ion-text-center ion-padding">
          <div className="loading-container">
            <IonText>Cerrando sesión...</IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader className="minimalist-header">
        <IonToolbar>
          <IonTitle>Mi Perfil</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            onClick={() => setShowLogoutAlert(true)}
            className="header-logout-btn"
          >
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="minimalist-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={refresh}
            pullingText="Desliza para actualizar"
            refreshingSpinner="circles"
            refreshingText="Actualizando..."
          />
        </IonRefresher>

        {/* Información del usuario */}
        <IonCard className="main-profile-card">
          <IonCardContent className="main-profile-content">
            <div className="profile-header-section">
              <IonAvatar className="profile-avatar">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.username}&background=ff6b35&color=fff&size=120`}
                  alt="Profile"
                />
                <div className="online-indicator"></div>
              </IonAvatar>
              <div className="profile-info">
                <IonText className="profile-name">{user.username}</IonText>
                <IonChip className="level-chip">
                  <IonIcon icon={star} />
                  <IonLabel>Nivel {getUserLevel()}</IonLabel>
                </IonChip>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-value positive">${user.totalPoints}</div>
                <div className="stat-label">Puntos</div>
              </div>
              <div className="stat-item">
                <div className="stat-value streak">{user.currentStreak}</div>
                <div className="stat-label">Racha</div>
              </div>
            </div>

            <IonItem lines="none" className="profile-email">
              <IonIcon icon={mail} slot="start" />
              <IonLabel>
                <h3>Email</h3>
                <p>{user.email}</p>
              </IonLabel>
            </IonItem>

            <IonItem lines="none" className="profile-member">
              <IonIcon icon={calendar} slot="start" />
              <IonLabel>
                <h3>Miembro desde</h3>
                <p>{format(new Date(), "MMMM yyyy", { locale: es })}</p>
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* Progreso de nivel */}
        <IonCard className="progress-card">
          <IonCardContent>
            <div className="progress-header">
              <IonText className="progress-title">
                <IonIcon icon={trophy} />
                Progreso de Nivel
              </IonText>
              <IonText className="progress-points">
                {user.totalPoints} pts
              </IonText>
            </div>
            <div className="level-info">
              <IonText>
                Nivel {getUserLevel()} → Nivel {getUserLevel() + 1}
              </IonText>
            </div>
            <IonProgressBar
              value={getProgressToNextLevel() / 100}
              className="level-progress-bar"
            />
            <div className="progress-footer">
              <IonText>
                {Math.ceil(getUserLevel() * 1000 - user.totalPoints)} puntos
                para el siguiente nivel
              </IonText>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Estadísticas */}
        <IonCard className="stats-card">
          <IonCardContent>
            <IonText className="stats-title">
              <IonIcon icon={statsChart} />
              Estadísticas
            </IonText>
            <IonRow className="stats-grid">
              <IonCol size="6" className="stat-col">
                <div className="stat-box flame">
                  <IonIcon icon={flame} />
                  <IonText className="stat-number">
                    {user.currentStreak}
                  </IonText>
                  <IonText className="stat-desc">Racha actual</IonText>
                </div>
              </IonCol>
              <IonCol size="6" className="stat-col">
                <div className="stat-box trophy">
                  <IonIcon icon={trophy} />
                  <IonText className="stat-number">
                    {user.longestStreak}
                  </IonText>
                  <IonText className="stat-desc">Mejor racha</IonText>
                </div>
              </IonCol>
            </IonRow>
            {taskStats && (
              <IonRow className="completion-stats">
                <IonCol size="6" className="completion-col">
                  <IonText className="completion-number">
                    {taskStats.completedTasks}
                  </IonText>
                  <IonText className="completion-desc">
                    Tareas completadas
                  </IonText>
                </IonCol>
                <IonCol size="6" className="completion-col">
                  <IonText className="completion-number">
                    {getCompletionRate()}%
                  </IonText>
                  <IonText className="completion-desc">Éxito total</IonText>
                </IonCol>
              </IonRow>
            )}
          </IonCardContent>
        </IonCard>

        {/* Mascota */}
        <PetDisplay
          pet={pet}
          onFeed={handleFeedPet}
          onPlay={handlePlayWithPet}
          onRecover={handleRecoverPet}
        />

        {/* Acciones */}
        <div className="logout-section">
          <IonButton
            expand="block"
            fill="outline"
            onClick={() => setShowLogoutAlert(true)}
            className="logout-button"
            color="danger"
          >
            <IonIcon icon={logOut} slot="start" />
            Cerrar Sesión
          </IonButton>
        </div>

        {/* Alert de logout */}
        <IonAlert
          isOpen={showLogoutAlert}
          onDidDismiss={() => setShowLogoutAlert(false)}
          header="Cerrar Sesión"
          message="¿Estás seguro de que quieres cerrar sesión?"
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
            },
            {
              text: "Cerrar Sesión",
              role: "destructive",
              handler: handleLogout, // Llama a la función corregida
            },
          ]}
        />

        {/* Toasts */}
        <IonToast
          isOpen={showSuccessToast}
          onDidDismiss={() => setShowSuccessToast(false)}
          message={successMessage}
          duration={3000}
          color="success"
          position="top"
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => {
            setShowToast(false);
            clearError();
          }}
          message={error || "Ha ocurrido un error"}
          duration={3000}
          color="danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
