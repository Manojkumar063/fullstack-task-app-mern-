'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthForm from '@/components/AuthForm'
import { authAPI } from '@/lib/api'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...registerData } = formData
      const response = await authAPI.register(registerData)
      localStorage.setItem('token', response.data.token)
      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    {
      name: 'name',
      type: 'text',
      label: 'Full name',
      placeholder: 'Full name',
      required: true,
      value: formData.name,
      onChange: handleChange,
    },
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
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm password',
      placeholder: 'Confirm password',
      required: true,
      value: formData.confirmPassword,
      onChange: handleChange,
    },
  ]

  return (
    <div>
      <AuthForm
        title="Create your account"
        fields={fields}
        onSubmit={handleSubmit}
        submitText="Register"
        error={error}
        loading={loading}
      />
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
