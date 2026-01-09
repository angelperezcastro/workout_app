import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const I18nContext = createContext(null);

const translations = {
  es: {
    common: {
      loading: "Cargando...",
      save: "Guardar",
      add: "Añadir",
      remove: "Quitar",
      back: "Volver",
      yes: "Sí",
      no: "No",
    },
    nav: {
      dashboard: "Panel",
      routines: "Rutinas",
      login: "Iniciar sesión",
      register: "Registrarse",
      logout: "Cerrar sesión",
    },
    languageToggle: {
      title: "Cambiar idioma",
    },

    // ✅ Actualizado para el Dashboard REAL
    dashboard: {
      title: "Panel",
      subtitle: "Inicia una rutina y registra tu sesión con tiempo y series completadas.",
      startRoutineBtn: "Iniciar rutina",

      modalTitle: "Elige una rutina",
      modalSubtitle: "Selecciona la rutina que vas a entrenar.",
      loadingRoutines: "Cargando rutinas...",
      noRoutines: "Aún no tienes rutinas creadas. Ve a “Rutinas” y crea una primero.",

      completedRoutines: "Rutinas completadas",
      totalTime: "Tiempo total",
      hoursShort: "h",
      minutesShort: "m",

    },

    workoutRun: {
      loading: "Cargando rutina...",
      loadFail: "No se pudo cargar la rutina",
      notFound: "Rutina no encontrada",
      saveFail: "No se pudo guardar la sesión",

      time: "Tiempo",
      setsLabel: "Series",

      set: "Serie",
      finishBtn: "Finalizar rutina",
    },


    auth: {
      loginTitle: "Iniciar sesión",
      loginSubtitle: "Accede a tu panel de entrenamientos.",
      email: "Email",
      password: "Contraseña",
      loggingIn: "Entrando...",
      loginBtn: "Entrar",
      noAccount: "¿No tienes cuenta?",
      signupHere: "Regístrate aquí",

      registerTitle: "Crear cuenta",
      registerSubtitle: "Registra tu cuenta para empezar a guardar tus rutinas.",
      name: "Nombre",
      creatingAccount: "Creando cuenta...",
      registerBtn: "Registrarse",
      haveAccount: "¿Ya tienes cuenta?",
      signIn: "Inicia sesión",
    },
    notFound: {
      text: "La página que buscas no existe.",
      backToDashboard: "Volver al panel",
    },
    routines: {
      loading: "Cargando rutinas...",
      loadError: "Error al cargar los datos",
      exerciseFallback: "Ejercicio",

      title: "Rutinas",
      subtitle:
        "Crea rutinas eligiendo ejercicios de tu catálogo y definiendo series, repeticiones y peso.",

      createTitle: "Crear nueva rutina",

      nameLabel: "Nombre de la rutina *",
      namePlaceholder: "Ej. Full body, Push/Pull, Pierna...",

      descriptionLabel: "Descripción (opcional)",
      descriptionPlaceholder: "Breve descripción de la rutina",

      routineExercisesTitle: "Ejercicios de la rutina",
      noCatalog:
        "Aún no tienes ejercicios en tu catálogo. Crea algunos desde el backend (colección exercises) para poder añadirlos aquí.",

      exerciseLabel: "Ejercicio",
      selectExercise: "Selecciona ejercicio",

      sets: "Series",
      reps: "Reps",
      weightKg: "Peso (kg)",

      add: "Añadir",
      remove: "Quitar",

      formErrorSelectExercise: "Selecciona un ejercicio",
      formErrorSetsReps: "Indica series y repeticiones",
      formErrorDuplicate: "Ese ejercicio con esos datos ya está añadido",
      formErrorNameRequired: "El nombre de la rutina es obligatorio",
      formErrorAtLeastOne: "Añade al menos un ejercicio a la rutina",
      formErrorCreateFail: "No se pudo crear la rutina",

      creating: "Creando rutina...",
      saveRoutine: "Guardar rutina",

      yourRoutines: "Tus rutinas",
      noRoutines: "Todavía no tienes ninguna rutina. Crea una con el formulario de arriba.",

      clickForDetails: "Haz clic para ver detalles",
    },
    routineDetail: {
      loading: "Cargando rutina...",
      loadFail: "No se pudo cargar la rutina",
      notFound: "Rutina no encontrada",
      exercisesTitle: "Ejercicios",
      noExercises: "Esta rutina no tiene ejercicios.",
      series: "series",
      reps: "reps",
      noSetsAssigned: "Este ejercicio no tiene series asignadas.",
    },
    errors: {
      loginFailed: "Error al iniciar sesión",
      registerFailed: "Error al registrarse",
      noTokenFromServer: "El servidor no devolvió un token.",
      requestFailed: "Request failed",
    },
  },

  en: {
    common: {
      loading: "Loading...",
      save: "Save",
      add: "Add",
      remove: "Remove",
      back: "Back",
      yes: "Yes",
      no: "No",
    },
    nav: {
      dashboard: "Dashboard",
      routines: "Routines",
      login: "Log in",
      register: "Sign up",
      logout: "Log out",
    },
    languageToggle: {
      title: "Toggle language",
    },

    // ✅ Updated for the REAL Dashboard
    dashboard: {
      title: "Dashboard",
      subtitle: "Start a routine and log your session with time and completed sets.",
      startRoutineBtn: "Start routine",

      modalTitle: "Choose a routine",
      modalSubtitle: "Select the routine you’re going to train.",
      loadingRoutines: "Loading routines...",
      noRoutines: "You don’t have any routines yet. Go to “Routines” and create one first.",

      completedRoutines: "Completed routines",
      totalTime: "Total time",
      hoursShort: "h",
      minutesShort: "m",

    },

    workoutRun: {
      loading: "Loading routine...",
      loadFail: "Could not load the routine",
      notFound: "Routine not found",
      saveFail: "Could not save the session",

      time: "Time",
      setsLabel: "Sets",

      set: "Set",
      finishBtn: "Finish workout",
    },


    auth: {
      loginTitle: "Log in",
      loginSubtitle: "Access your training dashboard.",
      email: "Email",
      password: "Password",
      loggingIn: "Logging in...",
      loginBtn: "Log in",
      noAccount: "Don’t have an account?",
      signupHere: "Sign up here",

      registerTitle: "Create account",
      registerSubtitle: "Create your account to start saving your routines.",
      name: "Name",
      creatingAccount: "Creating account...",
      registerBtn: "Sign up",
      haveAccount: "Already have an account?",
      signIn: "Log in",
    },
    notFound: {
      text: "The page you’re looking for doesn’t exist.",
      backToDashboard: "Back to dashboard",
    },
    routines: {
      loading: "Loading routines...",
      loadError: "Error loading data",
      exerciseFallback: "Exercise",

      title: "Routines",
      subtitle:
        "Create routines by choosing exercises from your catalog and defining sets, reps and weight.",

      createTitle: "Create new routine",

      nameLabel: "Routine name *",
      namePlaceholder: "e.g. Full body, Push/Pull, Legs...",

      descriptionLabel: "Description (optional)",
      descriptionPlaceholder: "Short routine description",

      routineExercisesTitle: "Routine exercises",
      noCatalog:
        "You don't have any exercises in your catalog yet. Create some from the backend (exercises collection) to add them here.",

      exerciseLabel: "Exercise",
      selectExercise: "Select exercise",

      sets: "Sets",
      reps: "Reps",
      weightKg: "Weight (kg)",

      add: "Add",
      remove: "Remove",

      formErrorSelectExercise: "Select an exercise",
      formErrorSetsReps: "Enter sets and reps",
      formErrorDuplicate: "That exercise with those values is already added",
      formErrorNameRequired: "Routine name is required",
      formErrorAtLeastOne: "Add at least one exercise to the routine",
      formErrorCreateFail: "Could not create the routine",

      creating: "Creating routine...",
      saveRoutine: "Save routine",

      yourRoutines: "Your routines",
      noRoutines: "You don't have any routines yet. Create one using the form above.",

      clickForDetails: "Click to view details",
    },
    routineDetail: {
      loading: "Loading routine...",
      loadFail: "Could not load the routine",
      notFound: "Routine not found",
      exercisesTitle: "Exercises",
      noExercises: "This routine has no exercises.",
      series: "sets",
      reps: "reps",
      noSetsAssigned: "This exercise has no assigned sets.",
    },
    errors: {
      loginFailed: "Login failed",
      registerFailed: "Sign up failed",
      noTokenFromServer: "Server did not return a token.",
      requestFailed: "Request failed",
    },
  },
};

// helper: "routines.title" => translations[lang].routines.title
function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "es");

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const value = useMemo(() => {
    const t = (key) => getByPath(translations[lang], key) ?? key;
    const toggleLang = () => setLang((prev) => (prev === "es" ? "en" : "es"));
    return { lang, setLang, toggleLang, t };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider />");
  return ctx;
}
