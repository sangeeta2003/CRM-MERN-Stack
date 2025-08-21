import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', status: 'Lead', notes: '' });
  const [editingId, setEditingId] = useState(null);

  const headers = { Authorization: `Bearer ${localStorage.getItem('token') || ''}` };

  const load = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/contacts`, { headers });
    setContacts(res.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/contacts/${editingId}`, form, { headers });
    } else {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/contacts`, form, { headers });
    }
    setForm({ name: '', email: '', phone: '', company: '', status: 'Lead', notes: '' });
    setEditingId(null);
    load();
  };

  const edit = (c) => {
    setEditingId(c._id);
    setForm({ name: c.name, email: c.email, phone: c.phone || '', company: c.company || '', status: c.status || 'Lead', notes: c.notes || '' });
  };

  const remove = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/contacts/${id}`, { headers });
    load();
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-3">
        <h2>Contacts</h2>
        <form onSubmit={submit} className="mb-3">
          <div className="row g-2">
            <div className="col"><input className="form-control" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
            <div className="col"><input type="email" className="form-control" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
            <div className="col"><input className="form-control" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
            <div className="col"><input className="form-control" placeholder="Company" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} /></div>
            <div className="col">
              <select className="form-select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                <option>Lead</option>
                <option>Prospect</option>
                <option>Customer</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
          <div className="mt-2">
            <textarea className="form-control" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
          </div>
          <div className="mt-2">
            <button className="btn btn-primary" type="submit">{editingId ? 'Update' : 'Add'} Contact</button>
            {editingId && <button type="button" className="btn btn-secondary ms-2" onClick={()=>{setEditingId(null); setForm({ name: '', email: '', phone: '', company: '', status: 'Lead', notes: '' });}}>Cancel</button>}
          </div>
        </form>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.company}</td>
                <td>{c.status}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>edit(c)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


