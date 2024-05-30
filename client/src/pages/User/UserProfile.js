import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import UserForm from '../../components/UserForm';

function UserProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [userData, setUserData] = useState(null);

    const getUserData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                '/api/user/get-user-info-by-id',
                { userId: params.userId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                // Assuming the API response has fields 'name' and 'email'
                const data = response.data.data;
                setUserData({
                    userName: data.name,
                    userEmail: data.email,
                });
            } else {
                toast.error(response.data.message || 'Failed to fetch user data');
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
        }
    };

    useEffect(() => {
        getUserData();
    }, [params.userId]);

    const onFinish = async (values) => {
        console.log('Form Values:', values);
        try {
            dispatch(showLoading());
            const response = await axios.post(
                '/api/user/update-user-profile',
                { ...values, userId: params.userId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success('User updated successfully');
                getUserData(); 
            } else {
                toast.error(response.data.message || 'Failed to update user data');
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
        }
    };

    return (
        <Layout>
            <h1 className='page-title'>User Profile</h1>
            <hr />
            {userData && <UserForm onFinish={onFinish} initialValues={userData} />}
        </Layout>
    );
}

export default UserProfile;
