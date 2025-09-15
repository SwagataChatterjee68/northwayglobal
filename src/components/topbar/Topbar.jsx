"use client";
import Link from "next/link";
import "./topbar.css";
import { useState } from "react";

export default function Topbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="topbar">
      <nav className="flex space-x-4">
        <button onClick={() => setIsOpen(true)} className="btn-primary">
          Change Password
        </button>
        <Link href="/logout" className="btn-danger">
          Logout
        </Link>
      </nav>

      {/* Modal */}
      {isOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2 className="modal-title">Change Password</h2>
            <form className="modal-form">
              <div className="form-group">
                <label htmlFor="oldPassword" className="form-label">
                  Old Password
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  className="form-input"
                  placeholder="Enter old password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="form-input"
                  placeholder="Enter new password"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
