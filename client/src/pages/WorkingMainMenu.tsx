export default function WorkingMainMenu() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 8 }}>
          Hoop Dreams
        </h1>
        <p style={{ color: '#666' }}>Basketball Life Simulator</p>
      </div>
      
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <div style={{ marginBottom: 12 }}>
          <button 
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              background: '#0066cc', 
              color: 'white', 
              border: 'none', 
              borderRadius: 6,
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            ▶ Play
          </button>
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <button 
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              background: '#f0f0f0', 
              color: '#333', 
              border: '1px solid #ccc', 
              borderRadius: 6,
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            ↻ Load / Continue
          </button>
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <button 
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              background: '#f0f0f0', 
              color: '#333', 
              border: '1px solid #ccc', 
              borderRadius: 6,
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            👥 Roster Editor
          </button>
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <button 
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              background: '#f0f0f0', 
              color: '#333', 
              border: '1px solid #ccc', 
              borderRadius: 6,
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            ⚙ Settings
          </button>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <span style={{ 
          background: '#f0f0f0', 
          padding: '4px 8px', 
          borderRadius: 4,
          fontSize: '12px',
          color: '#666'
        }}>
          Version 0.2
        </span>
      </div>
    </div>
  );
}