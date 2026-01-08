import { useI18n } from "../i18n/I18nProvider";

export default function LanguageToggle() {
  const { lang, toggleLang } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleLang}
      className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-sm hover:bg-slate-900"
      title="Toggle language"
    >
      {lang === "es" ? "EN" : "ES"}
    </button>
  );
}
