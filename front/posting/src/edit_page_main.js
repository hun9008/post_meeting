import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './edit.scss';
import Page1 from './edit_page_1';
import Page2 from './edit_page_2';
import Page3 from './edit_page_3';


function Edit({sex, onCancel}) {
    const [currentPage, setCurrentPage] = useState(1); // Add state to track the current page
    const [page1Data, setPage1Data] = useState(null);
    const [page2Data, setPage2Data] = useState(null);
    const [page3Data, setPage3Data] = useState(null);
    const navigate = useNavigate();
    const url = process.env.REACT_APP_SERVER_API; 

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1); // Move to the next page
        console.log("next");
        console.log(currentPage);
    };

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1); // Move to the previous page
    };

    const handleBackButton = () => {
        navigate('/');
    };

    const handlePage1Submit = (data) => {
        setPage1Data(data);
        console.log(data);
    };

    const handlePage2Submit = (data) => {
        setPage2Data(data);
        console.log(data);
    }

    const handlePage3Submit = (data) => {
        setPage3Data(data);
        console.log(data);
    }

    const handleAllSubmit = (e) => {
        const endpoint = '/api/auth/revise/info';
        const payload = {
            name: page1Data.nickname,
            militaryService: page1Data.militaryService,
            height: page1Data.height,
            bodyType: page1Data.bodyType,
            eyelid: page1Data.eyelid,
            fashion: page1Data.fashion,
            mbti: page2Data.mbti,
            hobby: page2Data.hobby,
            socialID: page3Data.socialID,
            emogi: page3Data.emogi
        };
        e.preventDefault();

        axios.post(url + endpoint, payload)
            .then(response => {
                console.log(response);
                navigate('/');
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    useEffect(() => {
        console.log('change : ', currentPage);
    }, [currentPage]);

    return (
        <div className='edit-container'>
            {currentPage === 1 ? (
                <Page1 sex={sex} handleNextPage={handleNextPage} onSubmit={handlePage1Submit} onCancel={onCancel}/>
            ) : currentPage === 2 ? (
                <Page2 handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} onSubmit={handlePage2Submit} onCancel={onCancel}/>
            ) : currentPage === 3 ? (
                <Page3 handlePreviousPage={handlePreviousPage} onSubmit={handlePage3Submit} onAllSubmit={handleAllSubmit} onCancel={onCancel}/>
            ) : (
                <div>
                    <p>Invalid page</p>
                    <button onClick={handleBackButton}>Go Back</button>
                </div>
            )}
        </div>
    );
}

export default Edit;