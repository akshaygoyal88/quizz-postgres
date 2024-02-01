// TinyMCEEditor.tsx
import React from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEEditorProps {
  initialValue: string;
  handleEditorChange: (content: string, editor: any) => void;
}

// const handleImageUpload = async (
//   blobInfo: any,
//   success: (url: string) => void,
//   failure: (error: string) => void
// ) => {
//   const formData = new FormData();
//   formData.append("file", blobInfo.blob(), blobInfo.filename());
//   const response = await fetch("/api/upload-image", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: formData,
//   });
//   try {
//     const data = await response.json();
//     success(data.url);
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     failure("Image upload failed");
//   }
// };

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  initialValue,
  handleEditorChange,
}) => {
  const handleImageUpload = (blobInfo, progress, failure) => {
    const formData = new FormData();
    console.log(blobInfo.blob(), "blobInfoblobInfo", blobInfo.filename());
    // formData.append("file", blobInfo.blob(), blobInfo.name);
    formData.append("file", blobInfo.blob(), blobInfo.filename());

    fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log(response, "responseresponse");
        return response.json();
      })
      .then((result) => {
        console.log(result);
        progress(result.url); // Adjust this line
      })
      .catch((error) => {
        console.log(error);
        failure("HTTP Error: " + error.message);
      });
  };

  // Editor with image upload
  return (
    <Editor
      apiKey="9iy1f4gyicomt4zn9qfm8rtwtg9zfd1mdhrddt5894jbv5a8"
      initialValue={initialValue}
      init={{
        height: 500,
        // menubar: false,
        plugins: "media image imagetools",
        menubar: "insert",
        // toolbar: "media",
        video_template_callback: function (data) {
          return (
            '<video width="' +
            data.width +
            '" height="' +
            data.height +
            '"' +
            (data.poster ? ' poster="' + data.poster + '"' : "") +
            ' controls="controls">\n' +
            '<source src="' +
            data.source +
            '"' +
            (data.sourcemime ? ' type="' + data.sourcemime + '"' : "") +
            " />\n" +
            (data.altsource
              ? '<source src="' +
                data.altsource +
                '"' +
                (data.altsourcemime
                  ? ' type="' + data.altsourcemime + '"'
                  : "") +
                " />\n"
              : "") +
            "</video>"
          );
        },
        toolbar:
          "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | image | media",
        // images_upload_url: "/api/upload-image",
        automatic_uploads: true,
        images_reuse_filename: true,
        images_upload_handler: handleImageUpload,
        image_list: [
          {
            title: "My image 1",
            value:
              "https://codecaffiene.s3.ap-south-1.amazonaws.com/1706268392833-image.jpg",
          },
        ],
      }}
      // automatic_uploads={ true}
      // images_upload_url={"/api/upload-image"}
      // images_reuse_filename={true}
      // images_upload_handler={handleImageUpload}
      onEditorChange={handleEditorChange}
    />
  );
};

export default TinyMCEEditor;
