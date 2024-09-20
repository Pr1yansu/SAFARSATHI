import { create } from "zustand";

const useModal = create((set) => ({
  isOpen: false,
  variant: "",
  data: {},
  open: (variant, data) => set({ isOpen: true, variant, data }),
  close: () => set({ isOpen: false, variant: "", data: {} }),
}));

export default useModal;
