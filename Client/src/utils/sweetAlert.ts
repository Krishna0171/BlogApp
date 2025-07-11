import Swal from "sweetalert2";
import type { ConfirmOptions } from "../types/general";

export const confirmDialog = async ({
  title = "Are you sure?",
  text = "This action cannot be undone.",
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel",
}: ConfirmOptions = {}) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });

  return result.isConfirmed;
};

export const logoutDialog = async (
  timeUntilLogout: number
): Promise<boolean> => {
  let timerInterval: number;
  const result = await Swal.fire({
    title: "Session Expired!",
    html: "Your session is expired in <b></b>. Do you want to logout and login again?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, logout",
    cancelButtonText: "Stay Logged In",
    timer: timeUntilLogout,
    timerProgressBar: true,
    didOpen: () => {
      const timer = Swal.getPopup()!.querySelector("b")!;
      timerInterval = setInterval(() => {
        timer.textContent = `${Math.floor((Swal.getTimerLeft() ?? 0) / 1000)}s`;
      }, 100);
    },
    willClose: () => {
      if (timerInterval) clearInterval(timerInterval);
    },
  });

  return result.isConfirmed || result.dismiss === Swal.DismissReason.timer;
};
