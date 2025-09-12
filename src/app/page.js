import "./globals.css"; 
export default function Home() {
  return (
    <div className="dashboard-layout">
      {/* Main Content */}
      <main className="main-content">
        <h1 className="main-header">Welcome to Your Dashboard</h1>
        <p className="main-subtext">
          Use the sidebar to navigate between sections like blogs, video galleries,
          photo galleries, and testimonials.
        </p>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="dashboard-card">
            <h2 className="card-title">Create Blog</h2>
            <p className="card-text">Start writing a new blog post.</p>
          </div>

          <div className="dashboard-card">
            <h2 className="card-title">Manage Blogs</h2>
            <p className="card-text">View, edit, or delete existing blogs.</p>
          </div>

          <div className="dashboard-card">
            <h2 className="card-title">Video Gallery</h2>
            <p className="card-text">Upload and manage your video collection.</p>
          </div>

          <div className="dashboard-card">
            <h2 className="card-title">Photo Gallery</h2>
            <p className="card-text">Organize and showcase photos.</p>
          </div>

          <div className="dashboard-card">
            <h2 className="card-title">Testimonials</h2>
            <p className="card-text">Add and update client feedback.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
