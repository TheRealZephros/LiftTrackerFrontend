import axios from "axios";
import { toast } from "react-toastify";

export const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
        const err = error.response;
        if (Array.isArray(err?.data?.errors)) {
            for (let val of err?.data.errors) {
                toast.warning(val.description, { theme: "dark" });
            }
        } else if (typeof err?.data.errors === 'object') {
            for (let key in err?.data.errors) {
                toast.warning(err?.data.errors[key][0], { theme: "dark" });
            }
        } else if (err?.data) {
            toast.error(err.data, { theme: "dark" });
        } else if (err?.status === 401) {
            // axiosClient will handle logout if refresh failed
            toast.error("Unauthorized request.", { theme: "dark" });
        } else if (err) {
            console.error("Unexpected error:", error);
        }
    }
};