import React, { useEffect, useState } from 'react'
import API from '../../api/axios'
import { useNavigate } from 'react-router-dom'


const AddCourse = () =>{

    const [departments,setDepartment]= useState([])
    const [error, setError]= useState("")
    const [lecturers, setLecturers] = useState([])
    const [loading, setLoading]= useState(true)
    const [formData, setFormData]= useState({
        courseCode:'',courseName:'',departmentId:'',
        courseDay:'',courseTime:'',credits:'',lecturerId:''
    })

    const navigate= useNavigate()

    useEffect (()=> {

        const fetchAll = async () => {
        try {
            const [depsRes, lecturersRes] = await Promise.all([
                API.get(`/departments`),
                API.get(`/lecturers`),
            ])
            setDepartment(depsRes.data)
            setLecturers(lecturersRes.data)
        } catch(err) {
            setError("Failed to Load Data");
        } finally {
            setLoading(false)
        }
    }
    fetchAll();

    },[])


    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]:e.target.value})
    }

    const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
        await API.post(`/courses`, {
            ...formData,
            adminCode: localStorage.getItem("code"), 
        });
        navigate("/admin"); 
    } catch(err) {
        setError(err.response?.data?.error ?? "Failed to create course.");
    }
    }

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <p className="text-[#888888] text-sm">Loading...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
            </div>
        </div>
    );

    return(
        <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-[#e5e5e5]'>
            <div className='bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-lg shadow-2xl'>
                <h2 className='text-3xl font-semibold mb-6 text-white text-center'>Create Course</h2>
                {error && (
                    <div className='"bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm'>
                        {error}
                    </div>
                )}


                <form className='space-y-4' onSubmit={handleSubmit}>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Course Code</label>
                        <input type="text" name="courseCode" value={formData.courseCode}
                        onChange={handleChange} required 
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                        placeholder='CCSC-1234' required/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Course Name</label>
                        <input type="text" name="courseName" value={formData.courseName}
                        onChange={handleChange} required 
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                        placeholder='Data Structures' required/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Credits</label>
                        <input type="number" name="credits" value={formData.credits}
                        onChange={handleChange} required 
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                        placeholder='3' required/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Department</label>
                        <select  name="departmentId" value={formData.departmentId}
                            onChange={handleChange} required 
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors">
                            
                            <option value="">Select Course Department</option>
                            {departments.map((d) => (
                                <option key={d.depId} value={d.depId}>{d.depName}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Session Day</label>
                        <select  name="courseDay" value={formData.courseDay}
                            onChange={handleChange} required 
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors">
                            
                            <option value="" disabled>Select Session Day</option>
                            <option value="Monday" >Monday</option>
                            <option value="Tuesday" >Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                        </select>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Session Time</label>
                        <select  name="courseTime" value={formData.courseTime}
                            onChange={handleChange} required 
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors">
                            
                            <option value="" disabled>Select Session Time</option>
                            <option value="08:30-11:00">08:30-11:00</option>
                            <option value="11:30:14:00">11:30:14:00</option>
                            <option value="14:30-17:00">14:30-17:00</option>
                            <option value="18:00-21:00">18:00-21:00</option>
                        </select>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Lecturer</label>
                        <select name="lecturerId" value={formData.lecturerId}
                            onChange={handleChange} required
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors">
                            <option value="">Select Lecturer</option>
                            {lecturers.map((l) => (
                                <option key={l.lecturerId} value={l.lecturerId}>
                                    {l.lecturerFirstName} {l.lecturerLastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type='submit' 
                        className='w-full bg-blue-900 text-[#0a0a0a] font-semibold rounded-lg p-3 hover:bg-[#e5e5e5] transition-colors mt-6'>
                            Add Course
                    </button>

                </form>


            </div>
        </div>
    )

}


export default AddCourse