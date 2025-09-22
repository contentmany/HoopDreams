export default function WorkingNotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f9f9f9' 
    }}>
      <div style={{ 
        background: 'white', 
        padding: 24, 
        borderRadius: 8, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: 400,
        margin: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: '2rem', color: '#dc2626', marginRight: 8 }}>⚠</span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111', margin: 0 }}>
            404 Page Not Found
          </h1>
        </div>

        <p style={{ marginTop: 16, fontSize: '14px', color: '#666', margin: 0 }}>
          Did you forget to add the page to the router?
        </p>
      </div>
    </div>
  );
}