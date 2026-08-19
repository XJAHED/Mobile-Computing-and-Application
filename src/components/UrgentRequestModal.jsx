import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import Button from './Button';
import LocationAutocomplete from './LocationAutocomplete';

const UrgentRequestModal = ({ onClose, currentUser }) => {
  const [bloodGroup, setBloodGroup] = useState(currentUser?.group || 'O+');
  const [location, setLocation] = useState(currentUser?.address || '');
  const [locationCoordinates, setLocationCoordinates] = useState(currentUser?.profileCoordinates || []);
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bloodGroup || !location || !phone) {
      alert("Please fill out all required fields.");
      return;
    }
    
    setLoading(true);
    try {
      const requestData = {
        bloodGroup,
        location,
        locationCoordinates,
        phone,
        note,
        postedBy: currentUser.uid,
        name: currentUser.name,
        timestamp: serverTimestamp(),
        status: 'Active'
      };
      
      await addDoc(collection(db, 'urgent_requests'), requestData);

      // Send FCM push notifications to registered donors with the matching blood group
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bloodGroup,
            requesterName: currentUser.name,
            location,
            note
          })
        });
      } catch (err) {
        console.warn("Push notification send failed (request still posted):", err);
      }

      onClose();
    } catch (err) {
      console.error("Error posting urgent request:", err);
      alert("Failed to post request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 duration-200 bg-black/60 animate-in fade-in">
      <div className="relative flex flex-col w-full max-w-md p-6 transition-colors duration-200 bg-white shadow-2xl rounded-3xl animate-in zoom-in-95">
        
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-red-600">
             <AlertCircle className="w-6 h-6" />
             <h2 className="text-xl font-bold">Post Urgent Need</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-100 :bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Blood Group Needed *</label>
             <select 
                value={bloodGroup} 
                onChange={(e) => setBloodGroup(e.target.value)} className="w-full px-4 py-3 text-gray-900 transition-all border border-gray-200 outline-none appearance-none bg-gray-50 rounded-xl focus:ring-2 focus:ring-red-500" 
                required
              >
                <option value="" disabled>Select Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Hospital / Location *</label>
            <LocationAutocomplete 
              value={location}
              onLocationSelect={(addr, coords) => {
                 setLocation(addr);
                 setLocationCoordinates(coords || []);
              }}
              placeholder="Search specific Hospital or Location..."
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Contact Phone *</label>
            <div className="relative flex items-center overflow-hidden text-sm transition-all border border-gray-200 bg-gray-50 rounded-xl focus-within:ring-2 focus-within:ring-red-500">
               <div className="flex items-center justify-center py-3 pl-4 pr-3 font-bold text-gray-600 bg-gray-100 border-r border-gray-200 shrink-0">
                 +880
               </div>
               <input 
                  type="tel" 
                  value={phone.replace(/\D/g, '').replace(/^(?:88)?0?/, '')} 
                  onChange={(e) => {
                     const val = e.target.value.replace(/\D/g, '').replace(/^(?:88)?0?/, '');
                     setPhone(`+880${val.slice(0, 10)}`);
                  }} 
                  className="w-full py-3 pl-3 pr-4 font-semibold tracking-wide text-gray-900 bg-transparent outline-none" 
                  required
                  placeholder="1XXXXXXXXX (10 digits)"
               />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Additional Note (Optional)</label>
            <textarea 
              value={note} 
              onChange={(e) => setNote(e.target.value)}
              placeholder="Patient condition, bag requirements..."
              rows="2" className="w-full px-4 py-3 text-gray-900 transition-all border border-gray-200 outline-none resize-none bg-gray-50 rounded-xl focus:ring-2 focus:ring-red-500" 
            />
          </div>

          <div className="pt-2">
            <Button 
              fullWidth 
              type="submit" 
              variant="primary" 
              disabled={loading} className="py-3.5 flex items-center justify-center gap-2 text-base shadow-lg shadow-red-200"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Posting...' : 'Post Request'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default UrgentRequestModal;
