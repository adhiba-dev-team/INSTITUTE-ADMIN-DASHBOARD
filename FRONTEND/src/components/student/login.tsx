import { useState } from "react";
import nyslogo from "../../../public/images/logo/Nystai logo svg.svg";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { toast } from "react-hot-toast";

export default function StudentLogin() {
    const [certificateId, setCertificateId] = useState("");
    const [aadhar, setAadhar] = useState("");
    const [pan, setPan] = useState("");
    const [certificateUrl, setCertificateUrl] = useState<string | null>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!certificateId) {
            toast.error("Certificate Number is required");
            return;
        }

        if (!(aadhar && pan)) {
            toast.error("Please provide Aadhaar and PAN");
            return;
        }

        try {
            const res = await fetch(
                "https://nystai-backend.onrender.com/studentscertificates/verify",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        certificateId,
                        aadhar,
                        pan,
                    }),
                }
            );

            const data = await res.json();
            if (data.success) {
                setCertificateUrl(data.certificateUrl);
                localStorage.setItem("certificateUrl", data.certificateUrl);
                toast.success("✅ Certificate verified successfully");
            } else {
                toast.error(data.error || "Verification failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error. Please try again later.");
        }
    };

    if (certificateUrl) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center">
                <img
                    src={certificateUrl}
                    alt="Certificate"
                    className="w-full h-auto max-h-[90vh] object-contain"
                />
            </div>
        );
    }

    return (
        <>
            <div
                className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: "url('/images/loginimg/loginimg.jpg')" }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-white/90 backdrop-blur-md"></div>

                <div className="relative w-full max-w-6xl p-8 rounded-xl">
                    <div className="grid grid-cols-1 xl:grid-cols-6 gap-6">
                        {/* Left Section */}
                        <div className="xl:col-span-3 p-6 sm:p-12 flex flex-col justify-center rounded-lg">
                            <div>
                                <img src={nyslogo} className="w-52 mx-auto" alt="logo" />
                            </div>

                            {!certificateUrl ? (
                                <form
                                    onSubmit={handleVerify}
                                    className="w-full flex-1 mt-6 mx-auto max-w-md flex flex-col justify-center"
                                >
                                    <div className="space-y-3 mb-6 text-center">
                                        <h1 className="text-2xl xl:text-3xl font-extrabold text-gray-900">
                                            Verify Certificate
                                        </h1>
                                        <p className="text-base xl:text-lg font-medium text-gray-500 leading-relaxed">
                                            Please fill in the required details to verify your certificate.
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <Label>Certificate Number</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter Certificate Number"
                                            value={certificateId}
                                            onChange={(e) => setCertificateId(e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <Label>Aadhaar Number</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter Aadhaar Number"
                                            value={aadhar}
                                            onChange={(e) => setAadhar(e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <Label>PAN Number</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter PAN Number"
                                            value={pan}
                                            onChange={(e) => setPan(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="mt-6 gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-20 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
                                    >
                                        Verify
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center mt-6">
                                    <h2 className="text-xl font-bold text-green-600 mb-4">
                                        ✅ Certificate Verified!
                                    </h2>
                                    <img
                                        src={certificateUrl}
                                        alt="Certificate"
                                        className="mx-auto border rounded-lg shadow-lg max-h-[500px]"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right Section */}
                        <div className="hidden xl:flex xl:col-span-3">
                            <div
                                className="w-full h-full bg-cover bg-center rounded-xl"
                                style={{ backgroundImage: "url('/images/loginimg/rightimg.jpg')" }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
