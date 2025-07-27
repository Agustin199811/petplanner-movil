import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonCard,
  IonCardContent,
  IonText,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonToggle,
  IonToast,
  IonLoading,
} from "@ionic/react";
import {
  checkmark,
  calendar,
  pricetag,
  repeat,
  flag,
  star,
} from "ionicons/icons";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TaskForm, TaskPriority, TaskFrequency } from "../types";
import { format } from "date-fns";
import { useAppStore } from "../store/appStore";
import "./CreateTask.css";
interface CreateTaskParams {
  taskId?: string;
}

const CreateTask: React.FC = () => {
  const history = useHistory();
  const { taskId } = useParams<CreateTaskParams>();
  const isEditing = !!taskId;

  const {
    tasks,
    categories,
    isLoading,
    error,
    createTask,
    updateTask,
    fetchCategories,
    clearError,
  } = useAppStore();

  const [showToast, setShowToast] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasCustomPoints, setHasCustomPoints] = useState(false);
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<TaskForm>();

  const selectedCategoryId = watch("categoryId");
  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditing && taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        reset({
          title: task.title,
          description: task.description || "",
          priority: task.priority,
          frequency: task.frequency,
          categoryId: task.category.id,
          dueDate: task.dueDate
            ? format(new Date(task.dueDate), "yyyy-MM-dd'T'HH:mm")
            : "",
          pointsReward: task.pointsReward,
        });
        setHasCustomPoints(task.pointsReward !== task.category.pointsReward);
      }
    }
  }, [isEditing, taskId, tasks, reset]);

  useEffect(() => {
    if (error) {
      setShowToast(true);
    }
  }, [error]);

  useEffect(() => {
    if (selectedCategory && !hasCustomPoints) {
      setValue("pointsReward", selectedCategory.pointsReward);
    }
  }, [selectedCategory, hasCustomPoints, setValue]);

  const onSubmit = async (data: TaskForm) => {
    try {
      const taskData = {
        ...data,
        dueDate: data.dueDate
          ? new Date(data.dueDate).toISOString()
          : undefined,
        pointsReward: hasCustomPoints
          ? data.pointsReward
          : selectedCategory?.pointsReward,
      };

      if (isEditing && taskId) {
        await updateTask(taskId, taskData);
      } else {
        await createTask(taskData);
      }

      setShowSuccess(true);
      setTimeout(() => {
        history.goBack();
      }, 1500);
    } catch (err) {
      // Error manejado por el store
    }
  };

  const priorityOptions = [
    { value: TaskPriority.LOW, label: "Baja", color: "success", icon: "🟢" },
    {
      value: TaskPriority.MEDIUM,
      label: "Media",
      color: "warning",
      icon: "🟡",
    },
    { value: TaskPriority.HIGH, label: "Alta", color: "danger", icon: "🔴" },
  ];

  const frequencyOptions = [
    { value: TaskFrequency.ONCE, label: "Una vez", icon: "1️⃣" },
    { value: TaskFrequency.DAILY, label: "Diaria", icon: "🔄" },
    { value: TaskFrequency.WEEKLY, label: "Semanal", icon: "📅" },
    { value: TaskFrequency.MONTHLY, label: "Mensual", icon: "🗓️" },
  ];

  return (
    <IonPage className="create-task-page">
      <IonHeader className="custom-header">
        <IonToolbar className="gradient-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/tasks" className="back-button" />
          </IonButtons>
          <IonTitle className="header-title">
            {isEditing ? "Editar Tarea" : "Nueva Tarea"}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="main-content">
        <div className="content-wrapper">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Card de información básica */}
            <div className="form-card">
              <div className="card-header">
                <div className="header-icon">
                  <IonIcon icon={checkmark} />
                </div>
                <h2>Información básica</h2>
              </div>

              <div className="form-group">
                <IonItem className="custom-item">
                  <IonLabel position="stacked" className="custom-label">
                    Título *
                  </IonLabel>
                  <IonInput
                    placeholder="¿Qué necesitas hacer?"
                    className="custom-input"
                    {...register("title", {
                      required: "El título es requerido",
                      minLength: {
                        value: 3,
                        message: "Mínimo 3 caracteres",
                      },
                    })}
                  />
                </IonItem>
                {errors.title && (
                  <div className="error-message">{errors.title.message}</div>
                )}
              </div>

              <div className="form-group">
                <IonItem className="custom-item">
                  <IonLabel position="stacked" className="custom-label">
                    Descripción
                  </IonLabel>
                  <IonTextarea
                    placeholder="Detalles adicionales (opcional)"
                    className="custom-textarea"
                    rows={3}
                    {...register("description")}
                  />
                </IonItem>
              </div>

              <div className="form-group">
                <IonItem className="custom-item">
                  <IonLabel position="stacked" className="custom-label">
                    Categoría *
                  </IonLabel>
                  <IonSelect
                    placeholder="Selecciona una categoría"
                    className="custom-select"
                    {...register("categoryId", {
                      required: "Selecciona una categoría",
                    })}
                  >
                    {categories.map((category) => (
                      <IonSelectOption key={category.id} value={category.id}>
                        {category.name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                {errors.categoryId && (
                  <div className="error-message">
                    {errors.categoryId.message}
                  </div>
                )}
              </div>
            </div>

            {/* Card de configuración */}
            <div className="form-card">
              <div className="card-header">
                <div className="header-icon secondary">
                  <IonIcon icon={flag} />
                </div>
                <h2>Configuración</h2>
              </div>

              <div className="form-group">
                <IonItem className="custom-item">
                  <IonLabel position="stacked" className="custom-label">
                    Prioridad
                  </IonLabel>
                  <IonSelect
                    placeholder="Selecciona prioridad"
                    className="custom-select"
                    {...register("priority", {
                      required: "Selecciona una prioridad",
                    })}
                  >
                    {priorityOptions.map((option) => (
                      <IonSelectOption key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </div>

              <div className="form-group">
                <IonItem className="custom-item">
                  <IonLabel position="stacked" className="custom-label">
                    Frecuencia
                  </IonLabel>
                  <IonSelect
                    placeholder="¿Cada cuánto?"
                    className="custom-select"
                    {...register("frequency", {
                      required: "Selecciona la frecuencia",
                    })}
                  >
                    {frequencyOptions.map((option) => (
                      <IonSelectOption key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </div>

              <div className="form-group">
                <IonItem className="custom-item">
                  <IonIcon icon={calendar} slot="start" />
                  <IonLabel position="stacked" className="custom-label">
                    Fecha límite (opcional)
                  </IonLabel>
                  <IonDatetime
                    presentation="date-time"
                    min={new Date().toISOString()}
                    value={dueDate}
                    onIonChange={(e) =>
                      setDueDate(
                        typeof e.detail.value === "string"
                          ? e.detail.value
                          : undefined
                      )
                    }
                  />
                </IonItem>
              </div>

              {/* Puntos personalizados */}
              <div className="points-section">
                <IonItem lines="none" className="points-toggle">
                  <div className="points-icon">
                    <IonIcon icon={star} />
                  </div>
                  <IonLabel>
                    <h3>Puntos personalizados</h3>
                    <p>
                      Por defecto: {selectedCategory?.pointsReward || 10} puntos
                    </p>
                  </IonLabel>
                  <IonToggle
                    checked={hasCustomPoints}
                    onIonChange={(e) => setHasCustomPoints(e.detail.checked)}
                  />
                </IonItem>

                {hasCustomPoints && (
                  <div className="custom-points-input">
                    <IonItem className="custom-item">
                      <IonLabel position="stacked" className="custom-label">
                        Puntos de recompensa
                      </IonLabel>
                      <IonInput
                        type="number"
                        min="1"
                        max="100"
                        placeholder="10"
                        className="custom-input"
                        {...register("pointsReward", {
                          min: { value: 1, message: "Mínimo 1 punto" },
                          max: { value: 100, message: "Máximo 100 puntos" },
                        })}
                      />
                    </IonItem>
                    {errors.pointsReward && (
                      <div className="error-message">
                        {errors.pointsReward.message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Vista previa */}
            {selectedCategory && (
              <div className="preview-card">
                <h3>Vista previa</h3>
                <div className="preview-content">
                  <div className="category-indicator">
                    <div
                      className="category-dot"
                      style={{ backgroundColor: selectedCategory.color }}
                    />
                    <span>{selectedCategory.name}</span>
                  </div>
                  <div className="points-preview">
                    Recompensa:{" "}
                    {hasCustomPoints
                      ? watch("pointsReward") || 10
                      : selectedCategory.pointsReward}{" "}
                    puntos
                  </div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="action-buttons">
              <IonButton
                expand="block"
                type="submit"
                disabled={isLoading}
                className="primary-button"
              >
                <IonIcon icon={checkmark} slot="start" />
                {isEditing ? "Actualizar Tarea" : "Crear Tarea"}
              </IonButton>

              <IonButton
                expand="block"
                fill="clear"
                onClick={() => history.goBack()}
                disabled={isLoading}
                className="secondary-button"
              >
                Cancelar
              </IonButton>
            </div>
          </form>
        </div>

        <IonLoading isOpen={isLoading} message="Guardando tarea..." />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => {
            setShowToast(false);
            clearError();
          }}
          message={error || "Error al guardar tarea"}
          duration={3000}
          color="danger"
          position="top"
        />

        <IonToast
          isOpen={showSuccess}
          onDidDismiss={() => setShowSuccess(false)}
          message={
            isEditing
              ? "Tarea actualizada exitosamente"
              : "Tarea creada exitosamente"
          }
          duration={1500}
          color="success"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default CreateTask;
