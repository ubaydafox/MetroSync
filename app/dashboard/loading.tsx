export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-(--text)/70 font-medium">Loading...</p>
      </div>
    </div>
  );
}
