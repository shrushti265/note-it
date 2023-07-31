import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';  
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import {v4 as uuid} from 'uuid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./sidebar.css"
import { useAuth } from '../../context';

const Sidebar = () => {
    
    const Navigate = useNavigate();
    const {authDispatch} = useAuth();

    const sidebarSections = [
        {
            key: uuid(),
            icon: <HomeOutlinedIcon />,
            name: 'Home',
            path: '/'
        },
        {
            key: uuid(),
            icon: <LabelOutlinedIcon />,
            name: 'Labels',
            path: '/labels'
        },
        {
            key: uuid(),
            icon: <ArchiveOutlinedIcon />,
            name: 'Archive',
            path: '/archive'
        },
        {
            key: uuid(),
            icon: <DeleteOutlineOutlinedIcon />,
            name: 'Trash',
            path: 'trash'
        },
        {
            key: uuid(),
            icon: <AccountCircleOutlinedIcon />,
            name: 'Profile',
            path: 'profile'
        }
    ]

    const mappedSections = sidebarSections.map(({key, icon, name, path}) => (
        <h6 key={key} className='aside-link-wrapper'>
            <Link to={path} className='btn btn-link'>
                <span className='icon mui-icon aside-section-icon'>
                    {icon}
                </span>
                {name}
            </Link>
        </h6>
    ))

    const handleLogout = () => {
        localStorage.removeItem("inscribe-token");
        localStorage.removeItem("inscribe-user");

        authDispatch({ action: {
            type: "RESET_AUTH", payload: {authToken: "", isAuth: false, authLoading: false, authError: null, authUser: {}}
        }});
        Navigate("/login");
    }

    return (
        <aside className='idebar flex-col flex-justify-between'>
            <section className='sidebar-nav-links flex-col'>
                {mappedSections}
                <button className='btn btn-primary btn-new-note btn-full-width px-0-75 py-0-25 mt-1-5 text-reg'>
                    Create new note
                </button>
            </section>
            <section className='sidebar-footer flex-row flex-align-center flex-justify-between flex-wrap'>
                <article className='user-info flex-row flex-align-center'>
                    <p className='user-name'>Jane Doe</p>
                </article>
                <button className='btn btn-icon btn-logout' onClick={handleLogout}>
                    <LogoutIcon />
                </button>
            </section>
        </aside>
    )
}

export {Sidebar}