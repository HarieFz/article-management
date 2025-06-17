import AlertError from "@/components/AlertError";
import AlertSuccess from "@/components/AlertSuccess";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { queryClient } from "@/network/config/queryClient";
import { ArticlesService } from "@/network/services/articles.service";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";

export default function DialogDelete({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { id: string }) => {
      return ArticlesService.delete(data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      setOpen(false);
      setShowSuccessAlert(true);
    },
    onError: (error) => {
      setShowErrorAlert(true);
      console.log(error);
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger onClick={() => setOpen(true)} asChild>
          <Button variant="link" className="text-red-600 hover:text-red-700 underline underline-offset-2">
            Delete
          </Button>
        </DialogTrigger>

        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="font-semibold text-xl text-slate-900">Delete Article</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Deleting this article is permanent and cannot be undone. All related content will be removed.
            </DialogDescription>
          </DialogHeader>
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
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 h-10 !px-4 !py-2.5"
              disabled={isPending}
              onClick={() => mutate({ id })}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="animate-spin" /> Loading
                </span>
              ) : (
                "Delete"
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
