import React, { useState } from 'react'
import axios from 'axios'
import { Modal } from '../../ui/modal'

interface AddProductModalProps {
  isOpen: boolean
  closeModal: () => void
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    ProductName: '',
    Description: '',
    Code: 101,
    MinimumBalance: null,
    MaximumBalance: null,
    PoolAmount: null,
    Priority: 1,
    MaturityPeriod: 365,
    AnnualPercentageYield: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ProductName' || name === 'Description' ? value : Number(value),
    }))
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        ParentId: '1b25ff29-3b0a-4b6d-8546-93d5b65928d2',
        ParentChartOfAccountNameDescription: 'Parent Product Name',
        IsRefundable: true,
        IsPooled: true,
        IsSuperSaver: false,
        TransferBalanceToParentOnMembershipTermination: true,
        TrackArrears: false,
        ThrottleScheduledArrearsRecovery: false,
        IsLocked: false,
        IsMandatory: true,
        CreatedDate: new Date().toISOString(),
        ChartOfAccountId: '2b1b9f84-5a76-49d8-9a43-e1788dd5dcd7',
        ChartOfAccountAccountType: 1,
        ChartOfAccountAccountCode: 1001,
        ChartOfAccountAccountName: 'Main G/L Account',
        ChartOfAccountCostCenterId: '5c2f0e65-c1df-4d27-984f-b1849e2387ee',
        ChartOfAccountCostCenterDescription: 'Head Office',
        PoolChartOfAccountId: 'd33c77e0-1f1b-46ef-8d8c-8ef98173355a',
        PoolChartOfAccountAccountType: 2,
        PoolChartOfAccountAccountCode: 2002,
        PoolChartOfAccountAccountName: 'Pool Account',
        PoolChartOfAccountCostCenterId: '7a87f285-88e1-41ec-b0cf-ccdeac09b102',
        PoolChartOfAccountCostCenterDescription: 'Central Pool',
        chartOfAccount: {
          Id: '2b1b9f84-5a76-49d8-9a43-e1788dd5dcd7',
          Name: 'Main G/L Account',
        },
        ProductId: crypto.randomUUID(),
      }

      await axios.post(
        `${import.meta.env.VITE_ACCOUNT_URL}/api/values/add-product`,
        payload,
        { headers: { 'ngrok-skip-browser-warning': 'true' } }
      )

      closeModal()
      alert('Product added successfully.')
    } catch (err) {
      console.error(err)
      alert('Failed to add product.')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="ProductName"
            placeholder="Product Name"
            value={formData.ProductName}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="Description"
            placeholder="Description"
            value={formData.Description}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="MinimumBalance"
            placeholder="Minimum Balance"
            value={formData.MinimumBalance}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="MaximumBalance"
            placeholder="Maximum Balance"
            value={formData.MaximumBalance}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="PoolAmount"
            placeholder="Pool Amount"
            value={formData.PoolAmount}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="AnnualPercentageYield"
            placeholder="Annual % Yield"
            value={formData.AnnualPercentageYield}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default AddProductModal
