import { useI18n } from "../i18n/I18nProvider";

function Dashboard() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">{t("dashboard.title")}</h1>
      <p className="text-slate-300">{t("dashboard.subtitle")}</p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">{t("dashboard.sessionsThisWeek")}</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">{t("dashboard.activeRoutines")}</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">{t("dashboard.totalSets")}</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
