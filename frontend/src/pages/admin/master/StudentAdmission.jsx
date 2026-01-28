import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  registerStudent,
  fetchStudents,
  resetStatus,
} from "../../../features/student/studentSlice";
import {
  fetchCourses,
  fetchBatches,
  fetchReferences,
  fetchEducations,
  createReference,
  createEducation,
} from "../../../features/master/masterSlice";
import { fetchInquiries } from "../../../features/transaction/transactionSlice";
import { fetchEmployees } from "../../../features/employee/employeeSlice";
import { getBranches } from "../../../features/master/branchSlice"; // Import API
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios"; // Added axios
import {
  Upload,
  ChevronRight,
  ChevronLeft,
  Save,
  Search,
  Plus,
  X,
  UserCheck,
  CreditCard,
  CheckCircle,
  Trash2,
} from "lucide-react";

const LOCATION_DATA = {
  Gujarat: ["Surat", "Ahmedabad", "Vadodara", "Rajkot"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Delhi: ["New Delhi", "Noida", "Gurgaon"],
};

// getUniqueEducation removed - using centralized master list instead

const StudentAdmission = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSuccess, students, isLoading, message } = useSelector(
    (state) => state.students
  );
  const { inquiries } = useSelector((state) => state.transaction);
  const { courses, batches, references, educations } = useSelector((state) => state.master);
  const { employees } = useSelector((state) => state.employees) || {
    employees: [],
  };
  const { branches } = useSelector((state) => state.branch);
  const { user } = useSelector((state) => state.auth); // Get Auth User

  const [step, setStep] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewCourses, setPreviewCourses] = useState([]);
  const [foundInquiry, setFoundInquiry] = useState(null);
  const [duplicateStudent, setDuplicateStudent] = useState(null);
  const [payAdmissionFee, setPayAdmissionFee] = useState(null); 
  const [isNewReference, setIsNewReference] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // Modal & New Entry States
  const [showRefModal, setShowRefModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  const [newRef, setNewRef] = useState({ name: '', mobile: '', address: '' });
  const [newEdu, setNewEdu] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      admissionDate: new Date().toISOString().split("T")[0],
      state: "Gujarat",
      city: "Surat",
      relationType: "Father", 
      reference: "Direct",
      receiptPaymentMode: "Cash",
      receiptDate: new Date().toISOString().split("T")[0],
    },
  });

  const watchFirstName = watch("firstName");
  const watchLastName = watch("lastName");
  const watchCourseSelection = watch("selectedCourseId");
  const watchSelectedBatch = watch("selectedBatch"); 
  const watchReference = watch("reference");
  const watchState = watch("state");
  const watchRelation = watch("relationType");

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchBatches());
    dispatch(fetchInquiries({ status: "Open" }));
    dispatch(fetchStudents());
    dispatch(fetchEmployees());
    dispatch(fetchReferences());
    dispatch(fetchEducations());
    if(user?.role === 'Super Admin') {
        dispatch(getBranches());
    }
  }, [dispatch, user]);

  // Handle inquiry data from location state (when navigating from Complete status)
  const location = useLocation();
  useEffect(() => {
    if (location.state?.inquiryData) {
      const inquiry = location.state.inquiryData;
      
      // Pre-fill all form fields from inquiry data
      setValue("firstName", inquiry.firstName || "");
      setValue("lastName", inquiry.lastName || "");
      setValue("middleName", inquiry.middleName || "");
      setValue("relationType", inquiry.relationType || "Father");
      setValue("email", inquiry.email || "");
      setValue("gender", inquiry.gender || "Male");
      setValue("mobileParent", inquiry.contactParent || "");
      setValue("mobileStudent", inquiry.contactStudent || "");
      setValue("contactHome", inquiry.contactHome || "");
      setValue("address", inquiry.address || "");
      setValue("state", inquiry.state || "Gujarat");
      setValue("city", inquiry.city || "Surat");
      setValue("education", inquiry.education || "");
      setValue("dob", inquiry.dob ? new Date(inquiry.dob).toISOString().split('T')[0] : "");
      setValue("reference", inquiry.referenceBy || "Direct");
      
      if (inquiry.studentPhoto) {
        setPreviewImage(inquiry.studentPhoto);
        setValue("studentPhoto", inquiry.studentPhoto);
      }

      toast.success("Student data pre-filled from inquiry!");
      
      // Clear the location state to prevent re-filling on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location, setValue]);

// educationOptions effect removed

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        payAdmissionFee
          ? "Student Admitted & Fees Paid!"
          : "Admission Draft Created!"
      );
      dispatch(resetStatus());
      navigate(
        payAdmissionFee
          ? "/transaction/pending-student-registration"
          : "/transaction/pending-admission-fees"
      );
    }
    if (message && !isSuccess && !isLoading) {
      toast.error(message);
      dispatch(resetStatus());
    }

    if (!isLoading) {
      setIsSubmitting(false);
    }
  }, [isSuccess, message, isLoading, dispatch, navigate, payAdmissionFee]);

  useEffect(() => {
    if (watchFirstName && watchLastName) {
      const inquiry = inquiries.find(
        (i) =>
          i.firstName?.toLowerCase() === watchFirstName.toLowerCase() &&
          i.lastName?.toLowerCase() === watchLastName.toLowerCase()
      );
      setFoundInquiry(inquiry || null);

      const student = students.find(
        (s) =>
          s.firstName?.toLowerCase() === watchFirstName.toLowerCase() &&
          s.lastName?.toLowerCase() === watchLastName.toLowerCase()
      );
      setDuplicateStudent(student || null);
    }
  }, [watchFirstName, watchLastName, inquiries, students]);

  // Fetch Next Receipt Number when entering Step 3 (Payment)
  const [nextReceiptNo, setNextReceiptNo] = useState("Loading...");

  useEffect(() => {
      if (step === 3 && payAdmissionFee === true) {
          const fetchReceiptNo = async () => {
              try {
                  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/transaction/fees/next-no`, {
                      withCredentials: true
                  });
                  setNextReceiptNo(data);
              } catch (error) {
                  console.error("Failed to fetch next receipt no", error);
                  setNextReceiptNo("Error");
              }
          };
          fetchReceiptNo();
      }
  }, [step, payAdmissionFee]);

// isNewReference effect removed

  const handleAutofillInquiry = () => {
    if (foundInquiry) {
      setValue("firstName", foundInquiry.firstName);
      setValue("lastName", foundInquiry.lastName);
      setValue("middleName", foundInquiry.middleName || "");
      setValue("email", foundInquiry.email || "");
      setValue("gender", foundInquiry.gender || "Male");
      setValue("mobileParent", foundInquiry.contactParent || "");
      setValue("mobileStudent", foundInquiry.contactStudent || "");
      setValue("address", foundInquiry.address || "");
      setValue("state", foundInquiry.state || "Gujarat");
      setValue("city", foundInquiry.city || "Surat");
      setValue("education", foundInquiry.education || "");
      setValue("dob", foundInquiry.dob ? new Date(foundInquiry.dob).toISOString().split('T')[0] : "");
      setValue("reference", foundInquiry.referenceBy || "");
      
      if (foundInquiry.studentPhoto) {
          setPreviewImage(foundInquiry.studentPhoto);
          setValue("studentPhoto", foundInquiry.studentPhoto);
      }

      toast.info("Data Autofilled from Inquiry");
      setFoundInquiry(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("studentPhoto", file);
    }
  };

  const handleAddCourseToList = () => {
    const courseId = getValues("selectedCourseId");
    const batchName = getValues("selectedBatch");
    const startDate = getValues("batchStartDate");
    const paymentType = getValues("paymentType");

    if (!courseId || !batchName || !startDate) {
      toast.error("Please select Course, Batch and Start Date");
      return;
    }

    const courseObj = courses.find((c) => c._id === courseId);
    const batchObj = batches.find((b) => b.name === batchName);

    let finalFees = courseObj.courseFees;
    let emiConfig = null;
    const admissionFee = courseObj.admissionFees || 500;

    if (paymentType === "Monthly") {
      const regFees = courseObj.registrationFees || 0;
      const installments = courseObj.totalInstallment || 1;
      const remaining = finalFees - regFees;
      const monthlyAmt = Math.ceil(remaining / installments);

      emiConfig = {
        registrationFees: regFees,
        monthlyInstallment: monthlyAmt,
        months: installments,
        admissionFees: admissionFee,
      };
    }

    const newEntry = {
      id: Date.now(),
      courseId: courseObj._id,
      courseName: courseObj.name,
      batch: batchName,
      batchTime: batchObj
        ? `${batchObj.startTime} - ${batchObj.endTime}`
        : "N/A",
      startDate,
      fees: finalFees,
      admissionFees: admissionFee,
      paymentType,
      emiConfig,
    };
    setPreviewCourses([newEntry]);
    setValue("selectedCourseId", null);
  };

  const onSubmit = (data) => {
    if (previewCourses.length === 0) {
      toast.error("Please add a course first.");
      return;
    }

    if (isSubmitting) return; 
    setIsSubmitting(true);

    const primaryCourse = previewCourses[0];

    const payload = {
      ...data,
      course: primaryCourse.courseId,
      batch: primaryCourse.batch,
      totalFees: primaryCourse.fees,
      paymentPlan: primaryCourse.paymentType,
      reference: data.reference,
      // Legacy referenceDetails removed in favor of standardized Reference Master
      referenceDetails: null,
      feeDetails: payAdmissionFee
        ? {
            amount: Number(data.amountPaid),
            paymentMode: data.receiptPaymentMode,
            // FIXED: If remarks is empty, send 'Admission Fee'
            remarks: data.remarks || 'Admission Fee',
            date: data.receiptDate,
          }
        : null,
    };

    dispatch(registerStudent(payload));
  };

  // Auto-set payment for One Time plan
  useEffect(() => {
    if (previewCourses.length > 0) {
      if (previewCourses[0].paymentType === "One Time") {
        setPayAdmissionFee(true);
      } else {
        // If switching or new add (Monthly), reset if needed or keep user choice?
        // For safety, if it was auto-set to true, we might want to respect that, 
        // but if it's a new Monthly course, typically we let them choose (null).
        // Let's rely on the user choosing again if they switch. 
        // But to avoid stuck "true" state if they delete One Time and add Monthly:
        // We can just leave it or set to null if it's currently true? 
        // Let's just handle the One Time enforcement.
      }
    } else {
        setPayAdmissionFee(null); // Reset when list cleared
    }
  }, [previewCourses]);

  const renderStepHeader = () => (
    <div className="flex justify-center items-center mb-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`flex items-center ${
            step === i ? "text-blue-700 font-bold" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 
                        ${
                          step >= i
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white border-gray-300"
                        }`}
          >
            {step > i ? <CheckCircle size={16} /> : i}
          </div>
          {i !== 3 && (
            <div
              className={`w-12 h-1 bg-gray-300 mr-2 ${
                step > i ? "bg-blue-600" : ""
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-4 flex justify-between items-center text-white shadow-md">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <UserCheck size={24} /> New Student Admission
          </h1>
          <button
            type="button"
            onClick={() => navigate("/master/student")}
            className="hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 relative">
          {/* Modals placed relative to form container */}
          {showRefModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 rounded-xl">
                <div className="bg-white p-5 rounded-lg shadow-2xl w-96 border animate-fadeIn">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h4 className="font-bold text-gray-800">Add New Reference</h4>
                        <button type="button" onClick={() => setShowRefModal(false)}><X size={18} className="text-gray-500 hover:text-red-500"/></button>
                    </div>
                    <div className="space-y-3">
                        <input 
                            className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Full Name *"
                            value={newRef.name}
                            onChange={e => setNewRef({...newRef, name: e.target.value})}
                        />
                        <input 
                            className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Mobile Number *"
                            value={newRef.mobile}
                            onChange={e => setNewRef({...newRef, mobile: e.target.value})}
                        />
                        <input 
                            className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="City / Address"
                            value={newRef.address}
                            onChange={e => setNewRef({...newRef, address: e.target.value})}
                        />
                        <button 
                            type="button" 
                            onClick={() => {
                                if(!newRef.name || !newRef.mobile) return toast.error('Name & Mobile required');
                                dispatch(createReference(newRef)).then((res) => {
                                    if(!res.error) {
                                        setValue('reference', newRef.name);
                                        setShowRefModal(false);
                                        toast.success('Reference Added!');
                                        setNewRef({ name: '', mobile: '', address: '' });
                                    }
                                });
                            }}
                            className="w-full py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition"
                        >
                            Save Reference
                        </button>
                    </div>
                </div>
            </div>
          )}

          {showEduModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 rounded-xl">
                <div className="bg-white p-5 rounded-lg shadow-2xl w-80 border animate-fadeIn">
                     <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h4 className="font-bold text-gray-800">Add Education</h4>
                        <button type="button" onClick={() => setShowEduModal(false)}><X size={18} className="text-gray-500 hover:text-red-500"/></button>
                    </div>
                     <div className="space-y-3">
                        <input 
                            className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Degree / Certificate Name *"
                            value={newEdu}
                            onChange={e => setNewEdu(e.target.value)}
                        />
                        <button 
                            type="button" 
                            onClick={() => {
                                if(!newEdu) return toast.error('Education Name required');
                                dispatch(createEducation({ name: newEdu })).then((res) => {
                                     if(!res.error) {
                                        setValue('education', newEdu);
                                        setShowEduModal(false);
                                        toast.success('Education Added!');
                                        setNewEdu('');
                                     }
                                });
                            }}
                            className="w-full py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition"
                        >
                            Save Education
                        </button>
                     </div>
                </div>
            </div>
          )}
          {renderStepHeader()}

          {foundInquiry && step === 1 && (
            <div className="bg-green-50 border border-green-200 p-3 mb-6 rounded-lg flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Search className="text-green-600" />
                </div>
                <div>
                  <p className="text-green-800 font-bold text-sm">
                    Inquiry Found!
                  </p>
                  <p className="text-green-700 text-xs">
                    Matching Name:{" "}
                    <b>
                      {foundInquiry.firstName} {foundInquiry.lastName}
                    </b>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAutofillInquiry}
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded shadow transition"
              >
                Use Inquiry Data
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-12 gap-5 animate-fade-in-up">
              
              {/* Branch Selection for Super Admin */}
              {user?.role === 'Super Admin' && (
                  <div className="col-span-12 bg-blue-50 p-4 rounded border-2 border-blue-100 mb-2">
                       <label className="label text-blue-800 font-bold block mb-2">
                          Select Branch for this Student *
                       </label>
                       <select 
                          {...register("branchId", { required: "Branch is required for Super Admin" })}
                          className="input border-blue-300 w-full"
                       >
                           <option value="">-- Select Branch --</option>
                           {branches.map(b => (
                               <option key={b._id} value={b._id}>{b.name} ({b.shortCode})</option>
                           ))}
                       </select>
                       {errors.branchId && <p className="text-red-500 text-xs mt-1">{errors.branchId.message}</p>}
                  </div>
              )}
              <div className="col-span-12 md:col-span-4">
                <label className="label">1. Admission Date</label>
                <input
                  type="date"
                  {...register("admissionDate")}
                  className="input"
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="label">1. Aadhar Card No *</label>
                <input
                  {...register("aadharCard", { required: true, minLength: 12 })}
                  placeholder="12 Digit Number"
                  className="input"
                  maxLength={12}
                  onInput={(e) => { if (e.target.value.length > 12) e.target.value = e.target.value.slice(0, 12); }}
                />
              </div>
              <div className="col-span-12 md:col-span-4 flex justify-center">
                <label className="relative cursor-pointer group">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 group-hover:border-blue-500 transition">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <span className="block text-center text-xs text-blue-600 font-bold mt-1">
                    Upload Photo
                  </span>
                </label>
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="label">2. First Name *</label>
                <input
                  {...register("firstName", { required: true })}
                  className="input"
                  placeholder="Student Name"
                />
              </div>
              <div className="col-span-6 md:col-span-2">
                <label className="label">2. Relation</label>
                <select
                  {...register("relationType")}
                  className="input bg-gray-50"
                >
                  <option value="Father">Father</option>
                  <option value="Husband">Husband</option>
                </select>
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="label">2. {watchRelation} Name</label>
                <input
                  {...register("middleName")}
                  className="input"
                  placeholder={`${watchRelation}'s Name`}
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="label">2. Last Name *</label>
                <input
                  {...register("lastName", { required: true })}
                  className="input"
                  placeholder="Surname"
                />
              </div>

              <div className="col-span-6 md:col-span-3">
                <label className="label">3. Occupation Type</label>
                <select {...register("occupationType")} className="input">
                  <option value="Student">Student</option>
                  <option value="Service">Service</option>
                  <option value="Business">Business</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="label">3. Occupation Name</label>
                <input {...register("occupationName")} className="input" />
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="label">3. Mother Name</label>
                <input {...register("motherName")} className="input" />
              </div>

              <div className="col-span-12 md:col-span-5">
                <label className="label">4. E-mail</label>
                <input
                  type="email"
                  {...register("email")}
                  className="input"
                  placeholder="examle@mail.com"
                />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="label">4. Date of Birth *</label>
                <input
                  type="date"
                  {...register("dob", { required: true })}
                  className="input"
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <label className="label">4. Gender *</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Male"
                      {...register("gender", { required: true })}
                      className="text-blue-600"
                    />{" "}
                    Male
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Female"
                      {...register("gender", { required: true })}
                      className="text-pink-600"
                    />{" "}
                    Female
                  </label>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4">
                <label className="label">5. Home Contact</label>
                <input
                  {...register("contactHome", { maxLength: 10 })}
                  className="input"
                  placeholder="Landline/Other"
                  maxLength={10}
                  onInput={(e) => { if (e.target.value.length > 10) e.target.value = e.target.value.slice(0, 10); }}
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="label">5. Student Contact (10 Digits)</label>
                <input
                  {...register("mobileStudent", { maxLength: 10 })}
                  className="input"
                  maxLength={10}
                  onInput={(e) => { if (e.target.value.length > 10) e.target.value = e.target.value.slice(0, 10); }}
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="label text-blue-700">
                  5. Parent Contact *
                </label>
                <input
                  {...register("mobileParent", {
                    required: true,
                    maxLength: 10,
                    minLength: 10,
                  })}
                  className="input border-blue-300 bg-blue-50"
                  maxLength={10}
                  onInput={(e) => { if (e.target.value.length > 10) e.target.value = e.target.value.slice(0, 10); }}
                />
              </div>

              <div className="col-span-12">
                <label className="label">6. Education</label>
                <div className="flex gap-2">
                    <select
                      {...register("education")}
                      className="input w-full"
                    >
                      <option value="">-- Select Education --</option>
                      {educations.map((opt, i) => (
                        <option key={opt._id || i} value={opt.name}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowEduModal(true)}
                      className="p-2 bg-blue-50 text-blue-600 rounded border hover:bg-blue-100 flex-shrink-0"
                      title="Add New Education"
                    >
                      <Plus size={20} />
                    </button>
                </div>
              </div>

              <div className="col-span-12">
                <label className="label">
                  7. Address (House No, Building, Street) *
                </label>
                <textarea
                  {...register("address", { required: true })}
                  rows="2"
                  className="input"
                ></textarea>
              </div>

              <div className="col-span-12 md:col-span-4">
                <label className="label">8. State *</label>
                <select
                  {...register("state", { required: true })}
                  className="input"
                >
                  {Object.keys(LOCATION_DATA).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="label">8. City *</label>
                <select
                  {...register("city", { required: true })}
                  className="input"
                >
                  {LOCATION_DATA[watchState]?.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="label">8. Pincode</label>
                <input {...register("pincode")} className="input" />
              </div>

              <div className="col-span-12 bg-gray-50 p-4 rounded border-dashed border-2 border-gray-200">
                <label className="label text-purple-700">
                  9. Reference Details
                </label>
                <div className="flex gap-4 items-center">
                  <select {...register("reference")} className="input w-full">
                    <option value="Direct">Direct / Walk-in</option>
                    <optgroup label="Staff">
                        {employees?.map((e) => (
                          <option key={e._id} value={e.name}>
                            {e.name} ({e.type})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="External References">
                        {references.map((r, i) => (
                             <option key={r._id || i} value={r.name}>{r.name}</option>
                        ))}
                    </optgroup>
                  </select>
                  <button
                      type="button"
                      onClick={() => setShowRefModal(true)}
                      className="p-2 bg-blue-50 text-blue-600 rounded border hover:bg-blue-100 flex-shrink-0"
                      title="Add New Reference"
                    >
                      <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="col-span-12 flex justify-end mt-4">
                <button
                  type="button"
                  onClick={async () => {
                    if (await trigger()) setStep(2);
                  }}
                  className="btn-primary"
                >
                  Next: Course Details <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-3 font-bold text-gray-700 border-b">
                  A. Select Course
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {courses.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">
                      No Courses Found
                    </p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-left sticky top-0">
                        <tr>
                          <th className="p-2">Name</th>
                          <th className="p-2">Fees</th>
                          <th className="p-2">Duration</th>
                          <th className="p-2">Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((c) => (
                          <tr
                            key={c._id}
                            className={`border-b hover:bg-blue-50 cursor-pointer ${
                              watchCourseSelection === c._id
                                ? "bg-blue-100"
                                : ""
                            }`}
                            onClick={() => setValue("selectedCourseId", c._id)}
                          >
                            <td className="p-2 font-medium">{c.name}</td>
                            <td className="p-2">₹{c.courseFees}</td>
                            <td className="p-2">
                              {c.duration} {c.durationType}
                            </td>
                            <td className="p-2">
                              <input
                                type="radio"
                                value={c._id}
                                {...register("selectedCourseId")}
                                checked={watchCourseSelection === c._id}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {watchCourseSelection && (
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <div className="font-bold text-slate-700 mb-3">
                    B. Batch & Fee Config
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-1 md:col-span-4 mb-2">
                      <label className="label mb-2">Select Batch *</label>
                      <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto bg-white shadow-sm">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100 text-left sticky top-0 border-b">
                            <tr>
                              <th className="p-3 w-12 text-center">#</th>
                              <th className="p-3">Batch Name</th>
                              <th className="p-3">Batch Time</th>
                              <th className="p-3 text-center text-blue-800">
                                Active Students <br />
                                <span className="text-xs font-normal">
                                  (In Selected Course)
                                </span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {batches
                              .filter(
                                (b) =>
                                  b.course === watchCourseSelection ||
                                  b.courses?.some(
                                    (c) => (c._id || c) === watchCourseSelection
                                  )
                              )
                              .map((b) => {
                                const activeCount =
                                  b.courseCounts?.[watchCourseSelection] || 0;
                                const isSelected =
                                  watchSelectedBatch === b.name;

                                return (
                                  <tr
                                    key={b._id}
                                    onClick={() =>
                                      setValue("selectedBatch", b.name)
                                    }
                                    className={`border-b cursor-pointer transition ${
                                      isSelected
                                        ? "bg-blue-100 border-blue-200"
                                        : "hover:bg-gray-50"
                                    }`}
                                  >
                                    <td className="p-3 text-center">
                                      <input
                                        type="radio"
                                        name="batchSelectGroup" 
                                        checked={isSelected}
                                        onChange={() =>
                                          setValue("selectedBatch", b.name)
                                        }
                                        className="cursor-pointer w-4 h-4 text-blue-600"
                                      />
                                    </td>
                                    <td className="p-3 font-medium text-gray-800">
                                      {b.name}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                      {b.startTime} - {b.endTime}
                                    </td>
                                    <td className="p-3 text-center">
                                      <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                                          activeCount > 0
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-500"
                                        }`}
                                      >
                                        {activeCount}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            {batches.filter(
                              (b) =>
                                b.course === watchCourseSelection ||
                                b.courses?.some(
                                  (c) => (c._id || c) === watchCourseSelection
                                )
                            ).length === 0 && (
                              <tr>
                                <td
                                  colSpan="4"
                                  className="p-4 text-center text-gray-500"
                                >
                                  No batches available for this course.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <label className="label">Start Date</label>
                      <input
                        type="date"
                        {...register("batchStartDate")}
                        className="input"
                        defaultValue={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <label className="label">Payment Plan</label>
                      <select {...register("paymentType")} className="input">
                        <option value="One Time">One Time</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="col-span-2 flex justify-end items-end">
                      <button
                        type="button"
                        onClick={handleAddCourseToList}
                        className="bg-slate-800 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-black h-10 w-full justify-center"
                      >
                        <Plus size={16} /> Add to List
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {previewCourses.length > 0 && (
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-slate-800 text-white p-3 font-bold text-sm">
                    C. Admission Preview
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b text-left">
                      <tr>
                        <th className="p-3">Course</th>
                        <th className="p-3">Batch</th>
                        <th className="p-3">Fees</th>
                        <th className="p-3">Admsn Fee</th>
                        <th className="p-3">Plan</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewCourses.map((item) => (
                        <tr key={item.id} className="border-b bg-white">
                          <td className="p-3 font-medium">{item.courseName}</td>
                          <td className="p-3">
                            {item.batch}
                            <br />
                            <span className="text-xs text-gray-500">
                              {item.batchTime}
                            </span>
                          </td>
                          <td className="p-3">₹{item.fees}</td>
                          <td className="p-3">₹{item.admissionFees}</td>
                          <td className="p-3">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {item.paymentType}
                            </span>
                            {item.paymentType === "Monthly" && (
                              <div className="text-xs text-gray-500 mt-1">
                                EMI: ₹{item.emiConfig?.monthlyInstallment}/mo
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setPreviewCourses([])}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {previewCourses[0].paymentType === "Monthly" && (
                      <tfoot className="bg-yellow-50 text-xs text-yellow-800">
                        <tr>
                          <td colSpan="6" className="p-3">
                            <strong>Monthly Breakdown:</strong> Total: ₹
                            {previewCourses[0].fees} | Registration: ₹
                            {previewCourses[0].emiConfig.registrationFees} |
                            EMI: ₹
                            {previewCourses[0].emiConfig.monthlyInstallment} x{" "}
                            {previewCourses[0].emiConfig.months} Months
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}

              {/* Show Payment Option Only if NOT One Time */}
              {previewCourses.length > 0 && previewCourses[0].paymentType !== 'One Time' && (
                <div className="bg-white p-6 rounded border shadow-sm mt-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">
                    Admission Fee Payment
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Do you want to add admission fee detail now?
                  </p>

                  <div className="flex gap-6">
                    <div
                      onClick={() => setPayAdmissionFee(true)}
                      className={`flex-1 border-2 p-4 rounded-lg cursor-pointer transition flex items-center justify-between
                                            ${
                                              payAdmissionFee === true
                                                ? "border-green-500 bg-green-50"
                                                : "border-gray-200 hover:border-green-300"
                                            }`}
                    >
                      <div>
                        <h4 className="font-bold text-green-700">
                          YES, Pay Now
                        </h4>
                        <p className="text-xs text-green-600">
                          Enter receipt details immediately.
                        </p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          payAdmissionFee === true
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {payAdmissionFee === true && <CheckCircle size={14} />}
                      </div>
                    </div>

                    <div
                      onClick={() => setPayAdmissionFee(false)}
                      className={`flex-1 border-2 p-4 rounded-lg cursor-pointer transition flex items-center justify-between
                                            ${
                                              payAdmissionFee === false
                                                ? "border-orange-500 bg-orange-50"
                                                : "border-gray-200 hover:border-orange-300"
                                            }`}
                    >
                      <div>
                        <h4 className="font-bold text-orange-700">
                          NO, Pay Later
                        </h4>
                        <p className="text-xs text-orange-600">
                          Save to 'Pending Admission Fees'.
                        </p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          payAdmissionFee === false
                            ? "border-orange-600 bg-orange-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {payAdmissionFee === false && <CheckCircle size={14} />}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Force Info for One Time */}
              {previewCourses.length > 0 && previewCourses[0].paymentType === 'One Time' && (
                 <div className="bg-blue-50 border border-blue-200 p-4 rounded mt-6">
                    <p className="text-blue-800 font-bold flex items-center gap-2">
                        <CheckCircle size={20} />
                        One Time Payment Selected
                    </p>
                    <p className="text-blue-700 text-sm ml-7">
                        Full fees must be paid now. Proceed to generate receipt.
                    </p>
                 </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                >
                  <ChevronLeft size={16} /> Back to Personal
                </button>

                {payAdmissionFee === true && (
                  <button
                    type="button"
                    onClick={() => {
                      const amountToSet =
                        previewCourses[0].paymentType === "One Time"
                          ? previewCourses[0].fees +
                            previewCourses[0].admissionFees
                          : previewCourses[0].admissionFees;
                      setValue("amountPaid", amountToSet);
                      setStep(3);
                    }}
                    className="btn-primary"
                  >
                    Proceed to Fees <ChevronRight size={16} />
                  </button>
                )}

                {payAdmissionFee === false && (
                  <button
                    type="submit"
                    disabled={isLoading || isSubmitting}
                    className={`bg-orange-600 text-white px-6 py-2 rounded font-bold hover:bg-orange-700 flex items-center gap-2 shadow opacity-90 hover:opacity-100 ${
                      isLoading || isSubmitting
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    <Save size={18} />{" "}
                    {isLoading || isSubmitting
                      ? "Saving..."
                      : "Save & Admit (Pay Later)"}
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 3 && payAdmissionFee === true && (
            <div className="animate-fade-in-up">
              <div className="max-w-2xl mx-auto border rounded-xl shadow-lg bg-white overflow-hidden">
                <div className="bg-gray-800 text-white p-4 font-bold flex justify-between items-center">
                  <span>
                    <CreditCard className="inline mr-2" /> Fee Receipt Details
                  </span>
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                    Step 3 of 3
                  </span>
                </div>
                <div className="p-6 grid grid-cols-2 gap-6">
                  <div className="col-span-2 bg-blue-50 p-3 rounded text-blue-800 text-sm">
                    <strong>Course Fees:</strong> ₹{previewCourses[0]?.fees}
                    <br />
                    <strong>Admission Fees:</strong> ₹
                    {previewCourses[0]?.admissionFees}
                    {previewCourses[0]?.paymentType === "One Time" && (
                      <>
                        <br />
                        <strong className="text-green-700">
                          Total Payable Now:
                        </strong>{" "}
                        ₹
                        {previewCourses[0]?.fees +
                          previewCourses[0]?.admissionFees}
                      </>
                    )}
                    {previewCourses[0]?.paymentType === "Monthly" && (
                      <>
                        <br />
                        <strong className="text-orange-700">
                          Pay Admission Now:
                        </strong>{" "}
                        ₹{previewCourses[0]?.admissionFees}
                        <br />
                        <span className="text-xs">
                          Registration fees (₹
                          {previewCourses[0]?.emiConfig?.registrationFees}) will
                          be paid during registration
                        </span>
                      </>
                    )}
                  </div>

                  <div>
                    <label className="label">Receipt No</label>
                    <input
                      className="input bg-gray-100 text-gray-500 cursor-not-allowed"
                      value={nextReceiptNo}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="label">Receipt Date</label>
                    <input
                      type="date"
                      {...register("receiptDate")}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Amount Paid (₹) *</label>
                    <input
                      type="number"
                      {...register("amountPaid", { required: true })}
                      className="input border-l-4 border-green-500 text-lg font-bold"
                    />
                  </div>
                  <div>
                      <label className="label">Payment Mode</label>
                      <select
                        {...register("receiptPaymentMode")}
                        className="input"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Online/UPI">Online/UPI</option>
                      </select>
                  </div>
                  <div className="col-span-2">
                    <label className="label">Remarks</label>
                    <input
                      {...register("remarks")}
                      className="input"
                      placeholder="e.g. Google Pay Trans ID..."
                    />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-between border-t">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-secondary"
                  >
                    Back to Course
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || isSubmitting}
                    className={`bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 flex gap-2 shadow items-center ${
                      isLoading || isSubmitting
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    <Save size={18} />{" "}
                    {isLoading || isSubmitting
                      ? "Processing..."
                      : "Confirm Admission & Pay"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      <style>{`
                .label { display:block; font-size:0.75rem; font-weight:700; color:#4b5563; text-transform:uppercase; margin-bottom:0.3rem; letter-spacing:0.02em; }
                .input { width:100%; border:1px solid #d1d5db; padding:0.5rem; border-radius:0.375rem; outline:none; transition: all 0.2s; font-size:0.9rem; }
                .input:focus { border-color:#2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
                .btn-primary { background:#2563eb; color:white; padding:0.5rem 1.5rem; border-radius:0.375rem; display:flex; align-items:center; gap:0.5rem; font-weight:600; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); transition: background 0.2s;}
                .btn-primary:hover { background:#1d4ed8; }
                .btn-secondary { background:white; color:#374151; border:1px solid #d1d5db; padding:0.5rem 1.25rem; border-radius:0.375rem; display:flex; align-items:center; gap:0.5rem; font-weight:500; transition: background 0.2s; }
                .btn-secondary:hover { background:#f3f4f6; }
                @keyframes fadeInUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
            `}</style>
    </div>
  );
};

export default StudentAdmission;