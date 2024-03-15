import React from 'react'
import {coloumns ,Table} from'antd'
import { useDispatch } from 'react-redux'
import Layout from '../../components/Layout'
import {showLoading , hideLoading } from '../../redux/alertsSlice'
import axios from 'axios'
import { useState,useEffect } from 'react'

function DoctorsList() {
  const [doctors , setDoctors] = useState([])
  const dispatch = useDispatch()
  const getUsersData =async()=>{
      try {
          dispatch(showLoading())
          const response = await axios.get('./api/admin/get-all-doctors',{
              headers: {
                  Authorization:`Bearer ${localStorage.getItem("token")}`,
              }
          })
          dispatch(hideLoading())
          if(response.data.success){
              setDoctors(response.data.data)
          }
      } catch (error) {
          dispatch(hideLoading())
          console.log(error)
      }
  }
  useEffect(() => {
    getUsersData();
  }, []);
  const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        render: (text,record) => <span className='normal-text'>{record.firstName}{record.lastName}</span>,
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        render: (text,record)=>(
            <div className='d-flex'>
              {record.status === 'pending' && <h1 className='anchor'>Approve</h1>}
              {record.status === 'Approve' && <h1 className='anchor'>Block</h1>} 
            </div>
        )
    },
  ]
  return (
    <Layout>
      <h1 className='d-flex'>DoctorsList</h1>
      <Table columns={columns} dataSource={doctors}/>
      </Layout>
  )
}

export default DoctorsList