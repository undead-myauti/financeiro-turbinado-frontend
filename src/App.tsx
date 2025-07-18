import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { userService } from './services/api';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AddIncome } from './pages/AddIncome';
import { AddCategory } from './pages/AddCategory';
import { AddExpense } from './pages/AddExpense';
import { EditExpense } from './pages/EditExpense';
import { EditReceipt } from './pages/EditReceipt';
import { ExpensesList } from './pages/ExpensesList';
import { ReceiptsList } from './pages/ReceiptsList';
import { Reports } from './pages/Reports';
import AddCreditCard from './pages/AddCreditCard';

// Componente para proteger rotas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = userService.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-income" 
            element={
              <ProtectedRoute>
                <AddIncome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-category" 
            element={
              <ProtectedRoute>
                <AddCategory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-expense" 
            element={
              <ProtectedRoute>
                <AddExpense />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-expense/:id" 
            element={
              <ProtectedRoute>
                <EditExpense />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-receipt/:id" 
            element={
              <ProtectedRoute>
                <EditReceipt />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/expenses" 
            element={
              <ProtectedRoute>
                <ExpensesList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/receipts" 
            element={
              <ProtectedRoute>
                <ReceiptsList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-credit-card" 
            element={
              <ProtectedRoute>
                <AddCreditCard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
