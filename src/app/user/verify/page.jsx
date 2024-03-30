import React from 'react'

const VerifyPage = () => {
    return (
        <>
            <div
                className="w-full h-screen bg-gray-100 dark:bg-gray-900 gap-10 items-center justify-center flex flex-col"
            >
                <p
                    className=" text-center text-2xl text-gray-900 dark:text-gray-100"
                >
                    Registeration sucessfull
                </p>
                <p
                    className=" text-center text-xl text-gray-900 dark:text-gray-100"
                >
                    Please check your email to verify your account
                </p>
                <p
                    className=" text-center text-xl text-gray-900 dark:text-gray-100"
                >
                    If you did not receive this email, please try again
                </p>

            </div>
        </>
    )
}

export default VerifyPage