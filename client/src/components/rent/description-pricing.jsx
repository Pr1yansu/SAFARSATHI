import React from "react";
import { HiCurrencyRupee, HiMapPin, HiPencilSquare, HiTag } from "react-icons/hi2";

const DescriptionPricing = ({
  description,
  setDescription,
  price,
  setPrice,
  address,
  setAddress,
  name,
  setName,
}) => {
  return (
    <div className="bg-white rounded-2xl max-h-[440px] overflow-y-auto scrollbar-none space-y-4 pr-1">
      <div className="space-y-1">
        <h4 className="text-xl font-black text-slate-900 tracking-tight">
          Property Details & Pricing
        </h4>
        <p className="text-xs font-semibold text-slate-500">
          Provide a clear title, description, address, and nightly rate for your listing
        </p>
      </div>

      <div className="space-y-4">
        {/* Name / Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <HiTag className="text-indigo-600" />
            <span>Listing Title</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Luxury Himalayan Mountain Villa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
          {!name && (
            <p className="text-[10px] font-bold text-rose-500">* Title is required (min 5 chars)</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <HiPencilSquare className="text-indigo-600" />
            <span>Detailed Description</span>
          </label>
          <textarea
            rows={3}
            placeholder="Describe your place, surrounding views, special amenities, and house rules..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
          />
          {!description && (
            <p className="text-[10px] font-bold text-rose-500">* Description is required (min 20 chars)</p>
          )}
        </div>

        {/* Price & Address Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <HiCurrencyRupee className="text-emerald-600" />
              <span>Price per Night (₹)</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs font-black text-slate-400">₹</span>
              <input
                type="number"
                min={100}
                placeholder="2500"
                value={price || ""}
                onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>
            {price < 100 && (
              <p className="text-[10px] font-bold text-rose-500">* Minimum price is ₹100/night</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <HiMapPin className="text-indigo-600" />
              <span>Full Street Address</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mall Road, Manali, HP 175131"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
            {!address && (
              <p className="text-[10px] font-bold text-rose-500">* Street address required</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionPricing;
