import React from "react";
import {
  IonCard,
  IonCardContent,
  IonText,
  IonIcon,
  IonRow,
  IonCol,
  IonProgressBar,
} from "@ionic/react";
import { trophy, flame, star, checkmark } from "ionicons/icons";
import { TaskStats } from "../types";

interface StatsCardProps {
  stats: TaskStats | null;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  if (!stats) {
    return (
      <IonCard className="stats-card">
        <IonCardContent>
          <IonText>
            <h3>Cargando Estadísticas...</h3>
          </IonText>
        </IonCardContent>
      </IonCard>
    );
  }

  const completionPercentage = stats.completionRate;

  return (
    <IonCard className="stats-card">
      <IonCardContent>
        <IonRow
          className="ion-align-items-center"
          style={{ marginBottom: "20px" }}
        >
          <IonCol size="8">
            <IonText>
              <h2 style={{ margin: "0", fontWeight: "bold" }}>
                {stats.totalPoints} puntos
              </h2>
              <p style={{ margin: "4px 0 0 0", opacity: 0.9 }}>
                Total acumulado
              </p>
            </IonText>
          </IonCol>
          <IonCol size="4" className="ion-text-end">
            <div style={{ fontSize: "3rem" }}>
              <IonIcon icon={trophy} />
            </div>
          </IonCol>
        </IonRow>

        <div style={{ marginBottom: "20px" }}>
          <IonRow
            className="ion-align-items-center"
            style={{ marginBottom: "8px" }}
          >
            <IonCol>
              <IonText>
                <small style={{ opacity: 0.9 }}>
                  Progreso: {stats.completedTasks}/{stats.totalTasks} tareas
                </small>
              </IonText>
            </IonCol>
            <IonCol size="auto">
              <IonText>
                <small style={{ opacity: 0.9 }}>
                  {completionPercentage.toFixed(1)}%
                </small>
              </IonText>
            </IonCol>
          </IonRow>
          <IonProgressBar
            value={completionPercentage / 100}
            style={{
              "--background": "rgba(255, 255, 255, 0.3)",
              "--progress-background": "rgba(255, 255, 255, 0.9)",
              height: "8px",
              borderRadius: "4px",
            }}
          />
        </div>

        <IonRow>
          <IonCol size="4" className="ion-text-center">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <IonIcon icon={flame} size="large" />
              <div>
                <IonText>
                  <h3 style={{ margin: "0", fontSize: "1.5rem" }}>
                    {stats.currentStreak}
                  </h3>
                  <small style={{ opacity: 0.9 }}>Racha actual</small>
                </IonText>
              </div>
            </div>
          </IonCol>

          <IonCol size="4" className="ion-text-center">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <IonIcon icon={star} size="large" />
              <div>
                <IonText>
                  <h3 style={{ margin: "0", fontSize: "1.5rem" }}>
                    {stats.longestStreak}
                  </h3>
                  <small style={{ opacity: 0.9 }}>Mejor racha</small>
                </IonText>
              </div>
            </div>
          </IonCol>

          <IonCol size="4" className="ion-text-center">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <IonIcon icon={checkmark} size="large" />
              <div>
                <IonText>
                  <h3 style={{ margin: "0", fontSize: "1.5rem" }}>
                    {stats.progress?.tasksCompletedToday || 0}
                  </h3>
                  <small style={{ opacity: 0.9 }}>Hoy</small>
                </IonText>
              </div>
            </div>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>
  );
};

export default StatsCard;
