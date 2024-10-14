import React from 'react';

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
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 py-12">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
              <p className="text-md leading-relaxed mt-2">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
