import React, { useState } from 'react';
// Using JSDoc instead of TypeScript imports
import { 
  UserPlusIcon, 
  PencilIcon, 
  TrashIcon, 
  UserCircleIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';



const TeamMemberManagement = ({
  team,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
  availableRoles,
  availableSkills,
  members = []
}) => {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    teamId: team.teamId,
    hrEmpId: 0,
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    skills: [],
    capacity: 40,
    currentWorkload: 0
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.role) {
      return; // Basic validation
    }
    
    onAddMember({
      teamId: formData.teamId,
      hrEmpId: formData.hrEmpId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      role: formData.role,
      capacity: formData.capacity,
      currentWorkload: formData.currentWorkload,
      skills: formData.skills
    });
    
    // Reset form
    setFormData({
      teamId: team.teamId,
      hrEmpId: 0,
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      skills: [],
      capacity: 40,
      currentWorkload: 0
    });
    setSelectedSkills([]);
    setIsAddingMember(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    if (editingMember === null) return;
    
    onUpdateMember(editingMember, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      role: formData.role,
      capacity: formData.capacity,
      skills: formData.skills
    });
    
    setEditingMember(null);
    setSelectedSkills([]);
  };

  const handleEdit = (member) => {
    setFormData({
      teamId: member.teamId,
      hrEmpId: member.hrEmpId,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: member.role,
      skills: member.skills,
      capacity: member.capacity,
      currentWorkload: member.currentWorkload
    });
    setSelectedSkills(member.skill);
    setEditingMember(member.id);
    setIsAddingMember(false);
  };

  const handleCancel = () => {
    if (editingMember) {
      setEditingMember(null);
    } else {
      setIsAddingMember(false);
    }
    
    setFormData({
      teamId: team.teamId,
      hrEmpId: 0,
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      skills: [],
      capacity: 40,
      currentWorkload: 0
    });
    setSelectedSkills([]);
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
      setFormData({...formData, skills: formData.skills.filter(s => s !== skill)});
    } else {
      setSelectedSkills([...selectedSkills, skill]);
      setFormData({...formData, skills: [...formData.skills, skill]});
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
        {!isAddingMember && !editingMember && (
          <button
            onClick={() => setIsAddingMember(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <UserPlusIcon className="h-4 w-4 mr-1" />
            Add Member
          </button>
        )}
      </div>
      
      {/* Add/Edit Form */}
      {(isAddingMember || editingMember) && (
        <form onSubmit={editingMember ? handleEditSubmit : handleAddSubmit} className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                required
              />
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                required
              />
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                required
              />
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="hrEmpId" className="block text-sm font-medium text-gray-700">HR Employee ID</label>
              <input
                type="number"
                id="hrEmpId"
                value={formData.hrEmpId}
                onChange={(e) => setFormData(prev => ({ ...prev, hrEmpId: Number(e.target.value) }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                required
              />
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                required
              >
                <option value="">Select role...</option>
                {availableRoles.map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Weekly Capacity (hour)</label>
              <input
                type="number"
                id="capacity"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                min="1"
                max="60"
                required
              />
            </div>
            
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      selectedSkills.includes(skill)
                        ? 'bg-indigo-100 text-indigo-800 font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {selectedSkills.includes(skill) && (
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                    )}
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="sm:col-span-6 flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <XCircleIcon className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                {editingMember ? 'Update Member' : 'Add Member'}
              </button>
            </div>
          </div>
        </form>
      )}
      
      {/* Members List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {members.length === 0 ? (
          <p className="py-4 px-6 text-gray-500 text-center">No team members yet</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {members.map(member => (
              <li key={member.id} className={`${editingMember === member.id ? 'bg-indigo-50' : ''}`}>
                <div className="flex items-center justify-between px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{member.firstName} {member.lastName}</div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{member.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium 
                      bg-indigo-100 text-indigo-800 mr-2">
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium 
                      bg-green-100 text-green-800 mr-4">
                      {member.capacity}h
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        disabled={isAddingMember || editingMember !== null}
                        className={`text-indigo-600 hover:text-indigo-900 ${
                          isAddingMember || (editingMember !== null && editingMember !== member.id)
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        <PencilIcon className="h-5 w-5" />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button
                        onClick={() => onRemoveMember(member.id)}
                        disabled={isAddingMember || editingMember !== null}
                        className={`text-red-600 hover:text-red-900 ${
                          isAddingMember || editingMember !== null
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Skills list */}
                {member.skills && member.skills.length > 0 && (
                  <div className="px-4 py-2 pb-4 sm:px-6 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2 mt-1">
                      {member.skills.map(skill => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeamMemberManagement;
