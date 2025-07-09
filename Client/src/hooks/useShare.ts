import { toast } from "react-toastify";

export const useShare = () => {
  const share = async (title: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        toast.error("Sharing failed!");
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.success("Failed to copy link!");
      }
    }
  };

  return { share };
};