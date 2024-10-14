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
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isFileMenu ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-lg p-4 sm:max-w-[425px] w-full">
        <h2 className="text-lg font-semibold">Upload Files</h2>
        <p className="text-sm text-gray-600 mb-4">Choose a file type to upload. You can upload up to 5 files at a time.</p>
        <div className="grid grid-cols-2 gap-4">
          {fileTypes.map(({ type, icon: Icon, label, accept }) => (
            <div key={type} className="flex flex-col items-center">
              <button
                onClick={() => selectFile(type)}
                className="w-full p-4 text-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Icon className="mx-auto mb-2" size={24} />
                <span>{label}</span>
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
        <div className="flex justify-end mt-4">
          <button onClick={closeFileMenu} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default FileMenu;
