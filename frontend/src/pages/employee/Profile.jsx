import React from "react";
import useAuthStore from "../../stores/authStore";
import StatsCard from "../../components/StatsCard";
import {
  BanknotesIcon,
  UserIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const leaveBalance = user.leaveBalance || {};

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* User Info */}
        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gray-200 rounded-full p-2">
                  <UserIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="text-lg font-medium text-gray-900">
                    {user.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gray-200 rounded-full p-2">
                  <EnvelopeIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-lg font-medium text-gray-900">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gray-200 rounded-full p-2">
                  <UserIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p className="text-lg font-medium text-gray-900 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Leave Balance
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatsCard
              title="Sick Leave"
              value={leaveBalance.sickLeave || 0}
              icon={<BanknotesIcon className="h-6 w-6" />}
              color="red"
            />
            <StatsCard
              title="Casual Leave"
              value={leaveBalance.casualLeave || 0}
              icon={<BanknotesIcon className="h-6 w-6" />}
              color="blue"
            />
            <StatsCard
              title="Vacation"
              value={leaveBalance.vacationLeave || 0}
              icon={<BanknotesIcon className="h-6 w-6" />}
              color="purple"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
