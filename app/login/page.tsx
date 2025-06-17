"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../public/images/logo-v1.png";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AuthService, LoginRequest, LoginResponse } from "@/network/services/auth.service";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { encrypt } from "@/lib/crypto";
import AlertError from "@/components/AlertError";

const schema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

const initialState = {
  username: "",
  password: "",
};

export default function Login() {
  const router = useRouter();
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialState,
  });

  const {
    mutate: signIn,
    isPending,
    error,
  } = useMutation({
    mutationFn: (data: LoginRequest) => {
      return AuthService.login(data);
    },
    onSuccess: (data: LoginResponse) => {
      setCookie("token", encrypt({ token: data.token, role: data.role }), {
        maxAge: 60 * 60 * 24,
      });
      setCookie("password", encrypt({ password: form.watch().password }));
      if (data.role === "Admin") {
        router.push("/admin/articles");
      } else if (data.role === "User") {
        router.push("/");
      } else {
        return;
      }
    },
    onError: (error) => {
      setShowErrorAlert(true);
      console.error(error);
    },
  });

  const handleSignIn = (data: LoginRequest) => {
    signIn({
      username: data.username,
      password: data.password,
    });
  };

  return (
    <div className="sm:bg-gray-100 w-full h-dvh flex items-center justify-center max-sm:px-4">
      <div className="sm:bg-white sm:rounded-[12px] sm:max-w-[400px] w-full h-fit sm:px-4 sm:py-10 px-2.5 py-6">
        <div className="flex justify-center mb-6">
          <Image src={Logo} alt="Logo" width={0} height={0} sizes="100vw" className="w-[134px] h-6" priority />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignIn)} className="w-full mb-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <div className="mb-3">
                  <Label htmlFor="username">Username</Label>
                  <Input type="text" id="username" placeholder="Input username" className="my-1" {...field} />
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <div className="mb-6">
                  <Label htmlFor="username">Password</Label>
                  <div className="relative my-1">
                    <Input type={isShow ? "text" : "password"} id="password" placeholder="Input password" {...field} />
                    <div className="w-4 h-4 absolute top-2.5 right-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-4 cursor-pointer"
                        onClick={() => setIsShow((prev) => !prev)}
                      >
                        {isShow ? (
                          <Eye size={16} className="text-slate-600" />
                        ) : (
                          <EyeOff size={16} className="text-slate-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <FormMessage />
                </div>
              )}
            />
            <Button
              variant="default"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 w-full py-2.5 cursor-pointer"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="animate-spin" /> Loading
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

        <div className="flex justify-center">
          <p className="text-sm">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-600 underline">
              Register
            </Link>
          </p>
        </div>
      </div>

      {showErrorAlert && (
        <AlertError message={error?.message} duration={3000} onClose={() => setShowErrorAlert(false)} />
      )}
    </div>
  );
}
