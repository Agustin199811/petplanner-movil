import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonText,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonToast,
  IonCard,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonButton,
  IonButtons,
  IonPopover,
  IonList,
  IonCheckbox,
} from "@ionic/react";
import { add, refresh, funnel, checkmark, close } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { TaskPriority, TaskFrequency } from "../types";
import { useAppStore } from "../store/appStore";
import TaskCard from "../components/TaskCard";
import "./Tasks.css"; // Importar los estilos

type TaskFilter = "all" | "pending" | "completed";

const Tasks: React.FC = () => {
  const history = useHistory();
  const {
    tasks,
    categories,
    isLoading,
    error,
    fetchTasks,
    fetchCategories,
    completeTask,
    deleteTask,
    clearError,
  } = useAppStore();

  const [selectedFilter, setSelectedFilter] = useState<TaskFilter>("all");
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);

  // Filtros avanzados
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | "">(
    ""
  );
  const [selectedFrequency, setSelectedFrequency] = useState<
    TaskFrequency | ""
  >("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedFilter, selectedPriority, selectedFrequency, selectedCategories]);

  useEffect(() => {
    if (error) {
      setShowErrorToast(true);
    }
  }, [error]);

  const loadData = async () => {
    try {
      await Promise.all([fetchTasks(), fetchCategories()]);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };

  const applyFilters = async () => {
    const filters: any = {};

    // Filtro básico por estado
    if (selectedFilter === "pending") {
      filters.isCompleted = false;
    } else if (selectedFilter === "completed") {
      filters.isCompleted = true;
    }

    // Filtros avanzados
    if (selectedPriority) {
      filters.priority = selectedPriority;
    }
    if (selectedFrequency) {
      filters.frequency = selectedFrequency;
    }
    if (selectedCategories.length === 1) {
      filters.categoryId = selectedCategories[0];
    }

    try {
      await fetchTasks(filters);
    } catch (err) {
      console.error("Error applying filters:", err);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadData();
    event.detail.complete();
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const result = await completeTask(taskId);
      setSuccessMessage(
        `¡Tarea completada! +${result.pointsEarned} puntos ${
          result.wasOnTime ? "(Bonus)" : ""
        }`
      );
      setShowSuccessToast(true);
    } catch (err) {
      // Error ya manejado por el store
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setSuccessMessage("Tarea eliminada");
      setShowSuccessToast(true);
    } catch (err) {
      // Error ya manejado por el store
    }
  };

  const clearAllFilters = () => {
    setSelectedPriority("");
    setSelectedFrequency("");
    setSelectedCategories([]);
  };

  const getFilteredTasks = () => {
    let filteredTasks = [...tasks];

    // Filtro por categorías (cuando hay múltiples seleccionadas)
    if (selectedCategories.length > 1) {
      filteredTasks = filteredTasks.filter((task) =>
        selectedCategories.includes(task.category.id)
      );
    }

    return filteredTasks;
  };

  const renderEmptyState = () => {
    let message = "No hay tareas";
    let icon = "📝";

    if (selectedFilter === "pending") {
      message = "¡No hay tareas pendientes!";
      icon = "🎉";
    } else if (selectedFilter === "completed") {
      message = "No hay tareas completadas aún";
      icon = "⏳";
    }

    return (
      <IonCard className="empty-state-card">
        <IonCardContent className="empty-state-content">
          <div className="empty-state-icon">{icon}</div>
          <IonText>
            <h3 className="empty-state-title">{message}</h3>
            <p className="empty-state-description">
              {selectedFilter === "pending"
                ? "¡Excelente trabajo! Has completado todas tus tareas."
                : "Crea una nueva tarea para empezar."}
            </p>
          </IonText>
          {selectedFilter !== "completed" && (
            <IonButton
              className="empty-state-button"
              fill="solid"
              onClick={() => history.push("/tabs/tasks/create")}
            >
              <IonIcon icon={add} slot="start" />
              Crear tarea
            </IonButton>
          )}
        </IonCardContent>
      </IonCard>
    );
  };

  const filteredTasks = getFilteredTasks();
  const hasActiveFilters =
    selectedPriority || selectedFrequency || selectedCategories.length > 0;

  return (
    <IonPage className="tasks-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Tareas</IonTitle>
          <IonButtons slot="end">
            <IonButton
              fill="clear"
              className="filter-button"
              onClick={() => setShowFilterPopover(true)}
            >
              <IonIcon icon={funnel} />
              {hasActiveFilters && <div className="filter-indicator" />}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher
          slot="fixed"
          className="custom-refresher"
          onIonRefresh={handleRefresh}
        >
          <IonRefresherContent
            pullingIcon={refresh}
            pullingText="Desliza para actualizar"
            refreshingSpinner="circles"
            refreshingText="Actualizando..."
          />
        </IonRefresher>

        {/* Filtros básicos */}
        <IonSegment
          className="custom-segment"
          value={selectedFilter}
          onIonChange={(e) => setSelectedFilter(e.detail.value as TaskFilter)}
        >
          <IonSegmentButton value="all">
            <IonLabel>TODAS</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="pending">
            <IonLabel>PENDIENTES</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="completed">
            <IonLabel>COMPLETADAS</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* Indicador de filtros activos */}
        {hasActiveFilters && (
          <IonCard className="active-filters-card">
            <IonCardContent className="active-filters-content">
              <IonText color="primary">
                <small>Filtros activos</small>
              </IonText>
              <IonButton
                fill="clear"
                size="small"
                className="clear-filters-btn"
                onClick={clearAllFilters}
              >
                <IonIcon icon={close} />
                Limpiar
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {/* Lista de tareas */}
        <div style={{ marginBottom: "80px" }}>
          {isLoading ? (
            <div className="loading-state">
              <IonText color="medium">Cargando tareas...</IonText>
            </div>
          ) : filteredTasks.length === 0 ? (
            renderEmptyState()
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onEdit={(task) => history.push(`/tabs/tasks/edit/${task.id}`)}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>

        {/* FAB para agregar tarea */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton className="custom-fab animated-button">
            <IonIcon
              icon={add}
              onClick={() => history.push("/tabs/tasks/create")}
            />
          </IonFabButton>
        </IonFab>

        {/* Popover de filtros avanzados - CORREGIDO */}
        <IonPopover
          className="filters-popover"
          isOpen={showFilterPopover}
          onDidDismiss={() => setShowFilterPopover(false)}
          showBackdrop={true}
          // Configuraciones adicionales para mejor comportamiento
          trigger={undefined}
          alignment="center"
          side="bottom"
          // Asegurar que se centre en la pantalla
          reference="event"
        >
          <IonContent className="ion-no-padding">
            <div className="filters-content">
              {/* Header */}
              <div className="filters-header">
                <h3 className="filters-title">Filtros</h3>
                <p className="filters-subtitle">
                  Personaliza tu vista de tareas
                </p>
                {hasActiveFilters && (
                  <div className="active-filters-badge">
                    {
                      [
                        selectedPriority,
                        selectedFrequency,
                        ...selectedCategories,
                      ].filter(Boolean).length
                    }
                  </div>
                )}
              </div>

              {/* Contenido scrolleable */}
              <div className="filters-sections">
                {/* Filtros de prioridad y frecuencia */}
                <div className="filter-section">
                  <h4 className="filter-section-title">Configuración</h4>

                  <IonItem className="modern-select" lines="none">
                    <IonSelect
                      placeholder="Seleccionar prioridad"
                      value={selectedPriority}
                      onIonChange={(e) => setSelectedPriority(e.detail.value)}
                      interface="popover"
                    >
                      <IonSelectOption value="">
                        Todas las prioridades
                      </IonSelectOption>
                      <IonSelectOption value={TaskPriority.HIGH}>
                        🔴 Alta prioridad
                      </IonSelectOption>
                      <IonSelectOption value={TaskPriority.MEDIUM}>
                        🟡 Prioridad media
                      </IonSelectOption>
                      <IonSelectOption value={TaskPriority.LOW}>
                        🟢 Prioridad baja
                      </IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem className="modern-select" lines="none">
                    <IonSelect
                      placeholder="Seleccionar frecuencia"
                      value={selectedFrequency}
                      onIonChange={(e) => setSelectedFrequency(e.detail.value)}
                      interface="popover"
                    >
                      <IonSelectOption value="">
                        Todas las frecuencias
                      </IonSelectOption>
                      <IonSelectOption value={TaskFrequency.ONCE}>
                        📅 Una vez
                      </IonSelectOption>
                      <IonSelectOption value={TaskFrequency.DAILY}>
                        🔄 Diaria
                      </IonSelectOption>
                      <IonSelectOption value={TaskFrequency.WEEKLY}>
                        📆 Semanal
                      </IonSelectOption>
                      <IonSelectOption value={TaskFrequency.MONTHLY}>
                        🗓️ Mensual
                      </IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </div>

                {/* Categorías */}
                <div className="filter-section">
                  <h4 className="filter-section-title">Categorías</h4>
                  <div className="categories-grid">
                    {categories.map((category) => (
                      <IonItem
                        key={category.id}
                        className={`category-filter-item ${
                          selectedCategories.includes(category.id)
                            ? "selected"
                            : ""
                        }`}
                        button
                        lines="none"
                        onClick={() => {
                          if (selectedCategories.includes(category.id)) {
                            setSelectedCategories(
                              selectedCategories.filter(
                                (id) => id !== category.id
                              )
                            );
                          } else {
                            setSelectedCategories([
                              ...selectedCategories,
                              category.id,
                            ]);
                          }
                        }}
                      >
                        <div className="category-content">
                          <IonCheckbox
                            className="category-checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onIonChange={(e) => {
                              if (e.detail.checked) {
                                setSelectedCategories([
                                  ...selectedCategories,
                                  category.id,
                                ]);
                              } else {
                                setSelectedCategories(
                                  selectedCategories.filter(
                                    (id) => id !== category.id
                                  )
                                );
                              }
                            }}
                          />
                          <div
                            className="category-indicator"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="category-name">{category.name}</span>
                          <span className="category-count">
                            {
                              tasks.filter(
                                (task) => task.category.id === category.id
                              ).length
                            }
                          </span>
                        </div>
                      </IonItem>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botones de acción - Siempre visibles */}
              <div className="filter-actions">
                <IonButton
                  fill="outline"
                  className="filter-button-clear"
                  onClick={() => {
                    clearAllFilters();
                  }}
                >
                  <IonIcon icon={close} slot="start" />
                  Limpiar
                </IonButton>
                <IonButton
                  className="filter-button-apply"
                  onClick={() => {
                    setShowFilterPopover(false);
                  }}
                >
                  <IonIcon icon={checkmark} slot="start" />
                  Aplicar
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonPopover>

        {/* Toasts */}
        <IonToast
          className="custom-toast"
          isOpen={showSuccessToast}
          onDidDismiss={() => setShowSuccessToast(false)}
          message={successMessage}
          duration={3000}
          color="success"
          position="top"
        />

        <IonToast
          className="custom-toast"
          isOpen={showErrorToast}
          onDidDismiss={() => {
            setShowErrorToast(false);
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

export default Tasks;
