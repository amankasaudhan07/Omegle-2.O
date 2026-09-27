import React, { useRef } from "react";
import { Camera } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { userExists } from "../../redux/reducers/auth";
import { useUpdateAvatarMutation } from "../../redux/api/api";
import UserAvatar from "./UserAvatar";

const AvatarUpload = ({ user, className = "h-14 w-14", showLabel = false }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [updateAvatar, { isLoading }] = useUpdateAvatarMutation();

  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);
    const toastId = toast.loading("Updating profile photo...");

    try {
      const result = await updateAvatar(formData).unwrap();
      dispatch(userExists(result.user));
      toast.success(result.message, { id: toastId });
    } catch (error) {
      toast.error(error?.data?.message || "Could not update profile photo", { id: toastId });
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        aria-label="Update profile photo"
        title="Update profile photo"
        className={`relative shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] ${className} ${isLoading ? "opacity-60" : ""}`}
      >
        <UserAvatar name={user?.name} src={user?.avatar} className="h-full w-full" />
        <span className="absolute bottom-0 right-0 rounded-full bg-[var(--brand)] p-1 text-white shadow">
          <Camera className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </button>
      {showLabel && (
        <div className="min-w-0">
          <p className="truncate font-medium" style={{ color: "var(--text)" }}>{user?.name}</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isLoading}
            className="text-sm font-medium text-[var(--brand)] disabled:opacity-60"
          >
            {isLoading ? "Updating" : "Change photo"}
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

export default AvatarUpload;
