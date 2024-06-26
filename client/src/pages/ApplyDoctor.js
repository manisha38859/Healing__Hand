import React from 'react';
import Layout from '../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DoctorForm from '../components/DoctorForm';
import moment from 'moment';

function ApplyDoctor() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);

    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const formattedTimings = values.timings.map(time => time.format("HH:mm"));
    
            const response = await axios.post('/api/user/apply-doctor-account', {
                ...values,
                userId: user._id,
                timings: formattedTimings,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
    
            dispatch(hideLoading());
    
            if (response.data.success) {
                toast.success(response.data.message);
                toast("Redirecting to Home page");
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong");
        }
    };
    

    return (
        <Layout>
            <h1 className='page-title'>Apply Doctor</h1>
            <hr />
            <DoctorForm onFinish={onFinish} />
        </Layout>
    );
}

export default ApplyDoctor;
