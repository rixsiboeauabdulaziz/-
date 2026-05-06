const loadUser = () => {
    try {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    } catch {
      localStorage.removeItem('user');
      setUser(null);
    }
  };