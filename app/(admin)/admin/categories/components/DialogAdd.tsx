import AlertError from "@/components/AlertError";
import AlertSuccess from "@/components/AlertSuccess";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/network/config/queryClient";
import { CategoriesService } from "@/network/services/categories.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Category field cannot be empty"),
});

const initialState = {
  name: "",
};

export default function DialogAdd() {
  const [open, setOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialState,
  });

  const { mutate: add, isPending } = useMutation({
    mutationFn: (data: { name: string }) => {
      return CategoriesService.post(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
      form.reset();
      setShowSuccessAlert(true);
    },
    onError: (error) => {
      setShowErrorAlert(true);
      console.error(error);
    },
  });

  const handleAdd = (data: { name: string }) => {
    add({ name: data.name });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm text-white select-none"
          onClick={() => setOpen(true)}
        >
          <Plus size={20} className="text-white" /> Add Category
        </DialogTrigger>

        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="font-semibold text-xl text-slate-900 mb-6">Add Category</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAdd)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name" className="font-medium text-sm text-gray-900 mb-1">
                      Category
                    </FormLabel>
                    <FormControl>
                      <Input type="text" id="name" placeholder="Input Category" className="bg-white h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 !px-4 !py-2.5"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 h-10 !px-4 !py-2.5" disabled={isPending}>
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="animate-spin" /> Loading
                </span>
              ) : (
                "Add"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {showSuccessAlert && <AlertSuccess duration={3000} onClose={() => setShowErrorAlert(false)} />}

      {showErrorAlert && <AlertError duration={3000} onClose={() => setShowErrorAlert(false)} />}
    </>
  );
}
