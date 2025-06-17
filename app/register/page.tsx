"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../public/images/logo-v1.png";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AuthService, RegisterRequest, RegisterResponse } from "@/network/services/auth.service";
import { useRouter } from "next/navigation";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import AlertError from "@/components/AlertError";
import AlertSuccess from "@/components/AlertSuccess";

const schema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
  role: z.string().min(1, "Password is required."),
});

const initialState = {
  username: "",
  password: "",
  role: "",
};

export default function Register() {
  const router = useRouter();
  const [isShow, setIsShow] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialState,
  });

  const {
    mutate: signUp,
    isPending,
    error,
  } = useMutation({
    mutationFn: (data: RegisterRequest) => {
      return AuthService.register(data);
    },
    onSuccess: () => {
      setShowSuccessAlert(true);
      router.push("/");
    },
    onError: (error) => {
      setShowErrorAlert(true);
      console.log(error);
    },
  });

  const handleSignUp = (data: RegisterRequest) => {
    signUp({
      username: data.username,
      password: data.password,
      role: data.role,
    });
  };

  return (
    <div className="sm:bg-gray-100 w-full h-dvh flex items-center justify-center max-sm:px-4">
      <div className="sm:bg-white sm:rounded-[12px] sm:max-w-[400px] w-full h-fit sm:px-4 sm:py-10 px-2.5 py-6">
        <div className="flex justify-center mb-6">
          <Image src={Logo} alt="Logo" width={0} height={0} sizes="100vw" className="w-[134px] h-6" priority />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignUp)} className="w-full mb-6">
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
            <div className="flex flex-col gap-1 mb-6">
              <Label>Role</Label>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
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
                "Register"
              )}
            </Button>
          </form>
        </Form>

        <div className="flex justify-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {showSuccessAlert && (
        <AlertSuccess message="Registration successful." duration={3000} onClose={() => setShowErrorAlert(false)} />
      )}

      {showErrorAlert && (
        <AlertError message={error?.message} duration={3000} onClose={() => setShowErrorAlert(false)} />
      )}
    </div>
  );
}
