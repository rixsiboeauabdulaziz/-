// hooks/useAuth.js
export function useAuth() {
    const token = localStorage.getItem("token")
    if (!token) return null

    try {
        // Декодируем токен без библиотек (payload — это вторая часть)
        const payload = JSON.parse(atob(token.split(".")[1]))
        return payload // { id, role }
    } catch {
        return null
    }
}