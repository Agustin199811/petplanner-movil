import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonSplitPane,
  IonLoading,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/* Pages */
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tabs from "./components/Tabs";
import ProtectedRoute from "./components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppStore } from "./store/appStore";

setupIonicReact();

// Crear cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    checkAuth,
    fetchCategories,
    fetchTodayTasks,
    fetchPetStatus,
    setLoading,
  } = useAppStore();

  useEffect(() => {
    checkAuth(false); // No activar loading en checkAuth aquí
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Cargar datos iniciales cuando el usuario está autenticado
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadInitialData = async () => {
      try {
        console.log("Cargando datos iniciales...");
        setLoading(true);

        await Promise.all([
          fetchCategories().then(() => console.log("Categorías cargadas")),
          fetchTodayTasks().then(() => console.log("Tareas de hoy cargadas")),
          fetchPetStatus().then(() => console.log("Estado de mascota cargado")),
        ]);

        console.log("Datos iniciales cargados correctamente");
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [
    isAuthenticated,
    setLoading,
    fetchCategories,
    fetchTodayTasks,
    fetchPetStatus,
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <IonRouterOutlet id="main">
              {/* Rutas públicas */}
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />

              {/* Rutas protegidas */}
              <ProtectedRoute path="/tabs" component={Tabs} />

              
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>

      </IonApp>
    </QueryClientProvider>
  );
};

export default App;
