"use client";

import { useEffect, useState } from "react";
import { authService, employeeService } from "@/lib/services";
import { User, EmployeeProfile } from "@/lib/types";

export default function ExampleIntegration() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user and profile data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current logged-in user
        const userData = await authService.getCurrentUser();
        setUser(userData);

        // Get user's employee profile
        const profileData = await employeeService.getProfile(userData._id);
        setProfile(profileData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>

      {user && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">User Information</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Employee ID:</strong> {user.employeeId}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}
          </p>
        </div>
      )}

      {profile && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Profile Details</h2>
          <p>
            <strong>Full Name:</strong> {profile.fullName}
          </p>
          <p>
            <strong>Job Title:</strong> {profile.jobTitle || "N/A"}
          </p>
          <p>
            <strong>Department:</strong> {profile.department || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {profile.phone || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {profile.address || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}
