import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { toast } from 'react-hot-toast'
import { useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import DoctorForm from '../components/DoctorForm';
import moment from 'moment';
import { Button, Col, Form, Input, Row, TimePicker, DatePicker } from "antd";

function BookAppointment() {
    const [isAvailable, setIsAvailable] = useState(false);
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const params = useParams();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const [doctor, setDoctor] = useState(null);

    const getDoctorData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post(
                '/api/doctor/get-doctor-info-by-id',
                {
                    doctorId: params.doctorId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },

                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                setDoctor(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
        }
    };

    const bookNow = async () => {

        setIsAvailable(false);
        try {
            dispatch(showLoading())
            const response = await axios.post(
                '/api/user/book-appointment',
                {
                    doctorId: params.doctorId,
                    userId: user._id,
                    doctorInfo: doctor,
                    userInfo: user,
                    date: date,
                    time: time,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },

                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message)
            }
        } catch (error) {
            toast.error("Error booking appointment")
            dispatch(hideLoading());
        }
    };

    const checkAvailability = async () => {
        console.log(time);
        try {
            dispatch(showLoading())
            const response = await axios.post(
                '/api/user/check-booking-availability',
                {
                    doctorId: params.doctorId,
                    date: date,
                    time: time,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },

                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message)
                setIsAvailable(true);
            } else {
                toast.error("Appointment not available")
            }
        } catch (error) {
            toast.error("Error checking appointment")
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        getDoctorData();
    }, []);
    return (
        <Layout>
            {doctor && (<div><h1 className='page-title'>{doctor.firstName} {doctor.lastName}</h1>
                <hr />
                <Row gutter={20} className='mt-5'>
                    <Col span={8} sm={24} xs={24} lg={8}>
                        <h1 className='normal-text'><b>Timings :</b> {doctor.timings[0]} - {doctor.timings[1]}</h1>
                        <p>
                            <b>Specialization : </b>
                            {doctor.specialization}
                        </p>
                        <p>
                            <b>Phone Number : </b>
                            {doctor.phoneNumber}
                        </p>
                        <p>
                            <b>Address : </b>
                            {doctor.address}
                        </p>
                        <p>
                            <b>Fee per visit : </b>
                            {doctor.feePerCunsulatation}
                        </p>
                        <div className='d-flex-flex-column pt-2'>
                            <DatePicker
                                format='DD-MM-YYYY'
                                onChange={(value) => {
                                    const momentDate = moment(value.toDate());
                                    const formattedDate = momentDate.format("DD-MM-YYYY");
                                    setDate(formattedDate);
                                    setIsAvailable(false);
                                }}
                            />

                            <TimePicker
                                format='HH:mm'
                                className='mt-3'
                                onChange={(value) => {
                                    const momentTime = moment(value.toDate());
                                    const formattedTime = momentTime.format("HH:mm");
                                    setTime(formattedTime);
                                    setIsAvailable(false);
                                }}
                            />


                            <Button className='primary-button mt-3 full-width-button' onClick={checkAvailability}>Check Availability</Button>
                            {isAvailable && (<Button className='primary-button mt-3 full-width-button' onClick={bookNow}>Book Now</Button>)}
                        </div>
                    </Col>
                </Row>
            </div>)}
        </Layout>
    )
}

export default BookAppointment;