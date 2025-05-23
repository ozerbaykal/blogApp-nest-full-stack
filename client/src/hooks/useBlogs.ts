import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blog";
import { CreateBlogValues, GetAllParams } from "../types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useBlogs = (params?: GetAllParams) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const blogs = () =>
    useQuery({
      queryKey: ["blogs", params],
      queryFn: () => {
        return blogService.getAll(params);
      },
    });
  const ownBlogs = () =>
    useQuery({
      queryKey: ["ownBlogs", params],
      queryFn: () => blogService.getOwn(params),
    });

  const blog = (id: string) =>
    useQuery({
      queryKey: ["blog", id],
      queryFn: () => blogService.getById(id),
      enabled: !!id,
    });

  const createBlog = useMutation({
    mutationKey: ["createBlog"],
    mutationFn: (values: CreateBlogValues) => blogService.create(values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate(`/blog/${data._id}`);
      toast.success("Blog başarıyla oluşturuldu");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateBlog = useMutation({
    mutationKey: ["updateBlog"],
    mutationFn: ({ id, values }: { id: string; values: Partial<CreateBlogValues> }) =>
      blogService.update(id, values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate(`/blog/${data._id}`);
      toast.success("Blog başarıyla güncellendi");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteBlog = useMutation({
    mutationKey: ["deleteBlog"],
    mutationFn: (id: string) => blogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ownBlogs"] });
      toast.success("Blog başarıyla silindi");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    blogs,
    ownBlogs,
    blog,
    createBlog,
    updateBlog,
    deleteBlog,
  };
};
