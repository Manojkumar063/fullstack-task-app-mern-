'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthForm from '@/components/AuthForm'
import { authAPI } from '@/lib/api'

export default function SignIn() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login(formData)
      localStorage.setItem('token', response.data.token)
      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email address',
      placeholder: 'Email address',
      required: true,
      value: formData.email,
      onChange: handleChange,
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Password',
      required: true,
      value: formData.password,
      onChange: handleChange,
    },
  ]

  return (
    <div>
      <AuthForm
        title="Sign in to your account"
        fields={fields}
        onSubmit={handleSubmit}
        submitText="Sign in"
        error={error}
        loading={loading}
      />
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
