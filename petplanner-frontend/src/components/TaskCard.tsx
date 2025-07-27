import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonIcon,
  IonText,
  IonChip,
  IonLabel,
  IonButton,
  IonRow,
  IonCol,
  IonItem,
} from "@ionic/react";
import { calendar, star, ellipsisVertical, time } from "ionicons/icons";
import { Task, TaskPriority } from "../types";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { es } from "date-fns/locale";
import "./TaskCard.css"; // Importar los estilos

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  showActions?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "danger";
      case TaskPriority.MEDIUM:
        return "warning";
      case TaskPriority.LOW:
        return "success";
      default:
        return "medium";
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "Alta";
      case TaskPriority.MEDIUM:
        return "Media";
      case TaskPriority.LOW:
        return "Baja";
      default:
        return "Media";
    }
  };

  const getPriorityChipClass = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "priority-chip-high";
      case TaskPriority.MEDIUM:
        return "priority-chip-medium";
      case TaskPriority.LOW:
        return "priority-chip-low";
      default:
        return "priority-chip-medium";
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "Diaria";
      case "weekly":
        return "Semanal";
      case "monthly":
        return "Mensual";
      default:
        return "Una vez";
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);

    if (isToday(date)) {
      return "Hoy";
    } else if (isTomorrow(date)) {
      return "Mañana";
    } else {
      return format(date, "dd MMM", { locale: es });
    }
  };

  const isOverdue =
    task.dueDate && isPast(new Date(task.dueDate)) && !task.isCompleted;

  return (
    <IonCard
      className={`task-card ${task.isCompleted ? "task-completed" : ""}`}
      style={{
        borderLeft: `4px solid var(--ion-color-${getPriorityColor(
          task.priority
        )})`,
      }}
    >
      <IonCardContent>
        <IonItem lines="none">
          <IonCheckbox
            slot="start"
            checked={task.isCompleted}
            onIonChange={() =>
              onComplete && !task.isCompleted && onComplete(task.id)
            }
            disabled={task.isCompleted}
          />

          <div style={{ flex: 1 }}>
            <IonText>
              <h3
                className={`task-title ${task.isCompleted ? "completed" : ""}`}
              >
                {task.title}
              </h3>
            </IonText>

            {task.description && (
              <IonText>
                <p className="task-description">{task.description}</p>
              </IonText>
            )}

            <div className="task-chips">
              <IonChip
                className="custom-chip category-chip"
                style={{
                  backgroundColor: task.category.color + "20",
                  color: task.category.color,
                  borderColor: task.category.color,
                }}
              >
                <IonLabel>{task.category.name}</IonLabel>
              </IonChip>

              <IonChip
                className={`custom-chip ${getPriorityChipClass(task.priority)}`}
              >
                <IonLabel>{getPriorityLabel(task.priority)}</IonLabel>
              </IonChip>

              {task.frequency !== "once" && (
                <IonChip className="custom-chip frequency-chip">
                  <IonLabel>{getFrequencyLabel(task.frequency)}</IonLabel>
                </IonChip>
              )}
            </div>

            <IonRow className="ion-align-items-center task-info">
              <IonCol size="auto">
                {task.dueDate && (
                  <div className="task-info-item">
                    <IonIcon
                      icon={calendar}
                      size="small"
                      color={isOverdue ? "danger" : "medium"}
                    />
                    <IonText color={isOverdue ? "danger" : "medium"}>
                      <small>{formatDueDate(task.dueDate)}</small>
                    </IonText>
                  </div>
                )}
              </IonCol>

              <IonCol size="auto">
                <div className="task-info-item points-info">
                  <IonIcon icon={star} size="small" />
                  <IonText>
                    <small>{task.pointsReward} pts</small>
                  </IonText>
                </div>
              </IonCol>

              {showActions && (
                <IonCol className="ion-text-end task-actions">
                  <IonButton
                    fill="clear"
                    size="small"
                    className="action-button"
                    onClick={() => onEdit && onEdit(task)}
                  >
                    <IonIcon icon={ellipsisVertical} />
                  </IonButton>
                </IonCol>
              )}
            </IonRow>

            {task.isCompleted && task.completedAt && (
              <div className="completion-info">
                <IonIcon icon={time} size="small" />
                <IonText>
                  <small>
                    Completada{" "}
                    {format(new Date(task.completedAt), "dd/MM/yyyy HH:mm")}
                  </small>
                </IonText>
              </div>
            )}
          </div>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
};

export default TaskCard;
