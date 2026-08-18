export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Header skeleton */}
      <div className="h-8 w-64 rounded-xl bg-slate-200" />

      {/* Date filter skeleton */}
      <div className="h-14 w-full rounded-2xl bg-white border border-slate-200/60 p-3" />

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-white p-5 border border-slate-200/60 flex flex-col justify-between">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-8 w-32 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="h-80 w-full rounded-2xl bg-white p-6 border border-slate-200/60 flex flex-col justify-between">
        <div className="h-6 w-48 rounded bg-slate-200" />
        <div className="h-56 w-full rounded bg-slate-100" />
      </div>
    </div>
  );
}
