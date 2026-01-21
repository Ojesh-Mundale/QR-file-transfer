import { useState } from "react";
import { Upload, CheckCircle, FileText, Loader, AlertCircle, Smartphone } from "lucide-react";

export default function Mobile() {
  const params = new URLSearchParams(window.location.search);
  const session = params.get("session");
  
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  async function upload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);

      const BACKEND = import.meta.env.VITE_BACKEND_URL;

const res = await fetch(`${BACKEND}/upload/${session}`, {

        method: "POST",
        body: form
      });

      if (res.ok) {
        setUploaded(true);
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setUploading(false);
    }
  }

  const handleReset = () => {
    setUploaded(false);
    setFileName("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative z-10 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
            QuickTransfer
          </h1>
          <p className="text-white/90">Upload files to your Computer</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 transform transition-all duration-500">
          
          {!uploaded ? (
            <div className="space-y-6">
              
              {/* Upload Area */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Select File</h2>
                <p className="text-gray-600 text-sm mb-6">Choose a file to send to your Computer</p>
                
                <label 
                  htmlFor="file-upload" 
                  className="relative block cursor-pointer group"
                >
                  <input
                    id="file-upload"
                    type="file"
                    onChange={upload}
                    disabled={uploading}
                    className="hidden"
                  />
                  
                  <div className="border-4 border-dashed border-gray-300 rounded-2xl p-8 transition-all duration-300 group-hover:border-purple-400 group-hover:bg-purple-50/50">
                    <div className="flex flex-col items-center space-y-4">
                      
                      {uploading ? (
                        <>
                          <div className="relative">
                            <div className="w-20 h-20 rounded-full border-4 border-purple-200 flex items-center justify-center">
                              <Loader className="w-10 h-10 text-purple-600 animate-spin" />
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-800">Uploading...</p>
                            <p className="text-sm text-gray-600 mt-1">{fileName}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-10 h-10 text-white" />
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-800">Tap to upload</p>
                            <p className="text-sm text-gray-500 mt-1">Any file type supported</p>
                          </div>
                        </>
                      )}
                      
                    </div>
                  </div>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Upload Error</p>
                    <p className="text-sm text-red-600 mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              {/* Session Info */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-medium">Session ID</p>
                    <p className="text-sm font-mono font-semibold text-gray-800 truncate">{session}</p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-6 text-center animate-fade-in">
              
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg animate-bounce-once">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Success Message */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">File Sent!</h3>
                <p className="text-gray-600">Your file has been uploaded successfully</p>
              </div>

              {/* File Info */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 text-left">
                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-medium">File Name</p>
                    <p className="text-sm font-semibold text-gray-800 break-all">{fileName}</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Next step:</span> Go to your Computer and click "Check for Files" to download
                </p>
              </div>

              {/* Upload Another Button */}
              <button
                onClick={handleReset}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Another File
              </button>

            </div>
          )}

        </div>

        {/* Footer Note */}
        <p className="text-center text-white/80 text-xs mt-4">
          
        </p>

      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}