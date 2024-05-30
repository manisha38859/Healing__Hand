import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import moment from 'moment';

function Userslist() {
    
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();

    const getUsersData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/admin/get-all-users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    };

    const changeUserStatus = async (record, status) => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/admin/change-user-status', {
                userId: record._id,
                status: status
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                getUsersData();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.log("Error changing user status");
            dispatch(hideLoading());
        }
    };

    const clearBlockedUsers = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/admin/clear-blocked-users', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                getUsersData();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.log("Error clearing blocked users");
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        getUsersData();
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            render: (text, record) => (
                <span>
                    {moment(record.createdAt).format("DD-MM-YYYY")} {moment(record.createdAt).format("HH:mm")}
                </span>
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'status',
            render: (text, record) => (
                <div className='d-flex'>
                    {record.status === 'active' ? (
                        <span className="anchor" onClick={() => changeUserStatus(record, 'blocked')}>Block</span>
                    ) : (
                        <span className="anchor" onClick={() => changeUserStatus(record, 'active')}>Unblock</span>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h1 className='page-header'>User List</h1>
                <Button type="primary" onClick={clearBlockedUsers}>Clear Blocked Users</Button>
            </div>
            <Table columns={columns} dataSource={users}/>
        </Layout>
    );
}

export default Userslist;
