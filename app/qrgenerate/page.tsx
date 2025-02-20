"use client";
import React, { useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchQrLink } from "@/redux/features/qrSlice";
import html2canvas from "html2canvas";
import { QRCode } from "react-qrcode-logo";

const page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { link: qrLink, loading, error } = useSelector(
    (state: RootState) => state.qr
  );
  const designRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchQrLink());
  }, [dispatch]);

  const handleDownload = async () => {
    if (!designRef.current) return;
    const canvas = await html2canvas(designRef.current);
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "menu-qr.png";
    link.click();
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 min-h-screen bg-beige w-full ml-14">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-customGold">Generate QR</h1>
        </div>

        <div className="flex justify-center items-center min-h-[80vh]">
          <div
            ref={designRef}
            className="relative w-[350px] h-[500px] bg-white shadow-xl rounded-md overflow-hidden"
          >
            {/* BACKGROUND IMAGE SECTION */}
            <div
              className="absolute top-0 left-0 w-full h-[300px] bg-cover bg-center"
              style={{ backgroundImage: "url('/assets/background.jpg')" }}
            >
                 <div className="absolute inset-0 bg-black opacity-60"></div>
              {/* Push text block higher with `justify-start` and `pt-8` */}
              <div className="flex flex-col items-center justify-start w-full h-full text-center text-white drop-shadow-md pt-8">
                <p className="uppercase font-bold text-base leading-tight">
                  VIEW OUR
                </p>
                <p className="uppercase font-bold text-5xl leading-tight mt-1">
                  MENU
                </p>
                <p className="uppercase font-bold text-base leading-tight mt-1">
                  - ONLINE -
                </p>
              </div>
            </div>

            {/* DARK OVERLAY SECTION */}
            <div className="absolute bottom-0 left-0 w-full h-[200px] bg-[#1C2B2D] flex flex-col items-center justify-end pb-4">
              <img
                src="/assets/logo.png"
                alt="Vertical by Jetwing"
                className="w-32 h-auto"
              />
            </div>

            {/* QR CODE SECTION */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{ top: "190px" }}
            >
              <div className="bg-white p-2 rounded-md shadow-md">
                {loading && <p className="text-black">Loading QR...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && qrLink && (
                  <QRCode
                    value={qrLink}
                    size={160}
                    fgColor="#C77A4B"
                    bgColor="#FFFFFF"
                    logoImage="/assets/logowithback.png"
                    logoWidth={50}
                    logoHeight={50}
                    ecLevel="H"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Download button */}
        <div className="flex justify-center mt-3">
          <button
            onClick={handleDownload}
            className="bg-customorange text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-400 cursor-pointer"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
