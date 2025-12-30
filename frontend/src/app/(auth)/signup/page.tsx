"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import axios from "axios";


const signupSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      const res = await api.post("/auth/signup", data);

      login(res.data.token, res.data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            alert(err.response?.data?.message || "Login failed"); }
        else {
            alert("Something went wrong");
        }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-slate-900 p-6 rounded space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Signup</h1>

        <Input placeholder="Name" {...register("name")} />
        <Input placeholder="Email" {...register("email")} />
        <Input
          type="password"
          placeholder="Password"
          {...register("password")}
        />

        {Object.values(errors).length > 0 && (
          <p className="text-red-400 text-sm">
            Please fix the errors above
          </p>
        )}

        <button
          disabled={isSubmitting}
          className="w-full bg-emerald-600 py-2 rounded hover:bg-emerald-700"
        >
          {isSubmitting ? "Creating account..." : "Signup"}
        </button>
      </form>
    </main>
  );
}
