import React, { FC } from "react";
import { useParams } from "react-router-dom";
import { useBlogs } from "../../hooks/useBlogs";
import Comments from "../../components/comments";

const Detail: FC = () => {
  const { id } = useParams();
  const { blog } = useBlogs();
  const { data, isLoading, error } = blog(id as string);

  if (isLoading) return <div>Loading ...</div>;
  if (error) return <div>ERROR : {error.message}</div>;

  return (
    <div>
      <div className=" h-[30vh] bg-center bg-cover md:h-[40vh] bg-[url('/banner.png')] flex items-end justify-center pb-10">
        <h1 className="text-4xl md:text-5xl">{data?.title}</h1>
      </div>

      <div className="grid grid-cols-[3fr_1fr] mt-5 border-b border-dark-20">
        <div className="p-5">{data?.content}</div>

        <div className="border-l border-dark-20">
          <p className="flex flex-col gap-2 border-b border-dark-20 px-3 md:px-5 pb-5">
            <span className="text-sm text-zinc-400">Tarih</span>
            <span>
              {new Date(data?.createdAt as string).toLocaleDateString("tr", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </p>

          <div className=" flex flex-col gap-5 px-3 md:px-5 py-5">
            {data?.tags.map((tag) => (
              <div key={tag} className="bg-zinc-800 border-zinc-700 p-2 text-center rounded-md">
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Comments />
    </div>
  );
};

export default Detail;
