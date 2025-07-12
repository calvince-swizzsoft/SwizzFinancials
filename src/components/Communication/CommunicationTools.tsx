import { useState } from "react";

export default function CommunicationTools() {
  const [messageType, setMessageType] = useState("Email");
  const [recipientGroup, setRecipientGroup] = useState("All Members");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !content) {
      setStatus("Please fill all fields.");
      return;
    }
    console.log({
      messageType,
      recipientGroup,
      subject,
      content,
    });
    setStatus("Message sent successfully!");
    setSubject("");
    setContent("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Communication Tools
      </h2>

      <form onSubmit={handleSend} className="space-y-6">
        {/* Message Type */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Message Type
          </label>
          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
            <option value="In-App">In-App Message</option>
          </select>
        </div>

        {/* Recipient Group */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Recipient Group
          </label>
          <select
            value={recipientGroup}
            onChange={(e) => setRecipientGroup(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="All Members">All Members</option>
            <option value="Active Members">Active Members</option>
            <option value="Inactive Members">Inactive Members</option>
            <option value="New Signups">New Signups</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Enter subject line"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Message
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border rounded-md resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Type your message here..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Send {messageType}
        </button>

        {/* Status Message */}
        {status && (
          <div className="mt-4 text-sm text-green-600 dark:text-green-400">
            {status}
          </div>
        )}
      </form>
    </div>
  );
}
