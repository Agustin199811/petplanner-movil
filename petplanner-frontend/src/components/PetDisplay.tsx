import React from "react";
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonProgressBar,
  IonText,
  IonRow,
  IonCol,
  IonChip,
  IonLabel,
} from "@ionic/react";
import {
  heart,
  happy,
  flash,
  star,
  restaurant,
  gameController,
  home,
} from "ionicons/icons";
import { Pet, PetMood } from "../types";

interface PetDisplayProps {
  pet: Pet | null;
  onFeed?: () => void;
  onPlay?: () => void;
  onRecover?: () => void;
  showActions?: boolean;
}

const PetDisplay: React.FC<PetDisplayProps> = ({
  pet,
  onFeed,
  onPlay,
  onRecover,
  showActions = true,
}) => {
  if (!pet) {
    return (
      <IonCard className="pet-card">
        <IonCardContent className="ion-text-center">
          <IonText color="medium">
            <h3>No tienes mascota</h3>
            <p>Regístrate para obtener tu mascota virtual</p>
          </IonText>
        </IonCardContent>
      </IonCard>
    );
  }

  const getMoodEmoji = (mood: PetMood) => {
    switch (mood) {
      case PetMood.VERY_HAPPY:
        return "😄";
      case PetMood.HAPPY:
        return "😊";
      case PetMood.NEUTRAL:
        return "😐";
      case PetMood.SAD:
        return "😢";
      case PetMood.VERY_SAD:
        return "😭";
      default:
        return "😊";
    }
  };

  const getPetEmoji = (type: string) => {
    switch (type) {
      case "dog":
        return "🐕";
      case "cat":
        return "🐱";
      case "rabbit":
        return "🐰";
      case "bird":
        return "🐦";
      default:
        return "🐕";
    }
  };

  const getStatColor = (value: number) => {
    if (value >= 80) return "success";
    if (value >= 50) return "warning";
    return "danger";
  };

  if (pet.isAway) {
    return (
      <IonCard className="pet-card">
        <IonCardContent className="ion-text-center">
          <div style={{ fontSize: "4rem", marginBottom: "16px" }}>💨</div>
          <IonText color="danger">
            <h2>{pet.name} se ha ido</h2>
            <p>Tu mascota se fue porque no la cuidaste bien</p>
          </IonText>
          {showActions && onRecover && (
            <IonButton
              fill="solid"
              color="primary"
              onClick={onRecover}
              className="animated-button"
              style={{ marginTop: "16px" }}
            >
              <IonIcon icon={home} slot="start" />
              Traer de vuelta
            </IonButton>
          )}
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonCard className="pet-card">
      <IonCardContent>
        <div className="ion-text-center" style={{ marginBottom: "20px" }}>
          <div
            style={{ fontSize: "5rem", marginBottom: "8px" }}
            className={`pet-mood-${pet.currentMood.replace(
              "_",
              "-"
            )} pulse-animation`}
          >
            {getPetEmoji(pet.type)}
          </div>
          <IonText>
            <h2>{pet.name}</h2>
          </IonText>
          <IonChip color="primary">
            <IonIcon icon={star} />
            <IonLabel>Nivel {pet.level}</IonLabel>
          </IonChip>
          <div style={{ fontSize: "2rem", margin: "8px 0" }}>
            {getMoodEmoji(pet.currentMood)}
          </div>
        </div>

        {/* Estadísticas */}
        <div style={{ marginBottom: "20px" }}>
          <IonRow
            className="ion-align-items-center"
            style={{ marginBottom: "12px" }}
          >
            <IonCol size="2">
              <IonIcon icon={heart} color={getStatColor(pet.happiness)} />
            </IonCol>
            <IonCol size="6">
              <IonText>
                <small>Felicidad</small>
              </IonText>
            </IonCol>
            <IonCol size="4" className="ion-text-end">
              <IonText>
                <small>{pet.happiness}%</small>
              </IonText>
            </IonCol>
          </IonRow>
          <IonProgressBar
            value={pet.happiness / 100}
            color={getStatColor(pet.happiness)}
          />

          <IonRow
            className="ion-align-items-center"
            style={{ marginBottom: "12px", marginTop: "12px" }}
          >
            <IonCol size="2">
              <IonIcon icon={happy} color={getStatColor(pet.health)} />
            </IonCol>
            <IonCol size="6">
              <IonText>
                <small>Salud</small>
              </IonText>
            </IonCol>
            <IonCol size="4" className="ion-text-end">
              <IonText>
                <small>{pet.health}%</small>
              </IonText>
            </IonCol>
          </IonRow>
          <IonProgressBar
            value={pet.health / 100}
            color={getStatColor(pet.health)}
          />

          <IonRow
            className="ion-align-items-center"
            style={{ marginBottom: "12px", marginTop: "12px" }}
          >
            <IonCol size="2">
              <IonIcon icon={flash} color={getStatColor(pet.energy)} />
            </IonCol>
            <IonCol size="6">
              <IonText>
                <small>Energía</small>
              </IonText>
            </IonCol>
            <IonCol size="4" className="ion-text-end">
              <IonText>
                <small>{pet.energy}%</small>
              </IonText>
            </IonCol>
          </IonRow>
          <IonProgressBar
            value={pet.energy / 100}
            color={getStatColor(pet.energy)}
          />
        </div>

        {/* Barra de experiencia */}
        <div style={{ marginBottom: "20px" }}>
          <IonRow
            className="ion-align-items-center"
            style={{ marginBottom: "8px" }}
          >
            <IonCol>
              <IonText>
                <small>Experiencia: {pet.experience}/100</small>
              </IonText>
            </IonCol>
          </IonRow>
          <IonProgressBar value={pet.experience / 100} color="tertiary" />
        </div>

        {/* Acciones */}
        {showActions && (
          <IonRow>
            <IonCol size="6">
              <IonButton
                fill="outline"
                expand="block"
                onClick={onFeed}
                disabled={!onFeed}
                className="animated-button"
              >
                <IonIcon icon={restaurant} slot="start" />
                Alimentar
              </IonButton>
            </IonCol>
            <IonCol size="6">
              <IonButton
                fill="outline"
                expand="block"
                onClick={onPlay}
                disabled={!onPlay || pet.energy < 10}
                className="animated-button"
              >
                <IonIcon icon={gameController} slot="start" />
                Jugar
              </IonButton>
            </IonCol>
          </IonRow>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default PetDisplay;
