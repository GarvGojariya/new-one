"use client"
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const Verify = ({ params }) => {
    const { iv, encryptedData } = params;
    const data = {
        iv: iv,
        encryptedData: encryptedData,
    }
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const verifyUser = async () => {

        try {
            await axios.post("/api/user/verify", data)
            setVerified(true);
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-10">

                <h1 className="text-4xl">Verify Email</h1>
                <button
                    onClick={verifyUser}
                    className="flex w-auto justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Verify Email</button>
                {verified && (
                    <div
                        className="flex flex-col r  py-2 gap-10"
                    >
                        <h2 className="text-2xl">Email Verified</h2>
                        <Link href="/user/login"
                            className='flex w-auto justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        >
                            Login
                        </Link>
                    </div>
                )}
                {error && (
                    <div>
                        <h2 className="text-2xl bg-red-500 text-black">Error</h2>
                    </div>
                )}
            </div>
        </>
    )
}

export default Verify