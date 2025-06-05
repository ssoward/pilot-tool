import React, { useState } from 'react';
import type { TeamMember, Team } from '../types/Team';
import { 
  UserPlusIcon, 
  PencilIcon, 
  TrashIcon, 
  UserCircleIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface TeamMemberManagementProps {
  team: Team;
  onAddMember: (member: Omit<TeamMember, 'id' | 'joinedAt'>) => void;
  onUpdateMember: (memberId: string, updates: Partial<TeamMember>) => void;
  onRemoveMember: (memberId: string) => void;
  availableRoles: ('lead' | 'senior' | 'mid' | 'junior')[];
  availableSkills: string[];
  members?: TeamMember[];
}

interface MemberFormData {
  teamId: string;
  userId: string;
  name: string;
  email: string;
  role: 'lead' | 'senior' | 'mid' | 'junior' | '';
  skills: string[];
  capacity: number;
  currentWorkload: number;
}

const TeamMemberManagement: React.FC<TeamMemberManagementProps> = ({
  team,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
  availableRoles,
  availableSkills,
  members = []
}) => {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [formData, setFormData] = useState<MemberFormData>({
    teamId: team.id,
    userId: '',
    name: '',
    email: '',
    role: '',
    skills: [],
    capacity: 100,
    currentWorkload: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.role === '') {
      return; // Don't submit if no role selected
    }

    const memberData = {
      teamId: formData.teamId,
      userId: formData.userId || `user-${Date.now()}`, // Generate temp userId if empty
      name: formData.name,
      email: formData.email,
      role: formData.role as 'lead' | 'senior' | 'mid' | 'junior',
      skills: formData.skills,
      capacity: formData.capacity,
      currentWorkload: formData.currentWorkload
    };

    if (editingMember) {
      onUpdateMember(editingMember, memberData);
      setEditingMember(null);
    } else {
      onAddMember(memberData);
      setIsAddingMember(false);
    }
    
    setFormData({
      teamId: team.id,
      userId: '',
      name: '',
      email: '',
      role: '',
      skills: [],
      capacity: 100,
      currentWorkload: 0
    });
  };

  const handleEdit = (member: TeamMember) => {
    setFormData({
      teamId: member.teamId,
      userId: member.userId,
      name: member.name,
      email: member.email,
      role: member.role,
      skills: member.skills || [],
      capacity: member.capacity || 100,
      currentWorkload: member.currentWorkload || 0
    });
    setEditingMember(member.id);
    setIsAddingMember(true);
  };

  const handleCancel = () => {
    setIsAddingMember(false);
    setEditingMember(null);
    setFormData({
      teamId: team.id,
      userId: '',
      name: '',
      email: '',
      role: '',
      skills: [],
      capacity: 100,
      currentWorkload: 0
    });
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          <button
            onClick={() => setIsAddingMember(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Add Member
          </button>
        </div>

        {/* Member List */}
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {member.role}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      {member.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      Capacity: {member.capacity || 100}%
                    </div>
                  </div>
                  {member.skills && member.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {member.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onRemoveMember(member.id)}
                  className="p-2 text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {members.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <UserCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>No team members yet. Add your first member to get started.</p>
            </div>
          )}
        </div>

        {/* Add/Edit Member Form */}
        {isAddingMember && (
          <div className="mt-6 border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {editingMember ? 'Edit Member' : 'Add New Member'}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'lead' | 'senior' | 'mid' | 'junior' | '' }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a role</option>
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                    Capacity (%)
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    min="0"
                    max="100"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        formData.skills.includes(skill)
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      } border hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {formData.skills.includes(skill) ? (
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <XCircleIcon className="h-4 w-4 mr-1" />
                      )}
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingMember ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMemberManagement;
