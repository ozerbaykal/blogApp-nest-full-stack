import { Formik, Form } from "formik";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import Input from "../../components/input";
import ReactSelect from "react-select/creatable";
import { CreateBlogValues } from "../../types";
import { useBlogs } from "../../hooks/useBlogs";
import { blogSchema } from "../../utils/schema";

const BlogForm: FC = () => {
  //id yi al
  const { id } = useParams();

  //edit mode kontrolu
  const isEditMode = !!id;

  //blog hookları
  const { createBlog, blog } = useBlogs();

  //düzenlenecek blogun verilerini al
  const { data, isLoading } = blog(id as string);

  //etiketleri state e at
  const [tags, setTags] = useState<string[]>(data?.tags || []);

  console.log(data);

  const handleSubmit = (values: any) => {
    const data: CreateBlogValues = { ...values, tags };
    console.log(data);

    createBlog.mutate(data);
  };

  if (isLoading) return <div>Loading ...</div>;
  return (
    <div className="max-w-3xl mx-auto padding-x py-10">
      <h1 className="text-3xl font-bold text-zinc-400 mb-8">
        {isEditMode ? "Blog Düzenle" : "Blog Oluştur"}
      </h1>

      <Formik
        initialValues={{ title: data?.title || "", content: data?.content || "" }}
        validationSchema={blogSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-10">
            <Input label="Başlık" name="title" type="text" />
            <Input label="İçerik" name="content" type="textarea" />

            <div className="flex flex-col gap-2">
              <label className="block text-sm/6 font-medium text-white" htmlFor="tags">
                Etiketler
              </label>

              <ReactSelect
                isMulti
                onChange={(event) => setTags(event.map((tag) => tag.value))}
                value={tags.map((tag) => ({ label: tag, value: tag }))}
              />
            </div>
            <div className="flex justify-end mt-10">
              <button
                disabled={isSubmitting}
                type="submit"
                className="bg-yellow-55 text-black px-4 py-2 rounded-md hover:bg-yellow-60 transition cursor-pointer"
              >
                {isEditMode ? "Düzenle" : "Oluştur"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BlogForm;
