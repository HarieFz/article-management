"use client";

import Header from "@/app/(admin)/components/Header";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoriesService } from "@/network/services/categories.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEditor, EditorContent, EditorContext } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image as ExImage } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@/components/tiptap-ui-primitive/toolbar";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArticlesService } from "@/network/services/articles.service";
import { queryClient } from "@/network/config/queryClient";
import { useRouter } from "next/navigation";
import { UploadService } from "@/network/services/upload.service";
import Image from "next/image";
import AlertSuccess from "@/components/AlertSuccess";
import AlertError from "@/components/AlertError";
import { useDebounce } from "use-debounce";
const schema = z.object({
  thumbnail: z.instanceof(File).refine((file) => file.size > 0, { message: "Please enter picture" }),
  title: z.string().min(1, "Please enter title"),
  category: z.string().min(1, "Please select category"),
  content: z.string().min(1, "Content field cannot be empty"),
});

const initialState = {
  thumbnail: null as unknown as File,
  title: "",
  category: "",
  content: "",
};

export default function AddArticle() {
  const router = useRouter();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string>("");

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [previewThumbnail, setPreviewThumbnail] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialState,
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoriesService.get(),
  });

  const editor = useEditor({
    content: form.getValues("content"),
    onUpdate: ({ editor }) => {
      form.setValue("content", editor.getHTML(), { shouldValidate: true });
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ExImage,
      Placeholder.configure({
        placeholder: "Type a content...",
      }),
      CharacterCount.configure({
        textCounter: (text) => [...new Intl.Segmenter().segment(text)].length,
      }),
    ],
  });

  const addImage = (url: string) => {
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
      setOpen(false);
      setImageURL("");
    }
  };

  const { mutate: handleAdd, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      if (!editor) throw new Error("Editor not initialized");

      const uploadResult = await UploadService.post(data.thumbnail);

      const html = editor.getHTML();

      await ArticlesService.post({
        title: data.title,
        categoryId: data.category,
        content: html,
        imageUrl: uploadResult.imageUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      router.push("/admin/articles");
      form.reset();
      setShowSuccessAlert(true);
    },
    onError: (error) => {
      setShowErrorAlert(true);
      console.error(error);
    },
  });

  const handleDeleteThumbnail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setPreviewThumbnail("");
    form.setValue("thumbnail", null as unknown as File);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <Header title="Articles" />

      <main className="max-w-8xl w-full mx-auto px-6 pt-6 pb-25">
        <div className="bg-gray-50 border border-slate-200 rounded-[12px] overflow-hidden">
          <Link href="/admin/articles" className="flex items-center gap-2 p-5">
            <ArrowLeft size={20} className="text-slate-900" />
            <p className="font-medium text-slate-900">Create Articles</p>
          </Link>

          <Form {...form}>
            <div className="flex flex-col gap-4 p-6">
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm text-gray-900 mb-1">Thumbnails</FormLabel>
                    <div>
                      <Label
                        htmlFor="thumbnail"
                        className="w-[223px] h-[163px] bg-white border border-dashed border-slate-300 rounded-[8px] flex flex-col items-center justify-center"
                      >
                        {previewThumbnail ? (
                          <div className="p-3">
                            <Image
                              src={previewThumbnail}
                              alt="Preview"
                              width={0}
                              height={0}
                              sizes="100vw"
                              className="object-cover w-full h-[115px] rounded-[6px] mb-2"
                            />
                            <div className="flex items-center justify-center gap-2.5">
                              <Button
                                variant="link"
                                className="w-fit px-0 py-0 h-fit text-blue-600 hover:text-blue-700 underline underline-offset-2"
                                asChild
                              >
                                <Label htmlFor="thumbnail">Change</Label>
                              </Button>
                              <Button
                                variant="link"
                                className="w-fit px-0 py-0 h-fit text-red-500 hover:text-red-600 underline underline-offset-2"
                                onClick={handleDeleteThumbnail}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1">
                            <ImagePlus />
                            <p className="text-xs text-slate-500 underline underline-offset-1 mt-2">
                              Click to select files
                            </p>
                            <p className="text-xs text-slate-500">Suport File Type : jpg or png</p>
                          </div>
                        )}
                      </Label>
                      <FormControl>
                        <Input
                          id="thumbnail"
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setPreviewThumbnail(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          accept="image/png, image/jpeg"
                        />
                      </FormControl>
                      <FormMessage className="mt-2" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="title" className="font-medium text-sm text-gray-900 mb-1">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input type="text" id="title" placeholder="Input title" className="bg-white h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-1">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full bg-white !h-10 !text-slate-900 !font-medium">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {isCategoriesLoading ? (
                              <SelectItem value="default" disabled>
                                <Loader2Icon className="animate-spin" /> Loading
                              </SelectItem>
                            ) : (
                              <>
                                <SelectItem value="default">Category</SelectItem>

                                {categories?.data
                                  ?.filter((item) => item.id && item.id.trim() !== "")
                                  ?.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                      {item.name}
                                    </SelectItem>
                                  ))}
                              </>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-sm text-slate-500">
                        The existing category list can be seen in the{" "}
                        <Link
                          href="categories"
                          className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
                        >
                          category
                        </Link>{" "}
                        menu
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="content"
                render={() => (
                  <FormItem>
                    <div
                      className="h-[551px] bg-gray-50 border border-slate-200 rounded-[12px] overflow-hidden flex flex-col justify-between"
                      style={{ boxShadow: "0px 1px 2px 0px #0000000D" }}
                    >
                      <EditorContext.Provider value={{ editor }}>
                        <div>
                          <div className="bg-white">
                            <Toolbar ref={toolbarRef}>
                              <ToolbarGroup>
                                <UndoRedoButton action="undo" />
                                <UndoRedoButton action="redo" />
                              </ToolbarGroup>

                              <ToolbarGroup>
                                <MarkButton type="bold" />
                                <MarkButton type="italic" />
                              </ToolbarGroup>

                              <ToolbarSeparator />

                              <ToolbarGroup>
                                <Dialog open={open} onOpenChange={setOpen}>
                                  <DialogTrigger onClick={() => setOpen(true)} asChild>
                                    <ImageUploadButton />
                                  </DialogTrigger>

                                  <DialogContent showCloseButton={false}>
                                    <DialogHeader>
                                      <DialogTitle className="font-semibold text-xl text-slate-900 mb-6">
                                        Insert Image
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div>
                                      <Label htmlFor="url" className="mb-1">
                                        Image URL
                                      </Label>
                                      <Input
                                        type="text"
                                        id="url"
                                        placeholder="Input Category"
                                        className="bg-white h-10"
                                        onChange={(e) => setImageURL(e.target.value)}
                                        value={imageURL}
                                      />
                                    </div>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          className="h-10 !px-4 !py-2.5"
                                          onClick={() => setOpen(false)}
                                        >
                                          Cancel
                                        </Button>
                                      </DialogClose>
                                      <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 h-10 !px-4 !py-2.5"
                                        onClick={() => addImage(imageURL)}
                                      >
                                        Confirm
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </ToolbarGroup>

                              <ToolbarSeparator />

                              <ToolbarGroup>
                                <TextAlignButton align="left" />
                                <TextAlignButton align="center" />
                                <TextAlignButton align="right" />
                                <TextAlignButton align="justify" />
                              </ToolbarGroup>
                            </Toolbar>
                          </div>

                          <div>
                            <EditorContent editor={editor} className="p-4" />
                          </div>
                        </div>
                      </EditorContext.Provider>
                      <div className="bg-white px-4 py-6">
                        <p className="text-xs text-slate-900">{editor?.storage.characterCount.words()} Words</p>
                      </div>
                    </div>
                    {form.formState.errors.content && (
                      <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </Form>

          <div className="flex items-center justify-end gap-2 px-6 py-4 mb-6">
            <Button className="bg-white hover:bg-accent text-slate-900" disabled={isPending}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={form.handleSubmit((data) => handleAdd(data))}
              disabled={isPending}
            >
              Upload
            </Button>
          </div>
        </div>
      </main>

      {showSuccessAlert && <AlertSuccess duration={3000} onClose={() => setShowErrorAlert(false)} />}

      {showErrorAlert && <AlertError duration={3000} onClose={() => setShowErrorAlert(false)} />}
    </div>
  );
}
