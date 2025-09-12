"use client";

import { Editor } from "@tinymce/tinymce-react";

export default function EditorClient() {
  return (
    <Editor
      apiKey="no-api-key"
      init={{
        height: 500,
        plugins: "lists link image table code help wordcount",
        toolbar:
          "undo redo | formatselect | bold italic emoticons | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
        skin: "oxide-dark",
        content_css: "dark",
      }}
    />
  );
}