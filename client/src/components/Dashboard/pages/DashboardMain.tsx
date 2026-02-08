import React from 'react';

const DashboardMain: React.FC = () => {
  return (
    <div className="dashboard-main">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      
      <main className="dashboard-content">
        <section className="dashboard-section">
          <h2>Welcome to your Dashboard</h2>
          <p>Select an option from the sidebar to get started.</p>
        </section>
      </main>
    </div>
  );
};

export default DashboardMain;
