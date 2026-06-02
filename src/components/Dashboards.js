import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase-config';
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { auth } from '../firebase/firebase-config';

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch leads from database
  const fetchLeads = async () => {
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const leadsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeads(leadsData);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Update lead status
  const updateStatus = async (leadId, newStatus) => {
    try {
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, { status: newStatus });
      fetchLeads();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Add note to lead
  const addNote = async (leadId) => {
    if (!newNote.trim()) return;
    
    try {
      const leadRef = doc(db, 'leads', leadId);
      const lead = leads.find(l => l.id === leadId);
      const existingNotes = lead.notes || [];
      
      await updateDoc(leadRef, {
        notes: [...existingNotes, { text: newNote, date: new Date().toISOString() }]
      });
      
      setNewNote('');
      fetchLeads();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Delete lead
  const deleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteDoc(doc(db, 'leads', leadId));
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return { bg: '#eff6ff', color: '#3b82f6', text: 'NEW' };
      case 'contacted': return { bg: '#f3f4f6', color: '#6b7280', text: 'CONTACTED' };
      case 'converted': return { bg: '#f0fdf4', color: '#166534', text: 'CONVERTED' };
      default: return { bg: '#f3f4f6', color: '#6b7280', text: status };
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading leads...</div>;
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#166534' }}>Lead Management System</h1>
        <button
          onClick={() => auth.signOut()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <h3 style={{ color: '#3b82f6' }}>{leads.filter(l => l.status === 'new').length}</h3>
          <p>New Leads</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <h3 style={{ color: '#6b7280' }}>{leads.filter(l => l.status === 'contacted').length}</h3>
          <p>Contacted</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <h3 style={{ color: '#166534' }}>{leads.filter(l => l.status === 'converted').length}</h3>
          <p>Converted</p>
        </div>
      </div>

      {/* Leads Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead style={{ backgroundColor: '#f3f4f6' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Source</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Message</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Notes</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const statusStyle = getStatusColor(lead.status);
              return (
                <tr key={lead.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem' }}>{lead.name}</td>
                  <td style={{ padding: '1rem' }}>{lead.email}</td>
                  <td style={{ padding: '1rem' }}>{lead.source || 'Website'}</td>
                  <td style={{ padding: '1rem', maxWidth: '250px', wordBreak: 'break-word' }}>
                    {lead.message || '-'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="new">NEW</option>
                      <option value="contacted">CONTACTED</option>
                      <option value="converted">CONVERTED</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {lead.notes && lead.notes.length > 0 ? (
                      <details>
                        <summary style={{ cursor: 'pointer', color: '#3b82f6' }}>
                          {lead.notes.length} note(s)
                        </summary>
                        {lead.notes.map((note, idx) => (
                          <div key={idx} style={{ fontSize: '12px', marginTop: '5px', padding: '5px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                            {note.text}
                            <br />
                            <small>{new Date(note.date).toLocaleDateString()}</small>
                          </div>
                        ))}
                      </details>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>No notes</span>
                    )}
                    <div style={{ marginTop: '8px' }}>
                      <input
                        type="text"
                        placeholder="Add note..."
                        value={selectedLead === lead.id ? newNote : ''}
                        onChange={(e) => {
                          setSelectedLead(lead.id);
                          setNewNote(e.target.value);
                        }}
                        style={{
                          padding: '0.25rem',
                          fontSize: '12px',
                          width: '120px',
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      />
                      <button
                        onClick={() => {
                          addNote(lead.id);
                          setSelectedLead(null);
                        }}
                        style={{
                          marginLeft: '5px',
                          padding: '0.25rem 0.5rem',
                          fontSize: '12px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {leads.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#6b7280' }}>
          No leads yet. Submit a lead from the contact form or add manually in Firebase Console.
        </div>
      )}
    </div>
  );
}

export default Dashboard;