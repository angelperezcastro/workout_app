import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

function RoutineCard({ routine }) {
  const { name, description } = routine;
  const { t } = useI18n();

  return (
    <Link to={`/routines/${routine._id}`}>
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 hover:bg-slate-800 transition cursor-pointer space-y-2">
        <h3 className="text-lg font-semibold">{name}</h3>

        {description && (
          <p className="text-sm text-slate-300 line-clamp-2">{description}</p>
        )}

        <p className="text-xs text-slate-400">{t("routines.clickForDetails")}</p>
      </div>
    </Link>
  );
}

export default RoutineCard;
