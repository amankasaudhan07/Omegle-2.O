import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Navbar from '../components/specific/Navbar';

const Support = () => {
    const navigate = useNavigate();
    
    return (
        <>
            <Navbar />

            <section className="bg-gray-100  dark:bg-gray-900 text-gray-800 dark:text-gray-300 min-h-screen flex flex-col justify-center py-12">
                <div className="container mx-auto px-4 md:px-12 lg:px-24">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                        Support & Help Center
                    </h2>
                    <p className="text-lg md:text-xl lg:text-2xl text-center mb-12 leading-relaxed">
                        We're here to help you with any questions or issues you may have. Explore our FAQ or contact us directly.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h3>
                            <p className="text-md leading-relaxed mb-4">
                                Browse our FAQ section to find answers to common questions about using the chat, safety tips, and more.
                            </p>
                            <Link to="/faq" className="text-blue-600 hover:text-blue-700 font-semibold">Go to FAQ</Link>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Report an Issue</h3>
                            <p className="text-md leading-relaxed mb-4">
                                Encountering a bug or issue while chatting? Let us know, and we’ll work to resolve it as soon as possible.
                            </p>
                            <Link to="/report-issue" className="text-blue-600 hover:text-blue-700 font-semibold">Report a Problem</Link>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Support</h3>
                            <p className="text-md leading-relaxed mb-4">
                                Need more help? Get in touch with our support team for personal assistance via email or chat.
                            </p>
                            <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-semibold">Contact Us</Link>
                        </div>
                    </div>

                    <div className="text-center">
                        

                            <button
                                className="mt-8 px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 ease-in-out"
                                onClick={() => { navigate('/newChat') }}
                            >
                                Chat With Strangers
                            </button>
                            <button
                                className="mt-8 ml-4 px-6 py-3 text-lg bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition duration-300 ease-in-out"
                                onClick={() => { navigate('/friends') }}
                            >
                                Chat With Your Friends
                            </button>
                        
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default Support;
