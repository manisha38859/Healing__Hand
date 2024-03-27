import React from 'react'
import { coloumns, Table } from 'antd'
import { useDispatch } from 'react-redux'
import Layout from '../../components/Layout'
import { showLoading, hideLoading } from '../../redux/alertsSlice'
import axios from 'axios'
//import toast from 'react-hot-toast';
import { useState, useEffect } from 'react'
//import { response } from 'express'
import moment from 'moment'

function DoctorAppointments() {
    const [appointments, setAppointments] = useState([])
    const dispatch = useDispatch()
    const getAppointmentsData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/doctor/get-appointments-by-doctor-id', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            dispatch(hideLoading())
            if (response.data.success) {
                setAppointments(response.data.data)
                //getDoctorsData();
            }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
        }
    }

    const changeAppointmentStatus = async (record, status) => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/doctor/change-appointment-status', {appointmentId: record._id, status: status}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            dispatch(hideLoading())
            if (response.data.success) {
                console.log(response.data.message)
                getAppointmentsData();
            }
        } catch (error) {
            console.log("Error changing doctor account status")
            dispatch(hideLoading())
        }
    }

    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
        },
        {
            title: 'Patient',
            dataIndex: 'name',
            render: (text, record) => (
                <span className='normal-text'>
                    {record.userInfo?.name || 'N/A'}
                </span>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            render: (text, record) => (
                <span className='normal-text'>
                    {record.userInfo?.phoneNumber || 'N/A'}
                </span>
            ),
        },
        {
            title: 'Date & Time',
            dataIndex: 'createdAt',
            render: (text, record) => (
                <span>
                    {moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("HH:mm")}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (

                <div className='d-flex'>
                    {record.status === 'pending' && (
                        <div className='d-flex'> <h1 className='anchor px-2' onClick={() => changeAppointmentStatus(record, 'approved')}>Approve  </h1>
                            <h1 className='anchor' onClick={() => changeAppointmentStatus(record, 'rejected')}>  Reject</h1>
                        </div>
                    )}
                </div>
            ),
        },
    ];


    useEffect(() => {
        getAppointmentsData();
    }, []);


    return (
        <Layout>
            <h1 className='page-loader'>Appointments</h1>
            <Table columns={columns} dataSource={appointments} />
        </Layout>
    )
}

export default DoctorAppointments;