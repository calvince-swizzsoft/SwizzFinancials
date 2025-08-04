import { useEffect, useState } from "react"
import axios from "axios"
import AddProductModal from "./AddProductModal"

interface Product {
  Id: string
  Code: number
  PaddedCode: string
  Description: string
  MinimumBalance: number
  MaximumBalance: number
  PoolAmount: number
  PriorityDescription: string
  MaturityPeriod: number
  AnnualPercentageYield: number
  IsRefundable: boolean
  IsPooled: boolean
  IsSuperSaver: boolean
  IsLocked: boolean
  IsMandatory: boolean
  CreatedDate: string
}

export default function InvestmentProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_ACCOUNT_URL}/api/values/products`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((res) => {
        setProducts(res.data.Data)
        setLoading(false)
      })
      .catch((err) => {
        setError(`Failed to fetch products.${err}`)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="mx-auto w-full mb-10">
        <h3 className="mb-3 font-semibold text-gray-800 text-2xl dark:text-white/90">
          Investment Products
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          A list of available investment products and their configurations.
        </p>
      </div>
      
      <div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded mb-4"
        >
          + Add Product
        </button>
        <AddProductModal isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="border px-4 py-2">Code</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Min Balance</th>
                <th className="border px-4 py-2">Max Balance</th>
                <th className="border px-4 py-2">Pool</th>
                <th className="border px-4 py-2">Maturity</th>
                <th className="border px-4 py-2">Yield (%)</th>
                <th className="border px-4 py-2">Priority</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.Id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border px-4 py-2">{prod.PaddedCode}</td>
                  <td className="border px-4 py-2">{prod.Description}</td>
                  <td className="border px-4 py-2">{prod.MinimumBalance.toLocaleString()}</td>
                  <td className="border px-4 py-2">{prod.MaximumBalance.toLocaleString()}</td>
                  <td className="border px-4 py-2">{prod.PoolAmount.toLocaleString()}</td>
                  <td className="border px-4 py-2">{prod.MaturityPeriod} days</td>
                  <td className="border px-4 py-2">{prod.AnnualPercentageYield}%</td>
                  <td className="border px-4 py-2">{prod.PriorityDescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


