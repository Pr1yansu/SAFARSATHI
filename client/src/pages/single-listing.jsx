import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetTouristSpotByIdQuery } from "../store/apis/touristspots";
import Loader from "../components/ui/loader";
import Avatar from "../components/ui/avatar";
import { IconPickerItem } from "react-icons-picker";
import Accordion from "../components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";
import { DateRangePicker } from "react-date-range";
import MapComponent from "../components/filter-steps/map/map-component";
import { formatCurrency } from "../components/utils/utils";
import Button from "../components/ui/button";
import useModal from "../components/hooks/modal";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import LocationFetcher from "../components/listing/location-fetcher";
import toast from "react-hot-toast";
import {
  useCreateReserveMutation,
  useGetReserveByTouristSpotIdQuery,
} from "../store/apis/reserve";
import PaymentBTN from "../components/ui/payment-btn";
import ReviewTouristSpot from "./components/review";
import { HiShieldCheck, HiCheckCircle, HiMapPin, HiKey, HiCalendar, HiCheckBadge, HiWifi, HiTv, HiTruck } from "react-icons/hi2";
import { MdVerified, MdKitchen } from "react-icons/md";

const SingleListing = ({ profile }) => {
  const { id } = useParams();
  const { open } = useModal();
  const [createReserve] = useCreateReserveMutation();
  const {
    data: reserve,
    refetch: refetchReserve,
  } = useGetReserveByTouristSpotIdQuery(id, {
    skip: !id,
  });
  const [openIndex, setOpenIndex] = useState(null);
  const [isAccordionVisible, setAccordionVisible] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [price, setPrice] = useState(0);

  const {
    data: touristSpot,
    isLoading,
    refetch: refetchTouristSpot,
  } = useGetTouristSpotByIdQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    if (touristSpot) {
      setPrice(touristSpot.price);
    }
  }, [touristSpot]);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleLearnMoreClick = () => {
    setAccordionVisible(!isAccordionVisible);
  };

  const handleDateChange = (ranges) => {
    const { selection } = ranges;
    setDateRange(selection);
  };

  const calculateTotalPrice = () => {
    const { startDate, endDate } = dateRange;
    const days = Math.max(1, (endDate - startDate) / (1000 * 3600 * 24));
    return formatCurrency(days * price);
  };

  const handleReserve = useCallback(async () => {
    toast.dismiss();
    if (!profile) {
      open("login");
      return;
    }

    try {
      const { startDate, endDate } = dateRange;
      if (startDate === endDate) {
        toast.error("Please select a valid date range");
        return;
      }

      await createReserve({
        touristSpot: touristSpot._id,
        startDate,
        endDate,
        price: price,
      })
        .unwrap()
        .then((payload) => {
          toast.success(payload.message);
          refetchReserve();
        })
        .catch((err) => {
          toast.error(err.data?.message || "Reservation error");
        });
    } catch (error) {
      toast.error("Failed to reserve tourist spot");
    }
  }, [profile, touristSpot, dateRange, price, createReserve, refetchReserve, open]);

  if (isLoading && !touristSpot) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <Loader fullScreen={false} text="Loading destination details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 gradient-hero-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title & Metadata */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {touristSpot?.name}
            </h1>
            {touristSpot?.verified && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-xs">
                <MdVerified className="text-emerald-500" />
                <span>Verified Spot</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600">
            <LocationFetcher
              lat={touristSpot?.location?.lat}
              lng={touristSpot?.location?.lng}
              address={touristSpot?.location?.address}
            />
          </div>
        </div>

        {/* Hero Image Gallery Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-card border border-slate-200/80 aspect-[16/9] lg:aspect-[21/9] w-full bg-slate-100">
          <img
            src={touristSpot?.image?.secure_url}
            alt={touristSpot?.name}
            className="w-full h-full object-cover hover:scale-103 transition-transform duration-700 cursor-pointer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
          
          {touristSpot?.category?.label && (
            <div className="absolute top-4 left-4 z-10 glass-badge px-4 py-1.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-2 shadow-xs">
              <IconPickerItem value={touristSpot?.category?.icon} size={16} />
              <span>{touristSpot.category.label}</span>
            </div>
          )}
        </div>

        {/* Main 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          {/* Left Main Column: Details, Highlights, Description, Map & REVIEWS */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Host Section */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Hosted by {touristSpot?.host?.name}</span>
                  <HiCheckCircle className="text-indigo-600 text-lg" />
                </h3>
                <p className="text-xs text-slate-500 font-medium">Verified Premier Host • SAFARSATHI Partner</p>
              </div>
              <Avatar
                hostName={touristSpot?.host?.name}
                avatar={touristSpot?.host?.avatar}
              />
            </div>

            {/* Property Highlights Section */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-card space-y-4">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">Property Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <HiCheckBadge className="text-indigo-600 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Experienced Superhost</h4>
                    <p className="text-[11px] text-slate-500">Known for high ratings and 100% response rates.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <HiMapPin className="text-indigo-600 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Great Location</h4>
                    <p className="text-[11px] text-slate-500">95% of recent guests gave the location 5 stars.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <HiKey className="text-indigo-600 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Keyless Smart Check-in</h4>
                    <p className="text-[11px] text-slate-500">Self check-in using secure door passcode.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <HiCalendar className="text-indigo-600 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Flexible Policy</h4>
                    <p className="text-[11px] text-slate-500">Free cancellation up to 48 hours before check-in.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specs & Amenities Badges */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-card space-y-4">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">Included Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-800">
                  <HiWifi className="text-indigo-600 text-lg" />
                  <span>High-speed Wi-Fi</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-800">
                  <HiTv className="text-indigo-600 text-lg" />
                  <span>HD Smart TV</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-800">
                  <MdKitchen className="text-indigo-600 text-lg" />
                  <span>Full Kitchen</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-800">
                  <HiTruck className="text-indigo-600 text-lg" />
                  <span>Free Parking</span>
                </div>
              </div>
            </div>

            {/* Safar Cover Protection Section */}
            <div className="p-6 bg-gradient-to-r from-indigo-50/80 via-violet-50/80 to-pink-50/50 rounded-3xl border border-indigo-100/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <HiShieldCheck className="text-indigo-600 text-3xl" />
                  <span>safar<span className="gradient-text">cover</span></span>
                </h4>
                <span className="text-[10px] uppercase tracking-widest font-extrabold bg-indigo-600 text-white px-2.5 py-1 rounded-full shadow-xs">
                  Included Free
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every booking includes comprehensive protection against Host cancellations, listing inaccuracies, and check-in support.
              </p>

              <button
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline cursor-pointer"
                onClick={handleLearnMoreClick}
              >
                {isAccordionVisible ? "Show Less Details" : "Learn More About Protection"}
              </button>

              <AnimatePresence>
                {isAccordionVisible && (
                  <motion.div
                    className="mt-4 pt-4 border-t border-indigo-100"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Accordion>
                      <Accordion.Item
                        title="What's Covered Under Safar Cover"
                        isOpen={openIndex === 0}
                        onToggle={() => handleToggle(0)}
                      >
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Full refund if a Host cancels within 30 days of check-in, or if the listing isn’t as advertised. 24/7 dedicated support line.
                        </p>
                      </Accordion.Item>
                      <Accordion.Item
                        title="Exclusions & Policy Terms"
                        isOpen={openIndex === 1}
                        onToggle={() => handleToggle(1)}
                      >
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Standard travel delays outside host control are subject to individual cancellation tiers.
                        </p>
                      </Accordion.Item>
                    </Accordion>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Spot Description */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-card space-y-3">
              <h3 className="text-lg font-bold text-slate-900">About This Destination</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {touristSpot?.description}
              </p>
            </div>

            {/* Location Map Section */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-card space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <HiMapPin className="text-indigo-600" />
                <span>Location & Surroundings</span>
              </h3>
              <div className="rounded-2xl overflow-hidden border border-slate-200 h-80 shadow-inner">
                <MapComponent
                  location={touristSpot?.location}
                  zoomControl={false}
                  zoom={6}
                />
              </div>
            </div>

            {/* REVIEWS SECTION — Full Width in Main Column */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-card">
              <ReviewTouristSpot
                touristSpotId={touristSpot._id}
                reviews={touristSpot?.reviews || []}
                refetch={refetchTouristSpot}
              />
            </div>
          </div>

          {/* Right Sticky Column: Reservation Widget Only */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-6">
            {/* Reservation Card */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80 space-y-5">
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">
                    {formatCurrency(price)}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">/ night</span>
                </div>
                {touristSpot?.verified && (
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Best Rate
                  </span>
                )}
              </div>

              {/* Date Range Picker Widget */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <DateRangePicker
                  ranges={[dateRange]}
                  onChange={handleDateChange}
                  rangeColors={["#4f46e5"]}
                  minDate={new Date()}
                  maxDate={new Date(new Date().getFullYear() + 2, 11, 31)}
                />
              </div>

              {reserve ? (
                <div className="space-y-3">
                  <Button
                    className="w-full font-bold py-3"
                    disabled
                    intent="ghost"
                  >
                    Already Reserved
                  </Button>
                  {reserve.paid === false && (
                    <PaymentBTN reservationId={reserve._id}>
                      Pay Now ({calculateTotalPrice()})
                    </PaymentBTN>
                  )}
                  {reserve.paid === false && (
                    <Button className="w-full font-bold" intent="danger">
                      Cancel Reservation
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  onClick={handleReserve}
                  size="lg"
                  intent="primary"
                  className="w-full font-bold shadow-glow"
                >
                  Reserve Now
                </Button>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-600 text-xs sm:text-sm font-semibold">
                <span>Total Estimated</span>
                <span className="text-base font-extrabold text-slate-900">
                  {calculateTotalPrice()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleListing;
