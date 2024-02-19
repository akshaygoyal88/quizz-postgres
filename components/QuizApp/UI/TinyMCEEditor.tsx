"use client";
import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import ReactDOMServer from "react-dom/server";

interface TinyMCEEditorProps {
  initialValue?: string;
  handleEditorChange: (content: string, index?: number, editor?: any) => void;
  imagesList?: string[];
  editorsContent?: string | null;
  idx?: string;
  index?: number;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  initialValue,
  handleEditorChange,
  imagesList,
  editorsContent,
  idx,
  index,
}) => {
  const [forceRender, setForceRender] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [editorVal, setEditorVal] = useState<string>("");
  // const dir = "ltr";
  console.log(editorsContent);

  const handleOnChange = (content: string, editor: any) => {
    console.log(index);
    handleEditorChange(content, index, editor);
  };

  const handleImageUpload = (
    blobInfo: { blob: () => Blob; filename: () => string | undefined },
    progress: (arg0: number) => void
  ) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open("POST", "/api/upload-image");

      xhr.upload.onprogress = (e) => {
        progress((e.loaded / e.total) * 100);
      };

      xhr.onload = () => {
        if (xhr.status === 403) {
          reject({ message: "HTTP Error: " + xhr.status, remove: true });
          return;
        }

        if (xhr.status < 200 || xhr.status >= 300) {
          reject("HTTP Error: " + xhr.status);
          return;
        }

        const json = JSON.parse(xhr.responseText);
        console.log(json, "jsonjson");

        if (!json || typeof json.url != "string") {
          reject("Invalid JSON: " + xhr.responseText);
          return;
        }

        resolve(json.url);
      };

      xhr.onerror = () => {
        reject(
          "Image upload failed due to a XHR Transport error. Code: " +
            xhr.status
        );
      };

      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());

      xhr.send(formData);
    });

  useEffect(() => {
    setForceRender((prev) => !prev);
  }, [imagesList]);
  useEffect(() => {
    if (editorsContent) {
      setEditorVal(editorsContent);
    }
  }, [editorsContent]);
  return (
    <Editor
      key={`editor_${idx}_${forceRender}`}
      apiKey="9iy1f4gyicomt4zn9qfm8rtwtg9zfd1mdhrddt5894jbv5a8"
      initialValue={editorVal}
      init={{
        height: 200,
        plugins:
          "gallery image advlist autolink lists image charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks visualchars code fullscreen nonbreaking save  emoticons paste textpattern media image imagetools",
        toolbar:
          "gallery | undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | image | gallery | outdent indent | ltr rtl | mediaembed",
        images_upload_handler: handleImageUpload,
        image_list: imagesList,

        mediaembed_service_url: "https://noembed.com/embed?url={url}", // need premium subscription for this.
      }}
      onEditorChange={handleOnChange}
    />
  );
};

export default TinyMCEEditor;
