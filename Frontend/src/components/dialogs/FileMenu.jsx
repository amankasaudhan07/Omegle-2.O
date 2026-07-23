import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsFileMenu, setUploadingLoader } from '../../redux/reducers/misc';
import { useSendAttachmentsMutation } from '../../redux/api/api';
import { Camera, FileAudio, FileVideo, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const FileMenu = ({ chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [sendAttachments] = useSendAttachmentsMutation();

  const fileRefs = {
    image: useRef(null),
    audio: useRef(null),
    video: useRef(null),
    file: useRef(null),
  };

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const selectFile = (type) => fileRefs[type].current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length <= 0) return;
    if (files.length > 5) {
     return toast.error(`You can only send 5 ${key} at a time`);
     
    }

    dispatch(setUploadingLoader(true));
    const toastId =toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try {
      const myForm = new FormData();
      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm);
       console.log("res",res);
      if (res.data) {
        toast.success(`${key} sent successfully`,{id:toastId});
      } else {
        toast.error(`Failed to send ${key}`,{id:toastId});
      }
    } catch (error) {
      toast.error(error,{id:toastId});
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  const fileTypes = [
    { type: 'image', icon: Camera, label: 'Image', accept: 'image/png, image/jpeg, image/gif' },
    { type: 'audio', icon: FileAudio, label: 'Audio', accept: 'audio/mpeg, audio/wav' },
    { type: 'video', icon: FileVideo, label: 'Video', accept: 'video/mp4, video/webm, video/ogg' },
    { type: 'file', icon: Upload, label: 'File', accept: '*' },
  ];

 return (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
      isFileMenu ? "flex" : "hidden"
    }`}
  >
    <div
      className="w-full max-w-[425px] rounded-2xl p-6 shadow-2xl transition-all duration-300"
      style={{
        backgroundColor: "var(--surface)",
        color: "var(--text)",
        border: "1px solid var(--border)",
      }}
    >
      <h2
        className="text-xl font-bold mb-2"
        style={{ color: "var(--text)" }}
      >
        Upload Files
      </h2>

      <p
        className="text-sm mb-6"
        style={{
          color: "var(--text)",
          opacity: 0.7,
        }}
      >
        Choose a file type to upload. You can upload up to 5 files at a time.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {fileTypes.map(({ type, icon: Icon, label, accept }) => (
          <div key={type}>
            <button
              onClick={() => selectFile(type)}
              className="w-full rounded-xl p-4 transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "var(--bg)",
                color: "var(--text)",
                border: "1px solid var(--border)",
              }}
            >
              <Icon
                className="mx-auto mb-2"
                size={26}
                style={{ color: "var(--text)" }}
              />

              <span className="font-medium">{label}</span>
            </button>

            <input
              type="file"
              multiple
              accept={accept}
              className="hidden"
              onChange={(e) => fileChangeHandler(e, `${label}s`)}
              ref={fileRefs[type]}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={closeFileMenu}
          className="px-5 py-2 rounded-lg font-medium transition-all duration-300 hover:opacity-90"
          style={{
            backgroundColor: "var(--border)",
            color: "var(--text)",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);
};

export default FileMenu;
