import { useState, useEffect, useCallback } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

/**
 * useApi — generic data-fetching hook
 * @param {string} url  - API endpoint
 * @param {object} opts - { immediate: bool, onSuccess, onError }
 */
export function useApi(url, { immediate = true, onSuccess, onError } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const fetch = useCallback(async (overrideUrl) => {
    setLoading(true)
    setError(null)
    try {
      const { data: res } = await api.get(overrideUrl || url)
      setData(res)
      onSuccess?.(res)
      return res
    } catch (err) {
      const msg = err.response?.data?.message || 'Request failed'
      setError(msg)
      onError?.(msg)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    if (immediate && url) fetch()
  }, [url, immediate])

  return { data, loading, error, refetch: fetch, setData }
}

/**
 * useMutation — for POST/PUT/DELETE operations
 */
export function useMutation(method, url, { onSuccess, onError, successMsg } = {}) {
  const [loading, setLoading] = useState(false)

  const mutate = useCallback(async (body, overrideUrl) => {
    setLoading(true)
    try {
      const { data } = await api[method](overrideUrl || url, body)
      if (successMsg) toast.success(successMsg)
      onSuccess?.(data)
      return data
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed'
      toast.error(msg)
      onError?.(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [method, url])

  return { mutate, loading }
}
