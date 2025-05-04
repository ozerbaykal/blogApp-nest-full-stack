import { Formik, Form } from "formik";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { blogSchema } from "../../utils/schema";
import Input from "../../components/input";
import ReactSelect from "react-select/creatable";

const BlogForm: FC = () => {
  const [tags, setTags] = useState([]);
  const { id } = useParams();
  const isEditMode = !!id;

  const handleSubmit = (values: any) => {
    console.log("buton clik");
    console.log(values);
  };

  return (
    <div className="max-w-3xl mx-auto padding-x py-10">
      <h1 className="text-3xl font-bold text-zinc-400 mb-8">
        {isEditMode ? "Blog Düzenle" : "Blog Oluştur"}
      </h1>

      <Formik
        initialValues={{ title: "", content: "" }}
        //validationSchema={blogSchema}
        onSubmit={handleSubmit}
        // enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-10">
            <Input label="Başlık" name="title" type="text" />
            <Input label="İçerik" name="içerik" type="textarea" />

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
