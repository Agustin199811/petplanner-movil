import React from "react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonBadge,
} from "@ionic/react";
import { checkboxOutline, personOutline } from "ionicons/icons";
import { Route, Redirect } from "react-router-dom";
import Tasks from "../pages/Tasks";
import Profile from "../pages/Profile";
import CreateTask from "../pages/CreateTask";
import { useAppStore } from "../store/appStore";

const Tabs: React.FC = () => {
  const { todayTasks } = useAppStore();

  // Contar tareas pendientes de hoy
  const pendingTodayTasks = todayTasks.filter(
    (task) => !task.isCompleted
  ).length;

  return (
    <IonTabs className="minimalist-tabs">
      <IonRouterOutlet>
        <Route exact path="/tabs/tasks" component={Tasks} />
        <Route exact path="/tabs/tasks/create" component={CreateTask} />
        <Route exact path="/tabs/tasks/edit/:taskId" component={CreateTask} />
        <Route exact path="/tabs/profile" component={Profile} />
        <Route exact path="/tabs">
          <Redirect to="/tabs/tasks" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="custom-tab-bar">
        <IonTabButton
          tab="tasks"
          href="/tabs/tasks"
          className="custom-tab-button"
        >
          <div className="tab-content">
            <div className="icon-container">
              <IonIcon icon={checkboxOutline} className="tab-icon" />
              {pendingTodayTasks > 0 && (
                <IonBadge className="task-badge">{pendingTodayTasks}</IonBadge>
              )}
            </div>
            <IonLabel className="tab-label">Tareas</IonLabel>
          </div>
        </IonTabButton>

        <IonTabButton
          tab="profile"
          href="/tabs/profile"
          className="custom-tab-button"
        >
          <div className="tab-content">
            <div className="icon-container">
              <IonIcon icon={personOutline} className="tab-icon" />
            </div>
            <IonLabel className="tab-label">Perfil</IonLabel>
          </div>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
