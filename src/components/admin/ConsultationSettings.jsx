import React, { useState } from 'react';
import { Calendar, Clock, Plus, Edit2, Trash2 } from 'lucide-react';
import { showWarning } from '../../utils/toastConfig';

export default function ConsultationSetting() {
  const [consultations, setConsultations] = useState([
    {
      id: 1,
      date: '20/06/2025',
      times: ['7:00AM', '7:00AM', '7:00AM']
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Time slots for dropdown
  const timeSlots = [
    '6:00AM', '6:30AM', '7:00AM', '7:30AM', '8:00AM', '8:30AM', '9:00AM',
    '9:30AM', '10:00AM', '10:30AM', '11:00AM', '11:30AM', '12:00PM',
    '12:30PM', '1:00PM', '1:30PM', '2:00PM', '2:30PM', '3:00PM',
    '3:30PM', '4:00PM', '4:30PM', '5:00PM', '5:30PM', '6:00PM'
  ];

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingId(null);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleSave = () => {
    if (!selectedDate || !selectedTime) {
      showWarning('Please select both date and time to proceed');
      return;
    }

    if (editingId) {
      // Update existing consultation
      setConsultations(consultations.map(consult => {
        if (consult.id === editingId) {
          return {
            ...consult,
            date: selectedDate,
            times: [...consult.times, selectedTime]
          };
        }
        return consult;
      }));
    } else {
      // Add new consultation
      const newConsultation = {
        id: Date.now(),
        date: selectedDate,
        times: [selectedTime]
      };
      setConsultations([...consultations, newConsultation]);
    }

    // Reset form
    setShowAddForm(false);
    setSelectedDate('');
    setSelectedTime('');
    setEditingId(null);
  };

  const handleEdit = (consultation) => {
    setEditingId(consultation.id);
    setSelectedDate(consultation.date);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this consultation slot?')) {
      setConsultations(consultations.filter(consult => consult.id !== id));
    }
  };

  const handleDeleteTime = (consultId, timeIndex) => {
    setConsultations(consultations.map(consult => {
      if (consult.id === consultId) {
        const newTimes = consult.times.filter((_, index) => index !== timeIndex);
        return { ...consult, times: newTimes };
      }
      return consult;
    }).filter(consult => consult.times.length > 0)); // Remove if no times left
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {/* Header */}
        <div className="grid grid-cols-2 bg-slate-600 text-white rounded-t-lg overflow-hidden">
          <div className="px-6 py-4 border-r border-slate-500">
            <h3 className="font-semibold text-sm uppercase tracking-wide">Date</h3>
          </div>
          <div className="px-6 py-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide">Time</h3>
          </div>
        </div>

        {/* Consultation List */}
        <div className="divide-y divide-gray-200">
          {consultations.map((consultation) => (
            <div key={consultation.id} className="grid grid-cols-2 hover:bg-gray-50 transition-colors">
              {/* Date Column */}
              <div className="px-6 py-4 border-r border-gray-200">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {consultation.date}
                </div>
              </div>

              {/* Time Column */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {consultation.times.map((time, timeIndex) => (
                      <div
                        key={timeIndex}
                        className="group relative bg-teal-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-teal-600 transition-colors"
                      >
                        {time}
                        <button
                          onClick={() => handleDeleteTime(consultation.id, timeIndex)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                          title="Remove time"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(consultation)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(consultation.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Button */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add new
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Date Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select date
                </label>
                <input
                  type="date"
                  value={selectedDate ? selectedDate.split('/').reverse().join('-') : ''}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    const formatted = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                    setSelectedDate(formatted);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Time Select */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option value="">Choose time...</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedDate('');
                  setSelectedTime('');
                  setEditingId(null);
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}