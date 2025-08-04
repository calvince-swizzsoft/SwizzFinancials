import React, { useState } from 'react'
import axios from 'axios'
import { Modal } from '../../ui/modal'

interface AddPostingPeriodModalProps {
  isOpen: boolean
  closeModal: () => void
}

const AddPostingPeriodModal: React.FC<AddPostingPeriodModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    status: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/add-product`,
        {
          ...formData,
          CreatedDate: new Date().toISOString(), // Required by API
          ProductName: formData.name,
          Description: formData.status,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )
      console.log(response.data)
      setSuccess('Posting period added successfully!')
      setFormData({ name: '', startDate: '', endDate: '', status: '' })
    } catch (err: any) {
      setError('Failed to add posting period')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
      <div className="p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Add Posting Period</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg mt-1"
            >
              <option value="">Select status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-lg border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? 'Saving...' : 'Add Period'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default AddPostingPeriodModal
