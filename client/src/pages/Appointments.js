import React from 'react'
import { coloumns, Table } from 'antd'
import { useDispatch } from 'react-redux'
import Layout from '../components/Layout'
import { showLoading, hideLoading } from '../redux/alertsSlice'
import axios from 'axios'
//import toast from 'react-hot-toast';
import { useState, useEffect } from 'react'
//import { response } from 'express'
import moment from 'moment'

function Appointments() {
    const [appointments, setAppointments] = useState([])
    const dispatch = useDispatch()
    const getAppointmentsData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/user/get-appointments-by-user-id', {
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

    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
        },
        {
            title: 'Doctor',
            dataIndex: 'name',
            render: (text, record) => (
                <span className='normal-text'>
                    {record.doctorInfo?.firstName || 'N/A'} {record.doctorInfo?.lastName || 'N/A'}
                </span>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            render: (text, record) => (
                <span className='normal-text'>
                    {record.doctorInfo?.phoneNumber || 'N/A'}
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
        }
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

export default Appointments;