import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { Download, Printer, Smartphone, Clock, CheckCircle, Loader, Upload, RefreshCw } from "lucide-react";

export default function PC() {
  const [session, setSession] = useState(() => Math.random().toString(36).slice(2, 8));
  const [fileReady, setFileReady] = useState(false);
  const [fileBlob, setFileBlob] = useState(null);
  const [fileName, setFileName] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const [checking, setChecking] = useState(false);

  const host = window.location.hostname;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setSession(Math.random().toString(36).slice(2, 8));
          setFileReady(false);
          setFileBlob(null);
          setFileName("");
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const checkForFile = async () => {
    setChecking(true);
    try {
      const res = await fetch(`http://${host}:5000/file/${session}`);
      if (res.ok) {
        const blob = await res.blob();
        const fileNameFromHeader = res.headers.get("X-File-Name");
        const name = fileNameFromHeader || "uploaded_file";
        setFileBlob(blob);
        setFileName(name);
        setFileReady(true);
      } else if (res.status === 404) {
        alert("No file uploaded yet for this session.");
      } else {
        alert("Error checking for file.");
      }
    } catch (err) {
      alert("Network error. Make sure the backend is running.");
    }
    setChecking(false);
  };

  const handleDownload = () => {
    if (fileBlob) {
      const url = URL.createObjectURL(fileBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    if (fileBlob) {
      const url = URL.createObjectURL(fileBlob);
      const printWindow = window.open(url);
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  };

  const qrUrl = `http://${host}:5173/?mobile=true&session=${session}`;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
            QuickTransfer
          </h1>
          <p className="text-white/90 text-lg">Seamless file sharing between devices</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Left Side - Send Files */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-purple-500/20 hover:shadow-3xl">
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              
              {/* Title */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Send Files</h2>
                <p className="text-gray-600">Scan QR code with your mobile</p>
              </div>

              {/* QR Code - Centered */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-2xl border-4 border-indigo-100">
                  <QRCodeCanvas value={qrUrl} size={280} level="H" />
                </div>
              </div>

              {/* Scan Instruction Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-6 py-3 rounded-full text-sm font-medium shadow-sm border border-indigo-100">
                <Smartphone className="w-5 h-5" />
                Open camera and scan QR code
              </div>

              {/* Timer - Simple and Clean */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl px-8 py-4 shadow-sm border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Session expires in</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatTime(timeLeft)}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Side - Receive Files */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-purple-500/20 hover:shadow-3xl">
            <div className="flex flex-col h-full">
              
              {/* Title */}
              <div className="text-center pb-6 mb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Receive Files</h2>
                <p className="text-gray-600">Check for uploaded files</p>
              </div>

              {!fileReady ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                  
                  {/* Waiting Illustration */}
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <Upload className="w-16 h-16 text-purple-400" />
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Status Text */}
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-gray-700">Waiting for files...</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      Upload a file from your mobile device and click check
                    </p>
                  </div>

                  {/* Check Button */}
                  <button
                    onClick={checkForFile}
                    disabled={checking}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[200px]"
                  >
                    {checking ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-5 h-5" />
                        Check for Files
                      </>
                    )}
                  </button>

                </div>
              ) : (
                <div className="flex-1 flex flex-col space-y-6 animate-fade-in">
                  
                  {/* Success Header */}
                  <div className="text-center flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 shadow-lg animate-bounce-once">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">File Received!</h3>
                    <p className="text-gray-600">Your file is ready</p>
                  </div>

                  {/* File Info */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 flex-shrink-0">
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Download className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 break-all">File Name: {fileName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 flex-1 flex flex-col justify-end">
                    <button
                      onClick={handleDownload}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download File
                    </button>
                    
                    <button
                      onClick={handlePrint}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Printer className="w-5 h-5" />
                      Print File
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>
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