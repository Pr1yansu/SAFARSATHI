import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useModal from "../hooks/modal";
import { IoClose } from "react-icons/io5";
import Button from "../ui/button";
import LocationPicker from "../filter-steps/map/location-picker";
import CategoryPicker from "../rent/category-picker";
import { useGetCategoriesQuery } from "../../store/apis/categories";
import Loader from "../ui/loader";
import Separator from "../ui/separator";
import AmenitiesCounter from "../rent/amenities-counter";
import AddImage from "../rent/add-image";
import GuestsAndRooms from "../rent/guess-rooms";
import DescriptionPricing from "../rent/description-pricing";
import {
  useCreateTouristSpotMutation,
  useGetTouristSpotsQuery,
} from "../../store/apis/touristspots";
import toast from "react-hot-toast";

const Steps = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex gap-2 items-center justify-start absolute top-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${
            currentStep === index + 1 ? "bg-purple-500" : "bg-gray-300"
          }`}
        ></div>
      ))}
    </div>
  );
};

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [loading, setLoading] = useState(false); // New loading state

  const actionLabel = useMemo(() => {
    return currentStep === totalSteps ? "Submit" : "Next";
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
          toast.error("Please select a category.");
        }
        break;
      case 2:
        if (
          !selectedLocation.lat ||
          !selectedLocation.lng ||
          !selectedLocation.address
        ) {
          isValid = false;
          toast.error("Please select a valid location.");
        }
        break;
      case 3:
        break;
      case 4:
        if (!selectedImage) {
          isValid = false;
          toast.error("Please upload an image.");
        }
        break;
      case 5:
        if (moreInfo.guests < 1 || moreInfo.rooms < 1) {
          isValid = false;
          toast.error("Please provide valid guest and room information.");
        }
        break;
      case 6:
        if (!name || !description || price <= 0 || !address) {
          isValid = false;
          toast.error(
            "Please provide all required details (name, description, price, and address)."
          );
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
    setLoading(true); // Set loading to true
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", selectedCategory);
    formData.append("location", JSON.stringify(selectedLocation));
    formData.append("amenities", JSON.stringify(amenities));
    formData.append("image", selectedImage);
    formData.append("moreInfo", JSON.stringify(moreInfo));
    formData.append("description", description);
    formData.append("price", price);
    formData.append("address", address);

    try {
      await createTouristSpot(formData).unwrap();
      refetchAllTouristSpots();
      close();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setSelectedCategory(null);
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
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={close}
        >
          <motion.div
            className="bg-white rounded-md p-4 shadow-md max-w-md w-full mx-6 relative space-y-2 m-4"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Button
              className="absolute top-2 right-2"
              onClick={close}
              size="icon"
              intent="ghost"
            >
              <IoClose size={24} />
            </Button>

            {/* Step Indicators */}
            <Steps currentStep={currentStep} totalSteps={totalSteps} />

            {/* Content based on step */}
            <div className="text-sm font-semibold text-center text-zinc-800">
              Rent your home
            </div>
            <Separator />
            <div>
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

            {/* Action Buttons */}
            <div className="flex justify-between mt-4 gap-2">
              {secondaryActionLabel && (
                <Button
                  onClick={handleBack}
                  className="bg-gray-300 px-4 py-2 rounded-md w-full"
                  intent="outline"
                  disabled={loading} // Disable button if loading
                >
                  {secondaryActionLabel}
                </Button>
              )}
              {loading ? ( // Show loading spinner instead of button
                <Loader className="w-full h-10" />
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md w-full"
                  disabled={loading}
                >
                  {actionLabel}
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RentHome;
