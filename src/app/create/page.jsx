// "use client";
// import { useState } from "react";
// import { Editor } from "@tinymce/tinymce-react";
// import { FaPaperPlane } from "react-icons/fa";
// import { toast } from "sonner";
// import PermissionBox from "@/components/modal/Permission";
// import "./create.css";

// export default function CreateBlog() {
//   const [formData, setFormData] = useState({
//     title: "",
//     writer: "",
//     description: "",
//     image: null,
//     content: "",
//   });
//   const [showPermission, setShowPermission] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleEditorChange = (content) => {
//     setFormData((prev) => ({ ...prev, content }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setShowPermission(true); // open popup only
//   };

//   const confirmCreate = async () => {
//     const blogData = {
//       title: formData.title,
//       writer: formData.writer,
//       description: formData.description,
//       image: formData.image ? formData.image.name : null,
//       content: `<p>${formData.content}</p>`,
//     };

//     try {
//       const res = await fetch("https://json-server-lnkp.onrender.com/blogs", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(blogData),
//       });

//       if (res.ok) {
//         toast.success("Blog created successfully!");
//         setFormData({
//           title: "",
//           writer: "",
//           description: "",
//           image: null,
//           content: "",
//         });
//       } else {
//         toast.error("Failed to create blog");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Error connecting to server");
//     } finally {
//       setShowPermission(false); // close popup after action
//     }
//   };

//   return (
//     <div className="page-container">
//       <main className="main-content">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <input
//             type="text"
//             name="title"
//             placeholder="Blog Title"
//             value={formData.title}
//             onChange={handleChange}
//             className="form-input"
//             required
//           />
//           <input
//             type="text"
//             name="writer"
//             placeholder="Writer"
//             value={formData.writer}
//             onChange={handleChange}
//             className="form-input"
//             required
//           />
//           <textarea
//             name="description"
//             placeholder="Description"
//             value={formData.description}
//             onChange={handleChange}
//             className="form-textarea"
//             required
//           />
//           <input
//             type="file"
//             name="image"
//             accept="image/*"
//             onChange={handleChange}
//             className="form-input"
//           />
//           <Editor
//             apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
//             value={formData.content}
//             onEditorChange={handleEditorChange}
//           />
//           <button type="submit" className="submit-btn">
//             <FaPaperPlane /> Submit Blog
//           </button>
//         </form>
//       </main>

//       <PermissionBox
//         isOpen={showPermission}
//         onConfirm={confirmCreate}
//         onCancel={() => setShowPermission(false)}
//       />
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "sonner";
import "../globals.css";
import PermissionBox from "@/components/modal/Permission";
import "./create.css";

export default function CreateBlog() {
  const [formData, setFormData] = useState({
    title: "",
    writer: "",
    description: "",
    image: null,
    content: "",
  });

  const [showPermission, setShowPermission] = useState(false);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const confirmCreate = async () => {
    const blogData = {
      title: formData.title,
      writer: formData.writer,
      description: formData.description,
      image: formData.image ? formData.image.name : null,
      content: `<p>${formData.content}</p>`,
    };

    try {
      const res = await fetch("https://json-server-lnkp.onrender.com/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (res.ok) {
        toast.success("Blog created successfully!");
        setFormData({
          title: "",
          writer: "",
          description: "",
          image: null,
          content: "",
        });
      } else {
        toast.error("Failed to create blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    } finally {
      setShowPermission(false); // close popup after action
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPermission(true); // open popup only
  };

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="form-wrapper">
          <h1 className="form-title">Create New Blog</h1>
          <p className="form-subtitle">
            Fill in the details below to publish your blog.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Writer */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Blog Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Writer Name</label>
                <input
                  type="text"
                  name="writer"
                  className="form-input"
                  value={formData.writer}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Short Description</label>
              <textarea
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Image */}
            <div className="form-group">
              <label className="form-label">Upload Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="form-input"
                onChange={handleChange}
              />
            </div>

            {/* Editor */}
            <div className="form-group">
              <label className="form-label">Start Writing</label>
              <Editor
                id="my-tinymce-editor"
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={formData.content}
                onEditorChange={handleEditorChange}
                init={{
                  menubar: false,
                  branding: false,
                  plugins: [
                    "anchor",
                    "autolink",
                    "charmap",
                    "codesample",
                    "emoticons",
                    "link",
                    "lists",
                    "media",
                    "searchreplace",
                    "table",
                    "visualblocks",
                    "wordcount",
                    "checklist",
                    "mediaembed",
                    "casechange",
                    "formatpainter",
                    "pageembed",
                    "a11ychecker",
                    "tinymcespellchecker",
                    "permanentpen",
                    "powerpaste",
                    "advtable",
                    "advcode",
                    "advtemplate",
                    "mentions",
                    "tableofcontents",
                    "footnotes",
                    "mergetags",
                    "autocorrect",
                    "typography",
                    "inlinecss",
                    "markdown",
                    "importword",
                    "exportword",
                    "exportpdf",
                  ],
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | " +
                    "bold italic underline strikethrough | link media table mergetags | " +
                    "align lineheight | checklist numlist bullist indent outdent | " +
                    "emoticons charmap | removeformat",
                }}
              />
            </div>
            <button type="submit" className="submit-btn">
              <FaPaperPlane /> Submit Blog
            </button>
          </form>
        </div>
      </main>
      <PermissionBox
        isOpen={showPermission}
        onConfirm={confirmCreate}
        onCancel={() => setShowPermission(false)}
        action="create"
      />
    </div>
  );
}
