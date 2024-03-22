import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signUp.scss';
import Page1 from './signUp_page1'; // Import the Page1 component
import Page2 from './signUp_page2'; // Import the Page2 component
import Page3 from './signUp_page3'; // Import the Page3 component
import Page4 from './signUp_page4'; // Import the Page4 component

function SignUp() {
    const [currentPage, setCurrentPage] = useState(1); // Add state to track the current page
    const [page1Data, setPage1Data] = useState(null);
    const [page2Data, setPage2Data] = useState(null);
    const [page3Data, setPage3Data] = useState(null);
    const [page4Data, setPage4Data] = useState(null);
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

    const handlePage4Submit = (data) => {
        setPage4Data(data);
        console.log(data);
    }

    const handleAllSubmit = (e) => {
        const endpoint = '/api/auth/register/final';
        const payload = {
            email: page1Data.email,  // Using the studentNumber state
            password: page1Data.password,
            name: page1Data.name,
            sex: page1Data.sex,
            militaryService: page2Data.militaryService,
            height: page2Data.height,
            bodyType: page2Data.bodyType,
            eyelid: page2Data.eyelid,
            fashion: page2Data.fashion,
            mbti: page3Data.mbti,
            hobby: page3Data.hobby,
            emogi: page4Data.emogi
        };
        console.log(payload);
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
        <div>
            {currentPage === 1 ? (
                <Page1 handleNextPage={handleNextPage} onSubmit={handlePage1Submit}/>
            ) : currentPage === 2 ? (
                <Page2 sex={page1Data.sex} handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} onSubmit={handlePage2Submit}/>
            ) : currentPage === 3 ? (
                <Page3 handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} onSubmit={handlePage3Submit} />
            ) : currentPage === 4 ? (
                <Page4 handlePreviousPage={handlePreviousPage} onSubmit={handlePage4Submit} onAllSubmit={handleAllSubmit}/>
            ) : (
                <div>
                    <p>Invalid page</p>
                    <button onClick={handleBackButton}>Go Back</button>
                </div>
            )}
        </div>
    );
}

export default SignUp;