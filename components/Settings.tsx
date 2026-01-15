// Replace ONLY the useEffect that fetches profile (around line 45):
useEffect(() => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (token && userProfile.id) {
        fetch('/api/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
                // FIXED: Use correct header name
                'x-clerk-user-id': userProfile.id
            }
        })
            .then(res => res.json())
            .then((data: UserProfile | null) => {
                if (data) {
                    onUpdate(data);
                    setFormData(data);
                }
            })
            .catch(err => console.error('Profile fetch failed:', err));
    }
}, [userProfile.id]);
