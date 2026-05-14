const ErrorState = ({ message }) => (
  <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 shadow-soft text-center text-rose-700">
    <p className="text-lg font-semibold">Unable to load sales</p>
    <p className="mt-2 text-sm">{message || 'Please refresh or try again later.'}</p>
  </div>
);

export default ErrorState;
