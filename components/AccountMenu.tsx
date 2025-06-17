import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
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
import { Button } from "@/components/ui/button";

import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthService } from "@/network/services/auth.service";
import { useQuery } from "@tanstack/react-query";
import { getFirstLetter } from "@/utils/getFirstLetter";

export default function AccountMenu({ textColor = "dark" }: { textColor?: "dark" | "white" }) {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => AuthService.profile(),
  });

  const handleLogout = () => {
    deleteCookie("token");
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-900">
            {getFirstLetter(data?.username)}
          </div>
          <p
            className={`sm:block hidden ${
              textColor === "dark" ? "text-slate-900" : "text-white"
            } underline underline-offset-3`}
          >
            {data?.username}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[224px]" align="end" sideOffset={10}>
        <DropdownMenuItem className="font-normal text-sm text-slate-600" asChild>
          <Link href="/profile">My Account</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger className="w-full hover:bg-accent flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-red-500 select-none">
              <LogOut size={16} className="text-red-500" /> Logout
            </DialogTrigger>

            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle className="font-semibold text-lg text-slate-900">Logout</DialogTitle>
                <DialogDescription className="text-sm text-slate-500">Are you sure want to logout?</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="h-10 !px-4 !py-2.5">
                    Cancel
                  </Button>
                </DialogClose>
                <Button className="bg-blue-600 hover:bg-blue-700 h-10 !px-4 !py-2.5" onClick={() => handleLogout()}>
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
