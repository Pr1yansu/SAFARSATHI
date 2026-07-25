import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useModal from "../hooks/modal";
import { IoClose } from "react-icons/io5";
import LocationPicker from "../filter-steps/map/location-picker";
import CategoryPicker from "../rent/category-picker";
import { useGetCategoriesQuery } from "../../store/apis/categories";
import Loader from "../ui/loader";
import AmenitiesCounter from "../rent/amenities-counter";
import AddImage from "../rent/add-image";
import GuestsAndRooms from "../rent/guess-rooms";
import DescriptionPricing from "../rent/description-pricing";
import {
  useCreateTouristSpotMutation,
  useGetTouristSpotsQuery,
} from "../../store/apis/touristspots";
import toast from "react-hot-toast";

const RentHome = () => {
  const {
    data: categories,
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
  } = useGetCategoriesQuery();
  const { isOpen, variant, close } = useModal();
  const [createTouristSpot] = useCreateTouristSpotMutation();
  const { refetch: refetchAllTouristSpots } = useGetTouristSpotsQuery();

  const [selectedLocation, setSelectedLocation] = useState({
    lat: null,
    lng: null,
    address: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amenities, setAmenities] = useState({
    wifi: { count: 0, icon: "IoWifiOutline" },
    tv: { count: 0, icon: "IoTvOutline" },
    kitchen: { count: 0, icon: "IoFastFoodOutline" },
    ac: { count: 0, icon: "IoSnowOutline" },
    heating: { count: 0, icon: "IoBonfireOutline" },
    parking: { count: 0, icon: "IoCarOutline" },
  });
  const [moreInfo, setMoreInfo] = useState({
    guests: 1,
    rooms: 1,
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(false);

  const actionLabel = useMemo(() => {
    return currentStep === totalSteps ? "Publish Listing" : "Next Step";
  }, [currentStep]);

  const secondaryActionLabel = useMemo(() => {
    return currentStep === 1 ? null : "Back";
  }, [currentStep]);

  const handleNext = async () => {
    let isValid = true;
    toast.dismiss();

    switch (currentStep) {
      case 1:
        if (!selectedCategory) {
          isValid = false;
          toast.error("Please pick a category for your property.");
        }
        break;
      case 2:
        if (
          !selectedLocation.lat ||
          !selectedLocation.lng ||
          !selectedLocation.address
        ) {
          isValid = false;
          toast.error("Please click on the map to set a valid property location.");
        }
        break;
      case 3:
        break;
      case 4:
        const currentImages = selectedImages.length > 0 ? selectedImages : selectedImage ? [selectedImage] : [];
        if (currentImages.length === 0) {
          isValid = false;
          toast.error("Please upload at least 1 photo for your listing.");
        }
        break;
      case 5:
        if (moreInfo.guests < 1 || moreInfo.rooms < 1) {
          isValid = false;
          toast.error("Please specify at least 1 guest capacity and 1 room.");
        }
        break;
      case 6:
        if (!name || name.trim().length < 5) {
          isValid = false;
          toast.error("Please enter a property title (min 5 characters).");
        } else if (!description || description.trim().length < 15) {
          isValid = false;
          toast.error("Please provide a property description (min 15 characters).");
        } else if (Number(price) < 100) {
          isValid = false;
          toast.error("Please enter a valid nightly price (minimum ₹100).");
        } else if (!address) {
          isValid = false;
          toast.error("Please provide a street address.");
        }
        break;
      default:
        break;
    }

    if (isValid) {
      if (currentStep === totalSteps) {
        await handleSubmit();
      } else {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, totalSteps));
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", selectedCategory);
    formData.append("location", JSON.stringify(selectedLocation));
    formData.append("amenities", JSON.stringify(amenities));
    
    const imageList = selectedImages.length > 0 ? selectedImages : selectedImage ? [selectedImage] : [];
    if (imageList[0]) {
      formData.append("image", imageList[0]);
    }
    imageList.forEach((img) => {
      formData.append("images", img);
    });

    formData.append("moreInfo", JSON.stringify(moreInfo));
    formData.append("description", description);
    formData.append("price", price);
    formData.append("address", address);

    try {
      await createTouristSpot(formData).unwrap();
      toast.success("Property listed successfully!");
      refetchAllTouristSpots();
      close();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to publish listing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setSelectedCategory(null);
      setSelectedImages([]);
      setSelectedImage(null);
      setSelectedLocation({ lat: null, lng: null, address: "" });
      setAmenities({
        wifi: { count: 0, icon: "AiOutlineWifi" },
        tv: { count: 0, icon: "RiTv2Line" },
        kitchen: { count: 0, icon: "MdOutlineKitchen" },
        ac: { count: 0, icon: "TbAirConditioning" },
        heating: { count: 0, icon: "IoMdBonfire" },
        parking: { count: 0, icon: "AiOutlineCar" },
      });
      setMoreInfo({
        guests: 1,
        rooms: 1,
        adults: 1,
        children: 0,
        infants: 0,
      });
      setDescription("");
      setPrice(0);
      setAddress("");
      setName("");
    }
  }, [isOpen]);

  if (variant !== "rent") {
    return null;
  }

  if (categoriesLoading || categoriesFetching) {
    return <Loader />;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={close}
        >
          <motion.div
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 max-w-xl w-full relative space-y-5 overflow-hidden scrollbar-none max-h-[90vh] flex flex-col justify-between"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header & Step Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                    Step {currentStep} of {totalSteps}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                    List Your Property
                  </h3>
                </div>
                <button
                  onClick={close}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <IoClose size={20} />
                </button>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full gradient-bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto scrollbar-none py-2">
              {currentStep === 1 && (
                <CategoryPicker
                  categories={categories}
                  onChange={(category) => setSelectedCategory(category)}
                  selectedCategory={selectedCategory}
                />
              )}
              {currentStep === 2 && (
                <LocationPicker
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                />
              )}
              {currentStep === 3 && (
                <AmenitiesCounter
                  amenities={amenities}
                  setAmenities={setAmenities}
                />
              )}
              {currentStep === 4 && (
                <AddImage
                  selectedImages={selectedImages}
                  setSelectedImages={setSelectedImages}
                  onChange={(image) => setSelectedImage(image)}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                />
              )}
              {currentStep === 5 && (
                <GuestsAndRooms moreInfo={moreInfo} setMoreInfo={setMoreInfo} />
              )}
              {currentStep === 6 && (
                <DescriptionPricing
                  description={description}
                  setDescription={setDescription}
                  price={price}
                  setPrice={setPrice}
                  address={address}
                  setAddress={setAddress}
                  name={name}
                  setName={setName}
                />
              )}
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              {secondaryActionLabel ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors disabled:opacity-50"
                >
                  {secondaryActionLabel}
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="px-8 py-3.5 gradient-bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>{actionLabel}</span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RentHome;
