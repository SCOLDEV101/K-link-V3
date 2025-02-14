const config = {
// <<<<<<< Updated upstream
    SERVER_PATH: "https://k-link-production.up.railway.app",
    // API_PATH: "http://192.168.30.195:8000/api/",
    // IMAGE_PATH: "http://192.168.30.195:8000/uploaded",
    // tokenName: "token",
    // API_PATH: "http://localhost:8000/api/",
    // IMAGE_PATH: "http://127.0.0.1:8000/uploaded",
    Headers: () => {
        const getCookieValue = (name) => {
            const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
                const [cookieName, cookieValue] = cookie.split("=");
                acc[cookieName] = cookieValue;
                return acc;
            }, {});
            return cookies[name];
        };

        return {
            headers: {
                Authorization: 'Bearer ' + getCookieValue("token"),
                'X-CSRF-TOKEN': getCookieValue("XSRF-TOKEN"),
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Surrogate-Control': 'no-store'
            }
        }
    }
}

export default config;
