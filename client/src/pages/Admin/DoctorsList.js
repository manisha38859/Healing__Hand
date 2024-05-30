import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import moment from 'moment';

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get('/api/admin/get-all-doctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/admin/change-doctor-account-status', { doctorId: record._id, userId: record.userId, status: status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      dispatch(hideLoading());
      if (response.data.success) {
        console.log(response.data.message);
        getDoctorsData();
      }
    } catch (error) {
      console.log("Error changing doctor account status");
      dispatch(hideLoading());
    }
  };

  const clearBlockedDoctors = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/admin/clear-blocked-doctors', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      dispatch(hideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getDoctorsData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error('Something went wrong');
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => <span className='normal-text'>{record.firstName} {record.lastName}</span>,
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className='d-flex'>
          {record.status === 'pending' && <h1 className='anchor' onClick={() => changeDoctorStatus(record, 'approved')}>Approve</h1>}
          {record.status === 'approved' && <h1 className='anchor' onClick={() => changeDoctorStatus(record, 'blocked')}>Block</h1>}
          {record.status === 'blocked' && <h1 className='anchor' onClick={() => changeDoctorStatus(record, 'approved')}>Unblock</h1>}
        </div>
      )
    },
  ];

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className='d-flex'>DoctorsList</h1>
        <Button type="primary" onClick={clearBlockedDoctors}>Clear Blocked Doctors</Button>
      </div>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  );
}

export default DoctorsList;
