import toast from 'react-hot-toast'

const API_ENDPOINT = 'http://localhost:8080'

export async function getFetch<T>(
  url: string,
  options?: { customError?: boolean }
): Promise<T & { message: string }> {
  return new Promise((resolve, reject) => {
    const toastId = toast.loading('Ładowanie...')
    fetch(API_ENDPOINT + url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(async (response) => {
        const data = (await response.json()) as T & { message: string }
        if (response.ok) {
          toast.success(data.message, { id: toastId })
          resolve(data)
        } else {
          toast.error(data.message, { id: toastId })

          if (options?.customError) reject(data)
        }
      })
      .catch((error) => {
        toast.error('Serwer nie odpowiada :(', { id: toastId })
        if (options?.customError) reject(error)
      })
  })
}

export async function postFetch<T>(
  body: object,
  url: string,
  options?: { customError?: boolean }
): Promise<T & { message: string }> {
  return new Promise((resolve, reject) => {
    const toastId = toast.loading('Ładowanie...')
    fetch(API_ENDPOINT + url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(async (response) => {
        const data = (await response.json()) as T & { message: string }
        if (response.ok) {
          toast.success(data.message, { id: toastId })
          resolve(data)
        } else {
          toast.error(data.message, { id: toastId })

          if (options?.customError) reject(data)
        }
      })
      .catch((error) => {
        toast.error('Serwer nie odpowiada :(', { id: toastId })
        if (options?.customError) reject(error)
      })
  })
}

export async function imageFetch<T>(
  body: FormData,
  url: string,
  options?: { customError?: boolean }
): Promise<T & { message: string }> {
  return new Promise((resolve, reject) => {
    const toastId = toast.loading('Ładowanie...')
    fetch(API_ENDPOINT + url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        // "Content-Type": "application/json",
      },
      body: body
    })
      .then(async (response) => {
        const data = (await response.json()) as T & { message: string }
        if (response.ok) {
          toast.success(data.message, { id: toastId })
          resolve(data)
        } else {
          toast.error(data.message, { id: toastId })

          if (options?.customError) reject(data)
        }
      })
      .catch((error) => {
        toast.error('Serwer nie odpowiada :(', { id: toastId })
        if (options?.customError) reject(error)
      })
  })
}
