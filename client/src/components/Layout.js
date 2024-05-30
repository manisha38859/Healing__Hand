import React, { useEffect, useState } from 'react';
import "../layout.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from 'antd';
import { resetUser } from '../redux/userSlice';

function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const userMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: 'Appointments',
            path: '/appointments',
            icon: 'ri-file-list-line',
        },
        {
            name: 'Apply Doctor',
            path: '/apply-doctor',
            icon: 'ri-hospital-line',
        },
        {
            name: 'Profile',
            path: `/user/userprofile/${user?._id}`,
            icon: 'ri-user-line',
        },
    ];

    const doctorMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: 'Appointments',
            path: '/doctor/appointments',
            icon: 'ri-file-list-line',
        },
        {
            name: 'Profile',
            path: `/doctor/profile/${user?._id}`,
            icon: 'ri-user-line',
        },
    ];

    const adminMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: 'Users',
            path: '/admin/userslist',
            icon: 'ri-user-line',
        },
        {
            name: 'Doctors',
            path: '/admin/doctorslist',
            icon: 'ri-user-star-line',
        },
    ];

    const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
    const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";

    const handleLogout = () => {
        localStorage.clear();
        dispatch(resetUser());
        navigate('/login');
    };

    return (
        <div className='main'>
            <div className='d-flex layout'>
                <div className='sidebar'>
                    <div className='sidebar-header'>
                        <h1 className='logo'>HH</h1>
                        <h1 className='role'>{role}</h1>
                    </div>
                    <div className='menu'>
                        {menuToBeRendered.map((menu) => {
                            const isActive = location.pathname === menu.path;
                            return (
                                <div key={menu.name} className={`d-flex menu-item ${isActive && 'active-menu-item'}`}>
                                    <i className={menu.icon}></i>
                                    {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                                </div>
                            );
                        })}
                         <div className='d-flex menu-item logout' onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            <i className='ri-logout-circle-line' style={{ color: 'white' }}></i>
                            {!collapsed && <span style={{ color: 'white' }}>Logout</span>}
                        </div>

                    </div>
                </div>
                <div className="content">
                    <div className="header">
                        {collapsed ? (
                            <i className="ri-menu-2-fill header-action-icon"
                                onClick={() => setCollapsed(false)}
                            ></i>
                        ) : (
                            <i className="ri-close-fill header-action-icon"
                                onClick={() => setCollapsed(true)}
                            ></i>
                        )}

                        <div className='d-flex align-items-center px-4'>
                            <Badge count={user?.unseenNotifications.length} onClick={() => navigate('/notifications')}>
                                <i className='ri-notification-line header-action-icon px-3'></i>
                            </Badge>
                            {!user?.isAdmin ? (
                                <Link className='anchor mx-3' to={user?.isDoctor ? `/doctor/profile/${user?._id}` : `/user/userprofile/${user?._id}`}>
                                    {user?.name}
                                </Link>
                            ) : (
                                <span className='anchor mx-3'>{user?.name}</span>
                            )}
                        </div>
                    </div>
                    <div className='body'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
