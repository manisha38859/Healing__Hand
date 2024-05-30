import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import Layout from '../components/Layout';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import axios from 'axios';
import moment from 'moment';

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();

    const getAppointmentsData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/user/get-appointments-by-user-id', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            dispatch(hideLoading());
            if (response.data.success) {
                setAppointments(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    };

    const changeAppointmentStatus = async (record, status) => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/change-appointment-status', {
                appointmentId: record._id,
                status: status
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            dispatch(hideLoading());
            if (response.data.success) {
                console.log(response.data.message);
                getAppointmentsData();
            }
        } catch (error) {
            console.log("Error changing appointment status");
            dispatch(hideLoading());
        }
    };

    const deleteOutdatedAppointments = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/doctor/delete-outdated-appointments', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            dispatch(hideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                getAppointmentsData(); 
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            message.error('Something went wrong');
            console.log(error);
        }
    };

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
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className='d-flex'>
                    {record.status === 'pending' && (
                        <div className='d-flex'>
                            <h1 className='anchor px-2' onClick={() => changeAppointmentStatus(record, 'approved')}>Approve</h1>
                            <h1 className='anchor' onClick={() => changeAppointmentStatus(record, 'rejected')}>Reject</h1>
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
            <div className="d-flex justify-content-between align-items-center">
                <h1 className='page-title'>Appointments</h1>
                <Button type="primary" onClick={deleteOutdatedAppointments}>Delete Outdated Appointments</Button>
            </div>
            <Table columns={columns} dataSource={appointments} />
        </Layout>
    );
}

export default Appointments;