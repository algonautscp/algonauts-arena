type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
