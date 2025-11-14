import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import PageMeta from "../common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { ArrowLeft, Pencil, PlusIcon, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";

interface PricingPlan {
    id: number;
    planName: string;
    amount: string;
    keys: string[];
}

interface ApiPlan {
    id: number;
    plan_name: string;
    price: string;
    point_1?: string;
    point_2?: string;
    point_3?: string;
    point_4?: string;
    point_5?: string;
    point_6?: string;
    point_7?: string;
}

interface FormErrors {
    planName: string;
    amount: string;
    keys: string[];
    keysGeneral?: string;
}

export default function AllPricing() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [planName, setPlanName] = useState("");
    const [amount, setAmount] = useState("");
    const [keys, setKeys] = useState<string[]>(["", "", "", "", ""]);
    const { id } = useParams<{ id?: string }>();
    const [plan, setPlan] = useState<ApiPlan | null>(null);
    const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
    const [planToDelete, setPlanToDelete] = useState<PricingPlan | null>(null);

    const handleAddField = () => setKeys([...keys, ""]);

    const [errors, setErrors] = useState<FormErrors>({
        planName: "",
        amount: "",
        keys: ["", "", "", "", "", "", ""],
        keysGeneral: "",
    });

    // Add plan
    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Please fix validation errors before submitting.");
            return;
        }

        const sanitizedPlanName = planName.trim().replace(/[^a-zA-Z\s]/g, "");
        const sanitizedAmount = amount.trim().replace(/[^0-9.]/g, "");

        if (!sanitizedPlanName || !sanitizedAmount || keys.filter((k) => k.trim()).length < 5) {
            toast.error("Plan name, amount, and at least 5 features are required.");
            return;
        }

        try {
            setIsLoading(true); // 🔹 Start loading

            const payload = {
                plan_name: sanitizedPlanName,
                price: sanitizedAmount,
                point_1: keys[0] || "",
                point_2: keys[1] || "",
                point_3: keys[2] || "",
                point_4: keys[3] || "",
                point_5: keys[4] || "",
                point_6: keys[5] || "",
                point_7: keys[6] || "",
            };

            await axios.post(
                "https://nystai-backend.onrender.com/pricing-plans/add-pricing-plan",
                payload
            );

            toast.success("Pricing plan added!");
            setIsAddOpen(false);
            resetForm();
            fetchPlans();
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const apiErrors = err.response?.data?.errors;
                if (Array.isArray(apiErrors) && apiErrors.length > 0) {
                    apiErrors.forEach((e: { msg: string }) => console.error(e.msg));
                    toast.error(apiErrors[0].msg);
                } else {
                    toast.error("Failed to add plan.");
                }
            } else {
                toast.error("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false); // 🔹 Stop loading
        }
    };

    const validateForm = () => {
        let valid = true;
        let newErrors: FormErrors = { planName: "", amount: "", keys: Array(keys.length).fill(""), keysGeneral: "" };

        if (!planName.trim()) {
            newErrors.planName = "Plan name is required";
            valid = false;
        } else if (!/^[A-Za-z\s]+$/.test(planName.trim())) {
            newErrors.planName = "Plan name must only contain letters";
            valid = false;
        }

        if (!amount.trim()) {
            newErrors.amount = "Amount is required";
            valid = false;
        } else if (!/^\d+(\.\d+)?$/.test(amount.trim())) {
            newErrors.amount = "Amount must be a valid number";
            valid = false;
        }

        for (let i = 0; i < 5; i++) {
            if (!keys[i] || !keys[i].trim()) {
                newErrors.keys[i] = `Key ${i + 1} is required`;
                valid = false;
            }
        }

        setErrors(newErrors);
        return valid;
    };

    const validateEditForm = () => {
        let valid = true;
        let newErrors: FormErrors = { planName: "", amount: "", keys: Array(keys.length).fill(""), keysGeneral: "" };

        if (!planName.trim()) {
            newErrors.planName = "Plan name is required";
            valid = false;
        } else if (!/^[A-Za-z\s]+$/.test(planName.trim())) {
            newErrors.planName = "Plan name must only contain letters";
            valid = false;
        }

        if (!amount.trim()) {
            newErrors.amount = "Amount is required";
            valid = false;
        } else if (!/^\d+(\.\d+)?$/.test(amount.trim())) {
            newErrors.amount = "Amount must be a valid number";
            valid = false;
        }

        if (keys.length < 5) {
            newErrors.keysGeneral = "At least 5 features are required";
            valid = false;
        }

        for (let i = 0; i < Math.min(5, keys.length); i++) {
            if (!keys[i] || !keys[i].trim()) {
                newErrors.keys[i] = `Feature ${i + 1} is required`;
                valid = false;
            } else if (!/^[A-Za-z\s]+$/.test(keys[i].trim())) {
                newErrors.keys[i] = `Feature ${i + 1} must only contain letters`;
                valid = false;
            }
        }

        for (let i = 5; i < keys.length; i++) {
            if (keys[i] && keys[i].trim() && !/^[A-Za-z\s]+$/.test(keys[i].trim())) {
                newErrors.keys[i] = `Feature ${i + 1} must only contain letters`;
                valid = false;
            }
        }

        setErrors(newErrors);
        return valid;
    };

    const handleRemoveKey = (index: number) => {
        setKeys((prevKeys) => prevKeys.filter((_, i) => i !== index));
    };

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://nystai-backend.onrender.com/pricing-plans/all-pricing-plans");
            const apiPlans: ApiPlan[] = response.data.data || [];
            const formattedPlans: PricingPlan[] = apiPlans.map((p) => ({
                id: p.id,
                planName: p.plan_name,
                amount: p.price.replace(/[^0-9.]/g, ""),
                keys: [
                    p.point_1,
                    p.point_2,
                    p.point_3,
                    p.point_4,
                    p.point_5,
                    p.point_6,
                    p.point_7,
                ].filter(Boolean) as string[],
            }));
            setPricingPlans(formattedPlans);
        } catch (error) {
            console.error("Error fetching plans:", error);
            // ❌ remove this: toast.error("Failed to fetch pricing plans.");
            // just let the UI show "No pricing plans found."
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    useEffect(() => {
        const fetchPlan = async () => {
            if (!id) return;
            try {
                const res = await axios.get<{ plan: ApiPlan }>(
                    `https://nystai-backend.onrender.com/pricing-plans/single-plan/${id}`
                );
                setPlan(res.data.plan);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch pricing plan");
            }
        };
        fetchPlan();
    }, [id]);

    useEffect(() => {
        if (plan) {
            setPlanName(plan.plan_name || "");
            setAmount(plan.price || "");
            setKeys([
                plan.point_1 || "",
                plan.point_2 || "",
                plan.point_3 || "",
                plan.point_4 || "",
                plan.point_5 || "",
                plan.point_6 || "",
                plan.point_7 || "",
            ]);
        }
    }, [plan]);

    const handleUpdate = async () => {
        if (!validateEditForm()) {
            toast.error("Please fix validation errors before submitting.");
            return;
        }
        if (!editingPlan) return;

        try {
            setIsUpdateLoading(true); // 🔹 start loading

            const payload = {
                plan_name: planName,
                price: amount,
                point_1: keys[0] || "",
                point_2: keys[1] || "",
                point_3: keys[2] || "",
                point_4: keys[3] || "",
                point_5: keys[4] || "",
                point_6: keys[5] || "",
                point_7: keys[6] || "",
            };

            await axios.put(
                `https://nystai-backend.onrender.com/pricing-plans/update-pricing-plan/${editingPlan.id}`,
                payload
            );

            toast.success("Plan updated successfully!");
            closeEditModal();
            setEditingPlan(null);
            fetchPlans();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update plan");
        } finally {
            setIsUpdateLoading(false); // 🔹 stop loading
        }
    };

    const handleDelete = async () => {
        if (!planToDelete) return;

        try {
            setIsDeleteLoading(true); // 🔹 start loading

            await axios.delete(
                `https://nystai-backend.onrender.com/pricing-plans/delete-pricing-plan/${planToDelete.id}`
            );

            toast.success("Plan deleted successfully!");
            closeDeleteModal();
            fetchPlans();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete plan");
        } finally {
            setIsDeleteLoading(false); // 🔹 stop loading
        }
    };

    const handleKeyChange = (index: number, value: string) => {
        const updatedKeys = [...keys];
        updatedKeys[index] = value;
        setKeys(updatedKeys);
    };

    const resetForm = () => {
        setPlanName("");
        setAmount("");
        setKeys(["", "", "", "", ""]);
    };

    const openDeleteModal = (plan: PricingPlan) => {
        setPlanToDelete(plan);
        setIsDeleteOpen(true);
    };

    const closeDeleteModal = () => {
        setPlanToDelete(null);
        setIsDeleteOpen(false);
    };

    return (
        <>
            <PageMeta title="All Pricing - Nystai Institute" description="All available pricing plans" />
            <PageBreadcrumb pageTitle="All Pricing" />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="mb-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:mb-7">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">All Pricing</h3>
                    <button
                        onClick={() => {
                            resetForm();
                            setIsAddOpen(true);
                        }}
                        className="flex items-center gap-2 w-fit rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
                    >
                        <PlusIcon className="size-5 text-gray-800" />
                        Add Plans
                    </button>
                </div>

                {/* ✅ Add Plan Modal */}
                <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} className="max-w-[700px] m-4">
                    <div className="w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                        <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90 text-center">Add Plans Form</h4>
                        <form className="flex flex-col mt-5" onSubmit={(e) => e.preventDefault()}>
                            <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label className="mb-3">Plan Name</Label>
                                        <Input
                                            type="text"
                                            placeholder="IoT Foundation"
                                            value={planName}
                                            onChange={(e) => setPlanName(e.target.value)}
                                        />
                                        {errors.planName && <p className="text-red-500 text-sm">{errors.planName}</p>}
                                    </div>
                                    <div>
                                        <Label className="mb-3">Plan Amount</Label>
                                        <Input
                                            type="text"
                                            placeholder="12000"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                        {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
                                    </div>
                                    <div className="lg:col-span-2">
                                        <Label className="mb-3">Key Features</Label>
                                        {/* For keys: */}
                                        {keys.map((key, idx) => (
                                            <div key={idx}>
                                                <Input
                                                    placeholder={`Key ${idx + 1}`}
                                                    value={key}
                                                    onChange={(e) => handleKeyChange(idx, e.target.value)}
                                                    className="mb-2"
                                                />
                                                {errors.keys[idx] && <p className="text-red-500 text-sm">{errors.keys[idx]}</p>}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleAddField}
                                            className="text-sm text-[#F8C723] mt-1 underline"
                                        >
                                            + Add another key
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
                                <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800">
                                    <ArrowLeft className="size-5 text-[#F8C723]" />
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-10 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
                                    disabled={isLoading} // 🔹 Disable while loading
                                >
                                    {isLoading ? "Adding..." : "Add New Plan"}  {/* 🔹 Show loading text */}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>

                {/* Display Pricing Plans */}
                <div className="w-full max-w-[1200px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    {loading ? (
                        <p className="text-center p-10">Loading pricing plans...</p>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto no-scrollbar">
                            {pricingPlans.length > 0 ? (
                                pricingPlans.map((plan, index) => (
                                    <div
                                        key={index}
                                        className="min-w-[300px] max-w-sm p-6 bg-[#f5f5f5] rounded-2xl bg-cover bg-center flex flex-col justify-between"
                                        style={{
                                            backgroundImage: "url('/images/AllCourse/pricingcardbg.png')",
                                            minHeight: "500px",
                                        }}
                                    >
                                        <div>
                                            <h2 className="mb-2 text-xl text-center font-semibold text-[#000]">
                                                {plan.planName}
                                            </h2>
                                            <p className="text-4xl py-4 text-center font-bold text-[#C79A07] mb-2">
                                                ₹{plan.amount}
                                            </p>
                                            <hr className="border-gray-300 mb-4" />
                                            <ul className="space-y-2 text-gray-700 text-sm min-h-[150px]">
                                                {plan.keys.map((key, idx) => (
                                                    <li key={idx} className="py-1 text-[#212121]">{key}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="flex justify-center gap-2">
                                            {/* Edit Button */}
                                            <button
                                                onClick={() => {
                                                    setEditingPlan(plan);
                                                    setPlanName(plan.planName);
                                                    setAmount(plan.amount);
                                                    setKeys(plan.keys.length ? plan.keys : [""]);
                                                    openEditModal();
                                                }}
                                                className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-8 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
                                            >
                                                <Pencil className="w-4 h-4" /> Edit Plan
                                            </button>
                                            {/* Delete Button */}
                                            <button
                                                onClick={() => openDeleteModal(plan)}
                                                className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center p-10">No pricing plans found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ Edit Plan Modal */}
            <Modal isOpen={isEditOpen} onClose={closeEditModal} className="max-w-[700px] m-4">
                <div className="w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90 text-center">Edit Plan</h4>
                    <form className="flex flex-col mt-5" onSubmit={(e) => e.preventDefault()}>
                        <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label className="mb-3">Plan Name</Label>
                                    <Input type="text" value={planName} onChange={(e) => setPlanName(e.target.value)} />
                                    {errors.planName && <p className="text-red-500 text-sm">{errors.planName}</p>}
                                </div>
                                <div>
                                    <Label className="mb-3">Plan Amount</Label>
                                    <Input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                    {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
                                </div>
                                <div className="lg:col-span-2">
                                    <Label className="mb-3">Key Features</Label>
                                    {keys.map((key, idx) => (
                                        <div key={idx} className="mb-3">
                                            <div className="relative w-full mb-3">
                                                <Input
                                                    placeholder={`Feature ${idx + 1}`}
                                                    value={key}
                                                    onChange={(e) => handleKeyChange(idx, e.target.value)}
                                                    className="w-full pr-10" // padding right to make space for button
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveKey(idx)}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 p-1"
                                                    aria-label={`Remove feature ${idx + 1}`}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            {errors.keys && errors.keys[idx] && (
                                                <p className="text-red-500 text-sm mt-1 ml-1">{errors.keys[idx]}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                    {/* General error for keys count */}
                                    {errors.keysGeneral && (
                                        <p className="text-red-500 text-sm mt-1">{errors.keysGeneral}</p>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleAddField}
                                        className="text-sm text-[#F8C723] mt-1 underline"
                                    >
                                        + Add another key
                                    </button>
                                
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
                            <button onClick={closeEditModal} className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800">
                                <ArrowLeft className="size-5 text-[#F8C723]" />
                            </button>
                            <button
                                type="submit"
                                onClick={handleUpdate}
                                className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-10 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
                                disabled={isUpdateLoading} // 🔹 disable while loading
                            >
                                {isUpdateLoading ? "Updating..." : "Update Plan"}  {/* 🔹 show loading text */}
                            </button>

                        </div>
                    </form>
                </div>
            </Modal>

            {/* ✅ Delete Modal */}
            {isDeleteOpen && planToDelete && (
                <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal} className="max-w-md m-4">
                    <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 ">
                        <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-8">
                            Confirm Plan Deletion
                        </h4>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-10 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
                                disabled={isDeleteLoading} // 🔹 disable while loading
                            >
                                {isDeleteLoading ? "Deleting..." : "Yes, Delete Plan"}  {/* 🔹 show loading text */}
                            </button>
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800"
                            >
                                <X size={18} className="text-[#F8C723]" />
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}


