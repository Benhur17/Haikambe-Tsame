import React from "react";

const StatCard = ({ title, value, icon: Icon, color = "primary", subtitle, trend }) => {
  const colorClasses = {
    primary: "from-[var(--color-accent)] to-[var(--color-accent-secondary)]",
    secondary: "from-[var(--color-info)] to-[#3b82f6]",
    success: "from-[var(--color-success)] to-[#10b981]",
    warning: "from-[var(--color-warning)] to-[#f59e0b]",
    error: "from-[var(--color-error)] to-[#ef4444]",
    purple: "from-purple-500 to-purple-600",
    indigo: "from-indigo-500 to-indigo-600"
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-all scale-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              {title}
            </p>
            {trend && (
              <span className={`text-xs font-semibold ${trend.positive ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                {trend.value}
              </span>
            )}
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mt-2">
            {value}
          </h3>
          {subtitle && (
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg`}>
            <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
