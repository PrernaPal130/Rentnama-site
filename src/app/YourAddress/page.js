"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Phone,
  Home,
  X,
} from "lucide-react";
import { useAppData } from "../../context/myContext";

const emptyForm = {
  label: "Home",
  name: "",
  phone: "",
  address: "",
  note: "",
  defaultAddress: false,
};

export default function YourAddressPage() {
  const { addresses, addAddress, updateAddress, deleteAddress } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editingId) {
      updateAddress(editingId, formData);
    } else {
      addAddress(formData);
    }

    closeForm();
  }

  function handleEdit(address) {
    setEditingId(address.id);
    setFormData({
      label: address.label,
      name: address.name,
      phone: address.phone,
      address: address.address,
      note: address.note,
      defaultAddress: address.defaultAddress,
    });
    setShowForm(true);
  }

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/Account"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
        >
          <ArrowLeft size={16} />
          Back to your account
        </Link>

        <section className="mt-5 rounded-[28px] border border-[#ecd8d1] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
                Your Address
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                Manage saved delivery addresses
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                View every saved address, choose who receives the outfit, and
                keep delivery details updated for future rentals.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData(emptyForm);
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c97762] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b96954]"
            >
              <Plus size={18} />
              Add New Address
            </button>
          </div>

          {showForm ? (
            <div className="mt-8 rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#bc7766]">
                    {editingId ? "Edit Address" : "New Address"}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                    {editingId
                      ? "Update delivery address"
                      : "Add a delivery address"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-full border border-[#e4c8c0] p-2 text-gray-600 hover:bg-[#fff6f2]"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-4 md:grid-cols-2"
              >
                <label className="text-sm text-gray-700">
                  <span className="mb-2 block font-medium">Address Label</span>
                  <select
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#e5d1cb] px-4 py-3 outline-none focus:border-[#d88b76]"
                  >
                    <option>Home</option>
                    <option>Office</option>
                    <option>Parents&apos; Home</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="text-sm text-gray-700">
                  <span className="mb-2 block font-medium">Person Name</span>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter recipient name"
                    className="w-full rounded-2xl border border-[#e5d1cb] px-4 py-3 outline-none focus:border-[#d88b76]"
                  />
                </label>

                <label className="text-sm text-gray-700">
                  <span className="mb-2 block font-medium">Phone Number</span>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-2xl border border-[#e5d1cb] px-4 py-3 outline-none focus:border-[#d88b76]"
                  />
                </label>

                <label className="text-sm text-gray-700">
                  <span className="mb-2 block font-medium">Address Note</span>
                  <input
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Delivery timing or landmark"
                    className="w-full rounded-2xl border border-[#e5d1cb] px-4 py-3 outline-none focus:border-[#d88b76]"
                  />
                </label>

                <label className="text-sm text-gray-700 md:col-span-2">
                  <span className="mb-2 block font-medium">Full Address</span>
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House number, area, city, state, PIN"
                    rows={4}
                    className="w-full rounded-2xl border border-[#e5d1cb] px-4 py-3 outline-none focus:border-[#d88b76]"
                  />
                </label>

                <label className="inline-flex items-center gap-3 text-sm text-gray-700 md:col-span-2">
                  <input
                    type="checkbox"
                    name="defaultAddress"
                    checked={formData.defaultAddress}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-[#d5b7af] text-[#c97762] focus:ring-[#d88b76]"
                  />
                  Set as default address
                </label>

                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <button
                    type="submit"
                    className="rounded-full bg-[#c97762] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b96954]"
                  >
                    {editingId ? "Update Address" : "Save Address"}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-full border border-[#e4c8c0] bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-[#fff6f2]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {addresses.map((address) => (
              <article
                key={address.id}
                className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                        {address.label === "Home" ? (
                          <Home size={20} />
                        ) : (
                          <MapPin size={20} />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#bc7766]">
                          {address.label}
                        </p>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {address.name}
                        </h2>
                      </div>
                    </div>

                    {address.defaultAddress ? (
                      <div className="mt-3 inline-flex rounded-full bg-[#f5d7cf] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#9b5848]">
                        Default Address
                      </div>
                    ) : null}
                  </div>

                  <div className="text-right text-xs font-medium text-gray-500">
                    {address.id}
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <Phone size={16} className="mt-0.5 text-[#b46c5b]" />
                    <span>{address.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 text-[#b46c5b]" />
                    <span>{address.address}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-[#fcf1ed] px-4 py-3 text-sm text-gray-600">
                  {address.note || "No additional delivery note added."}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(address)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#fff6f2]"
                  >
                    <Pencil size={16} />
                    Edit Address
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAddress(address.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#f0d1cb] bg-[#fff4f1] px-4 py-2.5 text-sm font-medium text-[#b85c50] hover:bg-[#ffe9e4]"
                  >
                    <Trash2 size={16} />
                    Delete Address
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
