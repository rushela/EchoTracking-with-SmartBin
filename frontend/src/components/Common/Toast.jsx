import { useToast } from "@chakra-ui/react";

/**
 * A reusable toast notification hook for consistent feedback.
 */
const useCustomToast = () => {
  const toast = useToast();

  const showToast = ({ title, description, status = "success", duration = 3000 }) => {
    toast({
      title,
      description,
      status,
      duration,
      isClosable: true,
      position: "top-right",
    });
  };

  return showToast;
};

export default useCustomToast;
