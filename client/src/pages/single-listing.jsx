import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetTouristSpotByIdQuery } from "../store/apis/touristspots";
import Loader from "../components/ui/loader";
import Avatar from "../components/ui/avatar";
import Separator from "../components/ui/separator";
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

const SingleListing = ({ profile }) => {
  const { id } = useParams();
  const { open } = useModal();
  const [createReserve] = useCreateReserveMutation();
  const {
    data: reserve,
    isLoading: reserveIsLoading,
    isFetching: reserveIsFetching,
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
    isFetching,
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
          toast.error(err.data.message);
        });
    } catch (error) {
      toast.error("Failed to reserve tourist spot");
    }
  }, [profile, touristSpot, dateRange, price, createReserve, refetchReserve]);

  if (isLoading || isFetching || reserveIsLoading || reserveIsFetching) {
    return <Loader />;
  }

  return (
    <div className="max-w-screen-lg mx-auto my-4 p-4">
      <div className="space-y-4">
        <h4 className="text-3xl font-semibold text-gray-800">
          {touristSpot?.name}
        </h4>
        <LocationFetcher
          lat={touristSpot?.location?.lat}
          lng={touristSpot?.location?.lng}
          address={touristSpot?.location?.address}
        />
        <div className="rounded-xl overflow-hidden shadow-md">
          <img
            src={touristSpot?.image?.secure_url}
            alt={touristSpot?.name}
            className="w-full aspect-video object-cover rounded-xl hover:scale-125 transition-transform duration-300 cursor-pointer"
          />
        </div>
        <div className="flex flex-wrap items-start max-md:gap-4">
          <div className="w-3/5 space-y-4 lg:pe-4 max-md:w-full">
            {/* Host Information */}
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-gray-800">
                Hosted by {touristSpot?.host?.name}
              </p>
              <Avatar
                hostName={touristSpot?.host?.name}
                avatar={touristSpot?.host?.avatar}
              />
            </div>

            {/* Amenities and Details */}
            <div className="flex items-center gap-4 flex-wrap">
              {Object.keys(touristSpot?.info).map((info) => (
                <p key={info} className="flex items-center gap-1 text-gray-500">
                  {touristSpot?.info[info]}
                  <span className="lowercase">{info}</span>
                </p>
              ))}
            </div>

            <Separator />
            <div className="flex items-center gap-4">
              <IconPickerItem value={touristSpot?.category?.icon} size={40} />
              <div>
                <p className="text-lg font-semibold text-gray-800 uppercase">
                  {touristSpot?.category?.label}
                </p>
                <p className="text-sm font-medium text-gray-500">
                  This property is near {touristSpot?.category?.label}.
                </p>
              </div>
            </div>

            {/* Learn More Section */}
            <Separator />
            <div>
              <h4 className="text-3xl font-semibold">
                <span className="text-purple-500">safar</span> cover
              </h4>
              <p className="text-gray-500">
                Every booking includes free protection from Host cancellations,
                listing inaccuracies, and other issues like trouble checking in.
              </p>
              <button
                className="text-purple-500 hover:underline mt-4"
                onClick={handleLearnMoreClick}
              >
                {isAccordionVisible ? "Show Less" : "Learn More"}
              </button>
              <AnimatePresence>
                {isAccordionVisible && (
                  <motion.div
                    className="max-w-lg mt-8"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Accordion>
                      <Accordion.Item
                        title="What's covered"
                        isOpen={openIndex === 0}
                        onToggle={() => handleToggle(0)}
                      >
                        <p className="text-sm text-gray-500">
                          If a Host cancels your booking, you'll get a full
                          refund. If things go wrong, we'll help make it right.
                        </p>
                      </Accordion.Item>
                      <Accordion.Item
                        title="What's not covered"
                        isOpen={openIndex === 1}
                        onToggle={() => handleToggle(1)}
                      >
                        <p className="text-sm text-gray-500">
                          We can't help if you don't meet check-in requirements,
                          or if the issue isn't covered by our policies.
                        </p>
                      </Accordion.Item>
                    </Accordion>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Description */}
            <Separator className="my-4" />
            <div>
              <p className="text-base text-gray-500">
                {touristSpot?.description}
              </p>
            </div>

            {/* Map Section */}
            <Separator className="my-4" />
            <div>
              <h4 className="text-xl font-semibold text-gray-800">
                Where you will be
              </h4>
              <div
                className="rounded-xl overflow-hidden shadow-md mt-4"
                style={{ height: "400px" }}
              >
                <MapComponent
                  location={touristSpot?.location}
                  zoomControl={false}
                  zoom={6}
                />
              </div>
            </div>
          </div>

          <div className="w-2/5 lg:ps-2 max-md:w-full max-md:flex max-sm:flex-wrap gap-4">
            {/* Reservation Sidebar */}
            <div className="bg-white rounded-xl p-4 shadow-md border w-full">
              <span className="text-xl mb-4 font-semibold text-gray-800 uppercase block">
                {formatCurrency(price)}
                <span className="text-gray-500">/night</span>
              </span>
              <div className="border border-gray-300 rounded-md">
                <DateRangePicker
                  ranges={[dateRange]}
                  onChange={handleDateChange}
                  rangeColors={["#8b5cf6"]}
                  minDate={new Date()}
                  maxDate={new Date(new Date().getFullYear() + 40, 11, 31)}
                />
              </div>
              {reserve ? (
                <div className="flex flex-col space-y-4">
                  <div className="flex gap-4 items-center">
                    <Button
                      className="mt-4 w-full rounded-md"
                      disabled
                      intent="ghost"
                    >
                      Already Reserved
                    </Button>
                    {reserve.paid === false && (
                      <PaymentBTN reservationId={reserve._id}>
                        Pay Now {calculateTotalPrice()}
                      </PaymentBTN>
                    )}
                  </div>
                  {reserve.paid === false && (
                    <Button className="mt-4 w-full rounded-md" intent="danger">
                      Cancel
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  onClick={handleReserve}
                  className="mt-4 w-full rounded-md"
                >
                  Reserve
                </Button>
              )}
              <Separator className="my-4" />
              <div className="flex items-center justify-between mt-4 text-gray-500 px-2">
                <span className="text-sm font-medium cursor-pointer">
                  Total
                </span>
                <span className="text-lg font-semibold text-gray-800">
                  {calculateTotalPrice()}
                </span>
              </div>
            </div>
            {/* Reviews Section */}
            <div className="bg-white rounded-xl p-4 shadow-md md:mt-4 border w-full">
              <ReviewTouristSpot
                touristSpotId={touristSpot._id}
                reviews={touristSpot?.reviews || []}
                refetch={refetchTouristSpot}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleListing;
