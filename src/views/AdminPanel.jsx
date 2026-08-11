import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { Trash2, ShieldAlert } from 'lucide-react';

const AdminPanel = () => {
   const [users, setUsers] = useState([]);
   const [posts, setPosts] = useState([]);

   const [isAuthorized, setIsAuthorized] = useState(false);
   const [loadingAuth, setLoadingAuth] = useState(true);

   useEffect(() => {
      // Check Auth
      const unsubAuth = onAuthStateChanged(auth, (user) => {
         if (user) {
            setIsAuthorized(true);
         } else {
            setIsAuthorized(false);
         }
         setLoadingAuth(false);
      });

      // Fetch Users
      const unsubUsers = onSnapshot(collection(db, 'users'), sn => {
         setUsers(sn.docs.map(d => ({id: d.id, ...d.data()})));
      });
      // Fetch Posts History
      const unsubPosts = onSnapshot(collection(db, 'urgent_requests'), sn => {
         const postList = sn.docs.map(d => ({id: d.id, ...d.data()}));
         postList.sort((a, b) => {
            if (!a.timestamp || !b.timestamp) return 0;
            return b.timestamp.toDate() - a.timestamp.toDate();
         });
         setPosts(postList);
      });
      return () => {
         unsubAuth();
         unsubUsers();
         unsubPosts();
      }
   }, []);

   const deleteUser = async (id) => {
      if(window.confirm("WARNING: Are you sure you want to permanently delete this user?")) {
         try {
             await deleteDoc(doc(db, 'users', id));
         } catch(e) {
             alert('Failed to delete user');
         }
      }
   };

   const deletePost = async (id) => {
      if(window.confirm("Delete this Urgent Post?")) {
         try {
             await deleteDoc(doc(db, 'urgent_requests', id));
         } catch(e) {
             alert('Failed to delete post');
         }
      }
   };

   if (loadingAuth) {
      return <div className="flex items-center justify-center min-h-screen text-gray-500 bg-gray-50">Checking authorization...</div>;
   }

   if (!isAuthorized) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center transition-colors bg-gray-50">
            <ShieldAlert className="w-16 h-16 mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Access Denied!</h1>
            <p className="mt-2 text-gray-500">Only the admin can view this page.</p>
            <p className="mt-1 text-xs text-gray-400">Make sure you are logged in with the correct Phone Number.</p>
            <a href="/" className="px-6 py-2 mt-6 font-bold text-white transition-colors bg-red-600 shadow-md rounded-xl hover:bg-red-700">Go back Home</a>
         </div>
      );
   }

   return (
     <div className="min-h-screen p-4 text-gray-900 transition-colors bg-gray-50 sm:p-8">
       <div className="max-w-6xl mx-auto">
           <header className="flex items-center gap-3 pb-4 mb-8 border-b border-gray-200">
               <ShieldAlert className="w-8 h-8 text-red-600" />
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">Hidden Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">Manage all ReDrop users and posts</p>
               </div>
           </header>

           <div className="grid gap-6 md:grid-cols-2">
             {/* Users Table */}
             <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-3xl">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Registered Users</h2>
                  <span className="px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">{users.length} Total</span>
               </div>
               <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
                  {users.map(u => (
                     <div key={u.id} className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl">
                        <div>
                           <p className="text-sm font-semibold text-gray-900">{u.name || 'Unnamed'} <span className="font-bold text-red-600">({u.group || '?'})</span></p>
                           <p className="mt-1 text-xs text-gray-500">{u.phone}</p>
                        </div>
                        <button onClick={() => deleteUser(u.id)} className="p-2 text-red-500 transition-colors rounded-lg hover:bg-red-50 :bg-red-900/20" title="Delete User">
                           <Trash2 className="w-5 h-5"/>
                        </button>
                     </div>
                  ))}
                  {users.length === 0 && <p className="py-10 text-center text-gray-500">No users found</p>}
               </div>
             </div>

             {/* Posts History Table */}
             <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-3xl">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Urgent Posts History</h2>
                  <span className="px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">{posts.length} Total</span>
               </div>
               <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
                  {posts.map(p => {
                     let isExpired = false;
                     if (p.timestamp) {
                        const diffHrs = (Date.now() - p.timestamp.toDate().getTime()) / (1000 * 60 * 60);
                        isExpired = diffHrs >= 24;
                     }
                     return (
                     <div key={p.id} className={`flex justify-between items-center p-4 rounded-xl border transition-colors ${isExpired ? 'bg-gray-50 border-gray-100 opacity-70' : 'bg-gray-50 border-red-100'}`}>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                             <p className="text-sm font-semibold text-gray-900">{p.name || 'Anonymous'}</p>
                             <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isExpired ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                               {isExpired ? 'Expired' : 'Active Live'}
                             </span>
                           </div>
                           <p className="text-xs font-bold text-red-600">Needs {p.bloodGroup} at {p.location}</p>
                           {p.timestamp && <p className="text-[10px] text-gray-400 mt-1">{p.timestamp.toDate().toLocaleString()}</p>}
                        </div>
                        <button onClick={() => deletePost(p.id)} className="p-2 text-red-500 transition-colors rounded-lg hover:bg-red-50" title="Delete Post">
                           <Trash2 className="w-5 h-5"/>
                        </button>
                     </div>
                  )})}
                  {posts.length === 0 && <p className="py-10 text-center text-gray-500">No post history found</p>}
               </div>
             </div>
           </div>
       </div>
     </div>
   );
};

export default AdminPanel;
