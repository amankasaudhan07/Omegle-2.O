import React from 'react';
import Navbar from './Navbar';

const Faq = () => {
  const faqs = [
    {
      question: 'What is this website about?',
      answer: 'This website allows you to chat with strangers and make new friends online. It’s free to use, and no account is needed!'
    },
    {
      question: 'Is the chat anonymous?',
      answer: 'Yes, the chat is completely anonymous. We do not store any personal data about the users or their chats.'
    },
    {
      question: 'How do I report an issue?',
      answer: 'If you encounter a bug or an issue, you can use the "Report an Issue" section to let us know, and we’ll work to fix it.'
    },
    {
      question: 'Can I block someone from chatting with me?',
      answer: 'Currently, there is no block feature. We suggest disconnecting if you feel uncomfortable during a chat.'
    },
    // Add more FAQs as needed
  ];

  return (
    <>
      <Navbar/>
    
    <section
  className="min-h-screen py-12 transition-all duration-300"
  style={{
    backgroundColor: "var(--bg)",
    color: "var(--text)",
  }}
>
  <div className="container mx-auto px-4 md:px-12 lg:px-24">
    <h2
      className="text-3xl md:text-4xl font-bold text-center mb-10"
      style={{ color: "var(--text)" }}
    >
      Frequently Asked Questions
    </h2>

    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <h3
            className="text-xl font-semibold"
            style={{ color: "var(--text)" }}
          >
            {faq.question}
          </h3>

          <p
            className="text-md leading-relaxed mt-3"
            style={{
              color: "var(--text)",
              opacity: 0.8,
            }}
          >
            {faq.answer}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
    </>
  );
};

export default Faq;
