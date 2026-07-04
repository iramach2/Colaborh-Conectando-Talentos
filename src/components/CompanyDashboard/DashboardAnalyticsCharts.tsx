import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type ChartPoint = {
  name: string;
  applications: number;
};

export type DistributionPoint = {
  name: string;
  value: number;
  color: string;
};

type DashboardAnalyticsChartsProps = {
  applicationData: ChartPoint[];
  vacancyDistribution: DistributionPoint[];
  totalApplications: number;
};

const chartColors = ['#940dff', '#63e1a5', '#ffc24b', '#ff4b8c', '#533af6'];

const chartCardClass = 'rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]';

export const DashboardAnalyticsCharts = ({
  applicationData,
  vacancyDistribution,
  totalApplications,
}: DashboardAnalyticsChartsProps) => (
  <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.65fr)]">
    <section className={`${chartCardClass} flex min-h-[330px] flex-col`}>
      <div className="mb-5 flex flex-col gap-3 text-left sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-[20px] font-semibold tracking-tight text-[#343241]">Evolução de candidaturas</h3>
          <p className="mt-1 text-[12px] font-medium text-slate-400">Novos candidatos recebidos nos últimos 7 dias.</p>
        </div>
        <span className="inline-flex h-8 shrink-0 items-center rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-3 text-[12px] font-semibold text-[#940dff]">
          {totalApplications} no funil
        </span>
      </div>

      <div className="min-h-[240px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={applicationData} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="dashboardApplicationsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#940dff" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#940dff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee8f7" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fontWeight: 500, fill: '#94a3b8' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fontWeight: 500, fill: '#94a3b8' }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '14px',
                border: '1px solid rgba(226,232,240,0.9)',
                boxShadow: '0 18px 50px rgba(57,39,96,0.10)',
                padding: '10px 14px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#343241', fontWeight: 600 }}
              itemStyle={{ color: '#940dff', fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="applications"
              name="Candidaturas"
              stroke="#940dff"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#dashboardApplicationsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>

    <section className={`${chartCardClass} flex min-h-[330px] flex-col`}>
      <div className="mb-4 text-left">
        <h3 className="text-[20px] font-semibold tracking-tight text-[#343241]">Status do funil</h3>
        <p className="mt-1 text-[12px] font-medium text-slate-400">Participação por etapa do processo.</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={vacancyDistribution}
                cx="50%"
                cy="50%"
                innerRadius={54}
                outerRadius={78}
                paddingAngle={5}
                dataKey="value"
              >
                {vacancyDistribution.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={entry.color || chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '14px', border: '1px solid rgba(226,232,240,0.9)', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[24px] font-semibold leading-none text-[#343241]">{totalApplications}</span>
            <span className="mt-1 text-[10px] font-medium text-slate-400">candidatos</span>
          </div>
        </div>

        <div className="mt-5 w-full space-y-3">
          {vacancyDistribution.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between gap-3 text-[12px] font-medium">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color || chartColors[index % chartColors.length] }}
                />
                <span className="truncate text-slate-500">{item.name}</span>
              </div>
              <span className="font-semibold text-[#343241]">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);