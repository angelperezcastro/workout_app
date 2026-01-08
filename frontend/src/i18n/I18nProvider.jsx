import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const I18nContext = createContext(null);

const translations = {
  es: {
    common: {
      language: "Idioma",
      spanish: "Español",
      english: "Inglés",
      loading: "Cargando...",
      save: "Guardar",
      add: "Añadir",
      remove: "Quitar",
      login: "Iniciar sesión",
      register: "Registrarse",
    },
    nav: {
    dashboard: "Panel",
    routines: "Rutinas",
    login: "Iniciar sesión",
    register: "Registrarse",
    logout: "Cerrar sesión",
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
      noRoutines:
        "Todavía no tienes ninguna rutina. Crea una con el formulario de arriba.",
    },
  },
  en: {
    common: {
      language: "Language",
      spanish: "Spanish",
      english: "English",
      loading: "Loading...",
      save: "Save",
      add: "Add",
      remove: "Remove",
      login: "Log in",
      register: "Sign up",
    },
    nav: {
    dashboard: "Dashboard",
    routines: "Routines",
    login: "Log in",
    register: "Sign up",
    logout: "Log out",
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
      noRoutines:
        "You don't have any routines yet. Create one using the form above.",
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
