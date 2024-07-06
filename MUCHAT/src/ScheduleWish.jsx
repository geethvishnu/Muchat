import React, { useState } from 'react';
import axios from 'axios';

const ScheduleWish = ({ selectedUserId, onWishScheduled, onClose }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [buttonText, setButtonText] = useState('Wish Birthday 🎉');

  const handleScheduleWish = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/schedule-wish', {
        recipientId: selectedUserId,
        date,
        time,
        message,
      });

      if (response.data.success) {
        // alert('Birthday wish scheduled successfully');
        onWishScheduled(); // Notify parent component (Chat.jsx) that wish is scheduled
        setDate('');
        setTime('');
        setMessage('');
        setButtonText('Schedule for Contact'); // Update button text after scheduling
        onClose(); // Close the ScheduleWish component
      } else {
        alert('Failed to schedule birthday wish');
      }
    } catch (error) {
      console.error('Error scheduling birthday wish:', error);
      alert('Error scheduling birthday wish');
    }
  };

  const handleClose = () => {
    onClose(); // Call the onClose handler passed from the parent component
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white shadow-md rounded-lg p-6" style={{ maxWidth: '500px' }}>
        <h2 className="text-lg font-semibold mb-2 text-center">Send Birthday Wishes</h2>
        <form onSubmit={handleScheduleWish} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="date" className="text-gray-700 mb-1">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="time" className="text-gray-700 mb-1">Time</label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="message" className="text-gray-700 mb-1">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="border border-gray-300 p-2 rounded h-32 resize-none"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition duration-200"
            >
              Back
            </button>
            <div className="ml-20">
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleWish;
